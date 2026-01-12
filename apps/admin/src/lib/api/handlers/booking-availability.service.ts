import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';

type BookingAvailabilityRecord = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBookingAvailabilityInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled?: boolean;
};

export type UpdateBookingAvailabilityInput = Partial<CreateBookingAvailabilityInput>;

export type BulkUpdateAvailabilityInput = {
  dayOfWeek: number;
  enabled: boolean;
};

export type AvailabilityQueryInput = {
  dayOfWeek?: number;
  enabled?: boolean;
};

export class BookingAvailabilityService {
  async getAll(query: AvailabilityQueryInput) {
    const where: Prisma.BookingAvailabilityWhereInput = {
      ...(query.dayOfWeek !== undefined && { dayOfWeek: query.dayOfWeek }),
      ...(query.enabled !== undefined && { enabled: query.enabled }),
    };

    const availabilities = await prisma.bookingAvailability.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    const groupedByDay = availabilities.reduce<Record<number, typeof availabilities>>(
      (acc, item) => {
        if (!acc[item.dayOfWeek]) {
          acc[item.dayOfWeek] = [];
        }
        acc[item.dayOfWeek].push(item);
        return acc;
      },
      {} as Record<number, typeof availabilities>
    );

    return {
      availabilities,
      groupedByDay,
    };
  }

  async getById(id: string) {
    return prisma.bookingAvailability.findUnique({
      where: { id },
    });
  }

  async create(data: CreateBookingAvailabilityInput) {
    const overlapping = await this.checkOverlap(data.dayOfWeek, data.startTime, data.endTime);
    if (overlapping) {
      throw new Error('Time slot overlaps with existing availability');
    }

    return prisma.bookingAvailability.create({
      data,
    });
  }

  async update(id: string, data: UpdateBookingAvailabilityInput) {
    if (data.dayOfWeek !== undefined && data.startTime && data.endTime) {
      const overlapping = await this.checkOverlap(data.dayOfWeek, data.startTime, data.endTime, id);
      if (overlapping) {
        throw new Error('Time slot overlaps with existing availability');
      }
    }

    return prisma.bookingAvailability.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.bookingAvailability.delete({
      where: { id },
    });
  }

  async bulkUpdate(data: BulkUpdateAvailabilityInput) {
    return prisma.bookingAvailability.updateMany({
      where: { dayOfWeek: data.dayOfWeek },
      data: { enabled: data.enabled },
    });
  }

  private async checkOverlap(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    const existingSlots = await prisma.bookingAvailability.findMany({
      where: {
        dayOfWeek,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    const [newStartHour, newStartMin] = startTime.split(':').map(Number);
    const [newEndHour, newEndMin] = endTime.split(':').map(Number);
    const newStart = newStartHour * 60 + newStartMin;
    const newEnd = newEndHour * 60 + newEndMin;

    return existingSlots.some((slot: BookingAvailabilityRecord) => {
      const [existStartHour, existStartMin] = slot.startTime.split(':').map(Number);
      const [existEndHour, existEndMin] = slot.endTime.split(':').map(Number);
      const existStart = existStartHour * 60 + existStartMin;
      const existEnd = existEndHour * 60 + existEndMin;

      return (
        (newStart >= existStart && newStart < existEnd) ||
        (newEnd > existStart && newEnd <= existEnd) ||
        (newStart <= existStart && newEnd >= existEnd)
      );
    });
  }
}

export const bookingAvailabilityService = new BookingAvailabilityService();
