import type { HttpClient } from '../client';
import type { Project, ProjectsQuery, ProjectsResponse, ProjectResponse } from '../types';

export class ProjectsClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: ProjectsQuery): Promise<ProjectsResponse> {
    const params: Record<string, string> = {};

    if (query?.page) params.page = query.page.toString();
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.category) params.category = query.category;
    if (query?.featured !== undefined) params.featured = query.featured.toString();

    const result = await this.client.get<{
      projects: Project[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/api/v1/public/projects', params);

    return {
      success: true,
      data: result,
    };
  }

  async getBySlug(slug: string): Promise<ProjectResponse> {
    const project = await this.client.get<Project>(`/api/v1/public/projects/${slug}`);
    return {
      success: true,
      data: project,
    };
  }
}
