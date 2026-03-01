export interface ProjectContext {
  id: string;
  title: string;
  content: string;
  type: string;
}

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
  category: string;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  projectDate?: string | null;
  images: ProjectImage[];
  contexts?: ProjectContext[];
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
  company: string;
  period: string;
  description: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface AboutData {
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
