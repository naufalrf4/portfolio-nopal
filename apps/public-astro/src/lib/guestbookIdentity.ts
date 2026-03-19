export interface StoredGuestbookUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  token: string;
}

export interface LiveCursorIdentity {
  id: string;
  name: string;
  color: string;
  isGuest: boolean;
}

export const GUESTBOOK_STORAGE_KEY = 'public-guestbook-user';
const LIVE_CURSOR_GUEST_KEY = 'public-live-cursor-guest';

function hashString(value: string): number {
  return Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function getColorFromSeed(seed: string): string {
  const palette = ['#3B82F6', '#60A5FA', '#38BDF8', '#22C55E', '#8B5CF6', '#0EA5E9'];
  return palette[hashString(seed) % palette.length] || '#3B82F6';
}

function buildGuestAlias(): string {
  return `Guest_${Math.random().toString(36).slice(2, 6)}`;
}

function getStoredValue<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function getStoredGuestbookUser(): StoredGuestbookUser | null {
  const stored = getStoredValue<StoredGuestbookUser>(GUESTBOOK_STORAGE_KEY);

  if (
    !stored ||
    typeof stored.id !== 'string' ||
    typeof stored.email !== 'string' ||
    typeof stored.token !== 'string'
  ) {
    clearStoredGuestbookUser();
    return null;
  }

  return {
    ...stored,
    name: typeof stored.name === 'string' ? stored.name : null,
    image: typeof stored.image === 'string' ? stored.image : null,
  };
}

export function setStoredGuestbookUser(user: StoredGuestbookUser): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredGuestbookUser(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(GUESTBOOK_STORAGE_KEY);
}

export function resolveLiveCursorIdentity(): LiveCursorIdentity {
  const guestbookUser = getStoredGuestbookUser();
  if (guestbookUser?.email) {
    const displayName = guestbookUser.name?.trim() || guestbookUser.email.split('@')[0] || 'Guest';
    return {
      id: `auth:${guestbookUser.email}`,
      name: displayName,
      color: getColorFromSeed(guestbookUser.email),
      isGuest: false,
    };
  }

  const storedGuest = getStoredValue<{ id: string; name: string; color: string }>(
    LIVE_CURSOR_GUEST_KEY
  );
  if (storedGuest?.id && storedGuest?.name && storedGuest?.color) {
    return {
      id: storedGuest.id,
      name: storedGuest.name,
      color: storedGuest.color,
      isGuest: true,
    };
  }

  const alias = buildGuestAlias();
  const guestIdentity = {
    id: `guest:${alias.toLowerCase()}`,
    name: alias,
    color: getColorFromSeed(alias),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LIVE_CURSOR_GUEST_KEY, JSON.stringify(guestIdentity));
  }

  return {
    ...guestIdentity,
    isGuest: true,
  };
}
