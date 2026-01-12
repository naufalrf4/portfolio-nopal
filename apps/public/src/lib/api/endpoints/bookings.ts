import { fetchApi } from '../client';
import type { BookingAvailableResponse, BookingData } from '../types';

export const bookingsApi = {
  getAvailable: () =>
    fetchApi<BookingAvailableResponse>('/api/v1/public/bookings/available', {
      retries: 2,
    }),
  create: (data: BookingData) =>
    fetchApi<{ success: boolean }>('/api/v1/public/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
      retries: 0,
    }),
};
