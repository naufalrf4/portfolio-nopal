import { createAuthConfig } from '@naufalrf/auth/config';
import { prisma } from './db/prisma';

const authConfig = createAuthConfig(prisma);

export const { auth, signIn, signOut, handlers } = authConfig;
