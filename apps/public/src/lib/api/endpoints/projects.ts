import { fetchApi, buildQueryString } from '../client';
import type { Project, ProjectsResponse } from '../types';

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
    return fetchApi<ProjectsResponse>(`/api/v1/public/projects${qs}`, {
      retries: 2,
      revalidate: 3600,
    });
  },
  getBySlug: (slug: string) =>
    fetchApi<Project>(`/api/v1/public/projects/${slug}`, {
      retries: 2,
      revalidate: 3600,
    }),
};
