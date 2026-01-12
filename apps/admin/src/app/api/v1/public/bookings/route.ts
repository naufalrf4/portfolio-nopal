import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { SlotStatus, BookingStatus } from '@/prisma/generated/client/client';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/responses';
import { verifyTurnstileToken, isTurnstileConfigured } from '@/lib/services/turnstile';
import { createHash } from 'crypto';

const publicBookingSchema = z.object({
  slotId: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicBookingSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    if (isTurnstileConfigured()) {
      const turnstileResult = await verifyTurnstileToken(parsed.data.turnstileToken);

      if (!turnstileResult.success) {
        return errorResponse(
          'CAPTCHA verification failed. Please try again.',
          400,
          'TURNSTILE_VERIFICATION_FAILED'
        );
      }
    }

    const { slotId, name, email, phone, notes } = parsed.data;

    const slot = await prisma.bookingSlot.findUnique({
      where: { id: slotId },
      include: { booking: true },
    });

    if (!slot) {
      return notFoundResponse('Booking slot');
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      return errorResponse('This time slot is no longer available', 409);
    }

    if (slot.booking) {
      return errorResponse('This time slot is already booked', 409);
    }

    const slotDate = new Date(slot.date);
    slotDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (slotDate < today) {
      return errorResponse('Cannot book a slot in the past', 400);
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashIp(ip);

    const booking = await prisma.$transaction(async (tx) => {
      await tx.bookingSlot.update({
        where: { id: slotId },
        data: { status: SlotStatus.BOOKED },
      });

      return tx.booking.create({
        data: {
          name,
          email,
          phone: phone || null,
          notes: notes || null,
          ipHash,
          status: BookingStatus.PENDING,
          slotId,
        },
        include: { slot: true },
      });
    });

    const responseData = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      notes: booking.notes,
      status: booking.status,
      date: booking.slot?.date.toISOString().split('T')[0],
      time: booking.slot?.time,
      duration: booking.slot?.duration,
      createdAt: booking.createdAt.toISOString(),
    };

    return successResponse(responseData, 'Booking confirmed');
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON body', 400);
    }
    return serverErrorResponse();
  }
}
