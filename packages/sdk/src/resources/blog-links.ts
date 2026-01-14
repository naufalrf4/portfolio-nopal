import type { HttpClient, RequestOptions } from '../client';
import type { BlogLink, BlogLinksQuery, BlogLinksResponse } from '../types';

export class BlogLinksClient {
  constructor(private client: HttpClient) {}

  async getAll(query?: BlogLinksQuery, options?: RequestOptions): Promise<BlogLinksResponse> {
    const params: Record<string, string> = {};

    if (query?.source) params.source = query.source;

    const response = await this.client.get<{ blogs: BlogLink[]; meta: { total: number } }>(
      '/api/v1/public/blogs',
      { ...options, params }
    );

    return {
      success: true,
      data: response.blogs,
    };
  }
}
