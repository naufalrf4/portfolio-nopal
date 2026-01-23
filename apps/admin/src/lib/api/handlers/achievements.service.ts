import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';

export class AchievementsService {
  async getAll(query?: { visible?: boolean }) {
    const where: Prisma.AchievementWhereInput = {
      ...(query?.visible !== undefined && { visible: query.visible }),
    };

    return prisma.achievement.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.achievement.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.AchievementCreateInput) {
    return prisma.achievement.create({ data });
  }

  async update(id: string, data: Prisma.AchievementUpdateInput) {
    return prisma.achievement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.achievement.delete({
      where: { id },
    });
  }

  async reorder(achievementIds: string[]) {
    await prisma.$transaction(
      achievementIds.map((id, index) =>
        prisma.achievement.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return prisma.achievement.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async toggleVisibility(id: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      return null;
    }

    return prisma.achievement.update({
      where: { id },
      data: { visible: !achievement.visible },
    });
  }
}

export const achievementsService = new AchievementsService();
