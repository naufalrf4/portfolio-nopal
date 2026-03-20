import type {
  ProjectsResponse,
  Project,
  BlogsResponse,
  AboutData,
  AchievementsResponse,
  GuestbookResponse,
  ContactSubmissionInput,
  BookingAvailability,
  BookingSubmissionInput,
} from '../types';

class ApiClientError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.cause = cause;
  }
}

const API_BASE =
  process.env.ADMIN_API_URL?.trim() ||
  import.meta.env.ADMIN_API_URL?.trim() ||
  'http://localhost:3001';
const API_TIMEOUT_MS = 5000;

const FALLBACK_ABOUT: AboutData = {
  fullName: 'Naufal Rizqullah Firdaus',
  tagline: null,
  roles: [],
  shortBio: null,
  bio: '',
  email: '',
  location: null,
  avatarUrl: null,
  resumeUrl: null,
  availabilityStatus: null,
  skills: [],
  experience: [],
  socialLinks: [],
};

function createAbortSignal(timeoutMs: number): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId),
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const { signal, cleanup } = createAbortSignal(API_TIMEOUT_MS);

  try {
    const response = await fetch(url, { headers, signal });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (
      json &&
      typeof json === 'object' &&
      'success' in json &&
      json.success === true &&
      'data' in json
    ) {
      return json.data as T;
    }

    return json as T;
  } catch (error) {
    if (isAbortError(error)) {
      throw new ApiClientError(`Admin API request timed out for ${endpoint}`, error);
    }

    if (error instanceof SyntaxError) {
      throw new ApiClientError(`Failed to parse JSON response from ${endpoint}`, error);
    }
    throw error;
  } finally {
    cleanup();
  }
}

type FetchRequestInit = Parameters<typeof fetch>[1];

async function localApiFetch<T>(endpoint: string, init?: FetchRequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const json = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: T;
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    throw new Error(
      json?.error?.message || `Request failed: ${response.status} ${response.statusText}`
    );
  }

  if (
    json &&
    typeof json === 'object' &&
    'success' in json &&
    json.success === true &&
    'data' in json
  ) {
    return json.data as T;
  }

  return json as T;
}

async function requestProjects(params?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<ProjectsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.featured !== undefined) {
    searchParams.set('featured', params.featured.toString());
  }
  if (params?.category) {
    searchParams.set('category', params.category);
  }
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }

  const query = searchParams.toString();
  const endpoint = query ? `/api/v1/public/projects?${query}` : '/api/v1/public/projects';

  return apiFetch<ProjectsResponse>(endpoint);
}

export async function getProjects(params?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<ProjectsResponse> {
  try {
    return await requestProjects(params);
  } catch {
    return {
      projects: [],
      meta: {
        total: 0,
        featured: 0,
      },
    };
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/api/v1/public/projects/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getBlogs(limit?: number): Promise<BlogsResponse> {
  const query = limit ? `?limit=${limit}` : '';

  try {
    return await apiFetch<BlogsResponse>(`/api/v1/public/blogs${query}`);
  } catch {
    return {
      blogs: [],
      meta: { total: 0 },
    };
  }
}

export async function getAbout(): Promise<AboutData> {
  try {
    return await apiFetch<AboutData>('/api/v1/public/about');
  } catch {
    return FALLBACK_ABOUT;
  }
}

export async function getAchievements(limit?: number): Promise<AchievementsResponse> {
  const query = limit ? `?limit=${limit}` : '';

  try {
    return await apiFetch<AchievementsResponse>(`/api/v1/public/achievements${query}`);
  } catch {
    return {
      achievements: [],
      meta: { total: 0 },
    };
  }
}

export async function getGuestbookEntries(): Promise<GuestbookResponse> {
  try {
    return await apiFetch<GuestbookResponse>('/api/v1/public/guestbook');
  } catch {
    return { entries: [] };
  }
}

export async function submitContactForm(input: ContactSubmissionInput) {
  return localApiFetch<{ id: string; createdAt: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getBookingAvailability(days = 14) {
  const searchParams = new URLSearchParams({ days: String(days) });
  return localApiFetch<BookingAvailability>(`/api/bookings/available?${searchParams.toString()}`);
}

export async function submitBooking(input: BookingSubmissionInput) {
  return localApiFetch<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    notes: string | null;
    status: string;
    date: string;
    time: string;
    duration: number;
    createdAt: string;
  }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
