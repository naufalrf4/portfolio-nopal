import { z } from 'zod';

export const chatRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;

export const chatJsonSchema = {
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      sessionId: { type: 'string', format: 'uuid' },
      message: { type: 'string', minLength: 1, maxLength: 2000 },
    },
  },
};
