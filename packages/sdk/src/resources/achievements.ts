import type { HttpClient, RequestOptions } from '../client';
import type {
  Achievement,
  AchievementsQuery,
  AchievementsResponse,
  AchievementResponse,
  CreateAchievementInput,
  UpdateAchievementInput,
} from '../types';

export class AchievementsClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: AchievementsQuery, options?: RequestOptions): Promise<AchievementsResponse> {
    const params: Record<string, string> = {};

    if (query?.page) params.page = query.page.toString();
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.visible !== undefined) params.visible = query.visible.toString();

    const result = await this.client.get<{
      achievements: Achievement[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/api/v1/public/achievements', { ...options, params });

    return {
      success: true,
      data: result,
    };
  }

  async getById(id: string, options?: RequestOptions): Promise<AchievementResponse> {
    const achievement = await this.client.get<Achievement>(
      `/api/v1/public/achievements/${id}`,
      options
    );
    return {
      success: true,
      data: achievement,
    };
  }

  async create(input: CreateAchievementInput): Promise<AchievementResponse> {
    const achievement = await this.client.post<Achievement>('/api/v1/admin/achievements', input);
    return {
      success: true,
      data: achievement,
    };
  }

  async update(id: string, input: UpdateAchievementInput): Promise<AchievementResponse> {
    const achievement = await this.client.put<Achievement>(
      `/api/v1/admin/achievements/${id}`,
      input
    );
    return {
      success: true,
      data: achievement,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.client.delete(`/api/v1/admin/achievements/${id}`);
    return { success: true };
  }
}
