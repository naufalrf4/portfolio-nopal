'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-destructive/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-destructive/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="neu-extruded rounded-[32px] p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center">
            <div className="neu-inset-deep rounded-[32px] p-6 w-24 h-24 flex items-center justify-center">
              <div className="neu-extruded rounded-xl p-3">
                <AlertCircle className="w-10 h-10 text-destructive" strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-br from-destructive to-destructive/70 bg-clip-text text-transparent leading-none tracking-tight">
                500
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Something Went Wrong
              </h2>
            </div>

            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
              An unexpected error occurred while processing your request. Please try again or
              contact support if the problem persists.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-medium text-primary-foreground bg-primary neu-extruded hover:-translate-y-[1px] hover:neu-extruded-hover active:translate-y-[0.5px] active:neu-inset transition-all duration-200 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
