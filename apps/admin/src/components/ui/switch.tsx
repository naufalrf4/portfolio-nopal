'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-7 w-14 shrink-0 items-center rounded-full',
        'bg-[#E0E5EC]',
        'transition-all duration-300 ease-out',
        'outline-none',
        '[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#3B82F6] data-[state=checked]:to-[#60A5FA]',
        'data-[state=checked]:[box-shadow:inset_2px_2px_4px_rgba(59,130,246,0.4),inset_-2px_-2px_4px_rgba(96,165,250,0.4)]',
        'focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full',
          'bg-[#E0E5EC]',
          'transition-all duration-300 ease-out',
          '[box-shadow:5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]',
          'data-[state=unchecked]:translate-x-1',
          'data-[state=checked]:translate-x-8',
          'data-[state=checked]:bg-[#E0E5EC]',
          'data-[state=checked]:[box-shadow:3px_3px_8px_rgba(163,177,198,0.6),-3px_-3px_8px_rgba(255,255,255,0.5),0_0_12px_rgba(59,130,246,0.3)]',
          'hover:scale-105'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
