import { fetchApi } from '../client';
import type { AboutData } from '../types';

export const aboutApi = {
  get: () => fetchApi<AboutData>('/api/v1/public/about'),
};
