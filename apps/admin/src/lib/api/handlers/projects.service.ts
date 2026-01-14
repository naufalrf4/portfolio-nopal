import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryInput,
} from '@/lib/validations/project.schema';

export class ProjectsService {
  async getAll(query: ProjectQueryInput) {
    const { page, limit, category, featured, visible, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      ...(category && { category }),
      ...(featured !== undefined && { featured }),
      ...(visible !== undefined && { visible }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: {
          contexts: {
            orderBy: { order: 'asc' },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        contexts: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        contexts: {
          orderBy: { order: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async create(data: CreateProjectInput) {
    const { description, liveUrl, repoUrl, startDate, endDate, projectDate, tags, ...rest } = data;

    return prisma.project.create({
      data: {
        ...rest,
        description: description || '',
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        tags: tags || [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        projectDate: projectDate || null,
      },
      include: {
        contexts: true,
      },
    });
  }

  async update(id: string, data: UpdateProjectInput) {
    const { startDate, endDate, ...rest } = data;

    const updateData: Record<string, unknown> = { ...rest };

    if (startDate !== undefined) {
      updateData.startDate = startDate ? new Date(startDate) : null;
    }
    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    return prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        contexts: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }

  async checkSlugExists(slug: string, excludeId?: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!project) return false;
    if (excludeId && project.id === excludeId) return false;
    return true;
  }
}

export const projectsService = new ProjectsService();
