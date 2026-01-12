import { prisma } from '@/lib/db/prisma';
import type { UpdateContactSettingsInput } from '@/lib/validations/contact-settings.schema';

export class ContactSettingsService {
  async get() {
    let settings = await prisma.contactSettings.findFirst();

    if (!settings) {
      settings = await prisma.contactSettings.create({
        data: {
          notificationEmail: null,
          blockedKeywords: [],
        },
      });
    }

    return settings;
  }

  async update(data: UpdateContactSettingsInput) {
    const settings = await this.get();

    return prisma.contactSettings.update({
      where: { id: settings.id },
      data,
    });
  }
}

export const contactSettingsService = new ContactSettingsService();
