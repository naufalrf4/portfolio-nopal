import type { HttpClient } from '../client';
import type { BlogLink, BlogLinksQuery, BlogLinksResponse } from '../types';

export class BlogLinksClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: BlogLinksQuery): Promise<BlogLinksResponse> {
    const params: Record<string, string> = {};

    if (query?.source) params.source = query.source;

    const blogs = await this.client.get<BlogLink[]>('/api/v1/public/blogs', params);

    return {
      success: true,
      data: blogs,
    };
  }
}
