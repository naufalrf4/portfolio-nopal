import type { LogMinLevel, OutboxStatus } from '../types/notifications.types';

export const NOTIFICATION_EVENT_TYPES = [
  { value: 'contact.created', label: 'Contact Created', description: 'New contact submission received' },
  { value: 'booking.created', label: 'Booking Created', description: 'New meeting booking created' },
  { value: 'booking.status_changed', label: 'Booking Status Changed', description: 'Booking approved, rejected, or rescheduled' },
  { value: 'message.created', label: 'NGL Message Created', description: 'New anonymous message submitted' },
  { value: 'guestbook.created', label: 'Guestbook Created', description: 'New guestbook entry posted' },
  { value: 'log.error', label: 'Application Error Log', description: 'Centralized error logs matching threshold' },
] as const;

export const LOG_MIN_LEVELS: readonly { readonly value: LogMinLevel; readonly label: string }[] = [
  { value: 'debug', label: 'Debug and above' },
  { value: 'info', label: 'Info and above' },
  { value: 'warn', label: 'Warn and above' },
  { value: 'error', label: 'Error only' },
] as const;

export const OUTBOX_STATUS_OPTIONS: readonly { readonly value: string; readonly label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
  { value: 'dead', label: 'Dead' },
] as const;

export const OUTBOX_LIMIT_OPTIONS = [25, 50, 100, 200] as const;

export const STATUS_BADGE_VARIANTS: Record<OutboxStatus, 'default' | 'primary' | 'success' | 'warning' | 'destructive'> = {
  pending: 'warning',
  sent: 'success',
  failed: 'destructive',
  dead: 'destructive',
};

export function getEventTypeLabel(eventType: string): string {
  const match = NOTIFICATION_EVENT_TYPES.find((item) => item.value === eventType);
  return match?.label ?? eventType;
}
