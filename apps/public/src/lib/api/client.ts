const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export interface AboutData {
  fullName: string;
  tagline: string;
  roles: string[];
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl: string;
  resumeUrl?: string;
  skills: { name: string; level: number; category: string }[];
  experience: {
    type: 'work' | 'education' | 'organization';
    title: string;
    company: string;
    period: string;
    description: string;
    location?: string;
  }[];
  socialLinks: { platform: string; url: string }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  contexts?: { id: string; type: string; title: string; content: string; order: number }[];
  images?: { id: string; url: string; caption?: string; alt?: string; order: number }[];
}

export interface BlogLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt?: string;
}

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: string;
  user?: { name: string; image?: string };
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface BookingSlot {
  date: string;
  time: string;
  duration: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface BookingData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  date: string;
  time: string;
}

export const api = {
  about: {
    get: () => fetchApi<AboutData>('/api/v1/public/about'),
  },
  projects: {
    getAll: (params?: { featured?: boolean; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.featured) query.set('featured', 'true');
      if (params?.limit) query.set('limit', String(params.limit));
      const qs = query.toString();
      return fetchApi<{ projects: Project[] }>(`/api/v1/public/projects${qs ? `?${qs}` : ''}`);
    },
    getBySlug: (slug: string) => fetchApi<{ project: Project }>(`/api/v1/public/projects/${slug}`),
  },
  blogs: {
    getAll: (limit?: number) =>
      fetchApi<{ blogs: BlogLink[] }>(`/api/v1/public/blogs${limit ? `?limit=${limit}` : ''}`),
  },
  guestbook: {
    getAll: () => fetchApi<{ entries: GuestbookEntry[] }>('/api/v1/public/guestbook'),
    create: (message: string) =>
      fetchApi<GuestbookEntry>('/api/v1/public/guestbook', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  },
  links: {
    getAll: () => fetchApi<ProfileLink[]>('/api/v1/public/links'),
  },
  contact: {
    submit: (data: ContactFormData) =>
      fetchApi<{ success: boolean }>('/api/v1/public/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  bookings: {
    getAvailable: () =>
      fetchApi<{ slots: Record<string, BookingSlot[]> }>('/api/v1/public/bookings/available'),
    create: (data: BookingData) =>
      fetchApi<{ success: boolean }>('/api/v1/public/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
