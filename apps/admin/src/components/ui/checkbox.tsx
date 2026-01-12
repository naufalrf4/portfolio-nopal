'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer h-5 w-5 shrink-0 rounded-lg',
        'bg-[#E0E5EC]',
        'transition-all duration-300 ease-out',
        'outline-none',
        '[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
        'data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#3B82F6] data-[state=checked]:to-[#60A5FA]',
        'data-[state=checked]:[box-shadow:3px_3px_6px_rgba(59,130,246,0.3),-3px_-3px_6px_rgba(96,165,250,0.2)]',
        'focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn('flex items-center justify-center text-white')}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
