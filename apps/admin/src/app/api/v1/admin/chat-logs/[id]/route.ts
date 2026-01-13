import { NextRequest } from 'next/server';
import { auth } from '@naufalrf/auth';
import type { Session } from 'next-auth';
import { chatLogsService } from '@/lib/api/handlers/chat-logs.service';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api/responses';

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function checkAdminAuth(): Promise<{ authorized: boolean; response?: Response }> {
  const session = (await auth()) as Session | null;
  if (!session?.user) {
    return { authorized: false, response: unauthorizedResponse() };
  }
  const userRole = (session.user as { role?: string }).role;
  if (userRole !== 'ADMIN') {
    return { authorized: false, response: forbiddenResponse('Admin access required') };
  }
  return { authorized: true };
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

  try {
    const { id } = await context.params;
    const log = await chatLogsService.getById(id);

    if (!log) {
      return notFoundResponse('Chat log');
    }

    return successResponse(log);
  } catch {
    return serverErrorResponse('Failed to fetch chat log');
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

  try {
    const { id } = await context.params;
    const existing = await chatLogsService.getById(id);

    if (!existing) {
      return notFoundResponse('Chat log');
    }

    await chatLogsService.delete(id);
    return successResponse({ success: true }, 'Chat log deleted');
  } catch {
    return serverErrorResponse('Failed to delete chat log');
  }
}
