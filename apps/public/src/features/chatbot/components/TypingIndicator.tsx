'use client';

import { cn } from '@/src/lib/utils';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '0ms', animationDuration: '600ms' }}
      />
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '150ms', animationDuration: '600ms' }}
      />
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '300ms', animationDuration: '600ms' }}
      />
    </div>
  );
}
