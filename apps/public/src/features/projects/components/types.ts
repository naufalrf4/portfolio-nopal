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
  alt?: string;
  caption?: string;
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
  contexts?: ProjectContext[];
  images?: ProjectImage[];
  createdAt: string | Date;
  projectDate?: string | Date | null;
}
