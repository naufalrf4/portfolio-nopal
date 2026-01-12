import { z } from 'zod';

export const createAnonymousMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  ipHash: z.string().optional(),
});

export const updateReadStatusSchema = z.object({
  read: z.boolean(),
});

export type CreateAnonymousMessageInput = z.infer<typeof createAnonymousMessageSchema>;
export type UpdateReadStatusInput = z.infer<typeof updateReadStatusSchema>;
