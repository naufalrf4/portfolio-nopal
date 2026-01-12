import { fetchApi } from '../client';
import type { GuestbookEntry } from '../types';

export const guestbookApi = {
  getAll: () => fetchApi<{ entries: GuestbookEntry[] }>('/api/v1/public/guestbook'),
  create: (message: string, userEmail: string) =>
    fetchApi<GuestbookEntry>('/api/v1/public/guestbook', {
      method: 'POST',
      body: JSON.stringify({ message, userEmail }),
    }),
};
