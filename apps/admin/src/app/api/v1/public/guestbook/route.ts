import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { guestbookService } from '@/lib/api/handlers/guestbook.service';
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api/responses';
import { z } from 'zod';

const createGuestbookEntrySchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  userEmail: z.string().email('Invalid email'),
});

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

    return successResponse({ entries: formattedEntries });
  } catch {
    return serverErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createGuestbookEntrySchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { message, userEmail } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return unauthorizedResponse('User not found. Please sign in again.');
    }

    const entry = await guestbookService.create(user.id, message);

    return successResponse(entry, 'Entry added successfully');
  } catch {
    return serverErrorResponse();
  }
}
