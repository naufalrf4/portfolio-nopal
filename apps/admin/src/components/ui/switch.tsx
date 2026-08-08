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
        'bg-[var(--bg-elevated)]',
        'transition-all duration-300 ease-out',
        'outline-none',
        'shadow-neu-inset',
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--teal)] data-[state=checked]:to-[var(--amber)]',
        'data-[state=checked]:shadow-neu-inset',
        'focus-visible:ring-2 focus-visible:ring-[var(--teal)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full',
          'bg-[var(--bg-elevated)]',
          'transition-all duration-300 ease-out',
          'shadow-neu-extruded',
          'data-[state=unchecked]:translate-x-1',
          'data-[state=checked]:translate-x-8',
          'data-[state=checked]:bg-[var(--bg-elevated)]',
          'data-[state=checked]:shadow-neu-extruded',
          'hover:scale-105'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
