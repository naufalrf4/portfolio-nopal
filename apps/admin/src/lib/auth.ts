import { createAuthConfig } from '@naufalrf/auth';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { users } from '@/lib/db/schema';
import type { AuthDbCallbacks } from '@naufalrf/auth';

const authCallbacks: AuthDbCallbacks = {
  async getUserByEmail(email: string) {
    const result = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  },
  async upsertUser({ email, name, image }) {
    const now = new Date().toISOString();
    await db
      .insert(users)
      .values({ id: createId(), email, name, image, role: 'ADMIN', createdAt: now, updatedAt: now })
      .onConflictDoUpdate({
        target: users.email,
        set: { name, image, role: 'ADMIN', updatedAt: now },
      });
  },
};
export const { auth, signIn, signOut, handlers } = createAuthConfig(db, authCallbacks);
