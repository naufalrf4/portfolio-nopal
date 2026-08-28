export type LogMinLevel = 'debug' | 'info' | 'warn' | 'error';

export type OutboxStatus = 'pending' | 'sent' | 'failed' | 'dead';

export interface Channel {
  readonly id: string;
  readonly name: string;
  readonly chatId: string;
  readonly messageThreadId: number | null;
  readonly enabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Rule {
  readonly id: string;
  readonly eventType: string;
  readonly channelId: string;
  readonly enabled: boolean;
  readonly minLevel: LogMinLevel | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OutboxRow {
  readonly id: string;
  readonly eventType: string;
  readonly channelId: string;
  readonly channelName: string | null;
  readonly status: OutboxStatus;
  readonly attempts: number;
  readonly lastError: string | null;
  readonly telegramMessageId: number | null;
  readonly createdAt: string;
  readonly sentAt: string | null;
  readonly nextAttemptAt: string;
}

export interface ChannelFormData {
  readonly name: string;
  readonly chatId: string;
  readonly messageThreadId?: number;
  readonly enabled: boolean;
}

export interface RuleFormData {
  readonly eventType: string;
  readonly channelId: string;
  readonly enabled: boolean;
  readonly minLevel?: LogMinLevel;
}

export type DiscoveredChatType = 'private' | 'group' | 'supergroup' | 'channel';

export interface DiscoveredChat {
  readonly chatId: string;
  readonly title: string;
  readonly type: DiscoveredChatType;
  readonly messageThreadId: number | null;
  readonly threadName: string | null;
}
