'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { trackPageView, isGAReady } from '@naufalrf/analytics';

interface GoogleAnalyticsProps {
  measurementId: string;
}

function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGAReady()) return;

    trackPageView({
      page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // SSR-safe check: only validate prop, not window
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
