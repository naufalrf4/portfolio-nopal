import type { HttpClient } from '../client';
import type { ProfileLink, ProfileLinksResponse } from '../types';

export class ProfileLinksClient {
  constructor(private client: HttpClient) {}

  async getAll(): Promise<ProfileLinksResponse> {
    const links = await this.client.get<ProfileLink[]>('/api/v1/public/links');

    return {
      success: true,
      data: links,
    };
  }
}
