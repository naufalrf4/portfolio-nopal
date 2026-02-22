import { db } from '@/lib/db';
import { aboutMe } from '@/lib/db/schema';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/responses';
import { signAssetUrls } from '@/lib/utils/sign-urls';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  type: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface PublicAboutData {
  fullName: string;
  tagline: string | null;
  roles: string[];
  bio: string;
  email: string;
  location: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  availabilityStatus: 'available' | 'busy' | 'unavailable' | null;
  skills: Skill[];
  experience: Experience[];
  socialLinks: SocialLink[];
}

function parseJsonField<T>(value: unknown, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
  return value as T;
}

export async function GET() {
  try {
    const result = await db.select().from(aboutMe).limit(1);
    const aboutMeData = result[0];

    if (!aboutMeData) {
      return notFoundResponse('About me');
    }

    const availability = aboutMeData.availabilityStatus;
    const publicData: PublicAboutData = {
      fullName: aboutMeData.fullName,
      tagline: aboutMeData.tagline,
      roles: aboutMeData.roles || [],
      bio: aboutMeData.bio,
      email: aboutMeData.email,
      location: aboutMeData.location,
      avatarUrl: aboutMeData.avatarUrl,
      resumeUrl: aboutMeData.resumeUrl,
      availabilityStatus:
        availability === 'available' || availability === 'busy' || availability === 'unavailable'
          ? availability
          : null,
      skills: parseJsonField<Skill[]>(aboutMeData.skills, []),
      experience: parseJsonField<Experience[]>(aboutMeData.experience, []),
      socialLinks: parseJsonField<SocialLink[]>(aboutMeData.socialLinks, []),
    };

    const signedData = await signAssetUrls(publicData, {
      fields: ['avatarUrl', 'resumeUrl'],
    });

    return successResponse(signedData);
  } catch {
    return serverErrorResponse();
  }
}
