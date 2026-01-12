import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';
import { validateAuthEnvironment } from './env-validation';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

const validation = validateAuthEnvironment();
if (!validation.isValid) {
  console.error('Authentication configuration errors:');
  validation.errors.forEach((error) => console.error(`  - ${error}`));
}

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
        if (!isEmailVerified) {
          console.error('Google sign-in failed: Email not verified');
          return false;
        }

        const email = profile?.email;
        if (!email) {
          console.error('Google sign-in failed: No email provided');
          return false;
        }

        try {
          const response = await fetch(`${API_BASE}/api/v1/public/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name: profile?.name,
              image: profile?.picture,
            }),
          });

          if (!response.ok) {
            console.error('User sync failed:', response.status, response.statusText);
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            console.error('User sync failed:', data.error?.message || 'Unknown error');
            return false;
          }

          return true;
        } catch (error) {
          console.error('User sync error:', error);
          return false;
        }
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
