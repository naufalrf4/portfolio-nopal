export type LLMProvider = 'openai' | 'google' | 'groq' | 'deepseek';

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type ProjectContextType =
  | 'CONTEXT'
  | 'ROLE'
  | 'DECISIONS'
  | 'TRADEOFFS'
  | 'RESULT'
  | 'ARCHITECTURE'
  | 'OPERATIONS'
  | 'METRICS';

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

export interface KnowledgeDoc {
  id: string;
  filename: string;
  content: string;
  indexed: boolean;
  createdAt: Date;
  updatedAt: Date;
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
