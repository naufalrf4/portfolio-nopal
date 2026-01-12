import { prisma } from '@/lib/db/prisma';
import type { UpdateBookingSettingsInput } from '@/lib/validations/booking-settings.schema';

const DEFAULT_SETTINGS = {
  notificationEmail: null,
  reminderEnabled: true,
  reminderDay: 6,
  reminderTime: '09:00',
  timezone: 'Asia/Jakarta',
} as const;

export class BookingSettingsService {
  async get() {
    const settings = await prisma.bookingSettings.findFirst();

    if (!settings) {
      return this.create();
    }

    return settings;
  }

  async update(data: UpdateBookingSettingsInput) {
    const existing = await prisma.bookingSettings.findFirst();

    if (!existing) {
      return this.create(data);
    }

    return prisma.bookingSettings.update({
      where: { id: existing.id },
      data,
    });
  }

  private async create(data?: UpdateBookingSettingsInput) {
    return prisma.bookingSettings.create({
      data: {
        notificationEmail: data?.notificationEmail ?? DEFAULT_SETTINGS.notificationEmail,
        reminderEnabled: data?.reminderEnabled ?? DEFAULT_SETTINGS.reminderEnabled,
        reminderDay: data?.reminderDay ?? DEFAULT_SETTINGS.reminderDay,
        reminderTime: data?.reminderTime ?? DEFAULT_SETTINGS.reminderTime,
        timezone: data?.timezone ?? DEFAULT_SETTINGS.timezone,
      },
    });
  }
}

export const bookingSettingsService = new BookingSettingsService();
