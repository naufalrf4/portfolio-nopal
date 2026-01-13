import type { HttpClient } from '../client';
import type {
  KnowledgeDoc,
  KnowledgeDocsQuery,
  KnowledgeDocsResponse,
  KnowledgeDocResponse,
  CreateKnowledgeDocInput,
  UpdateKnowledgeDocInput,
} from '../types';

export class KnowledgeClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: KnowledgeDocsQuery): Promise<KnowledgeDocsResponse> {
    const params: Record<string, string> = {};

    if (query?.page) params.page = query.page.toString();
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.indexed !== undefined) params.indexed = query.indexed.toString();

    const result = await this.client.get<{
      docs: KnowledgeDoc[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/api/v1/admin/knowledge', params);

    return {
      success: true,
      data: result,
    };
  }

  async getById(id: string): Promise<KnowledgeDocResponse> {
    const doc = await this.client.get<KnowledgeDoc>(`/api/v1/admin/knowledge/${id}`);
    return {
      success: true,
      data: doc,
    };
  }

  async create(input: CreateKnowledgeDocInput): Promise<KnowledgeDocResponse> {
    const doc = await this.client.post<KnowledgeDoc>('/api/v1/admin/knowledge', input);
    return {
      success: true,
      data: doc,
    };
  }

  async update(id: string, input: UpdateKnowledgeDocInput): Promise<KnowledgeDocResponse> {
    const doc = await this.client.put<KnowledgeDoc>(`/api/v1/admin/knowledge/${id}`, input);
    return {
      success: true,
      data: doc,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.client.delete(`/api/v1/admin/knowledge/${id}`);
    return { success: true };
  }

  async triggerIngest(id: string): Promise<{ success: boolean; chunksIngested: number }> {
    const result = await this.client.post<{ chunksIngested: number }>(
      `/api/v1/admin/knowledge/${id}/ingest`
    );
    return {
      success: true,
      chunksIngested: result.chunksIngested,
    };
  }
}
