export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}

export interface AboutData {
  fullName: string;
  tagline: string;
  roles: string[];
  bio: string;
  email: string;
  location: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  skills: string[];
  experience: Experience[];
  socialLinks: SocialLinks;
  availabilityStatus?: string;
}

export interface Experience {
  type: 'Work' | 'Education';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  logoUrl?: string | null;
  skills?: string[];
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export interface ProjectsResponse {
  projects: Project[];
  meta: {
    total: number;
    featured: number;
  };
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category: string;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  visible?: boolean;
  order?: number;
  createdAt: string;
  updatedAt?: string;
  content?: string;
  thumbnailId?: string | null;
  contexts?: ProjectContext[];
  images?: ProjectImage[];
}

export interface ProjectContext {
  id: string;
  projectId: string;
  type: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}

export interface BlogsResponse {
  blogs: BlogLink[];
  meta: {
    total: number;
  };
}

export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
}

export interface GuestbookResponse {
  entries: GuestbookEntry[];
}

export interface GuestbookEntry {
  id: string;
  userId: string;
  message: string;
  visible: boolean;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAvailableResponse {
  [date: string]: BookingSlot[];
}

export interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  turnstileToken: string;
}

export interface BookingData {
  slotId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  turnstileToken: string;
}

export interface AnonymousMessageData {
  content: string;
}

export interface GuestbookSubmitData {
  message: string;
  userEmail: string;
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
