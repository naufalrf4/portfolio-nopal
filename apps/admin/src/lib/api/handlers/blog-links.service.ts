import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';

export class BlogLinksService {
  async getAll(query?: { source?: string; visible?: boolean }) {
    const where: Prisma.BlogLinkWhereInput = {
      ...(query?.source && { source: query.source }),
      ...(query?.visible !== undefined && { visible: query.visible }),
    };

    return prisma.blogLink.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.blogLink.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.BlogLinkCreateInput) {
    return prisma.blogLink.create({ data });
  }

  async update(id: string, data: Prisma.BlogLinkUpdateInput) {
    return prisma.blogLink.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.blogLink.delete({
      where: { id },
    });
  }

  async reorder(blogIds: string[]) {
    await prisma.$transaction(
      blogIds.map((id, index) =>
        prisma.blogLink.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return prisma.blogLink.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async toggleVisibility(id: string) {
    const blogLink = await prisma.blogLink.findUnique({
      where: { id },
    });

    if (!blogLink) {
      return null;
    }

    return prisma.blogLink.update({
      where: { id },
      data: { visible: !blogLink.visible },
    });
  }
}

export const blogLinksService = new BlogLinksService();
