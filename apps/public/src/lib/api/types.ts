export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface AboutData {
  fullName: string;
  tagline: string;
  roles: string[];
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl: string;
  resumeUrl?: string;
  skills: { name: string; level: number; category: string }[];
  experience: {
    type: 'work' | 'education' | 'organization';
    title: string;
    company: string;
    period: string;
    description: string;
    location?: string;
  }[];
  socialLinks: { platform: string; url: string }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  contexts?: ProjectContext[];
  images?: ProjectImage[];
}

export interface ProjectContext {
  id: string;
  type: string;
  title: string;
  content: string;
  order: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}

export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt?: string;
}

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: string;
  user?: { name: string; image?: string };
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface BookingSlot {
  date: string;
  time: string;
  duration: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

export interface BookingData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  date: string;
  time: string;
  turnstileToken?: string;
}
