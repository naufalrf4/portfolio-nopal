const JAKARTA_TIME_ZONE = 'Asia/Jakarta';
const JAKARTA_DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: JAKARTA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const JAKARTA_CLOCK_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: JAKARTA_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function getValidDate(date: string | Date | null | undefined): Date | null {
  if (!date) {
    return null;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function toJakartaDate(date: string | Date | null | undefined): Date | null {
  const source = getValidDate(date);
  if (!source) {
    return null;
  }

  const parts = JAKARTA_DATE_TIME_FORMATTER.formatToParts(source);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second)
    )
  );
}

function formatJakartaKey(date: string | Date | null | undefined): string | null {
  const zonedDate = toJakartaDate(date);
  if (!zonedDate) {
    return null;
  }

  return zonedDate.toISOString().slice(0, 10);
}

export function formatDate(
  date: string | Date | null | undefined,
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const dateObj = getValidDate(date);
  if (!dateObj) {
    return 'N/A';
  }

  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: JAKARTA_TIME_ZONE,
    });
  }

  if (format === 'full') {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: JAKARTA_TIME_ZONE,
    });
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: JAKARTA_TIME_ZONE,
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  const dateObj = getValidDate(date);
  if (!dateObj) {
    return 'N/A';
  }

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: JAKARTA_TIME_ZONE,
  });
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  const dateObj = toJakartaDate(date);
  if (!dateObj) {
    return 'N/A';
  }

  const now = toJakartaDate(new Date());
  if (!now) {
    return 'N/A';
  }
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffInDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function isToday(date: string | Date | null | undefined): boolean {
  const todayKey = formatJakartaKey(new Date());
  const dateKey = formatJakartaKey(date);
  return Boolean(todayKey && dateKey && todayKey === dateKey);
}

export function isYesterday(date: string | Date | null | undefined): boolean {
  const yesterday = toJakartaDate(new Date());
  const dateKey = formatJakartaKey(date);
  if (!yesterday || !dateKey) {
    return false;
  }

  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return formatJakartaKey(yesterday) === dateKey;
}

export function formatJakartaTime(
  date: string | Date | null | undefined = new Date(),
  showSeconds = true
): string {
  const dateObj = getValidDate(date) ?? new Date();
  const parts = JAKARTA_CLOCK_FORMATTER.formatToParts(dateObj);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  const time = showSeconds
    ? `${values.hour}:${values.minute}:${values.second}`
    : `${values.hour}:${values.minute}`;

  return `${time} WIB`;
}

export function isFuture(date: string | Date | null | undefined): boolean {
  const targetDate = toJakartaDate(date);
  const now = toJakartaDate(new Date());
  return Boolean(targetDate && now && targetDate.getTime() > now.getTime());
}
