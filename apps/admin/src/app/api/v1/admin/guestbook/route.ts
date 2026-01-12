import { withAdminAuth } from '@/lib/api/middleware/auth';
import { guestbookService } from '@/lib/api/handlers/guestbook.service';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';

async function handleGet() {
  try {
    const entries = await guestbookService.getAll();
    return successResponse({ entries });
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
