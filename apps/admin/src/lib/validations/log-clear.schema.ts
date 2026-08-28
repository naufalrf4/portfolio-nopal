import { z } from 'zod';

export const logClearSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('last-n-days'),
    days: z.coerce.number().int().min(1).max(3650),
  }),
  z.object({
    mode: z.literal('before-date'),
    beforeDate: z.iso.datetime({ offset: true }),
  }),
]);

export type LogClearInput = z.infer<typeof logClearSchema>;
