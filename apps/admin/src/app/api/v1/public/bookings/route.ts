import { NextRequest } from 'next/server';
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
import { createId } from '@paralleldrive/cuid2';
import { getSubmissionContext } from '@/lib/api/submission-context';

const publicBookingSchema = z.object({
  slotId: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
  turnstileToken: z.string().optional(),
  timezone: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = publicBookingSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const turnstileValidation = await validateTurnstileToken(parsed.data.turnstileToken);
    if (!turnstileValidation.success) {
      return errorResponse(
        turnstileValidation.message ?? 'CAPTCHA verification failed. Please try again.',
        turnstileValidation.status ?? 400,
        turnstileValidation.code ?? 'TURNSTILE_VERIFICATION_FAILED'
      );
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

    const submissionContext = getSubmissionContext(request);

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
          dashboardLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/bookings/${booking.id}`,
          acceptLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/bookings/${booking.id}?action=accept`,
          rejectLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/bookings/${booking.id}?action=reject`,
        });
      }
    } catch (emailError) {
      console.error('[Booking API] Admin notification email failed:', emailError);
    }

    return successResponse(responseData, 'Booking confirmed');
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON body', 400);
    }
    return serverErrorResponse();
  }
}
