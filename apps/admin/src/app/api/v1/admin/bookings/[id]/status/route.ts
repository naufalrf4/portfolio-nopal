import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { BookingStatus } from '@/prisma/generated/client/client';
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { emailService } from '@/lib/services/emailService';

const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  message: z.string().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const body = await request.json();
      const parsed = updateBookingStatusSchema.safeParse(body);

      if (!parsed.success) {
        return validationErrorResponse(parsed.error.flatten().fieldErrors);
      }

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { slot: true },
      });

      if (!booking) {
        return errorResponse('Booking not found', 404);
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: BookingStatus[parsed.data.status] },
        include: { slot: true },
      });

      const dateFormatted = updated.slot!.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      try {
        if (parsed.data.status === 'CONFIRMED') {
          await emailService.sendBookingConfirmed(updated.email, {
            bookingId: updated.id,
            name: updated.name,
            date: dateFormatted,
            time: updated.slot!.time,
            duration: updated.slot!.duration,
            message: parsed.data.message || 'Your booking has been confirmed!',
            status: 'confirmed',
          });
        } else if (parsed.data.status === 'CANCELLED') {
          await emailService.sendBookingRejected(updated.email, {
            bookingId: updated.id,
            name: updated.name,
            date: dateFormatted,
            time: updated.slot!.time,
            duration: updated.slot!.duration,
            message: parsed.data.message || 'Your booking could not be confirmed at this time.',
            status: 'rejected',
          });
        }
      } catch (emailError) {
        console.error('[Booking Status Update] Email failed:', emailError);
      }

      return successResponse(
        {
          id: updated.id,
          status: updated.status,
          date: dateFormatted,
          time: updated.slot!.time,
        },
        `Booking ${parsed.data.status.toLowerCase()}`
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse('Invalid JSON body', 400);
      }
      return serverErrorResponse();
    }
  })(request);
}
