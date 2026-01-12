import type { ApiResponse } from '@naufalrf/types';

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  contexts?: ProjectContext[];
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  key: string;
  order: number;
  caption?: string;
  alt?: string;
  createdAt: Date;
}

export interface ProjectContext {
  id: string;
  projectId: string;
  type: ProjectContextType;
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectContextType =
  | 'CONTEXT'
  | 'ROLE'
  | 'DECISIONS'
  | 'TRADEOFFS'
  | 'RESULT'
  | 'ARCHITECTURE'
  | 'OPERATIONS'
  | 'METRICS';

export interface BlogLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt?: Date;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestbookEntry {
  id: string;
  userId: string;
  message: string;
  reactions: unknown;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuestbookEntryInput {
  message: string;
}

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

export interface BlogLinksQuery {
  source?: string;
}

export type ProjectsResponse = ApiResponse<{
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export type ProjectResponse = ApiResponse<Project>;
export type BlogLinksResponse = ApiResponse<BlogLink[]>;
export type GuestbookEntriesResponse = ApiResponse<GuestbookEntry[]>;
export type GuestbookEntryResponse = ApiResponse<GuestbookEntry>;
export type ProfileLinksResponse = ApiResponse<ProfileLink[]>;
