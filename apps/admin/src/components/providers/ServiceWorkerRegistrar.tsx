'use client';

import { useEffect } from 'react';

// Registers the service worker on dashboard load. Push subscription also calls
// register(), but relying on that alone means the app is not installable until
// an admin enables notifications — browsers require an active registration
// before offering the install prompt.
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  return null;
}
