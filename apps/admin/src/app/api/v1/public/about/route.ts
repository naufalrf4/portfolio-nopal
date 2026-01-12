import { prisma } from '@/lib/db/prisma';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/responses';

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
    const aboutMe = await prisma.aboutMe.findFirst();

    if (!aboutMe) {
      return notFoundResponse('About me');
    }

    const publicData: PublicAboutData = {
      fullName: aboutMe.fullName,
      tagline: aboutMe.tagline,
      roles: aboutMe.roles,
      bio: aboutMe.bio,
      email: aboutMe.email,
      location: aboutMe.location,
      avatarUrl: aboutMe.avatarUrl,
      resumeUrl: aboutMe.resumeUrl,
      skills: parseJsonField<Skill[]>(aboutMe.skills, []),
      experience: parseJsonField<Experience[]>(aboutMe.experience, []),
      socialLinks: parseJsonField<SocialLink[]>(aboutMe.socialLinks, []),
    };

    return successResponse(publicData);
  } catch {
    return serverErrorResponse();
  }
}
