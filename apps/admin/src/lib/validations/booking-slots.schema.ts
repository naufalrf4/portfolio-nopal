import { z } from 'zod';

export const createBookingSlotSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be HH:MM format'),
  duration: z.number().int().min(15).max(120).default(60),
});

export const bulkCreateSlotsSchema = z.object({
  slots: z
    .array(
      z.object({
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        }),
        time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
          message: 'Time must be in HH:mm format',
        }),
        duration: z.number().int().min(15).max(120).default(60),
      })
    )
    .min(1, 'At least one slot is required')
    .max(50, 'Maximum 50 slots per bulk operation'),
});

export const updateBookingSlotSchema = z.object({
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  status: z.enum(['AVAILABLE', 'BLOCKED']).optional(),
});

export const copyFromWeekSchema = z.object({
  sourceStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid source start date',
  }),
  targetStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid target start date',
  }),
});

export const slotsQuerySchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
});

export type CreateBookingSlotInput = z.infer<typeof createBookingSlotSchema>;
export type BulkCreateSlotsInput = z.infer<typeof bulkCreateSlotsSchema>;
export type UpdateBookingSlotInput = z.infer<typeof updateBookingSlotSchema>;
export type CopyFromWeekInput = z.infer<typeof copyFromWeekSchema>;
export type SlotsQueryInput = z.infer<typeof slotsQuerySchema>;
