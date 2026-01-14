'use client';

import { useState, useEffect } from 'react';
import { AboutContent } from './AboutContent';
import { LoadingState, ErrorState, PageHeader } from '@/src/features/shared/components';
import type { AboutData } from './types';
import type { Achievement } from '@/src/lib/api/types';
import { User } from 'lucide-react';

interface AboutPageClientProps {
  initialData: AboutData | null;
  achievements: Achievement[];
  ssrError?: boolean;
}

export function AboutPageClient({
  initialData,
  achievements,
  ssrError = false,
}: AboutPageClientProps) {
  const [data, setData] = useState<AboutData | null>(initialData);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(ssrError && !initialData);

  const fetchData = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Auto-fetch if SSR failed and no initial data
  useEffect(() => {
    if (ssrError && !initialData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingState type="skeleton" count={3} />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="About Me"
            subtitle="Learn more about my journey, skills, and professional experience as a Full-Stack Engineer."
            icon={User}
          />
          <ErrorState
            title="Failed to load about data"
            message={error || 'Unable to load about information. Please try again.'}
            onRetry={fetchData}
            showRetry={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="About Me"
          subtitle="Learn more about my journey, skills, and professional experience as a Full-Stack Engineer."
          icon={User}
        />
        <AboutContent about={data} achievements={achievements} />
      </div>
    </div>
  );
}
