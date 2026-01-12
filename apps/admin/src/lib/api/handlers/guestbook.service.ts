import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';

export class GuestbookService {
  async getAll(query?: { userId?: string; visible?: boolean }) {
    const where: Prisma.GuestbookEntryWhereInput = {
      ...(query?.userId && { userId: query.userId }),
      ...(query?.visible !== undefined && { visible: query.visible }),
    };

    return prisma.guestbookEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    return prisma.guestbookEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async create(userId: string, message: string) {
    return prisma.guestbookEntry.create({
      data: {
        userId,
        message,
        visible: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.GuestbookEntryUpdateInput) {
    return prisma.guestbookEntry.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.guestbookEntry.delete({
      where: { id },
    });
  }

  async toggleVisibility(id: string) {
    const entry = await prisma.guestbookEntry.findUnique({
      where: { id },
      select: { visible: true },
    });

    if (!entry) {
      throw new Error('Guestbook entry not found');
    }

    return prisma.guestbookEntry.update({
      where: { id },
      data: { visible: !entry.visible },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async updateReactions(id: string, reactions: object) {
    return prisma.guestbookEntry.update({
      where: { id },
      data: { reactions },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async addReaction(id: string, userId: string, emoji: string) {
    const entry = await prisma.guestbookEntry.findUnique({
      where: { id },
      select: { reactions: true },
    });

    if (!entry) {
      throw new Error('Guestbook entry not found');
    }

    const reactions = (entry.reactions as Array<{ userId: string; emoji: string }>) || [];
    const existingIndex = reactions.findIndex((r) => r.userId === userId && r.emoji === emoji);

    if (existingIndex !== -1) {
      reactions.splice(existingIndex, 1);
    } else {
      reactions.push({ userId, emoji });
    }

    return prisma.guestbookEntry.update({
      where: { id },
      data: { reactions },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }
}

export const guestbookService = new GuestbookService();
