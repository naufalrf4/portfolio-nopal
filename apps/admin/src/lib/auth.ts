import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { users } from '@/lib/db/schema';

interface AuthDbCallbacks {
  getUserByEmail(email: string): Promise<{ id: string; role: string } | null>;
  upsertUser(data: { email: string; name?: string | null; image?: string | null }): Promise<void>;
}

function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}

function createAuthConfig(db: any, authCallbacks: AuthDbCallbacks) {
  return NextAuth({
    adapter: DrizzleAdapter(db) as any,
    trustHost: true,
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
    callbacks: {
      async signIn({ account, profile, user }) {
        if (account?.provider === 'google') {
          const isEmailVerified = Boolean(profile?.email_verified);
          if (!isEmailVerified) return false;

          const email = profile?.email || user?.email;
          if (!email) return false;

          const isAdmin = isAdminEmail(email);
          if (!isAdmin) return '/auth/signin?error=access_denied';

          await authCallbacks.upsertUser({
            email,
            name: profile?.name || user?.name,
            image: profile?.picture || (profile as any)?.image || user?.image,
          });

          return true;
        }
        return true;
      },
      async jwt({ token, user, trigger }) {
        if (user) {
          token.userId = user.id;
          token.role = (user as any).role || 'USER';
        }

        if (trigger === 'update' || trigger === 'signIn') {
          if (token.email) {
            const dbUser = await authCallbacks.getUserByEmail(token.email);
            if (dbUser) {
              token.userId = dbUser.id;
              token.role = dbUser.role;
            }
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.userId as string;
          (session.user as any).role = token.role as string;
        }
        return session;
      },
    },
  });
}

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
