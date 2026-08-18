// ── Re-exports from shared contracts ──
export type {
  AboutData,
  Skill,
  ExperienceItem,
  SocialLink,
  Achievement,
  AchievementsResponse,
  GuestbookEntry,
  GuestbookUser,
  GuestbookResponse,
  ContactSubmissionInput,
  BookingAvailability,
  BookingSlotItem,
  BookingSubmissionInput,
  ApiSuccessEnvelope,
  ApiErrorEnvelope,
  ApiEnvelope,
} from '@naufalrf/contracts';

// Admin's "Blog" is the same shape; rename for local consumption
export type { Blog as BlogLink } from '@naufalrf/contracts';

// ── Locally merged types (public-astro uses union of list + detail shapes) ──

export interface ProjectImage {
  id: string;
  url: string;
  order: number;
  alt: string | null;
  caption: string | null;
}

/** Local merged Project: list item fields + optional detail-only fields */
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  content?: string | null;
  category: string;
  techStack: string[] | null;
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

export interface BlogsResponse {
  blogs: BlogLink[];
  meta: { total: number };
}
