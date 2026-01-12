'use client';

import { cn } from '@/src/lib/utils';
import { NeuButton } from './NeuButton';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  showRetry = true,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
    >
      <div
        className={cn(
          'bg-[#E0E5EC] rounded-full p-6 mb-6',
          'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
        )}
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>

      <h3 className="text-xl font-semibold text-[#3D4852] mb-2">{title}</h3>
      <p className="text-[#6B7280] mb-6 max-w-md">{message}</p>

      {showRetry && onRetry && (
        <NeuButton onClick={onRetry} variant="accent">
          Try Again
        </NeuButton>
      )}
    </div>
  );
}
