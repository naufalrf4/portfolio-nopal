import type { ChatRequest, ChatResponse } from './types';

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

interface SendChatMessageOptions {
  request: ChatRequest;
  ragServiceUrl: string;
}

export async function sendChatMessage({
  request,
  ragServiceUrl,
}: SendChatMessageOptions): Promise<ChatResponse> {
  try {
    // Ensure no trailing slash
    const baseUrl = ragServiceUrl.endsWith('/') ? ragServiceUrl.slice(0, -1) : ragServiceUrl;

    const response = await fetch(`${baseUrl}/chat`, {
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
