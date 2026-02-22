import { db } from '@/lib/db';
import { eq, desc, lt, count } from 'drizzle-orm';
import { chatLogs } from '@/lib/db/schema';
import { createId } from '@paralleldrive/cuid2';
import type { CreateChatLogInput, ChatLogQueryInput } from '@/lib/validations/chat-log.schema';

export class ChatLogsService {
  async getAll(query: ChatLogQueryInput) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [logs, [{ total }]] = await Promise.all([
      db.select().from(chatLogs).limit(limit).offset(skip).orderBy(desc(chatLogs.updatedAt)),
      db.select({ total: count() }).from(chatLogs),
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
    const [log] = await db.select().from(chatLogs).where(eq(chatLogs.id, id)).limit(1);
    return log || null;
  }

  async getBySessionId(sessionId: string) {
    const [log] = await db
      .select()
      .from(chatLogs)
      .where(eq(chatLogs.sessionId, sessionId))
      .limit(1);
    return log || null;
  }

  async upsert(data: CreateChatLogInput) {
    const now = new Date().toISOString();
    const [result] = await db
      .insert(chatLogs)
      .values({
        id: createId(),
        sessionId: data.sessionId,
        messages: data.messages,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: chatLogs.sessionId,
        set: {
          messages: data.messages,
          updatedAt: now,
        },
      })
      .returning();
    return result;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(chatLogs).where(eq(chatLogs.id, id)).returning();
    return deleted;
  }

  async deleteExpired(daysOld: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await db
      .delete(chatLogs)
      .where(lt(chatLogs.updatedAt, cutoffDate.toISOString()))
      .returning();

    return result.length;
  }
}

export const chatLogsService = new ChatLogsService();
