import { fetchApi, buildQueryString } from '../client';
import type { BlogsResponse } from '../types';

export const blogsApi = {
  getAll: (limit?: number) => {
    const qs = buildQueryString({ limit });
    return fetchApi<BlogsResponse>(`/api/v1/public/blogs${qs}`, {
      retries: 2,
    });
  },
};
