import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db';
import { eq, and, gte, lte, asc } from 'drizzle-orm';
import { bookingSlots } from '@/lib/db/schema';
import type {
  CreateBookingSlotInput,
  BulkCreateSlotsInput,
  UpdateBookingSlotInput,
  CopyFromWeekInput,
  SlotsQueryInput,
} from '@/lib/validations/booking-slots.schema';

export class BookingSlotsService {
  async getSlotsByDateRange(query: SlotsQueryInput) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const slots = await db.query.bookingSlots.findMany({
      where: and(gte(bookingSlots.date, startDateStr), lte(bookingSlots.date, endDateStr)),
      orderBy: [asc(bookingSlots.date), asc(bookingSlots.time)],
      with: {
        booking: {
          columns: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    const transformedSlots = slots.map((slot) => {
      const startTime = slot.time;
      const endTime = this.calculateEndTime(slot.time, slot.duration);

      return {
        id: slot.id,
        date: slot.date,
        startTime,
        endTime,
        status: slot.status,
        bookerName: slot.booking?.name,
        bookerEmail: slot.booking?.email,
        createdAt: slot.createdAt,
        updatedAt: slot.updatedAt,
      };
    });

    const groupedByDate = transformedSlots.reduce(
      (acc, slot) => {
        const dateKey = slot.date;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(slot);
        return acc;
      },
      {} as Record<string, typeof transformedSlots>
    );

    return {
      slots: transformedSlots,
      groupedByDate,
      totalCount: transformedSlots.length,
    };
  }

  private calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  }

  async getSlotById(id: string) {
    const slot = await db.query.bookingSlots.findFirst({
      where: eq(bookingSlots.id, id),
      with: {
        booking: true,
      },
    });

    if (!slot) return null;

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date,
      startTime,
      endTime,
      status: slot.status,
      bookerName: slot.booking?.name,
      bookerEmail: slot.booking?.email,
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    };
  }

  async createSlot(data: CreateBookingSlotInput) {
    const slotDate = new Date(data.date);
    slotDate.setHours(0, 0, 0, 0);
    const dateStr = slotDate.toISOString().split('T')[0];

    const [existingSlot] = await db
      .select()
      .from(bookingSlots)
      .where(and(eq(bookingSlots.date, dateStr), eq(bookingSlots.time, data.time)))
      .limit(1);

    if (existingSlot) {
      throw new Error('A slot already exists for this date and time');
    }

    const now = new Date().toISOString();
    const [slot] = await db
      .insert(bookingSlots)
      .values({
        id: createId(),
        date: dateStr,
        time: data.time,
        duration: data.duration,
        status: 'AVAILABLE',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date,
      startTime,
      endTime,
      status: slot.status,
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    };
  }

  async createBulkSlots(data: BulkCreateSlotsInput) {
    const results: { created: number; skipped: number; errors: string[] } = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (const slotData of data.slots) {
      try {
        const slotDate = new Date(slotData.date);
        slotDate.setHours(0, 0, 0, 0);
        const dateStr = slotDate.toISOString().split('T')[0];

        const [existingSlot] = await db
          .select()
          .from(bookingSlots)
          .where(and(eq(bookingSlots.date, dateStr), eq(bookingSlots.time, slotData.time)))
          .limit(1);

        if (existingSlot) {
          results.skipped++;
          continue;
        }

        const now = new Date().toISOString();
        await db.insert(bookingSlots).values({
          id: createId(),
          date: dateStr,
          time: slotData.time,
          duration: slotData.duration,
          status: 'AVAILABLE',
          createdAt: now,
          updatedAt: now,
        });
        results.created++;
      } catch (error) {
        results.errors.push(
          `Failed to create slot for ${slotData.date} ${slotData.time}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return results;
  }

  async updateSlot(id: string, data: UpdateBookingSlotInput) {
    const existingSlot = await db.query.bookingSlots.findFirst({
      where: eq(bookingSlots.id, id),
      with: {
        booking: true,
      },
    });

    if (!existingSlot) {
      throw new Error('Slot not found');
    }

    if (existingSlot.status === 'BOOKED' && data.status === 'BLOCKED') {
      throw new Error('Cannot block a slot that is already booked');
    }

    const updateData: Partial<
      Pick<typeof bookingSlots.$inferInsert, 'time' | 'status' | 'updatedAt'>
    > = {};

    if (data.time !== undefined) {
      const [existingAtTime] = await db
        .select()
        .from(bookingSlots)
        .where(and(eq(bookingSlots.date, existingSlot.date), eq(bookingSlots.time, data.time)))
        .limit(1);

      if (existingAtTime && existingAtTime.id !== id) {
        throw new Error('A slot already exists for this time');
      }
      updateData.time = data.time;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const now = new Date().toISOString();
    updateData.updatedAt = now;

    const [slot] = await db
      .update(bookingSlots)
      .set(updateData)
      .where(eq(bookingSlots.id, id))
      .returning();

    const updatedWithBooking = await db.query.bookingSlots.findFirst({
      where: eq(bookingSlots.id, id),
      with: {
        booking: true,
      },
    });

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date,
      startTime,
      endTime,
      status: slot.status,
      bookerName: updatedWithBooking?.booking?.name,
      bookerEmail: updatedWithBooking?.booking?.email,
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    };
  }

  async deleteSlot(id: string) {
    const slot = await db.query.bookingSlots.findFirst({
      where: eq(bookingSlots.id, id),
      with: {
        booking: true,
      },
    });

    if (!slot) {
      throw new Error('Slot not found');
    }

    if (slot.status === 'BOOKED') {
      throw new Error('Cannot delete a slot that is booked');
    }

    const [deleted] = await db.delete(bookingSlots).where(eq(bookingSlots.id, id)).returning();
    return deleted;
  }

  async copyFromWeek(data: CopyFromWeekInput) {
    const sourceStart = new Date(data.sourceStartDate);
    const targetStart = new Date(data.targetStartDate);

    sourceStart.setHours(0, 0, 0, 0);
    targetStart.setHours(0, 0, 0, 0);

    const sourceEnd = new Date(sourceStart);
    sourceEnd.setDate(sourceEnd.getDate() + 6);
    sourceEnd.setHours(23, 59, 59, 999);

    const sourceStartStr = sourceStart.toISOString().split('T')[0];
    const sourceEndStr = sourceEnd.toISOString().split('T')[0];

    const sourceSlots = await db
      .select()
      .from(bookingSlots)
      .where(
        and(
          gte(bookingSlots.date, sourceStartStr),
          lte(bookingSlots.date, sourceEndStr),
          eq(bookingSlots.status, 'AVAILABLE')
        )
      )
      .orderBy(asc(bookingSlots.date), asc(bookingSlots.time));

    const results: { created: number; skipped: number } = {
      created: 0,
      skipped: 0,
    };

    for (const slot of sourceSlots) {
      const slotDate = new Date(slot.date);
      const dayOffset = Math.floor(
        (slotDate.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24)
      );

      const targetDate = new Date(targetStart);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      const [existingSlot] = await db
        .select()
        .from(bookingSlots)
        .where(and(eq(bookingSlots.date, targetDateStr), eq(bookingSlots.time, slot.time)))
        .limit(1);

      if (existingSlot) {
        results.skipped++;
        continue;
      }

      const now = new Date().toISOString();
      await db.insert(bookingSlots).values({
        id: createId(),
        date: targetDateStr,
        time: slot.time,
        duration: slot.duration,
        status: 'AVAILABLE',
        createdAt: now,
        updatedAt: now,
      });
      results.created++;
    }

    return results;
  }
}

export const bookingSlotsService = new BookingSlotsService();
