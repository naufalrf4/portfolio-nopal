import type { AboutData, ProfileLink } from '../types';

const API_BASE =
  process.env.ADMIN_API_URL?.trim() ||
  import.meta.env.ADMIN_API_URL?.trim() ||
  'http://localhost:3001';
const API_TIMEOUT_MS = 5000;

interface ApiEnvelope<T> {
  data?: T;
  error?: {
    message?: string;
  };
}

interface LinksPageData {
  aboutData: AboutData;
  links: ProfileLink[];
}

class LinksApiError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'LinksApiError';
    this.cause = cause;
  }
}

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

    const json = (await response.json()) as T | ApiEnvelope<T>;

    if (typeof json === 'object' && json !== null && 'data' in json) {
      return (json.data ?? null) as T;
    }

    return json as T;
  } catch (error) {
    if (isAbortError(error)) {
      throw new LinksApiError(`Admin API request timed out for ${endpoint}`, error);
    }

    throw error;
  } finally {
    cleanup();
  }
}

export async function getProfileLinks(): Promise<ProfileLink[]> {
  const links = await apiFetch<ProfileLink[]>('/api/v1/public/links');
  return Array.isArray(links) ? links : [];
}

export async function getAboutData(): Promise<AboutData> {
  let aboutData: AboutData | null = null;

  try {
    aboutData = await apiFetch<AboutData>('/api/v1/public/about');
  } catch (error) {
    const isNotFoundError =
      error instanceof Error && /404\s+Not Found|About me not found/i.test(error.message);

    if (!isNotFoundError) {
      throw error;
    }
  }

  return {
    fullName: aboutData?.fullName || 'NaufalRF',
    tagline: aboutData?.tagline || 'Full-Stack Engineer',
    shortBio: aboutData?.shortBio || null,
    bio:
      aboutData?.shortBio ||
      aboutData?.bio ||
      'Building scalable web applications. Open to collaboration and opportunities.',
    avatarUrl: aboutData?.avatarUrl || null,
    socialLinks: Array.isArray(aboutData?.socialLinks)
      ? aboutData.socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
          label: link.platform,
          icon: link.platform,
        }))
      : [],
  };
}

export async function getLinksPageData(): Promise<LinksPageData> {
  const [aboutData, links] = await Promise.all([getAboutData(), getProfileLinks()]);

  return {
    aboutData,
    links: links.sort((firstLink, secondLink) => firstLink.order - secondLink.order),
  };
}
