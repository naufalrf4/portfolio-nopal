export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  citations?: Citation[];
  suggestedActions?: SuggestedAction[];
  metadata?: ChatMetadata;
}

export interface Citation {
  source: string;
  title?: string;
  route?: string;
  routeLabel?: string;
  sourceType?: string;
  sourceRef?: string;
  section?: string;
}

export interface SuggestedAction {
  type: string;
  target: string;
  label: string;
}

export interface ChatMetadata {
  workflow: string;
  intent: string;
  queryLanguage: string;
  answerLanguage: string;
  retrievalConfidence: number;
  abstained: boolean;
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  sources: string[];
  citations?: Citation[];
  suggestedActions?: SuggestedAction[];
  metadata?: ChatMetadata;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}
