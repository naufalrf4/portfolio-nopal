import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@/prisma/generated/client/client';
import type { CreateChatLogInput, ChatLogQueryInput } from '@/lib/validations/chat-log.schema';

export class ChatLogsService {
  async getAll(query: ChatLogQueryInput) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.chatLog.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.chatLog.count(),
    ]);

    const logsWithStats = logs.map((log) => {
      const messages = log.messages as Array<{ role: string; timestamp: string }>;
      return {
        ...log,
        messageCount: messages.length,
        lastMessageAt: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
      };
    });

    return {
      logs: logsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.chatLog.findUnique({
      where: { id },
    });
  }

  async getBySessionId(sessionId: string) {
    return prisma.chatLog.findUnique({
      where: { sessionId },
    });
  }

  async upsert(data: CreateChatLogInput) {
    return prisma.chatLog.upsert({
      where: { sessionId: data.sessionId },
      create: {
        sessionId: data.sessionId,
        messages: data.messages as unknown as Prisma.InputJsonValue,
      },
      update: {
        messages: data.messages as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async delete(id: string) {
    return prisma.chatLog.delete({
      where: { id },
    });
  }

  async deleteExpired(daysOld: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.chatLog.deleteMany({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}

export const chatLogsService = new ChatLogsService();
