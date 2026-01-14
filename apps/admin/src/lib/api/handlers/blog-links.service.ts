import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type { CreateBlogLinkInput } from '@/lib/validations/blog-link.schema';

export type BlogLinkCreateInput = CreateBlogLinkInput;

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

  async create(data: BlogLinkCreateInput) {
    const maxOrder = await prisma.blogLink.aggregate({
      _max: { order: true },
    });

    return prisma.blogLink.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        source: data.source,
        tags: data.tags || [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        order: (maxOrder._max.order ?? -1) + 1,
        visible: true,
      },
    });
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
