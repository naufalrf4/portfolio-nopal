import { z } from 'zod';
import { ProjectContextType } from '@/prisma/generated/client/client';

export const createProjectContextSchema = z.object({
  projectId: z.string().cuid(),
  type: z.nativeEnum(ProjectContextType),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  order: z.number().int().default(0),
});

export const updateProjectContextSchema = createProjectContextSchema
  .partial()
  .omit({ projectId: true });

export const projectContextQuerySchema = z.object({
  projectId: z.string().cuid().optional(),
  type: z.nativeEnum(ProjectContextType).optional(),
});

export const reorderProjectContextsSchema = z.object({
  projectId: z.string().cuid(),
  contextIds: z.array(z.string().cuid()).min(1),
});

export type CreateProjectContextInput = z.infer<typeof createProjectContextSchema>;
export type UpdateProjectContextInput = z.infer<typeof updateProjectContextSchema>;
export type ProjectContextQueryInput = z.infer<typeof projectContextQuerySchema>;
export type ReorderProjectContextsInput = z.infer<typeof reorderProjectContextsSchema>;
