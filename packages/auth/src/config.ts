import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';

export function createAuthConfig(prisma: any) {
  return NextAuth({
    adapter: PrismaAdapter(prisma),
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

          await prisma.user.upsert({
            where: { email },
            update: {
              name: profile?.name || user?.name,
              image: profile?.picture || (profile as any)?.image || user?.image,
              role: 'ADMIN',
            },
            create: {
              email,
              name: profile?.name || user?.name,
              image: profile?.picture || (profile as any)?.image || user?.image,
              role: 'ADMIN',
            },
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
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email },
              select: { id: true, role: true },
            });
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

export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}
