'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Settings page error:', error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="rounded-[32px] p-8 max-w-lg w-full text-center"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          {/* Icon well */}
          <div className="flex justify-center mb-6">
            <div
              className="rounded-2xl p-4 w-16 h-16 flex items-center justify-center"
              style={{
                background: '#E0E5EC',
                boxShadow:
                  'inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
              }}
            >
              <AlertCircle className="h-8 w-8 text-[#EF4444]" />
            </div>
          </div>

          {/* Error message */}
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: '#3D4852',
            }}
          >
            Something went wrong
          </h2>
          <p
            className="text-sm mb-6"
            style={{
              color: '#6B7280',
            }}
          >
            {error.message || 'An unexpected error occurred while loading settings.'}
          </p>

          {/* Retry button */}
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-300 hover:-translate-y-[1px] active:translate-y-[0.5px]"
            style={{
              background: '#6C63FF',
              color: '#FFFFFF',
              boxShadow: '9px 9px 16px rgba(108,99,255,0.4), -9px -9px 16px rgba(255,255,255,0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '12px 12px 20px rgba(108,99,255,0.5), -12px -12px 20px rgba(255,255,255,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '9px 9px 16px rgba(108,99,255,0.4), -9px -9px 16px rgba(255,255,255,0.5)';
            }}
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
