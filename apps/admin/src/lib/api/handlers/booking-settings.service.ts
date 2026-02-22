import { db } from '@/lib/db';
import { bookingSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { UpdateBookingSettingsInput } from '@/lib/validations/booking-settings.schema';
import { createId } from '@paralleldrive/cuid2';

const DEFAULT_SETTINGS = {
  notificationEmail: null,
  reminderEnabled: true,
  reminderDay: 6,
  reminderTime: '09:00',
  timezone: 'Asia/Jakarta',
} as const;

export class BookingSettingsService {
  async get() {
    const result = await db.select().from(bookingSettings).limit(1);
    let settings = result[0];

    if (!settings) {
      settings = await this.create();
    }

    return settings;
  }

  async update(data: UpdateBookingSettingsInput) {
    const existing = await db.select().from(bookingSettings).limit(1);

    if (!existing[0]) {
      return this.create(data);
    }

    const [updated] = await db
      .update(bookingSettings)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      } as any)
      .where(eq(bookingSettings.id, existing[0].id))
      .returning();
    return updated;
  }

  private async create(data?: UpdateBookingSettingsInput) {
    const now = new Date().toISOString();
    const [created] = await db
      .insert(bookingSettings)
      .values({
        id: createId(),
        notificationEmail: data?.notificationEmail ?? DEFAULT_SETTINGS.notificationEmail,
        reminderEnabled: data?.reminderEnabled ?? DEFAULT_SETTINGS.reminderEnabled,
        reminderDay: data?.reminderDay ?? DEFAULT_SETTINGS.reminderDay,
        reminderTime: data?.reminderTime ?? DEFAULT_SETTINGS.reminderTime,
        timezone: data?.timezone ?? DEFAULT_SETTINGS.timezone,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return created;
  }
}

export const bookingSettingsService = new BookingSettingsService();
