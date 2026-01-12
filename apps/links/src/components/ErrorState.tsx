'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Failed to load', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center w-full max-w-md mx-auto">
      {/* Error icon in neuromorphic container */}
      <div
        className="rounded-full p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, #e8edf4, #d1d9e6)',
          boxShadow:
            '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
        }}
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>

      {/* Error message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-primary-foreground transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, #5b8fd9, #4a7bc2)',
            boxShadow:
              '6px 6px 12px rgba(163, 177, 198, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '8px 8px 16px rgba(163, 177, 198, 0.55), -8px -8px 16px rgba(255, 255, 255, 0.45)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '6px 6px 12px rgba(163, 177, 198, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow =
              'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow =
              '6px 6px 12px rgba(163, 177, 198, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
