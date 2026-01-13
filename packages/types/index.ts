export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export type ProjectCategory = 'web' | 'mobile' | 'backend' | 'devops' | 'all';

export type ProjectContextType =
  | 'CONTEXT'
  | 'ROLE'
  | 'DECISIONS'
  | 'TRADEOFFS'
  | 'RESULT'
  | 'ARCHITECTURE'
  | 'OPERATIONS'
  | 'METRICS';

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
}

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
  reactions: Record<string, unknown>;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface AnonymousMessage {
  id: string;
  content: string;
  ipHash: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatLog {
  id: string;
  sessionId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: {
      model?: string;
      tokens?: number;
      duration?: number;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
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

export interface KnowledgeDoc {
  id: string;
  filename: string;
  content: string;
  indexed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: Date;
  time: string;
  timezone: string;
  notes?: string;
  status: BookingStatus;
  ipHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  order: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface AboutMe {
  id: string;
  fullName: string;
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  bio: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills: string[];
  socialLinks: SocialLinks;
  experience: Experience[];
  education: Education[];
  createdAt: Date;
  updatedAt: Date;
}

export type LLMProvider = 'openai' | 'google' | 'groq' | 'deepseek';

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    provider?: LLMProvider;
    tokens?: number;
    duration?: number;
  };
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  sources: string[];
  metadata: {
    model: string;
    provider: LLMProvider;
    tokens: {
      prompt: number;
      completion: number;
    };
    durationMs: number;
  };
}

export interface ContentExport {
  aboutMe: {
    bio: string;
    skills: string[];
    experience: Experience[];
  };
  projects: Array<{
    title: string;
    slug: string;
    summary: string;
    description: string;
    techStack: string[];
    contexts: Array<{
      type: ProjectContextType;
      title: string;
      content: string;
    }>;
  }>;
  knowledgeDocs: Array<{
    id: string;
    filename: string;
    content: string;
  }>;
}

export interface CreateKnowledgeDocInput {
  filename: string;
  content: string;
}

export interface UpdateKnowledgeDocInput {
  filename?: string;
  content?: string;
}

export interface CreateChatLogInput {
  sessionId: string;
  messages: ChatMessage[];
}

export interface RetrievedChunk {
  content: string;
  source: string;
  score: number;
}

export interface IngestRequest {
  documentId?: string;
  type: 'knowledge' | 'project' | 'about' | 'all';
}

export interface IngestResponse {
  success: boolean;
  chunksIngested: number;
  source: string;
}
