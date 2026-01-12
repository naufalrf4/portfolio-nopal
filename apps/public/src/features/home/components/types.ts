export interface AboutData {
  fullName: string;
  tagline?: string;
  roles?: string[];
  bio: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills?: Array<{ name: string; category: string; level?: string }>;
  experience?: Array<{
    id: string;
    type: 'work' | 'education' | 'certification' | 'organization';
    title: string;
    organization: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    skills?: string[];
  }>;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt?: string | Date;
}

export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt?: string | Date;
}
