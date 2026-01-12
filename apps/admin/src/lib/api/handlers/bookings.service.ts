import { prisma } from '@/lib/db/prisma';
import { Prisma, BookingStatus } from '@/prisma/generated/client/client';
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
  BookingQueryInput,
  CalendarQueryInput,
} from '@/lib/validations/booking.schema';

export const bookingsService = {
  async getAll(query: BookingQueryInput) {
    const { page, limit, status, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      const dateFilter: Prisma.DateTimeFilter<'BookingSlot'> = {};
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.lte = new Date(dateTo);
      }
      where.slot = { date: dateFilter };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { slot: true },
      }),
      prisma.booking.count({ where }),
    ]);

    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.slot?.date?.toISOString() || '',
      time: booking.slot?.time || '',
      timezone: 'UTC',
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { slot: true },
    });
  },

  async create(data: CreateBookingInput) {
    const bookingDate = new Date(data.date);

    if (bookingDate < new Date()) {
      throw new Error('Booking date must be in the future');
    }

    const slot = await prisma.bookingSlot.create({
      data: {
        date: bookingDate,
        time: data.time,
        duration: 60,
        status: 'BOOKED',
      },
    });

    return prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        ipHash: data.ipHash,
        status: 'PENDING',
        slotId: slot.id,
      },
      include: { slot: true },
    });
  },

  async updateStatus(id: string, data: UpdateBookingStatusInput) {
    return prisma.booking.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
      },
      include: { slot: true },
    });
  },

  async delete(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { slotId: true },
    });

    const deleted = await prisma.booking.delete({
      where: { id },
    });

    if (booking?.slotId) {
      await prisma.bookingSlot
        .delete({
          where: { id: booking.slotId },
        })
        .catch(() => {});
    }

    return deleted;
  },

  async getCalendarView(query: CalendarQueryInput) {
    const { month, year } = query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bookings = await prisma.booking.findMany({
      where: {
        slot: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: { slot: true },
      orderBy: { createdAt: 'asc' },
    });

    const groupedByDate: Record<string, typeof bookings> = {};

    bookings.forEach((booking) => {
      if (booking.slot?.date) {
        const dateKey = booking.slot.date.toISOString().split('T')[0];
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push(booking);
      }
    });

    return { dates: groupedByDate };
  },
};
