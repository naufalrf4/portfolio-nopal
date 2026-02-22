import { db } from '@/lib/db';
import { profileLinks } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export class ProfileLinksService {
  async getAll(query?: { visible?: boolean }) {
    let queryBuilder = db.select().from(profileLinks);

    if (query?.visible !== undefined) {
      queryBuilder = queryBuilder.where(eq(profileLinks.visible, query.visible)) as any;
    }

    return queryBuilder.orderBy(asc(profileLinks.order));
  }

  async getById(id: string) {
    const result = await db.select().from(profileLinks).where(eq(profileLinks.id, id)).limit(1);
    return result[0] || null;
  }

  async create(data: any) {
    const [created] = await db
      .insert(profileLinks)
      .values({
        id: createId(),
        updatedAt: new Date().toISOString(),
        ...data,
      })
      .returning();
    return created;
  }

  async update(id: string, data: any) {
    const [updated] = await db
      .update(profileLinks)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profileLinks.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(profileLinks).where(eq(profileLinks.id, id));
  }

  async reorder(linkIds: string[]) {
    await db.transaction(async (tx) => {
      for (const [index, id] of linkIds.entries()) {
        await tx
          .update(profileLinks)
          .set({ order: index, updatedAt: new Date().toISOString() })
          .where(eq(profileLinks.id, id));
      }
    });

    return db.select().from(profileLinks).orderBy(asc(profileLinks.order));
  }
}

export const profileLinksService = new ProfileLinksService();
