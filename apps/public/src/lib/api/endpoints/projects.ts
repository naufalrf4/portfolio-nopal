import { fetchApi, buildQueryString } from '../client';
import type { Project } from '../types';

interface GetProjectsParams {
  featured?: boolean;
  limit?: number;
  category?: string;
}

export const projectsApi = {
  getAll: (params?: GetProjectsParams) => {
    const qs = buildQueryString({
      featured: params?.featured,
      limit: params?.limit,
      category: params?.category,
    });
    return fetchApi<{ projects: Project[] }>(`/api/v1/public/projects${qs}`);
  },
  getBySlug: (slug: string) => fetchApi<{ project: Project }>(`/api/v1/public/projects/${slug}`),
};
