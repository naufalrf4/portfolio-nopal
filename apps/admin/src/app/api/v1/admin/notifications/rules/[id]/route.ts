import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { withAdminAuthContext } from '@/lib/api/middleware/auth';
import { notFoundResponse, serverErrorResponse, successResponse } from '@/lib/api/responses';
import { db } from '@/lib/db';
import { notificationRules } from '@/lib/db/schema';

type RouteContext = { readonly params: Promise<{ readonly id: string }> };

async function handleDelete(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const [rule] = await db
      .delete(notificationRules)
      .where(eq(notificationRules.id, id))
      .returning();
    if (!rule) {
      return notFoundResponse('Rule');
    }
    return successResponse(rule, 'Notification rule deleted');
  } catch {
    return serverErrorResponse('Failed to delete notification rule');
  }
}

export const DELETE = withAdminAuthContext(handleDelete);
