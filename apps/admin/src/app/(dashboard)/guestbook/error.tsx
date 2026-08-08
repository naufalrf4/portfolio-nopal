'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

const NEUMORPHIC_STYLES = {
  background: 'linear-gradient(145deg, #1a1d29 0%, #13151f 100%)',
  accent: 'var(--teal)',
  muted: '#9CA3AF',
  shadows: {
    large:
      '12px 12px 24px rgba(0, 0, 0, 0.5), -12px -12px 24px rgba(255, 255, 255, 0.02), inset 2px 2px 4px rgba(255, 255, 255, 0.05)',
  },
};

export default function GuestbookError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Guestbook error:', error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="rounded-[var(--radius-container)] p-12 max-w-lg w-full text-center"
          style={{
            background: NEUMORPHIC_STYLES.background,
            boxShadow: NEUMORPHIC_STYLES.shadows.large,
          }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              boxShadow:
                '0 8px 16px rgba(239, 68, 68, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Something went wrong
          </h2>

          <p className="mb-2" style={{ color: NEUMORPHIC_STYLES.muted }}>
            Failed to load guestbook entries
          </p>

          {error.message && (
            <p
              className="text-sm mb-6 px-4 py-2 rounded-[16px] font-mono"
              style={{
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error.message}
            </p>
          )}

          <button
            onClick={reset}
            className="px-8 py-4 rounded-[20px] font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, var(--teal) 0%, #2563EB 100%)',
              color: 'white',
              boxShadow:
                '0 8px 16px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            <RefreshCcw className="w-5 h-5" />
            Try again
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
