'use client';

import { useEffect } from 'react';

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Projects page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="neu-card max-w-md text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something Went Wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'Failed to load projects. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="neu-extruded px-6 py-3 rounded-2xl font-medium text-foreground hover:neu-extruded-hover transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
