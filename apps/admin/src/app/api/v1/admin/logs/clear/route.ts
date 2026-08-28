import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import {
  serverErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/api/responses';
import { logQueryService } from '@/lib/services/logQuery.service';
import { logClearSchema } from '@/lib/validations/log-clear.schema';
import { subtractDaysFromNow } from '@/lib/utils/date';

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const validation = logClearSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const cutoff =
      validation.data.mode === 'last-n-days'
        ? subtractDaysFromNow(validation.data.days)
        : new Date(validation.data.beforeDate);

    const deletedCount = await logQueryService.deleteBefore(cutoff);

    return successResponse(
      { deletedCount, cutoff: cutoff.toISOString() },
      `Cleared ${deletedCount} log${deletedCount === 1 ? '' : 's'}`
    );
  } catch {
    return serverErrorResponse('Failed to clear logs');
  }
}

export const POST = withAdminAuth(handlePost);
