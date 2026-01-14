import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { guestbookService } from '@/lib/api/handlers/guestbook.service';
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from '@/lib/api/responses';
import { z } from 'zod';
import { getIpLocation } from '@/lib/services/geoIpService';
import { verifyTurnstileToken, isTurnstileConfigured } from '@/lib/services/turnstile';

const createGuestbookEntrySchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  userEmail: z.string().email('Invalid email'),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
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

    const { message, userEmail, turnstileToken } = parsed.data;

    if (isTurnstileConfigured() && turnstileToken) {
      const turnstileResult = await verifyTurnstileToken(turnstileToken);

      if (!turnstileResult.success) {
        return errorResponse(
          'CAPTCHA verification failed. Please try again.',
          400,
          'TURNSTILE_VERIFICATION_FAILED'
        );
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return unauthorizedResponse('User not found. Please sign in again.');
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded?.split(',')[0]?.trim() || 'unknown';
    const geoLocation = getIpLocation(clientIp);

    const locationData = {
      ipAddress: clientIp !== 'unknown' ? clientIp : undefined,
      countryCode: geoLocation?.countryCode,
      country: geoLocation?.country,
      city: geoLocation?.city,
      region: geoLocation?.region,
    };

    const entry = await guestbookService.create(user.id, message, locationData);

    return successResponse(entry, 'Entry added successfully');
  } catch {
    return serverErrorResponse();
  }
}
