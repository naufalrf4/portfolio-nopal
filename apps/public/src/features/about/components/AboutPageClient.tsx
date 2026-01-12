'use client';

import { useState } from 'react';
import { AboutContent } from './AboutContent';
import { LoadingState, ErrorState } from '@/src/features/shared/components';
import type { AboutData } from './types';

interface AboutPageClientProps {
  initialData: AboutData | null;
  error?: string;
}

export function AboutPageClient({ initialData, error: initialError }: AboutPageClientProps) {
  const [data, setData] = useState<AboutData | null>(initialData);
  const [error, setError] = useState<string | undefined>(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(undefined);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/v1/public/about`);

      if (!response.ok) {
        throw new Error('Failed to fetch about data');
      }

      const result = await response.json();
      setData(result?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load about data');
    } finally {
      setIsRetrying(false);
    }
  };

  if (isRetrying) {
    return <LoadingState type="skeleton" count={3} />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Failed to load about data"
        message={error || 'Unable to load about information. Please try again.'}
        onRetry={handleRetry}
        showRetry={true}
      />
    );
  }

  return <AboutContent about={data} />;
}
