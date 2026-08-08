import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium rounded-2xl',
    'transition-all duration-300 ease-out',
    'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    'shrink-0 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
          'shadow-neu-extruded',
          'hover:translate-y-[-1px]',
          'hover:shadow-neu-extruded',
          'active:translate-y-[0.5px]',
          'active:shadow-neu-inset',
        ].join(' '),
        primary: [
          'bg-gradient-to-r from-[var(--teal)] to-[var(--amber)] text-white',
          'shadow-neu-extruded',
          'hover:translate-y-[-1px] hover:brightness-110',
          'hover:shadow-neu-extruded',
          'active:translate-y-[0.5px] active:brightness-95',
          'active:shadow-neu-inset',
        ].join(' '),
        destructive: [
          'bg-gradient-to-r from-red-500 to-red-600 text-white',
          'shadow-neu-extruded',
          'hover:translate-y-[-1px] hover:brightness-110',
          'hover:shadow-neu-extruded',
          'active:translate-y-[0.5px] active:brightness-95',
          'active:shadow-neu-inset',
        ].join(' '),
        outline: [
          'bg-transparent border-2 border-[#D1D5DB] text-foreground',
          'shadow-neu-extruded',
          'hover:bg-[var(--bg-elevated)] hover:translate-y-[-1px]',
          'hover:shadow-neu-extruded',
          'active:translate-y-[0.5px]',
          'active:shadow-neu-inset',
        ].join(' '),
        ghost: [
          'bg-transparent shadow-none',
          'hover:bg-[var(--bg-elevated)]/50',
          'active:bg-[var(--bg-elevated)]/70',
        ].join(' '),
        link: [
          'bg-transparent shadow-none text-[var(--teal)]',
          'underline-offset-4 hover:underline',
          'p-0 h-auto',
        ].join(' '),
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-sm rounded-xl',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9 rounded-xl',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends React.ComponentProps<'button'>, ButtonVariants {
  asChild?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps, ButtonVariants };
