'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

export function OverviewCard({ icon, title, value, change }: StatCardProps) {
  return (
    <Card
      className={cn(
        'p-6 transition-all duration-300 ease-out',
        'hover:-translate-y-1',
        'bg-[#E0E5EC]',
        'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
        'hover:shadow-[12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br from-blue-400/20 to-cyan-500/20',
            'shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.5)]'
          )}
        >
          {icon}
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
              change.isPositive
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-red-500/10 text-red-600'
            )}
          >
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
      <p className="text-3xl font-bold text-[#3D4852] tracking-tight font-[family-name:var(--font-plus-jakarta)]">
        {value}
      </p>
    </Card>
  );
}

interface OverviewCardsProps {
  stats?: {
    totalInteractions: number;
    trackedClicks: number;
    countriesReached: number;
  };
  loading?: boolean;
}

export function OverviewCards({ stats, loading }: OverviewCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-6 bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D1D5DB]/50 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-[#D1D5DB]/50 rounded animate-pulse" />
                <div className="h-8 w-20 bg-[#D1D5DB]/50 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const data = stats || {
    totalInteractions: 0,
    trackedClicks: 0,
    countriesReached: 0,
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <OverviewCard
        icon={<Eye className="w-6 h-6 text-blue-500" />}
        title="Total Interactions"
        value={data.totalInteractions.toLocaleString()}
      />
      <OverviewCard
        icon={<Users className="w-6 h-6 text-purple-500" />}
        title="Tracked Clicks"
        value={data.trackedClicks.toLocaleString()}
      />
      <OverviewCard
        icon={<Activity className="w-6 h-6 text-emerald-500" />}
        title="Countries Reached"
        value={data.countriesReached}
      />
    </div>
  );
}
