import type { ApiResponse } from '@naufalrf/types';
import { ApiError, NotFoundError, ValidationError, ServerError, NetworkError } from './errors';

export interface ClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(config: ClientConfig = {}) {
    this.baseURL =
      config.baseURL ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      'http://localhost:3001';
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private buildURL(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorData: { code?: string; message?: string; details?: Record<string, string[]> } = {};

      if (isJson) {
        const apiResponse = (await response.json()) as ApiResponse<unknown>;
        errorData = apiResponse.error || {};
      }

      const message = errorData.message || `HTTP ${response.status}: ${response.statusText}`;

      switch (response.status) {
        case 404:
          throw new NotFoundError(message);
        case 400:
          throw new ValidationError(message, errorData.details);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ServerError(message);
        default:
          throw new ApiError(message, response.status, errorData.code);
      }
    }

    if (isJson) {
      const data = (await response.json()) as ApiResponse<T>;
      if (data.success && data.data !== undefined) {
        return data.data;
      }
      throw new ServerError('Invalid API response format');
    }

    return {} as T;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    try {
      const url = this.buildURL(path, params);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError(error instanceof Error ? error.message : 'Network request failed');
    }
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    try {
      const url = this.buildURL(path);
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError(error instanceof Error ? error.message : 'Network request failed');
    }
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    try {
      const url = this.buildURL(path);
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError(error instanceof Error ? error.message : 'Network request failed');
    }
  }

  async delete<T>(path: string): Promise<T> {
    try {
      const url = this.buildURL(path);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError(error instanceof Error ? error.message : 'Network request failed');
    }
  }
}
