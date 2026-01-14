'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initGA } from '@naufalrf/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GAScript() {
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
