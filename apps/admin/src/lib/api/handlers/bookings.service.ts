import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db';
import { eq, and, gte, lte, desc, asc, count, inArray } from 'drizzle-orm';
import { bookings, bookingSlots } from '@/lib/db/schema';
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

    const conditions = [];

    if (status) {
      conditions.push(eq(bookings.status, status));
    }

    if (dateFrom || dateTo) {
      const slotConditions = [];
      if (dateFrom) {
        slotConditions.push(gte(bookingSlots.date, new Date(dateFrom).toISOString().split('T')[0]));
      }
      if (dateTo) {
        slotConditions.push(lte(bookingSlots.date, new Date(dateTo).toISOString().split('T')[0]));
      }

      const matchingSlotIds = await db
        .select({ id: bookingSlots.id })
        .from(bookingSlots)
        .where(slotConditions.length > 1 ? and(...slotConditions) : slotConditions[0]);

      const slotIds = matchingSlotIds.map((s) => s.id);

      if (slotIds.length === 0) {
        return {
          bookings: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

      conditions.push(inArray(bookings.slotId, slotIds));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(whereClause)
        .orderBy(desc(bookings.createdAt))
        .offset(skip)
        .limit(limit),
      db.select({ total: count() }).from(bookings).where(whereClause),
    ]);

    const total = countResult[0]?.total ?? 0;

    const slotIds = rows.map((b) => b.slotId).filter(Boolean) as string[];
    let slotsMap: Record<string, typeof bookingSlots.$inferSelect> = {};
    if (slotIds.length > 0) {
      const slots = await db.select().from(bookingSlots).where(inArray(bookingSlots.id, slotIds));
      slotsMap = Object.fromEntries(slots.map((s) => [s.id, s]));
    }

    const transformedBookings = rows.map((booking) => {
      const slot = booking.slotId ? slotsMap[booking.slotId] : undefined;
      return {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: slot?.date || '',
        time: slot?.time || '',
        timezone:
          booking.metadata && typeof booking.metadata === 'object' && 'timezone' in booking.metadata
            ? String(booking.metadata.timezone)
            : 'Asia/Jakarta',
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

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
    return db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        bookingSlot: true,
      },
    });
  },

  async create(data: CreateBookingInput) {
    const bookingDate = new Date(data.date);

    if (bookingDate < new Date()) {
      throw new Error('Booking date must be in the future');
    }

    const now = new Date().toISOString();
    const dateStr = bookingDate.toISOString().split('T')[0];

    const [slot] = await db
      .insert(bookingSlots)
      .values({
        id: createId(),
        date: dateStr,
        time: data.time,
        duration: 60,
        status: 'BOOKED',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const [booking] = await db
      .insert(bookings)
      .values({
        id: createId(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        ipHash: data.ipHash,
        ipAddress: data.ipAddress || null,
        countryCode: data.countryCode || null,
        country: data.country || null,
        city: data.city || null,
        region: data.region || null,
        metadata: data.metadata || {},
        status: 'PENDING',
        slotId: slot.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
      with: {
        bookingSlot: true,
      },
    });
  },

  async updateStatus(id: string, data: UpdateBookingStatusInput) {
    const now = new Date().toISOString();
    const updateData: Partial<
      Pick<typeof bookings.$inferInsert, 'status' | 'notes' | 'updatedAt'>
    > = {
      status: data.status,
      notes: data.notes,
      updatedAt: now,
    };
    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    if (!updated) return null;

    return db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        bookingSlot: true,
      },
    });
  },

  async delete(id: string) {
    const [booking] = await db
      .select({ slotId: bookings.slotId })
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    const [deleted] = await db.delete(bookings).where(eq(bookings.id, id)).returning();

    if (booking?.slotId) {
      await db
        .delete(bookingSlots)
        .where(eq(bookingSlots.id, booking.slotId))
        .catch(() => {});
    }

    return deleted;
  },

  async getCalendarView(query: CalendarQueryInput) {
    const { month, year } = query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const matchingSlots = await db
      .select({ id: bookingSlots.id })
      .from(bookingSlots)
      .where(and(gte(bookingSlots.date, startDateStr), lte(bookingSlots.date, endDateStr)));

    const slotIds = matchingSlots.map((s) => s.id);

    if (slotIds.length === 0) {
      return { dates: {} };
    }

    const allBookings = await db.query.bookings.findMany({
      where: inArray(bookings.slotId, slotIds),
      orderBy: [asc(bookings.createdAt)],
      with: {
        bookingSlot: true,
      },
    });

    const groupedByDate: Record<string, typeof allBookings> = {};

    allBookings.forEach((booking) => {
      if (booking.bookingSlot?.date) {
        const dateKey = booking.bookingSlot.date;
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push(booking);
      }
    });

    return { dates: groupedByDate };
  },
};
