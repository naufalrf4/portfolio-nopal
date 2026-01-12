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
          'bg-[#E0E5EC] text-[#3D4852]',
          '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
          'hover:translate-y-[-1px]',
          'hover:[box-shadow:12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]',
          'active:translate-y-[0.5px]',
          'active:[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
        ].join(' '),
        primary: [
          'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white',
          '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
          'hover:translate-y-[-1px] hover:brightness-110',
          'hover:[box-shadow:12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]',
          'active:translate-y-[0.5px] active:brightness-95',
          'active:[box-shadow:inset_3px_3px_6px_rgba(59,130,246,0.4),inset_-3px_-3px_6px_rgba(96,165,250,0.3)]',
        ].join(' '),
        destructive: [
          'bg-gradient-to-r from-red-500 to-red-600 text-white',
          '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
          'hover:translate-y-[-1px] hover:brightness-110',
          'hover:[box-shadow:12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]',
          'active:translate-y-[0.5px] active:brightness-95',
          'active:[box-shadow:inset_3px_3px_6px_rgba(239,68,68,0.4),inset_-3px_-3px_6px_rgba(220,38,38,0.3)]',
        ].join(' '),
        outline: [
          'bg-transparent border-2 border-[#D1D5DB] text-foreground',
          '[box-shadow:2px_2px_4px_rgba(163,177,198,0.3),-2px_-2px_4px_rgba(255,255,255,0.3)]',
          'hover:bg-[#E0E5EC] hover:translate-y-[-1px]',
          'hover:[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
          'active:translate-y-[0.5px]',
          'active:[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
        ].join(' '),
        ghost: [
          'bg-transparent shadow-none',
          'hover:bg-[#E0E5EC]/50',
          'active:bg-[#E0E5EC]/70',
        ].join(' '),
        link: [
          'bg-transparent shadow-none text-[#3B82F6]',
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
