import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex w-full min-h-[100px] rounded-2xl bg-[#E0E5EC] px-4 py-3 text-base text-[#3D4852]',
        'placeholder:text-[#6B7280] placeholder:opacity-70',
        'resize-y',
        'transition-all duration-300 ease-out',
        'outline-none',
        '[box-shadow:inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]',
        'focus:ring-2 focus:ring-[#3B82F6]/30 focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:resize-none',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
