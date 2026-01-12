import { fetchApi } from '../client';
import type { BookingSlot, BookingData } from '../types';

export const bookingsApi = {
  getAvailable: () =>
    fetchApi<{ slots: Record<string, BookingSlot[]> }>('/api/v1/public/bookings/available'),
  create: (data: BookingData) =>
    fetchApi<{ success: boolean }>('/api/v1/public/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
