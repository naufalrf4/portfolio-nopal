import { db } from '@/lib/db';
import { aboutMe } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { UpdateAboutInput } from '@/lib/validations/about.schema';
import { createId } from '@paralleldrive/cuid2';

export class AboutService {
  async get() {
    const result = await db.select().from(aboutMe).limit(1);
    const aboutMeData = result[0];

    if (!aboutMeData) {
      return this.createDefault();
    }

    return aboutMeData;
  }

  async update(data: UpdateAboutInput) {
    const result = await db.select().from(aboutMe).limit(1);
    const existing = result[0];

    const updateData: any = {
      fullName: data.fullName,
      roles: data.roles,
      bio: data.bio,
      email: data.email,
      skills: data.skills,
    };

    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.resumeUrl !== undefined) updateData.resumeUrl = data.resumeUrl;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks;

    if (!existing) {
      const [created] = await db
        .insert(aboutMe)
        .values({
          id: createId(),
          updatedAt: new Date().toISOString(),
          ...updateData,
        } as any)
        .returning();
      return created;
    }

    const [updated] = await db
      .update(aboutMe)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      } as any)
      .where(eq(aboutMe.id, existing.id))
      .returning();
    return updated;
  }

  private async createDefault() {
    const [created] = await db
      .insert(aboutMe)
      .values({
        id: createId(),
        updatedAt: new Date().toISOString(),
        fullName: 'Full Name',
        tagline: 'Your Tagline',
        email: 'email@example.com',
        bio: '',
        roles: [],
        skills: [],
      } as any)
      .returning();
    return created;
  }
}

export const aboutService = new AboutService();
