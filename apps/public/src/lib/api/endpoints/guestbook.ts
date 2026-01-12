import { fetchApi } from '../client';
import type { GuestbookResponse, GuestbookSubmitData } from '../types';

export const guestbookApi = {
  getAll: () =>
    fetchApi<GuestbookResponse>('/api/v1/public/guestbook', {
      retries: 2,
    }),
  create: (data: GuestbookSubmitData) =>
    fetchApi<{ success: boolean }>('/api/v1/public/guestbook', {
      method: 'POST',
      body: JSON.stringify(data),
      retries: 0,
    }),
};
