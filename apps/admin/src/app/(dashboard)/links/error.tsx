'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { NEUMORPHIC_STYLES } from '@/features/links';

export default function LinksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Links page error:', error);
  }, [error]);

  return (
    <PageWrapper>
      <div
        className="rounded-[var(--radius-container)] p-12 text-center max-w-2xl mx-auto"
        style={{
          backgroundColor: NEUMORPHIC_STYLES.background,
          boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
        }}
      >
        <div
          className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, #EF4444, #F87171)',
            boxShadow: NEUMORPHIC_STYLES.shadows.small,
          }}
        >
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>
        <h2
          className="font-display text-2xl font-bold mb-2"
          style={{ color: NEUMORPHIC_STYLES.foreground }}
        >
          Something went wrong
        </h2>
        <p className="mb-8" style={{ color: NEUMORPHIC_STYLES.muted }}>
          {error.message || 'Failed to load profile links. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${NEUMORPHIC_STYLES.accent}, ${NEUMORPHIC_STYLES.accentLight})`,
            boxShadow: NEUMORPHIC_STYLES.shadows.small,
            color: 'white',
          }}
        >
          Try Again
        </button>
      </div>
    </PageWrapper>
  );
}
