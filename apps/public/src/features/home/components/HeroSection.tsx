'use client';

import { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { LoadingState, ErrorState } from '@/src/features/shared/components';
import { aboutApi } from '@/src/lib/api/endpoints/about';
import type { AboutData } from '@/src/lib/api/types';

export function HeroSection() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const aboutData = await aboutApi.get();
      setData(aboutData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <LoadingState type="spinner" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <ErrorState message={error || 'Failed to load about data'} onRetry={fetchData} />
      </section>
    );
  }

  const heroData = {
    fullName: data.fullName,
    tagline: data.tagline,
    roles: data.roles,
    bio: data.bio,
    avatarUrl: data.avatarUrl || '',
    resumeUrl: data.resumeUrl || '',
    socialLinks: Object.entries(data.socialLinks || {})
      .filter(([, url]) => url)
      .map(([platform, url]) => ({ platform, url: url as string })),
  };

  return <Hero about={heroData} />;
}
