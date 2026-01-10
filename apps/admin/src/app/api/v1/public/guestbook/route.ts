import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { guestbookService } from '@/lib/api/handlers/guestbook.service';

export async function GET() {
  try {
    const entries = await guestbookService.getAll({ visible: true });

    return successResponse(entries);
  } catch {
    return serverErrorResponse();
  }
}
