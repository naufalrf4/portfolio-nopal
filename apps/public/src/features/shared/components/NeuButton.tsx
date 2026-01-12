'use client';

import { cn } from '@/src/lib/utils';
import { forwardRef } from 'react';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const NeuButton = forwardRef<HTMLButtonElement, NeuButtonProps>(
  (
    { variant = 'default', size = 'md', isLoading, children, className, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
          'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
          'active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',
          variant === 'default' && 'bg-[#E0E5EC] text-[#3D4852] hover:text-[#3B82F6]',
          variant === 'accent' &&
            'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-[6px_6px_12px_rgba(59,130,246,0.3),-6px_-6px_12px_rgba(255,255,255,0.5)]',
          variant === 'ghost' && 'bg-transparent shadow-none hover:bg-[#E0E5EC]/50',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

NeuButton.displayName = 'NeuButton';
