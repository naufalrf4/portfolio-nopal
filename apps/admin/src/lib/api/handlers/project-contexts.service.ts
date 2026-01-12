import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type {
  CreateProjectContextInput,
  UpdateProjectContextInput,
  ProjectContextQueryInput,
  ReorderProjectContextsInput,
} from '@/lib/validations/project-context.schema';

export class ProjectContextsService {
  async getAll(query: ProjectContextQueryInput) {
    const where: Prisma.ProjectContextWhereInput = {
      ...(query.projectId && { projectId: query.projectId }),
      ...(query.type && { type: query.type }),
    };

    return prisma.projectContext.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    return prisma.projectContext.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async create(data: CreateProjectContextInput) {
    const projectExists = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { id: true },
    });

    if (!projectExists) {
      throw new Error('Project not found');
    }

    return prisma.projectContext.create({
      data,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateProjectContextInput) {
    return prisma.projectContext.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.projectContext.delete({
      where: { id },
    });
  }

  async reorder(data: ReorderProjectContextsInput) {
    const { projectId, contextIds } = data;

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExists) {
      throw new Error('Project not found');
    }

    const contexts = await prisma.projectContext.findMany({
      where: {
        id: { in: contextIds },
        projectId,
      },
    });

    if (contexts.length !== contextIds.length) {
      throw new Error('Some context IDs are invalid or do not belong to this project');
    }

    await prisma.$transaction(
      contextIds.map((id, index) =>
        prisma.projectContext.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return prisma.projectContext.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }
}

export const projectContextsService = new ProjectContextsService();
