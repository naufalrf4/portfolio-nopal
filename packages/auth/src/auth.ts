import { createAuthConfig } from './config';
import { prisma } from '../../../apps/admin/src/lib/db/prisma';

const authConfig = createAuthConfig(prisma);

export const auth = authConfig.auth;
export const signIn = authConfig.signIn;
export const signOut = authConfig.signOut;
