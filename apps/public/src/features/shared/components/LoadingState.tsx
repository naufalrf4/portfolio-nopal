'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';

interface LoadingStateProps {
  type?: 'skeleton' | 'spinner' | 'pulse';
  count?: number;
  height?: string;
  width?: string;
  className?: string;
  showSlowMessage?: boolean;
}

export function LoadingState({
  type = 'skeleton',
  count = 3,
  height = 'h-12',
  width = 'w-full',
  className,
  showSlowMessage = true,
}: LoadingStateProps) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showSlowMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSlowMessage]);
  if (type === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <div className="relative">
          <div
            className={cn(
              'bg-[#E0E5EC] rounded-full p-4',
              'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
            )}
          >
            <svg
              className="animate-spin h-8 w-8 text-[#3B82F6]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        {showMessage && (
          <p className="mt-4 text-sm text-[#6B7280] animate-fade-in">
            Still loading... This is taking longer than expected.
          </p>
        )}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-[#E0E5EC] rounded-2xl animate-pulse',
              height,
              width,
              'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-[#E0E5EC] rounded-2xl',
            height,
            width,
            'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]',
            'relative overflow-hidden'
          )}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      ))}
    </div>
  );
}
