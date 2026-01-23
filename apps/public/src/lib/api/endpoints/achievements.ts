import { fetchApi } from '../client';
import type { AchievementsResponse } from '../types';

export const achievementsApi = {
  async getAll(): Promise<AchievementsResponse> {
    return fetchApi<AchievementsResponse>('/api/v1/public/achievements');
  },
};
