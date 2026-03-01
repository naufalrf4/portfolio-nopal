import type { ProfileLink } from '../types';

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

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json as T;
}

export function getProfileLinks(): Promise<ProfileLink[]> {
  return apiFetch<ProfileLink[]>('/api/v1/public/links');
}
