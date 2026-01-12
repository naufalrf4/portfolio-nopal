import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
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
        const isEmailVerified = Boolean(profile?.email_verified);
        if (!isEmailVerified) return false;

        const email = profile?.email;
        if (!email) return false;

        try {
          await fetch(`${API_BASE}/api/v1/public/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name: profile?.name,
              image: profile?.picture,
            }),
          });
        } catch {
          return false;
        }

        return true;
      }
      return true;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (profile) {
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
