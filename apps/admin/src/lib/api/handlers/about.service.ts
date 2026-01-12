import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type { UpdateAboutInput } from '@/lib/validations/about.schema';

export class AboutService {
  async get() {
    const aboutMe = await prisma.aboutMe.findFirst();

    if (!aboutMe) {
      return this.createDefault();
    }

    return aboutMe;
  }

  async update(data: UpdateAboutInput) {
    const existing = await prisma.aboutMe.findFirst();

    const updateData: Prisma.AboutMeUpdateInput = {
      fullName: data.fullName,
      tagline: data.tagline,
      roles: data.roles,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      location: data.location,
      avatarUrl: data.avatarUrl,
      resumeUrl: data.resumeUrl,
      skills: data.skills,
      experience: data.experience ?? Prisma.DbNull,
      socialLinks: data.socialLinks ?? Prisma.DbNull,
    };

    if (!existing) {
      return prisma.aboutMe.create({
        data: updateData as Prisma.AboutMeCreateInput,
      });
    }

    return prisma.aboutMe.update({
      where: { id: existing.id },
      data: updateData,
    });
  }

  private async createDefault() {
    return prisma.aboutMe.create({
      data: {
        fullName: 'Full Name',
        email: 'email@example.com',
        bio: '',
        roles: [],
        skills: [],
      },
    });
  }
}

export const aboutService = new AboutService();
