import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, style, ...props }: React.ComponentProps<'div'>) {
  const isInset = className?.includes('neu-card-inset');

  return (
    <div
      data-slot="card"
      className={cn(
        'bg-[#E0E5EC] text-[#3D4852] flex flex-col rounded-[32px] transition-all duration-300 ease-out',
        'data-[hoverable=true]:hover:-translate-y-0.5 data-[hoverable=true]:cursor-pointer',
        '[&.neu-card-inset]:rounded-2xl',
        isInset
          ? '[box-shadow:inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]'
          : '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] data-[hoverable=true]:hover:[box-shadow:12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]',
        className
      )}
      style={style}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header flex flex-col gap-1.5 p-6 pb-0',
        'has-data-[slot=card-action]:flex-row has-data-[slot=card-action]:items-start has-data-[slot=card-action]:justify-between',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-display font-bold text-xl text-[#3D4852] tracking-tight leading-none',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-[#6B7280]', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-action" className={cn('self-end flex-shrink-0', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 p-6 pt-0', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
