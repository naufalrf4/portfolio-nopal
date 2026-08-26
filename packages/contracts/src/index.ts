

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

export interface ProjectImage {
  id: string;
  url: string;
  order: number;
  alt: string | null;
  caption: string | null;
}

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

export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileToken?: string;
  timezone?: string;
}

export interface BookingSlotItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

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

export type {
  ProjectListItem as Project, 
};
