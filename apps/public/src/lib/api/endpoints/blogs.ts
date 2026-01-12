import { fetchApi, buildQueryString } from '../client';
import type { BlogLink } from '../types';

export const blogsApi = {
  getAll: (limit?: number) => {
    const qs = buildQueryString({ limit });
    return fetchApi<{ blogs: BlogLink[] }>(`/api/v1/public/blogs${qs}`);
  },
};
