import { fetchApi } from '../client';
import type { ProfileLink } from '../types';

export const linksApi = {
  getAll: () =>
    fetchApi<ProfileLink[]>('/api/v1/public/links', {
      retries: 2,
    }),
};
