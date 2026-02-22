import { NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { bookingSlots } from '@/lib/db/schema';
import { eq, and, gte, lte, asc } from 'drizzle-orm';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/responses';

const availableSlotsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(14),
});

function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      days: searchParams.get('days') || 14,
    };

    const parsed = availableSlotsQuerySchema.safeParse(queryParams);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { days } = parsed.data;

    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);
    endDate.setHours(23, 59, 59, 999);

    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const slots = await db
      .select()
      .from(bookingSlots)
      .where(
        and(
          eq(bookingSlots.status, 'AVAILABLE'),
          gte(bookingSlots.date, todayStr),
          lte(bookingSlots.date, endDateStr)
        )
      )
      .orderBy(asc(bookingSlots.date), asc(bookingSlots.time));

    const filteredSlots = slots.filter((slot) => {
      const slotDateTime = new Date(slot.date + 'T00:00:00');
      const [hours, minutes] = slot.time.split(':').map(Number);
      slotDateTime.setHours(hours, minutes, 0, 0);

      return slotDateTime > now;
    });

    const groupedByDate: Record<
      string,
      {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
      }[]
    > = {};

    for (const slot of filteredSlots) {
      const dateKey = slot.date;

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }

      groupedByDate[dateKey].push({
        id: slot.id,
        date: dateKey,
        startTime: slot.time,
        endTime: calculateEndTime(slot.time, slot.duration),
        duration: slot.duration,
      });
    }

    return successResponse(groupedByDate);
  } catch {
    return serverErrorResponse();
  }
}
