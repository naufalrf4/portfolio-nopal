import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { notificationOutbox } from '@/lib/db/schema';
import type { TelegramSendResult } from '@/lib/services/telegramService';

const CLAIM_LIMIT = 15;
const MESSAGE_SPACING_MS = 1100;
const MAX_ATTEMPTS = 5;

export type ClaimedNotification = {
  readonly id: string;
  readonly chatId: string;
  readonly messageThreadId: number | null;
  readonly text: string;
  readonly attempts: number;
};

export interface NotificationDispatchDatabase {
  withClaimedPending<T>(
    limit: number,
    handler: (
      notifications: readonly ClaimedNotification[],
      updates: NotificationDispatchUpdates
    ) => Promise<T>
  ): Promise<T>;
}

export interface NotificationDispatchUpdates {
  markSent(id: string, messageId: number): Promise<void>;
  markFailed(
    id: string,
    attempts: number,
    status: 'failed' | 'dead',
    error: string
  ): Promise<void>;
  defer(id: string, retryAfter: number): Promise<void>;
}

type DispatchDependencies = {
  readonly send: (input: {
    readonly chatId: string;
    readonly messageThreadId: number | null;
    readonly text: string;
  }) => Promise<TelegramSendResult>;
  readonly sleep: (milliseconds: number) => Promise<void>;
  readonly database?: NotificationDispatchDatabase;
};

export type DispatchResult = {
  readonly claimed: number;
  readonly sent: number;
  readonly failed: number;
  readonly dead: number;
  readonly throttled: boolean;
};

const drizzleNotificationDispatchDatabase: NotificationDispatchDatabase = {
  async withClaimedPending(limit, handler) {
    return db.transaction(async (tx) => {
      const notifications = await tx.execute<ClaimedNotification>(sql`
        select
          outbox.id,
          channel.chat_id as "chatId",
          channel.message_thread_id as "messageThreadId",
          outbox.payload->>'text' as text,
          outbox.attempts
        from notification_outbox as outbox
        inner join notification_channels as channel on channel.id = outbox.channel_id
        where outbox.status = 'pending' and outbox.next_attempt_at <= now()
        order by outbox.created_at asc
        limit ${limit}
        for update skip locked
      `);
      const updates: NotificationDispatchUpdates = {
        async markSent(id, messageId) {
          await tx
            .update(notificationOutbox)
            .set({ status: 'sent', sentAt: new Date().toISOString(), telegramMessageId: messageId })
            .where(eq(notificationOutbox.id, id));
        },
        async markFailed(id, attempts, status, error) {
          const backoffSeconds = 2 ** Math.min(attempts, 10);
          await tx
            .update(notificationOutbox)
            .set({
              attempts,
              status,
              lastError: error,
              nextAttemptAt: new Date(Date.now() + backoffSeconds * 1000).toISOString(),
            })
            .where(eq(notificationOutbox.id, id));
        },
        async defer(id, retryAfter) {
          await tx
            .update(notificationOutbox)
            .set({ nextAttemptAt: new Date(Date.now() + retryAfter * 1000).toISOString() })
            .where(eq(notificationOutbox.id, id));
        },
      };
      return handler(notifications, updates);
    });
  },
};

export class NotificationDispatchService {
  constructor(private readonly database: NotificationDispatchDatabase = drizzleNotificationDispatchDatabase) {}

  async dispatch({ send, sleep }: DispatchDependencies): Promise<DispatchResult> {
    return this.database.withClaimedPending(CLAIM_LIMIT, async (claimed, updates) => {
      let sent = 0;
      let failed = 0;
      let dead = 0;

      for (const [index, notification] of claimed.entries()) {
        if (index > 0) {
          await sleep(MESSAGE_SPACING_MS);
        }

        const result = await send({
          chatId: notification.chatId,
          messageThreadId: notification.messageThreadId,
          text: notification.text,
        });
        if (result.ok) {
          await updates.markSent(notification.id, result.messageId);
          sent += 1;
          continue;
        }

        if (result.status === 429) {
          await updates.defer(notification.id, result.retryAfter ?? 60);
          return { claimed: claimed.length, sent, failed, dead, throttled: true };
        }

        const attempts = notification.attempts + 1;
        const status = attempts >= MAX_ATTEMPTS ? 'dead' : 'failed';
        await updates.markFailed(notification.id, attempts, status, result.description);
        if (status === 'dead') {
          dead += 1;
        } else {
          failed += 1;
        }
      }

      return { claimed: claimed.length, sent, failed, dead, throttled: false };
    });
  }
}

export const notificationDispatchService = new NotificationDispatchService();

export async function dispatchPendingNotifications(
  dependencies: DispatchDependencies
): Promise<DispatchResult> {
  const service = dependencies.database
    ? new NotificationDispatchService(dependencies.database)
    : notificationDispatchService;
  return service.dispatch(dependencies);
}
