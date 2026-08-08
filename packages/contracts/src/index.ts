// ──────────────────────────────────────────────────────────────────────────
// @naufalrf/contracts — pure types derived from Admin API producer shapes
// ──────────────────────────────────────────────────────────────────────────
// Source of truth: apps/admin/src/app/api/v1/public/*/route.ts
//                        apps/admin/src/lib/api/responses/index.ts
//
// DO NOT add fallback data, endpoint URLs, or runtime logic.
// Keep fields and optionality EXACTLY as Admin returns them.
// ──────────────────────────────────────────────────────────────────────────

// ─── About ───────────────────────────────────────────────────────────────
// Source: GET /api/v1/public/about
//         apps/admin/src/app/api/v1/public/about/route.ts

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface ExperienceItem {
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

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

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
  availabilityStatus: AvailabilityStatus | null;
  skills: Skill[];
  experience: ExperienceItem[];
  socialLinks: SocialLink[];
}

// ─── Projects ────────────────────────────────────────────────────────────
// Sources: GET /api/v1/public/projects  (list)
//          GET /api/v1/public/projects/[slug] (detail)

export interface ProjectImage {
  id: string;
  url: string;
  order: number;
  alt: string | null;
  caption: string | null;
}

/** Shape returned by GET /projects (list) — images are a subset of full ProjectImage */
export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  techStack: string[] | null;
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  images: ProjectImage[];
}

/** Shape returned by GET /projects/[slug] (detail) — full projectImages row */
export interface ProjectDetailImage {
  id: string;
  projectId: string;
  url: string;
  key: string | null;
  order: number;
  caption: string | null;
  alt: string | null;
  createdAt: string;
}

/** Shape returned by GET /projects/[slug] — superset of ProjectListItem */
export interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  content: string | null;
  category: string;
  techStack: string[] | null;
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  projectDate: string | null;
  images: ProjectDetailImage[];
}

export interface ProjectsMeta {
  total: number;
  featured: number;
}

export interface ProjectsResponse {
  projects: ProjectListItem[];
  meta: ProjectsMeta;
}

// ─── Profile Links ───────────────────────────────────────────────────────
// Source: GET /api/v1/public/links
//         apps/admin/src/app/api/v1/public/links/route.ts

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blogs ───────────────────────────────────────────────────────────────
// Source: GET /api/v1/public/blogs
//         apps/admin/src/app/api/v1/public/blogs/route.ts

export interface Blog {
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
  blogs: Blog[];
  meta: { total: number };
}

// ─── Achievements ────────────────────────────────────────────────────────
// Source: GET /api/v1/public/achievements
//         apps/admin/src/app/api/v1/public/achievements/route.ts

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
  meta: { total: number };
}

// ─── Guestbook ───────────────────────────────────────────────────────────
// Source: GET /api/v1/public/guestbook
//         apps/admin/src/app/api/v1/public/guestbook/route.ts

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

// ─── Messages (NGL) ──────────────────────────────────────────────────────
// Source: POST /api/v1/public/messages
//         apps/admin/src/app/api/v1/public/messages/route.ts

export interface MessagePayload {
  content: string;
  turnstileToken: string;
  timezone?: string;
}

export interface MessageError {
  message: string;
  code?: string;
}

export interface MessageResponse {
  success: boolean;
  error?: MessageError;
}

// ─── Contact Form ────────────────────────────────────────────────────────
// Source: POST /api/v1/public/contact
//         apps/admin/src/app/api/v1/public/contact/route.ts

export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileToken?: string;
  timezone?: string;
}

// ─── Bookings ────────────────────────────────────────────────────────────
// Sources: POST /api/v1/public/bookings
//          GET  /api/v1/public/bookings/available

export interface BookingSlotItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

/** date-grouped availability: { "2026-08-01": [BookingSlotItem, ...] } */
export type BookingAvailability = Record<string, BookingSlotItem[]>;

export interface BookingSubmissionInput {
  slotId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  turnstileToken?: string;
  timezone?: string;
}

export interface BookingResult {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  date: string;
  time: string;
  duration: number;
  createdAt: string;
}

// ─── Envelope ────────────────────────────────────────────────────────────
// Source: apps/admin/src/lib/api/responses/index.ts
//
// Every Admin public API response is wrapped in this top-level shape.
//   Success: { success: true, data: T, message?: string }
//   Error:   { success: false, error: { message: string, code?: string, details?: unknown } }

export interface ApiSuccessEnvelope<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiEnvelope<T = unknown> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

// ─── Type re-exports for consumer convenience ────────────────────────────

export type {
  ProjectListItem as Project, // legacy alias — most consumers use this as "Project"
};
