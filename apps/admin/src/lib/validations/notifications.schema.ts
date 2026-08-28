import type { LogLevel } from '@naufalrf/contracts';
import { z } from 'zod';
import { notificationEventTypeSchema } from '@/lib/services/notificationService';

const logLevelSchema = z.enum(['debug', 'info', 'warn', 'error'] satisfies readonly LogLevel[]);
const channelFields = {
  name: z.string().trim().min(1).max(100),
  chatId: z.string().trim().regex(/^-?\d+$/, 'Chat ID must be an integer'),
  messageThreadId: z.number().int().positive().nullable().optional(),
  enabled: z.boolean().optional(),
};

export const createChannelSchema = z.object({
  ...channelFields,
  enabled: channelFields.enabled.default(true),
});

export const updateChannelSchema = z.object({
  name: channelFields.name.optional(),
  chatId: channelFields.chatId.optional(),
  messageThreadId: channelFields.messageThreadId,
  enabled: z.boolean().optional(),
});

export const saveRuleSchema = z
  .object({
    eventType: notificationEventTypeSchema,
    channelId: z.string().trim().min(1),
    enabled: z.boolean().default(true),
    minLevel: logLevelSchema.nullable().optional(),
  })
  .superRefine((value, context) => {
    if (value.eventType !== 'log.error' && value.minLevel != null) {
      context.addIssue({
        code: 'custom',
        path: ['minLevel'],
        message: 'Minimum level is only supported for log.error rules',
      });
    }
  });

export const outboxQuerySchema = z.object({
  status: z.enum(['pending', 'sent', 'failed', 'dead']).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;
export type OutboxQuery = z.infer<typeof outboxQuerySchema>;
