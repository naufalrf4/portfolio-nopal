import { fetchApi } from '../client';
import type { ContactFormData } from '../types';

export const contactApi = {
  submit: (data: ContactFormData) =>
    fetchApi<{ success: boolean }>('/api/v1/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      retries: 0,
    }),
};
