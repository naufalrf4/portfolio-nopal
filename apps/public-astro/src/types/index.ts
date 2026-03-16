export interface ProjectImage {
  id: string;
  url: string;
  order: number;
  alt: string | null;
  caption: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  content?: string | null;
  category: string;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  projectDate?: string | null;
  images: ProjectImage[];
}

export interface ProjectsResponse {
  projects: Project[];
  meta: {
    total: number;
    featured: number;
  };
}

export interface BlogLink {
  id: string;
  url: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  source: string;
  category: string | null;
  publishedAt: string;
}

export interface BlogsResponse {
  blogs: BlogLink[];
  meta: {
    total: number;
  };
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Experience {
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

export interface SocialLink {
  platform: string;
  url: string;
}

export interface AboutData {
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

export interface Achievement {
  id: string;
  name: string;
  location: string;
  monthYear: string;
  photos: string[];
  description: string;
  externalUrl: string | null;
  order: number;
  createdAt: string;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  meta: {
    total: number;
  };
}

export interface GuestbookUser {
  name: string | null;
  image: string | null;
}

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: string;
  user: GuestbookUser;
}

export interface GuestbookResponse {
  entries: GuestbookEntry[];
}

export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileToken?: string;
  timezone?: string;
}

export interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export type BookingAvailability = Record<string, BookingSlot[]>;

export interface BookingSubmissionInput {
  slotId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  turnstileToken?: string;
  timezone?: string;
}
