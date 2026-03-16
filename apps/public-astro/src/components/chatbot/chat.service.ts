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

const CHAT_REQUEST_TIMEOUT_MS = 10000;

function createAbortSignal(timeoutMs: number): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId),
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
}

export async function sendChatMessage({
  request,
  ragServiceUrl,
}: SendChatMessageOptions): Promise<ChatResponse> {
  try {
    const baseUrl = ragServiceUrl.endsWith('/') ? ragServiceUrl.slice(0, -1) : ragServiceUrl;
    const { signal, cleanup } = createAbortSignal(CHAT_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal,
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
    } finally {
      cleanup();
    }
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }

    if (isAbortError(error)) {
      throw new ChatServiceError(
        'AI sedang lambat merespons. Silakan coba lagi dalam beberapa saat.',
        504
      );
    }

    throw new ChatServiceError(
      'Maaf, saat ini AI tidak tersedia. Silakan coba lagi beberapa saat atau hubungi saya melalui formulir kontak.'
    );
  }
}
