import { db } from '@/lib/db';
import { eq, desc, count } from 'drizzle-orm';
import { anonymousMessages } from '@/lib/db/schema';

export class AnonymousMessagesService {
  async getAll(filters?: { read?: boolean }) {
    const whereClause =
      filters?.read !== undefined ? eq(anonymousMessages.read, filters.read) : undefined;

    const [messages, [{ unreadCount }]] = await Promise.all([
      db
        .select()
        .from(anonymousMessages)
        .where(whereClause)
        .orderBy(desc(anonymousMessages.createdAt)),
      db
        .select({ unreadCount: count() })
        .from(anonymousMessages)
        .where(eq(anonymousMessages.read, false)),
    ]);

    return {
      messages,
      unreadCount,
    };
  }

  async getById(id: string) {
    const [message] = await db
      .select()
      .from(anonymousMessages)
      .where(eq(anonymousMessages.id, id))
      .limit(1);
    return message || null;
  }

  async markAsRead(id: string) {
    const now = new Date().toISOString();
    const [updated] = await db
      .update(anonymousMessages)
      .set({ read: true, updatedAt: now })
      .where(eq(anonymousMessages.id, id))
      .returning();
    return updated;
  }

  async markAsUnread(id: string) {
    const now = new Date().toISOString();
    const [updated] = await db
      .update(anonymousMessages)
      .set({ read: false, updatedAt: now })
      .where(eq(anonymousMessages.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const [deleted] = await db
      .delete(anonymousMessages)
      .where(eq(anonymousMessages.id, id))
      .returning();
    return deleted;
  }

  async getUnreadCount() {
    const [{ total }] = await db
      .select({ total: count() })
      .from(anonymousMessages)
      .where(eq(anonymousMessages.read, false));
    return total;
  }
}

export const anonymousMessagesService = new AnonymousMessagesService();
