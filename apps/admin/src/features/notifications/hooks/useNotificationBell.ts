import { useCallback, useEffect, useState } from 'react';
import type { OutboxRow } from '../types/notifications.types';

const SEEN_STORAGE_KEY = 'admin-notifications-seen-ids';
const POLL_INTERVAL_MS = 30000;
const BELL_ITEM_LIMIT = 8;

export interface NotificationBellItem extends OutboxRow {
  read: boolean;
}

function loadSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function persistSeenIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
  }
}

export function useNotificationBell() {
  const [rows, setRows] = useState<OutboxRow[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSeenIds(loadSeenIds());
    setMounted(true);
  }, []);

  const fetchRecent = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/v1/admin/notifications/outbox?limit=20', {
        ...(signal ? { signal } : {}),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRows(data.data);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        void error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchRecent(controller.signal);

    const interval = setInterval(() => {
      void fetchRecent();
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchRecent]);

  const sortedRows = [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const items: NotificationBellItem[] = sortedRows.slice(0, BELL_ITEM_LIMIT).map((row) => ({
    ...row,
    read: seenIds.has(row.id),
  }));

  const unreadCount = mounted ? sortedRows.filter((row) => !seenIds.has(row.id)).length : 0;

  const markAsRead = useCallback((id: string) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistSeenIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      rows.forEach((row) => next.add(row.id));
      persistSeenIds(next);
      return next;
    });
  }, [rows]);

  return {
    items,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchRecent,
  };
}
