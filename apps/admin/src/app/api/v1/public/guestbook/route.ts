import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { guestbookService } from '@/lib/api/handlers/guestbook.service';
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api/responses';
import { createGuestbookEntrySchema } from '@/lib/validations/guestbook.schema';

export async function GET() {
  try {
    const entries = await guestbookService.getAll({ visible: true });

    const formattedEntries = entries.map((entry) => ({
      id: entry.id,
      message: entry.message,
      createdAt: entry.createdAt,
      user: {
        name: entry.user.name,
        image: entry.user.image,
      },
    }));

    return successResponse(formattedEntries);
  } catch {
    return serverErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse('Authentication required');
    }

    const body = await request.json();
    const parsed = createGuestbookEntrySchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const entry = await guestbookService.create(session.user.id, parsed.data.message);

    return successResponse(entry, 'Entry added successfully');
  } catch {
    return serverErrorResponse();
  }
}
