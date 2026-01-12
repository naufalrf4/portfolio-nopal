'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: import('react').ReactNode;
  stats?: { label: string; value: string | number; variant?: 'default' | 'success' | 'warning' }[];
  className?: string;
  icon?: React.ReactElement;
}

const NEU_SHADOW_INSET =
  'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)';

function PageHeader({ title, description, actions, stats, className, icon }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        'animate-in fade-in slide-in-from-bottom-4 duration-500',
        'flex flex-col gap-4 md:gap-6',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div className="flex-1 space-y-0.5 md:space-y-1">
          <div className="flex items-center gap-2 md:gap-3">
            {icon && (
              <div className="flex-shrink-0 text-[#3D4852]">
                {React.cloneElement(icon as React.ReactElement<any>, {
                  className: 'h-5 w-5 md:h-7 md:w-7',
                  strokeWidth: 2,
                })}
              </div>
            )}
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#3D4852]">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-sm md:text-base text-[#6B7280] mt-0.5 md:mt-1">{description}</p>
          )}
        </div>

        {actions && <div className="hidden md:flex md:items-center gap-2">{actions}</div>}
      </div>

      {stats && stats.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-[#E0E5EC]"
          style={{ boxShadow: NEU_SHADOW_INSET }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                'inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium',
                'transition-colors duration-200',
                stat.variant === 'success' && 'bg-[#38B2AC]/10 text-[#38B2AC]',
                stat.variant === 'warning' && 'bg-[#F59E0B]/10 text-[#F59E0B]',
                (!stat.variant || stat.variant === 'default') && 'bg-[#6B7280]/10 text-[#6B7280]'
              )}
            >
              <span className="text-xs font-normal opacity-80">{stat.label}:</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
