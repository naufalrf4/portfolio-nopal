export type ExperienceType = 'work' | 'education' | 'certification' | 'organization';

export interface Experience {
  id?: string;
  type: ExperienceType | string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
  skills?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface AboutData {
  fullName: string;
  tagline: string;
  roles: string[];
  bio: string;
  email?: string;
  location?: string;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  skills: Skill[] | string[];
  experience: Experience[];
  socialLinks?: SocialLinks | Array<{ platform: string; url: string }>;
}
