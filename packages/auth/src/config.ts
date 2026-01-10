import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';

export function createAuthConfig(prisma: any) {
  return NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      async signIn({ account, profile }) {
        if (account?.provider === 'google') {
          return Boolean(profile?.email_verified);
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.userId = user.id;
          token.role = (user as any).role || 'USER';
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
