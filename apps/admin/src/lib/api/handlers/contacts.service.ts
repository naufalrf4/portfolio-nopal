import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type {
  CreateContactInput,
  UpdateContactInput,
  ContactQueryInput,
} from '@/lib/validations/contact.schema';

export class ContactsService {
  async getAll(query: ContactQueryInput) {
    const { page, limit, read, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactFormWhereInput = {
      ...(read !== undefined && { read }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [contacts, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactForm.count({ where }),
    ]);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.contactForm.findUnique({
      where: { id },
    });
  }

  async create(data: CreateContactInput) {
    return prisma.contactForm.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        ipHash: data.ipHash,
        read: false,
        replied: false,
      },
    });
  }

  async update(id: string, data: UpdateContactInput) {
    return prisma.contactForm.update({
      where: { id },
      data,
    });
  }

  async markAsRead(id: string) {
    return this.update(id, { read: true });
  }

  async delete(id: string) {
    return prisma.contactForm.delete({
      where: { id },
    });
  }

  async bulkMarkAsRead(ids: string[]) {
    return prisma.contactForm.updateMany({
      where: { id: { in: ids } },
      data: { read: true },
    });
  }

  async bulkMarkAsUnread(ids: string[]) {
    return prisma.contactForm.updateMany({
      where: { id: { in: ids } },
      data: { read: false },
    });
  }

  async bulkDelete(ids: string[]) {
    return prisma.contactForm.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

export const contactsService = new ContactsService();
