import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) {
    return 'just now';
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diff / YEAR);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}
