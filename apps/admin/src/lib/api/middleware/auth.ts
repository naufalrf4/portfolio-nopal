import { NextRequest } from 'next/server';
import { auth } from '@naufalrf/auth';
import type { Session } from 'next-auth';
import { unauthorizedResponse, forbiddenResponse } from '../responses';

const ADMIN_SERVICE_TOKEN = process.env.ADMIN_SERVICE_TOKEN;

export function withAuth(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const session = (await auth()) as Session | null;

    if (!session?.user) {
      return unauthorizedResponse();
    }

    return handler(req);
  };
}

export function withAdminAuth(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const session = (await auth()) as Session | null;

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    return handler(req);
  };
}

export function withServiceAuth<T>(handler: (req: NextRequest, context?: T) => Promise<Response>) {
  return async (req: NextRequest, context?: T) => {
    const token = req.headers.get('X-Service-Token');

    if (!token || token !== ADMIN_SERVICE_TOKEN) {
      return unauthorizedResponse('Invalid service token');
    }

    return handler(req, context);
  };
}
