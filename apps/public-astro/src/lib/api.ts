import type {
  ProjectsResponse,
  Project,
  BlogsResponse,
  AboutData,
  GuestbookResponse,
} from '../types';

const API_BASE = import.meta.env.ADMIN_API_URL || 'http://localhost:3001';
const SERVICE_TOKEN = import.meta.env.SERVICE_TOKEN || '';

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (SERVICE_TOKEN) {
    headers['X-Service-Token'] = SERVICE_TOKEN;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse JSON response from ${endpoint}`);
    }
    throw error;
  }
}

export async function getProjects(params?: {
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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { projects } = await getProjects();
    const project = projects.find((p) => p.slug === slug);
    return project || null;
  } catch {
    return null;
  }
}

export async function getBlogs(limit?: number): Promise<BlogsResponse> {
  const query = limit ? `?limit=${limit}` : '';
  return apiFetch<BlogsResponse>(`/api/v1/public/blogs${query}`);
}

export async function getAbout(): Promise<AboutData> {
  return apiFetch<AboutData>('/api/v1/public/about');
}

export async function getGuestbookEntries(): Promise<GuestbookResponse> {
  return apiFetch<GuestbookResponse>('/api/v1/public/guestbook');
}
