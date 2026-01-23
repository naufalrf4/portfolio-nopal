const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const IS_DEV = process.env.NODE_ENV === 'development';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends globalThis.RequestInit {
  retries?: number;
  retryDelay?: number;
  revalidate?: number | false;
}

function logRequest(endpoint: string, options?: FetchOptions): void {
  if (IS_DEV) {
    console.log(`[API Request] ${options?.method || 'GET'} ${endpoint}`, {
      headers: options?.headers,
      body: options?.body,
    });
  }
}

function logResponse(endpoint: string, status: number, data: unknown): void {
  if (IS_DEV) {
    console.log(`[API Response] ${endpoint} - ${status}`, data);
  }
}

function logError(endpoint: string, error: unknown): void {
  if (IS_DEV) {
    console.error(`[API Error] ${endpoint}`, error);
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) return false;
  return status >= 500 || status === 429;
}

function getUserFriendlyMessage(status: number, errorMessage?: string): string {
  if (errorMessage) return errorMessage;

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please sign in to continue.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `An error occurred (${status}). Please try again.`;
  }
}

export async function fetchApi<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const { retries = 1, retryDelay = 1000, revalidate, ...fetchOptions } = options || {};
  let lastError: ApiError | null = null;

  logRequest(endpoint, fetchOptions);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const nextFetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions?.headers,
        },
      };

      if (revalidate !== undefined) {
        nextFetchOptions.next = { revalidate };
      }

      const res = await fetch(`${API_BASE}${endpoint}`, nextFetchOptions);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const userMessage = getUserFriendlyMessage(res.status, errorData?.error?.message);

        lastError = new ApiError(
          res.status,
          userMessage,
          errorData?.error?.code,
          errorData?.error?.details
        );

        logError(endpoint, lastError);

        if (shouldRetry(res.status, attempt, retries)) {
          await delay(retryDelay * (attempt + 1));
          continue;
        }

        throw lastError;
      }

      const json = await res.json();
      const data = json.data ?? json;

      logResponse(endpoint, res.status, data);

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      lastError = new ApiError(
        0,
        'Network error. Please check your connection and try again.',
        'NETWORK_ERROR'
      );

      logError(endpoint, lastError);

      if (attempt < retries) {
        await delay(retryDelay * (attempt + 1));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new ApiError(0, 'Request failed', 'UNKNOWN_ERROR');
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}
