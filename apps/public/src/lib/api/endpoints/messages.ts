import { fetchApi } from '../client';
import type { AnonymousMessageData } from '../types';

export const messagesApi = {
  create: (data: AnonymousMessageData) =>
    fetchApi<{ success: boolean }>('/api/v1/public/messages', {
      method: 'POST',
      body: JSON.stringify(data),
      retries: 0,
    }),
};
