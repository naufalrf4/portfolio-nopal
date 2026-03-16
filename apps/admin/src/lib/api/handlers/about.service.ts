import { db } from '@/lib/db';
import { aboutMe } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { UpdateAboutInput } from '@/lib/validations/about.schema';
import { createId } from '@paralleldrive/cuid2';

type AboutInsert = typeof aboutMe.$inferInsert;

function sanitizeAssetValue(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    try {
      const parsedUrl = new URL(trimmedValue);
      const hasSignedQuery =
        parsedUrl.searchParams.has('X-Amz-Algorithm') ||
        parsedUrl.searchParams.has('X-Amz-Signature') ||
        parsedUrl.searchParams.has('x-id');

      if (!hasSignedQuery) {
        return trimmedValue;
      }

      const bucketName = process.env.R2_BUCKET_NAME;
      const rawPath = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));

      if (bucketName && rawPath.startsWith(`${bucketName}/`)) {
        return rawPath.slice(bucketName.length + 1);
      }

      return rawPath || null;
    } catch {
      return trimmedValue;
    }
  }

  return trimmedValue;
}

function normalizeExperienceItems(
  experience: UpdateAboutInput['experience']
): AboutInsert['experience'] {
  if (!experience) {
    return null;
  }

  return experience.map((item) => ({
    ...item,
    logoUrl: sanitizeAssetValue(item.logoUrl) ?? '',
    skills: item.skills?.map((skill) => skill.trim()).filter(Boolean) ?? [],
  }));
}

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
    const normalizedData = this.normalizePayload(data, existing?.id);

    if (!existing) {
      const [created] = await db.insert(aboutMe).values(normalizedData).returning();
      return created;
    }

    const [updated] = await db
      .update(aboutMe)
      .set({
        fullName: normalizedData.fullName,
        tagline: normalizedData.tagline,
        roles: normalizedData.roles,
        shortBio: normalizedData.shortBio,
        bio: normalizedData.bio,
        email: normalizedData.email,
        phone: normalizedData.phone,
        location: normalizedData.location,
        avatarUrl: normalizedData.avatarUrl,
        resumeUrl: normalizedData.resumeUrl,
        skills: normalizedData.skills,
        experience: normalizedData.experience,
        socialLinks: normalizedData.socialLinks,
        updatedAt: normalizedData.updatedAt,
      })
      .where(eq(aboutMe.id, existing.id))
      .returning();

    return updated;
  }

  private normalizePayload(data: UpdateAboutInput, id = createId()): AboutInsert {
    return {
      id,
      updatedAt: new Date().toISOString(),
      fullName: data.fullName,
      tagline: data.tagline ?? '',
      roles: data.roles,
      shortBio: data.shortBio ?? null,
      bio: data.bio ?? '',
      email: data.email,
      phone: data.phone ?? null,
      location: data.location ?? null,
      avatarUrl: sanitizeAssetValue(data.avatarUrl),
      resumeUrl: sanitizeAssetValue(data.resumeUrl),
      skills: data.skills,
      experience: normalizeExperienceItems(data.experience),
      socialLinks: data.socialLinks ?? null,
    };
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
        shortBio: '',
        bio: '',
        roles: [],
        skills: [],
      })
      .returning();

    return created;
  }
}

export const aboutService = new AboutService();
