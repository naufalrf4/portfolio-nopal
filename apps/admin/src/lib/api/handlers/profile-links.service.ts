import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';

export class ProfileLinksService {
  async getAll(query?: { visible?: boolean }) {
    const where: Prisma.ProfileLinkWhereInput = {
      ...(query?.visible !== undefined && { visible: query.visible }),
    };

    return prisma.profileLink.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.profileLink.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ProfileLinkCreateInput) {
    return prisma.profileLink.create({ data });
  }

  async update(id: string, data: Prisma.ProfileLinkUpdateInput) {
    return prisma.profileLink.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.profileLink.delete({
      where: { id },
    });
  }

  async reorder(linkIds: string[]) {
    await prisma.$transaction(
      linkIds.map((id, index) =>
        prisma.profileLink.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return prisma.profileLink.findMany({
      orderBy: { order: 'asc' },
    });
  }
}

export const profileLinksService = new ProfileLinksService();
