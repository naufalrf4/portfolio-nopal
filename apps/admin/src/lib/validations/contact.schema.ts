import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  ipHash: z.string().min(1),
});

export const updateContactSchema = z.object({
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
});

export const contactQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  read: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export const bulkContactActionSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(['markRead', 'markUnread', 'delete']),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
export type BulkContactActionInput = z.infer<typeof bulkContactActionSchema>;
