export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  sources: string[];
  metadata?: Record<string, unknown>;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}
