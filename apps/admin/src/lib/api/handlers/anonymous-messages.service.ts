import { prisma } from '@/lib/db/prisma';

export class AnonymousMessagesService {
  async getAll(filters?: { read?: boolean }) {
    const where = filters?.read !== undefined ? { read: filters.read } : {};

    const [messages, unreadCount] = await Promise.all([
      prisma.anonymousMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.anonymousMessage.count({
        where: { read: false },
      }),
    ]);

    return {
      messages,
      unreadCount,
    };
  }

  async getById(id: string) {
    return prisma.anonymousMessage.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return prisma.anonymousMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAsUnread(id: string) {
    return prisma.anonymousMessage.update({
      where: { id },
      data: { read: false },
    });
  }

  async delete(id: string) {
    return prisma.anonymousMessage.delete({
      where: { id },
    });
  }

  async getUnreadCount() {
    return prisma.anonymousMessage.count({
      where: { read: false },
    });
  }
}

export const anonymousMessagesService = new AnonymousMessagesService();
