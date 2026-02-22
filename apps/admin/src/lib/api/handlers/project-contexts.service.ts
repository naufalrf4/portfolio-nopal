import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db';
import { eq, and, inArray, asc } from 'drizzle-orm';
import { projects, projectContexts } from '@/lib/db/schema';
import type {
  CreateProjectContextInput,
  UpdateProjectContextInput,
  ProjectContextQueryInput,
  ReorderProjectContextsInput,
} from '@/lib/validations/project-context.schema';

export class ProjectContextsService {
  async getAll(query: ProjectContextQueryInput) {
    const conditions = [];
    if (query.projectId) conditions.push(eq(projectContexts.projectId, query.projectId));
    if (query.type) conditions.push(eq(projectContexts.type, query.type));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db.query.projectContexts.findMany({
      where: whereClause,
      orderBy: [asc(projectContexts.order)],
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    return db.query.projectContexts.findFirst({
      where: eq(projectContexts.id, id),
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async create(data: CreateProjectContextInput) {
    const [projectExists] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, data.projectId))
      .limit(1);
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const now = new Date().toISOString();
    const [created] = await db
      .insert(projectContexts)
      .values({
        id: createId(),
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return db.query.projectContexts.findFirst({
      where: eq(projectContexts.id, created.id),
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateProjectContextInput) {
    const [updated] = await db
      .update(projectContexts)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(projectContexts.id, id))
      .returning();

    if (!updated) {
      throw new Error('ProjectContext not found');
    }

    return db.query.projectContexts.findFirst({
      where: eq(projectContexts.id, id),
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const [deleted] = await db
      .delete(projectContexts)
      .where(eq(projectContexts.id, id))
      .returning();
    return deleted;
  }

  async reorder(data: ReorderProjectContextsInput) {
    const { projectId, contextIds } = data;
    const [projectExists] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const contexts = await db
      .select()
      .from(projectContexts)
      .where(
        and(inArray(projectContexts.id, contextIds), eq(projectContexts.projectId, projectId))
      );
    if (contexts.length !== contextIds.length) {
      throw new Error('Some context IDs are invalid or do not belong to this project');
    }

    await db.transaction(async (tx) => {
      for (const [index, id] of contextIds.entries()) {
        await tx
          .update(projectContexts)
          .set({ order: index, updatedAt: new Date().toISOString() })
          .where(eq(projectContexts.id, id));
      }
    });

    return db.query.projectContexts.findMany({
      where: eq(projectContexts.projectId, projectId),
      orderBy: [asc(projectContexts.order)],
    });
  }
}

export const projectContextsService = new ProjectContextsService();
