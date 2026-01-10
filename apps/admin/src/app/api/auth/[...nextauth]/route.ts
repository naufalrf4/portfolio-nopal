import { createAuthConfig } from '@naufalrf/auth/config';
import { prisma } from '@/lib/db/prisma';

const { handlers } = createAuthConfig(prisma);

export const { GET, POST } = handlers;
