import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 ease-out',
  {
    variants: {
      variant: {
        default:
          'bg-[#E0E5EC] text-[#6B7280] [box-shadow:3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]',
        primary: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20',
        success: 'bg-[#38B2AC]/10 text-[#38B2AC] border border-[#38B2AC]/20',
        warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
        destructive: 'bg-red-500/10 text-red-500 border border-red-500/20',
        outline:
          'bg-[#E0E5EC] text-[#6B7280] [box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
