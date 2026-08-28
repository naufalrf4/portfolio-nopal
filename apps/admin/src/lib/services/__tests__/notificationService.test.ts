import { describe, expect, it } from 'bun:test';
import type { LogLevel } from '@naufalrf/contracts';
import type {
  NotificationDatabase,
  NotificationRuleMatch,
  RuleBinding,
} from '@/lib/services/notificationService';
import { NotificationService } from '@/lib/services/notificationService';

const contactPayload = {
  name: 'Visitor',
  email: 'visitor@example.com',
  subject: 'Project',
  message: 'Hello',
  createdAt: '2026-08-28T05:00:00.000Z',
};

const logPayload = (highestSeverity: LogLevel) => ({
  count: 3,
  highestSeverity,
  service: 'admin',
  summary: 'Database unavailable',
  timestamp: '2026-08-28T05:00:00.000Z',
});

function createHarness({
  rules = [],
  bindings = [],
  failure,
}: {
  readonly rules?: readonly NotificationRuleMatch[];
  readonly bindings?: readonly RuleBinding[];
  readonly failure?: Error;
} = {}) {
  const inserted: Array<{
    readonly eventType: string;
    readonly channelId: string;
    readonly payload: unknown;
    readonly status: string;
    readonly attempts: number;
  }> = [];
  const database: NotificationDatabase = {
    findEnabledRules: async () => {
      if (failure) {
        throw failure;
      }
      return rules;
    },
    insertOutbox: async (records) => {
      inserted.push(...records);
    },
    findRuleBindings: async () => bindings,
    saveRule: async () => undefined,
  };

  return { service: new NotificationService(database), inserted };
}

describe('NotificationService', () => {
  it('inserts one outbox row per enabled matching rule', async () => {
    const harness = createHarness({
      rules: [
        { channelId: 'channel-1', minLevel: null },
        { channelId: 'channel-2', minLevel: null },
      ],
    });

    const result = await harness.service.enqueue('contact.created', contactPayload);

    expect(result).toEqual({ enqueued: 2 });
    expect(harness.inserted).toHaveLength(2);
    expect(harness.inserted.every((record) => record.status === 'pending')).toBe(true);
    expect(harness.inserted.every((record) => record.attempts === 0)).toBe(true);
  });

  it('inserts no rows when no enabled rule matches', async () => {
    const harness = createHarness();

    const result = await harness.service.enqueue('contact.created', contactPayload);

    expect(result).toEqual({ enqueued: 0 });
    expect(harness.inserted).toHaveLength(0);
  });

  it('applies the log rule minimum level', async () => {
    const below = createHarness({ rules: [{ channelId: 'channel-1', minLevel: 'error' }] });
    const matching = createHarness({
      rules: [{ channelId: 'channel-1', minLevel: 'error' }],
    });

    const belowResult = await below.service.enqueue('log.error', logPayload('warn'));
    const matchingResult = await matching.service.enqueue('log.error', logPayload('error'));

    expect(belowResult).toEqual({ enqueued: 0 });
    expect(matchingResult).toEqual({ enqueued: 1 });
    expect(matching.inserted).toHaveLength(1);
  });

  it('returns zero instead of throwing when the database fails', async () => {
    const harness = createHarness({ failure: new Error('database unavailable') });

    const result = await harness.service.enqueue('contact.created', contactPayload);

    expect(result).toEqual({ enqueued: 0 });
  });

  it('rejects a log rule on a channel pair used by a submission event', async () => {
    const harness = createHarness({
      bindings: [{ eventType: 'contact.created' }],
    });

    const result = await harness.service.saveRule({
      eventType: 'log.error',
      channelId: 'channel-1',
      enabled: true,
      minLevel: 'error',
    });

    expect(result).toEqual({
      ok: false,
      code: 'cross_channel_conflict',
      message: 'Log escalation and submission events cannot share a Telegram destination',
    });
  });
});
