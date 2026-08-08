'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-[var(--bg-elevated)]/80 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-300',
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-[var(--bg-elevated)] shadow-lg transition-all ease-out',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:duration-300 data-[state=closed]:duration-300',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l border-[#A3B1C6]/20 sm:max-w-sm rounded-l-[32px] shadow-neu-extruded',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r border-[#A3B1C6]/20 sm:max-w-sm rounded-r-[32px] shadow-neu-extruded',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b border-[#A3B1C6]/20 rounded-b-[32px] shadow-neu-extruded',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t border-[#A3B1C6]/20 rounded-t-[32px] shadow-neu-extruded',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className={cn(
            'absolute top-5 right-5 h-10 w-10 rounded-xl',
            'bg-[var(--bg-elevated)] flex items-center justify-center',
            'shadow-neu-extruded-sm',
            'text-[var(--text-secondary)] transition-all duration-200 opacity-70 hover:opacity-100',
            'hover:shadow-neu-extruded',
            'hover:text-[var(--text-primary)]',
            'active:shadow-neu-extruded',
            'focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]',
            'disabled:pointer-events-none',
            '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5'
          )}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-2 p-6 pb-0', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex flex-col-reverse gap-3 p-6 pt-0 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-[var(--text-secondary)]', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
