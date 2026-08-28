import { describe, expect, it } from 'bun:test';
import {
  NotificationDispatchService,
  dispatchPendingNotifications,
  type ClaimedNotification,
  type NotificationDispatchDatabase,
} from '@/lib/services/notificationDispatch.service';

function notification(overrides: Partial<ClaimedNotification> = {}): ClaimedNotification {
  return {
    id: 'outbox-1',
    chatId: '-100123',
    messageThreadId: null,
    text: 'Hello',
    attempts: 0,
    ...overrides,
  };
}

function createHarness(rows: readonly ClaimedNotification[]) {
  const sent: { readonly id: string; readonly messageId: number }[] = [];
  const failures: {
    readonly id: string;
    readonly attempts: number;
    readonly status: 'failed' | 'dead';
    readonly error: string;
  }[] = [];
  const deferred: { readonly id: string; readonly retryAfter: number }[] = [];
  const database: NotificationDispatchDatabase = {
    withClaimedPending: async (limit, handler) =>
      handler(rows.slice(0, limit), {
        markSent: async (id, messageId) => {
          sent.push({ id, messageId });
        },
        markFailed: async (id, attempts, status, error) => {
          failures.push({ id, attempts, status, error });
        },
        defer: async (id, retryAfter) => {
          deferred.push({ id, retryAfter });
        },
      }),
  };
  return { service: new NotificationDispatchService(database), sent, failures, deferred };
}

describe('NotificationDispatchService', () => {
  it('marks a successful delivery as sent with the Telegram message id', async () => {
    const harness = createHarness([notification()]);

    const result = await dispatchPendingNotifications({
      send: async () => ({ ok: true, messageId: 42 }),
      sleep: async () => {},
      database: {
        withClaimedPending: async (limit, handler) =>
          handler([notification()].slice(0, limit), {
            markSent: async (id, messageId) => {
              harness.sent.push({ id, messageId });
            },
            markFailed: async () => {},
            defer: async () => {},
          }),
      },
    });

    expect(result).toEqual({ claimed: 1, sent: 1, failed: 0, dead: 0, throttled: false });
    expect(harness.sent).toEqual([{ id: 'outbox-1', messageId: 42 }]);
  });

  it('defers a 429 response and stops before the next queued delivery', async () => {
    const harness = createHarness([notification(), notification({ id: 'outbox-2' })]);
    let sends = 0;

    const result = await harness.service.dispatch({
      send: async () => {
        sends += 1;
        return { ok: false, status: 429, description: 'Too Many Requests', retryAfter: 17 };
      },
      sleep: async () => {},
    });

    expect(result).toEqual({ claimed: 2, sent: 0, failed: 0, dead: 0, throttled: true });
    expect(sends).toBe(1);
    expect(harness.deferred).toEqual([{ id: 'outbox-1', retryAfter: 17 }]);
  });

  it('increments a generic failure and makes the fifth attempt dead', async () => {
    const harness = createHarness([notification({ attempts: 4 })]);

    const result = await harness.service.dispatch({
      send: async () => ({ ok: false, status: 500, description: 'Telegram failed' }),
      sleep: async () => {},
    });

    expect(result).toEqual({ claimed: 1, sent: 0, failed: 0, dead: 1, throttled: false });
    expect(harness.failures).toEqual([
      { id: 'outbox-1', attempts: 5, status: 'dead', error: 'Telegram failed' },
    ]);
  });

  it('claims no more than fifteen rows', async () => {
    const rows = Array.from({ length: 16 }, (_, index) => notification({ id: `outbox-${index}` }));
    const harness = createHarness(rows);
    const sleeps: number[] = [];

    const result = await harness.service.dispatch({
      send: async () => ({ ok: true, messageId: 1 }),
      sleep: async (milliseconds) => {
        sleeps.push(milliseconds);
      },
    });

    expect(result).toEqual({ claimed: 15, sent: 15, failed: 0, dead: 0, throttled: false });
    expect(harness.sent).toHaveLength(15);
    expect(sleeps).toHaveLength(14);
    expect(sleeps.every((milliseconds) => milliseconds >= 1100)).toBe(true);
  });
});
