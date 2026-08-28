import { asc, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import {
  serverErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/api/responses';
import { db } from '@/lib/db';
import { notificationChannels, notificationRules } from '@/lib/db/schema';
import { notificationService } from '@/lib/services/notificationService';
import { saveRuleSchema } from '@/lib/validations/notifications.schema';

async function handleGet(_req: NextRequest) {
  try {
    const rules = await db
      .select({
        id: notificationRules.id,
        eventType: notificationRules.eventType,
        channelId: notificationRules.channelId,
        channelName: notificationChannels.name,
        enabled: notificationRules.enabled,
        minLevel: notificationRules.minLevel,
        createdAt: notificationRules.createdAt,
        updatedAt: notificationRules.updatedAt,
      })
      .from(notificationRules)
      .innerJoin(notificationChannels, eq(notificationRules.channelId, notificationChannels.id))
      .orderBy(asc(notificationRules.createdAt));
    return successResponse(rules);
  } catch {
    return serverErrorResponse('Failed to fetch notification rules');
  }
}

async function handleSave(req: NextRequest) {
  try {
    const validation = saveRuleSchema.safeParse(await req.json());
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await notificationService.saveRule(validation.data);
    if (!result.ok) {
      return validationErrorResponse({ channelId: { _errors: [result.message] } });
    }
    return successResponse(result, 'Notification rule saved');
  } catch {
    return serverErrorResponse('Failed to save notification rule');
  }
}

export const GET = withAdminAuth(handleGet);
export const POST = withAdminAuth(handleSave);
export const PUT = withAdminAuth(handleSave);
