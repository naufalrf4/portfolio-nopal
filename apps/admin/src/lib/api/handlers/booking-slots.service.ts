import { Prisma, SlotStatus } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
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

    const slots = await prisma.bookingSlot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    const transformedSlots = slots.map((slot) => {
      const startTime = slot.time;
      const endTime = this.calculateEndTime(slot.time, slot.duration);

      return {
        id: slot.id,
        date: slot.date.toISOString(),
        startTime,
        endTime,
        status: slot.status,
        bookerName: slot.booking?.name,
        bookerEmail: slot.booking?.email,
        createdAt: slot.createdAt.toISOString(),
        updatedAt: slot.updatedAt.toISOString(),
      };
    });

    const groupedByDate = transformedSlots.reduce(
      (acc, slot) => {
        const dateKey = slot.date.split('T')[0];
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
    const slot = await prisma.bookingSlot.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });

    if (!slot) return null;

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date.toISOString(),
      startTime,
      endTime,
      status: slot.status,
      bookerName: slot.booking?.name,
      bookerEmail: slot.booking?.email,
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
    };
  }

  async createSlot(data: CreateBookingSlotInput) {
    const slotDate = new Date(data.date);
    slotDate.setHours(0, 0, 0, 0);

    const existingSlot = await prisma.bookingSlot.findUnique({
      where: {
        date_time: {
          date: slotDate,
          time: data.time,
        },
      },
    });

    if (existingSlot) {
      throw new Error('A slot already exists for this date and time');
    }

    const slot = await prisma.bookingSlot.create({
      data: {
        date: slotDate,
        time: data.time,
        duration: data.duration,
        status: SlotStatus.AVAILABLE,
      },
    });

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date.toISOString(),
      startTime,
      endTime,
      status: slot.status,
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
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

        const existingSlot = await prisma.bookingSlot.findUnique({
          where: {
            date_time: {
              date: slotDate,
              time: slotData.time,
            },
          },
        });

        if (existingSlot) {
          results.skipped++;
          continue;
        }

        await prisma.bookingSlot.create({
          data: {
            date: slotDate,
            time: slotData.time,
            duration: slotData.duration,
            status: SlotStatus.AVAILABLE,
          },
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
    const existingSlot = await prisma.bookingSlot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!existingSlot) {
      throw new Error('Slot not found');
    }

    if (existingSlot.status === SlotStatus.BOOKED && data.status === 'BLOCKED') {
      throw new Error('Cannot block a slot that is already booked');
    }

    const updateData: Prisma.BookingSlotUpdateInput = {};

    if (data.time !== undefined) {
      const existingAtTime = await prisma.bookingSlot.findUnique({
        where: {
          date_time: {
            date: existingSlot.date,
            time: data.time,
          },
        },
      });

      if (existingAtTime && existingAtTime.id !== id) {
        throw new Error('A slot already exists for this time');
      }
      updateData.time = data.time;
    }

    if (data.status !== undefined) {
      updateData.status = data.status as SlotStatus;
    }

    const slot = await prisma.bookingSlot.update({
      where: { id },
      data: updateData,
      include: { booking: true },
    });

    const startTime = slot.time;
    const endTime = this.calculateEndTime(slot.time, slot.duration);

    return {
      id: slot.id,
      date: slot.date.toISOString(),
      startTime,
      endTime,
      status: slot.status,
      bookerName: slot.booking?.name,
      bookerEmail: slot.booking?.email,
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
    };
  }

  async deleteSlot(id: string) {
    const slot = await prisma.bookingSlot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!slot) {
      throw new Error('Slot not found');
    }

    if (slot.status === SlotStatus.BOOKED) {
      throw new Error('Cannot delete a slot that is booked');
    }

    return prisma.bookingSlot.delete({
      where: { id },
    });
  }

  async copyFromWeek(data: CopyFromWeekInput) {
    const sourceStart = new Date(data.sourceStartDate);
    const targetStart = new Date(data.targetStartDate);

    sourceStart.setHours(0, 0, 0, 0);
    targetStart.setHours(0, 0, 0, 0);

    const sourceEnd = new Date(sourceStart);
    sourceEnd.setDate(sourceEnd.getDate() + 6);
    sourceEnd.setHours(23, 59, 59, 999);

    const sourceSlots = await prisma.bookingSlot.findMany({
      where: {
        date: {
          gte: sourceStart,
          lte: sourceEnd,
        },
        status: SlotStatus.AVAILABLE,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    const results: { created: number; skipped: number } = {
      created: 0,
      skipped: 0,
    };

    for (const slot of sourceSlots) {
      const dayOffset = Math.floor(
        (slot.date.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24)
      );

      const targetDate = new Date(targetStart);
      targetDate.setDate(targetDate.getDate() + dayOffset);

      const existingSlot = await prisma.bookingSlot.findUnique({
        where: {
          date_time: {
            date: targetDate,
            time: slot.time,
          },
        },
      });

      if (existingSlot) {
        results.skipped++;
        continue;
      }

      await prisma.bookingSlot.create({
        data: {
          date: targetDate,
          time: slot.time,
          duration: slot.duration,
          status: SlotStatus.AVAILABLE,
        },
      });
      results.created++;
    }

    return results;
  }
}

export const bookingSlotsService = new BookingSlotsService();
