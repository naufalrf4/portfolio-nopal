'use client';

import Link from 'next/link';
import { BellRing, CheckCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils/date';
import { useNotificationBell } from '@/features/notifications';
import { getEventTypeLabel, STATUS_BADGE_VARIANTS } from '@/features/notifications';

export function NotificationBell({ className }: { className?: string }) {
  const { items, unreadCount, loading, markAsRead, markAllAsRead } = useNotificationBell();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className={cn(
            'icon-btn relative inline-flex h-10 w-10 items-center justify-center text-foreground/70 transition-colors hover:text-foreground',
            className
          )}
        >
          <BellRing size={18} />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center',
                'rounded-full px-1 text-[10px] font-bold text-accent-foreground',
                'bg-accent',
                'surface-raised',
                'animate-pulse'
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden border border-line-strong surface-raised-lg">
        <div className="flex items-center justify-between p-3 border-b border-line-strong">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 text-[11px] text-[var(--teal)] hover:bg-[var(--teal)]/10"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-xs text-[var(--text-secondary)]">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-secondary)]">
              No notifications yet
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => markAsRead(item.id)}
                className={cn(
                  'relative flex w-full flex-col gap-1 p-3 text-left transition-colors',
                  'border-b border-line-strong last:border-b-0',
                  item.read ? 'bg-transparent' : 'bg-[var(--teal)]/5',
                  'hover:bg-[var(--bg-elevated)]'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {getEventTypeLabel(item.eventType)}
                  </span>
                  <Badge variant={STATUS_BADGE_VARIANTS[item.status]} className="shrink-0 text-[10px] px-2 py-0.5">
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[var(--text-secondary)] truncate">
                    {item.channelName || 'Unknown channel'}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] shrink-0">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                {!item.read && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] absolute right-2 top-2" />
                )}
              </button>
            ))
          )}
        </div>

        <Link
          href="/notifications"
          className={cn(
            'flex items-center justify-center p-2.5 text-xs font-medium text-[var(--teal)]',
            'border-t border-line-strong hover:bg-[var(--bg-elevated)] transition-colors'
          )}
        >
          Show all notifications
        </Link>
      </PopoverContent>
    </Popover>
  );
}
