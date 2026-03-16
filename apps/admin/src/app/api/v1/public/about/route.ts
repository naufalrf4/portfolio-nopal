import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/responses';
import { signAssetUrls } from '@/lib/utils/sign-urls';
import { getAboutMeRecord } from '@/lib/api/handlers/about-read.service';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  type: string;
  title: string;
  organization: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string;
  logoUrl: string | null;
  skills: string[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface PublicAboutData {
  fullName: string;
  tagline: string | null;
  roles: string[];
  shortBio: string | null;
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

type StoredExperience = {
  type?: unknown;
  title?: unknown;
  company?: unknown;
  organization?: unknown;
  period?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  location?: unknown;
  description?: unknown;
  logoUrl?: unknown;
  skills?: unknown;
};

type StoredSocialLinkMap = Record<string, unknown>;

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

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeSkillCategory(skill: string): string {
  const normalized = skill.toLowerCase();

  if (
    normalized.includes('react') ||
    normalized.includes('next') ||
    normalized.includes('tailwind') ||
    normalized.includes('typescript') ||
    normalized.includes('javascript')
  ) {
    return 'Web Development';
  }

  if (
    normalized.includes('postgres') ||
    normalized.includes('mysql') ||
    normalized.includes('supabase')
  ) {
    return 'Data & Backend';
  }

  if (normalized.includes('iot') || normalized.includes('esp32') || normalized.includes('mqtt')) {
    return 'IoT Systems';
  }

  if (
    normalized.includes('rag') ||
    normalized.includes('ai') ||
    normalized.includes('langchain') ||
    normalized.includes('openai')
  ) {
    return 'AI & Automation';
  }

  if (normalized.includes('docker') || normalized.includes('bash') || normalized.includes('aws')) {
    return 'Cloud & DevOps';
  }

  return 'Tools & Workflow';
}

function normalizeSkills(value: unknown): Skill[] {
  const parsed = parseJsonField<unknown[]>(value, []);

  return parsed.flatMap((skill) => {
    if (typeof skill === 'string') {
      return [
        {
          name: skill,
          level: 85,
          category: normalizeSkillCategory(skill),
        },
      ];
    }

    if (typeof skill === 'object' && skill !== null) {
      const raw = skill as Record<string, unknown>;
      const name = asString(raw.name);
      if (!name) {
        return [];
      }

      const level = typeof raw.level === 'number' ? raw.level : 85;
      const category = asString(raw.category) ?? normalizeSkillCategory(name);

      return [{ name, level, category }];
    }

    return [];
  });
}

function normalizeExperience(value: unknown): Experience[] {
  const parsed = parseJsonField<StoredExperience[]>(value, []);

  return parsed.flatMap((item) => {
    const type = asString(item.type);
    const title = asString(item.title);
    const organization = asString(item.organization) ?? asString(item.company);
    const startDate = asString(item.startDate) ?? asString(item.period);
    const endDate = asString(item.endDate);
    const description = asString(item.description) ?? '';
    const location = asString(item.location);
    const logoUrl = asString(item.logoUrl);
    const skills = parseJsonField<unknown[]>(item.skills, []).flatMap((skill) =>
      typeof skill === 'string' && skill.trim().length > 0 ? [skill.trim()] : []
    );

    if (!type || !title || !organization || !startDate) {
      return [];
    }

    return [
      {
        type,
        title,
        organization,
        location,
        startDate,
        endDate,
        description,
        logoUrl,
        skills,
      },
    ];
  });
}

function normalizeSocialLinks(value: unknown): SocialLink[] {
  const parsedArray = parseJsonField<unknown[]>(value, []);
  if (Array.isArray(parsedArray) && parsedArray.length > 0) {
    return parsedArray.flatMap((item) => {
      if (typeof item !== 'object' || item === null) {
        return [];
      }

      const raw = item as Record<string, unknown>;
      const platform = asString(raw.platform);
      const url = asString(raw.url);

      if (!platform || !url) {
        return [];
      }

      return [{ platform, url }];
    });
  }

  const parsedObject = parseJsonField<StoredSocialLinkMap | null>(value, null);
  if (!parsedObject || Array.isArray(parsedObject) || typeof parsedObject !== 'object') {
    return [];
  }

  return Object.entries(parsedObject).flatMap(([platform, rawUrl]) => {
    const url = asString(rawUrl);
    return url ? [{ platform, url }] : [];
  });
}

export async function GET() {
  try {
    const aboutMeData = await getAboutMeRecord();

    if (!aboutMeData) {
      return notFoundResponse('About me');
    }

    const availability = aboutMeData.availabilityStatus;
    const publicData: PublicAboutData = {
      fullName: aboutMeData.fullName,
      tagline: aboutMeData.tagline,
      roles: aboutMeData.roles || [],
      shortBio: asString(aboutMeData.shortBio),
      bio: aboutMeData.bio,
      email: aboutMeData.email,
      location: aboutMeData.location,
      avatarUrl: aboutMeData.avatarUrl,
      resumeUrl: aboutMeData.resumeUrl,
      availabilityStatus:
        availability === 'available' || availability === 'busy' || availability === 'unavailable'
          ? availability
          : null,
      skills: normalizeSkills(aboutMeData.skills),
      experience: normalizeExperience(aboutMeData.experience),
      socialLinks: normalizeSocialLinks(aboutMeData.socialLinks),
    };

    const signedData = await signAssetUrls(publicData, {
      fields: ['avatarUrl', 'resumeUrl'],
      nested: {
        experience: ['logoUrl'],
      },
    });

    return successResponse(signedData);
  } catch {
    return serverErrorResponse();
  }
}
