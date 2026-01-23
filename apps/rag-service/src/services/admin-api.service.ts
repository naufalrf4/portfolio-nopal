import { env } from '../config/env';
import { logger } from '../utils/logger';
import type { KnowledgeDoc, ChatMessage, ContentExport } from '@naufalrf/types';

interface FetchOptions {
  method?: string;
  body?: unknown;
}

class AdminApiService {
  private baseUrl = env.ADMIN_API_URL;
  private headers = {
    'Content-Type': 'application/json',
    'X-Service-Token': env.ADMIN_SERVICE_TOKEN,
  };

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: this.headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Admin API error: ${response.status} ${response.statusText}`);
      }

      const json = (await response.json()) as { data?: T } | T;
      return (json as { data?: T }).data ?? (json as T);
    } catch (error) {
      logger.error({ error, endpoint }, 'Admin API request failed');
      throw error;
    }
  }

  async getContentForIngestion(): Promise<ContentExport> {
    return this.fetch<ContentExport>('/api/v1/internal/content');
  }

  async getKnowledgeDocs(): Promise<KnowledgeDoc[]> {
    return this.fetch<KnowledgeDoc[]>('/api/v1/internal/knowledge');
  }

  async getKnowledgeDocById(id: string): Promise<KnowledgeDoc> {
    return this.fetch<KnowledgeDoc>(`/api/v1/internal/knowledge/${id}`);
  }

  async markKnowledgeDocIndexed(id: string): Promise<void> {
    await this.fetch(`/api/v1/internal/knowledge/${id}/indexed`, { method: 'PATCH' });
  }

  async saveChatLog(sessionId: string, messages: ChatMessage[]): Promise<void> {
    try {
      await this.fetch('/api/v1/internal/chat-logs', {
        method: 'POST',
        body: { sessionId, messages },
      });
      logger.debug({ sessionId, messageCount: messages.length }, 'Chat log saved');
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to save chat log');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${this.baseUrl}/api/health`);
      return true;
    } catch {
      return false;
    }
  }
}

export const adminApiService = new AdminApiService();
