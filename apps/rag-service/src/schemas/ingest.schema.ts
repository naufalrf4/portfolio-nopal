import { z } from 'zod';

export const ingestRequestSchema = z.object({
  documentId: z.string().optional(),
  type: z.enum(['knowledge', 'project', 'about', 'all']),
});

export type IngestRequestBody = z.infer<typeof ingestRequestSchema>;

export const ingestJsonSchema = {
  body: {
    type: 'object',
    required: ['type'],
    properties: {
      documentId: { type: 'string' },
      type: { type: 'string', enum: ['knowledge', 'project', 'about', 'all'] },
    },
  },
};
