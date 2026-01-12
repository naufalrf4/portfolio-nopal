'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics/tracker';

export function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    initGA();
    trackPageView(pathname, document.title);
  }, [pathname]);

  return null;
}
