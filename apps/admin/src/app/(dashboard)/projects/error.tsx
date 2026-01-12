'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Projects page error:', error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-[32px] bg-[#E0E5EC] p-12 max-w-lg text-center shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E0E5EC] text-[#EF4444] mb-6 shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="font-display font-bold text-2xl text-[#3D4852] mb-3">
            Something went wrong
          </h2>

          <p className="text-[#6B7280] mb-2">
            Failed to load projects. This might be a temporary issue.
          </p>

          {error.message && (
            <p className="text-sm text-[#A0AEC0] mb-6 font-mono">{error.message}</p>
          )}

          <Button
            onClick={reset}
            className="px-6 py-3 rounded-2xl font-semibold transition-all duration-200 bg-[#E0E5EC] text-[#3D4852] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] hover:-translate-y-[1px]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
