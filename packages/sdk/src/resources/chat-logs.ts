import type { HttpClient } from '../client';
import type { ChatLog, ChatLogsQuery, ChatLogsResponse, ChatLogResponse } from '../types';

export class ChatLogsClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: ChatLogsQuery): Promise<ChatLogsResponse> {
    const params: Record<string, string> = {};

    if (query?.page) params.page = query.page.toString();
    if (query?.limit) params.limit = query.limit.toString();

    const result = await this.client.get<{
      logs: ChatLog[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/api/v1/admin/chat-logs', params);

    return {
      success: true,
      data: result,
    };
  }

  async getById(id: string): Promise<ChatLogResponse> {
    const log = await this.client.get<ChatLog>(`/api/v1/admin/chat-logs/${id}`);
    return {
      success: true,
      data: log,
    };
  }

  async getBySessionId(sessionId: string): Promise<ChatLogResponse> {
    const log = await this.client.get<ChatLog>(`/api/v1/admin/chat-logs/session/${sessionId}`);
    return {
      success: true,
      data: log,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.client.delete(`/api/v1/admin/chat-logs/${id}`);
    return { success: true };
  }
}
