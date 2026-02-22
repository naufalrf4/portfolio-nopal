import { db } from '@/lib/db';
import { achievements } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export class AchievementsService {
  async getAll(query?: { visible?: boolean }) {
    let queryBuilder = db.select().from(achievements);

    if (query?.visible !== undefined) {
      queryBuilder = queryBuilder.where(eq(achievements.visible, query.visible)) as any;
    }

    return queryBuilder.orderBy(asc(achievements.order));
  }

  async getById(id: string) {
    const result = await db.select().from(achievements).where(eq(achievements.id, id)).limit(1);
    return result[0] || null;
  }

  async create(data: any) {
    const [created] = await db
      .insert(achievements)
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
      .update(achievements)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(achievements.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(achievements).where(eq(achievements.id, id));
  }

  async reorder(achievementIds: string[]) {
    await db.transaction(async (tx) => {
      for (const [index, id] of achievementIds.entries()) {
        await tx
          .update(achievements)
          .set({ order: index, updatedAt: new Date().toISOString() })
          .where(eq(achievements.id, id));
      }
    });

    return db.select().from(achievements).orderBy(asc(achievements.order));
  }

  async toggleVisibility(id: string) {
    const result = await db.select().from(achievements).where(eq(achievements.id, id)).limit(1);
    const achievement = result[0];

    if (!achievement) {
      return null;
    }

    const [updated] = await db
      .update(achievements)
      .set({
        visible: !achievement.visible,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(achievements.id, id))
      .returning();
    return updated;
  }
}

export const achievementsService = new AchievementsService();
