import { createId } from '@paralleldrive/cuid2';
import { meetsLevel } from '@naufalrf/contracts';
import type { LogLevel } from '@naufalrf/contracts';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
  notificationChannels,
  notificationOutbox,
  notificationRules,
} from '@/lib/db/schema';
import {
  getLogErrorLevel,
  notificationEventTypeSchema,
  renderNotification,
} from '@/lib/notifications/templates';
import type { NotificationEventType } from '@/lib/notifications/templates';
import { logger } from '@/lib/utils/logger';

export { notificationEventTypeSchema };
export type { NotificationEventType };

export const SUBMISSION_EVENT_TYPES = [
  'contact.created',
  'booking.created',
  'booking.status_changed',
  'message.created',
  'guestbook.created',
] as const satisfies readonly NotificationEventType[];

const logLevelSchema = z.enum(['debug', 'info', 'warn', 'error']);

export type NotificationRuleMatch = {
  readonly channelId: string;
  readonly minLevel: string | null;
};

export type RuleBinding = {
  readonly eventType: string;
};

type OutboxRecord = {
  readonly id: string;
  readonly eventType: NotificationEventType;
  readonly channelId: string;
  readonly payload: { readonly text: string };
  readonly status: 'pending';
  readonly attempts: 0;
};

export type SaveRuleInput = {
  readonly eventType: NotificationEventType;
  readonly channelId: string;
  readonly enabled: boolean;
  readonly minLevel?: LogLevel | null;
};

export type SaveRuleResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly code: 'cross_channel_conflict';
      readonly message: string;
    };

export interface NotificationDatabase {
  findEnabledRules(eventType: NotificationEventType): Promise<readonly NotificationRuleMatch[]>;
  insertOutbox(records: OutboxRecord[]): Promise<void>;
  findRuleBindings(channelId: string): Promise<readonly RuleBinding[]>;
  saveRule(input: SaveRuleInput): Promise<void>;
}

const drizzleNotificationDatabase: NotificationDatabase = {
  async findEnabledRules(eventType) {
    return db
      .select({ channelId: notificationRules.channelId, minLevel: notificationRules.minLevel })
      .from(notificationRules)
      .innerJoin(
        notificationChannels,
        eq(notificationRules.channelId, notificationChannels.id)
      )
      .where(
        and(
          eq(notificationRules.eventType, eventType),
          eq(notificationRules.enabled, true),
          eq(notificationChannels.enabled, true)
        )
      );
  },
  async insertOutbox(records) {
    await db.insert(notificationOutbox).values(records);
  },
  async findRuleBindings(channelId) {
    const [channel] = await db
      .select({ chatId: notificationChannels.chatId, messageThreadId: notificationChannels.messageThreadId })
      .from(notificationChannels)
      .where(eq(notificationChannels.id, channelId))
      .limit(1);

    if (!channel) {
      return [];
    }

    return db
      .select({ eventType: notificationRules.eventType })
      .from(notificationRules)
      .innerJoin(
        notificationChannels,
        eq(notificationRules.channelId, notificationChannels.id)
      )
      .where(
        and(
          eq(notificationChannels.chatId, channel.chatId),
          channel.messageThreadId === null
            ? isNull(notificationChannels.messageThreadId)
            : eq(notificationChannels.messageThreadId, channel.messageThreadId)
        )
      );
  },
  async saveRule(input) {
    const now = new Date().toISOString();
    await db
      .insert(notificationRules)
      .values({
        id: createId(),
        eventType: input.eventType,
        channelId: input.channelId,
        enabled: input.enabled,
        minLevel: input.minLevel ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [notificationRules.eventType, notificationRules.channelId],
        set: {
          enabled: input.enabled,
          minLevel: input.minLevel ?? null,
          updatedAt: now,
        },
      });
  },
};

export class NotificationService {
  constructor(private readonly database: NotificationDatabase = drizzleNotificationDatabase) {}

  async enqueue(
    eventType: NotificationEventType,
    payload: unknown
  ): Promise<{ readonly enqueued: number }> {
    try {
      const rules = await this.database.findEnabledRules(eventType);
      const highestSeverity = eventType === 'log.error' ? getLogErrorLevel(payload) : undefined;
      const survivingRules = rules.filter((rule) => {
        if (highestSeverity === undefined || rule.minLevel === null) {
          return true;
        }

        const threshold = logLevelSchema.safeParse(rule.minLevel);
        return threshold.success && meetsLevel(highestSeverity, threshold.data);
      });

      if (survivingRules.length === 0) {
        return { enqueued: 0 };
      }

      const text = renderNotification(eventType, payload);
      const records: OutboxRecord[] = survivingRules.map((rule) => ({
        id: createId(),
        eventType,
        channelId: rule.channelId,
        payload: { text },
        status: 'pending',
        attempts: 0,
      }));
      await this.database.insertOutbox(records);
      return { enqueued: records.length };
    } catch (error) {
      logger.error('Notification enqueue failed', {
        operation: 'notification.enqueue',
        eventType,
        error: error instanceof Error ? error.message : String(error),
      });
      return { enqueued: 0 };
    }
  }

  async saveRule(input: SaveRuleInput): Promise<SaveRuleResult> {
    const bindings = await this.database.findRuleBindings(input.channelId);
    const isEscalation = input.eventType === 'log.error';
    const hasConflictingBinding = bindings.some((binding) => {
      const bindingType = notificationEventTypeSchema.safeParse(binding.eventType);
      return bindingType.success && (bindingType.data === 'log.error') !== isEscalation;
    });

    if (hasConflictingBinding) {
      return {
        ok: false,
        code: 'cross_channel_conflict',
        message: 'Log escalation and submission events cannot share a Telegram destination',
      };
    }

    await this.database.saveRule(input);
    return { ok: true };
  }
}

export const notificationService = new NotificationService();
