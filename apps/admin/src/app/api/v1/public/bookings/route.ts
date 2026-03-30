import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { bookings, bookingSlots, bookingSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/responses';
import { validateTurnstileToken } from '@/lib/services/turnstile';
import { emailService } from '@/lib/services/emailService';
import { EMAIL_CONFIG } from '@/lib/email/config';
import { createId } from '@paralleldrive/cuid2';
import { getSubmissionContext } from '@/lib/api/submission-context';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/services/rate-limiter';

const publicBookingSchema = z.object({
  slotId: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
  turnstileToken: z.string().optional(),
  timezone: z.string().max(100).optional(),
});

const RATE_LIMIT_CONFIG = {
  maxRequests: 3,
  windowMs: 5 * 60 * 1000,
};

export async function POST(request: NextRequest) {
  try {
    const submissionContext = getSubmissionContext(request);
    const rateLimitResult = checkRateLimit(
      `bookings:${submissionContext.ipHash}`,
      RATE_LIMIT_CONFIG
    );
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMITED',
          },
        },
        { status: 429 }
      );

      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const body = await request.json();

    const parsed = publicBookingSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const turnstileValidation = await validateTurnstileToken(parsed.data.turnstileToken);
    if (!turnstileValidation.success) {
      const response = errorResponse(
        turnstileValidation.message ?? 'CAPTCHA verification failed. Please try again.',
        turnstileValidation.status ?? 400,
        turnstileValidation.code ?? 'TURNSTILE_VERIFICATION_FAILED'
      );

      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const { slotId, name, email, phone, notes, timezone } = parsed.data;

    const slotResult = await db.query.bookingSlots.findFirst({
      where: eq(bookingSlots.id, slotId),
      with: { booking: true },
    });

    if (!slotResult) {
      return notFoundResponse('Booking slot');
    }

    if (slotResult.status !== 'AVAILABLE') {
      return errorResponse('This time slot is no longer available', 409);
    }

    if (slotResult.booking) {
      return errorResponse('This time slot is already booked', 409);
    }

    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

    const slotDateTime = new Date(slotResult.date + 'T00:00:00');
    const [hours, minutes] = slotResult.time.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);

    if (slotDateTime < now) {
      return errorResponse('Cannot book a slot in the past', 400);
    }

    const nowStr = new Date().toISOString();
    const booking = await db.transaction(async (tx) => {
      await tx
        .update(bookingSlots)
        .set({ status: 'BOOKED', updatedAt: nowStr })
        .where(eq(bookingSlots.id, slotId));

      const [created] = await tx
        .insert(bookings)
        .values({
          id: createId(),
          name,
          email,
          phone: phone || null,
          notes: notes || null,
          ipHash: submissionContext.ipHash,
          ipAddress: submissionContext.ipAddress,
          countryCode: submissionContext.countryCode,
          country: submissionContext.country,
          city: submissionContext.city,
          region: submissionContext.region,
          metadata: {
            ...submissionContext.metadata,
            timezone: timezone || submissionContext.metadata.timezone,
          },
          status: 'PENDING',
          slotId,
          createdAt: nowStr,
          updatedAt: nowStr,
        })
        .returning();

      return created;
    });

    const dateFormatted = new Date(slotResult.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const responseData = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      notes: booking.notes,
      status: booking.status,
      date: slotResult.date,
      time: slotResult.time,
      duration: slotResult.duration,
      createdAt: booking.createdAt,
    };

    try {
      await emailService.sendBookingConfirmation(booking.email, {
        bookingId: booking.id,
        name: booking.name,
        date: dateFormatted,
        time: slotResult.time,
        duration: slotResult.duration,
      });
    } catch (emailError) {
      console.error('[Booking API] User confirmation email failed:', emailError);
    }

    try {
      const settingsResult = await db.select().from(bookingSettings).limit(1);
      const settings = settingsResult[0];

      if (settings?.notificationEmail) {
        await emailService.sendAdminBookingNotification(settings.notificationEmail, {
          booking: {
            id: booking.id,
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            date: dateFormatted,
            time: slotResult.time,
            notes: booking.notes,
          },
          dashboardLink: `${EMAIL_CONFIG.adminDashboardUrl}/bookings?bookingId=${booking.id}`,
          acceptLink: `${EMAIL_CONFIG.adminDashboardUrl}/bookings?bookingId=${booking.id}&action=confirm`,
          rejectLink: `${EMAIL_CONFIG.adminDashboardUrl}/bookings?bookingId=${booking.id}&action=cancel`,
        });
      }
    } catch (emailError) {
      console.error('[Booking API] Admin notification email failed:', emailError);
    }

    const response = successResponse(responseData, 'Booking confirmed');

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON body', 400);
    }
    return serverErrorResponse();
  }
}
