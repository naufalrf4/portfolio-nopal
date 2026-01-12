import { z } from 'zod';

export const createAnalyticsEventSchema = z.object({
  page: z.string().min(1).max(100),
  eventType: z.string().min(1).max(20),
  entityType: z.string().min(1).max(50),
  entityId: z.string().optional().nullable(),
  data: z.any().optional().nullable(),
  userSession: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  countryCode: z.string().length(2).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
});

export type CreateAnalyticsEventInput = z.infer<typeof createAnalyticsEventSchema>;
