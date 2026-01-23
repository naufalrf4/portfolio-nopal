import type { ChatRequest, ChatResponse } from '../types';

const RAG_URL = process.env.NEXT_PUBLIC_RAG_SERVICE_URL || 'http://localhost:3004';

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(`${RAG_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ChatServiceError(
        errorData?.error?.message || 'Failed to get response from AI',
        response.status
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new ChatServiceError(data.error?.message || 'Failed to process chat message');
    }

    return {
      sessionId: data.data.sessionId,
      message: data.data.message,
      sources: data.data.sources || [],
      metadata: data.data.metadata,
    };
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    throw new ChatServiceError(
      'Maaf, saat ini AI tidak tersedia. Silakan coba lagi beberapa saat atau hubungi saya melalui formulir kontak.'
    );
  }
}
