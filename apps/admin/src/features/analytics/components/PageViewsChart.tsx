'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageViewsChartProps {
  data?: Array<{
    date: string;
    views: number;
  }>;
  loading?: boolean;
}

export function PageViewsChart({ data, loading }: PageViewsChartProps) {
  const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('weekly');

  if (loading) {
    return (
      <Card
        className={cn(
          'p-6 bg-[#E0E5EC]',
          'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#3D4852]">Page Views</h3>
            <div className="h-8 w-32 bg-[#D1D5DB]/50 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 bg-[#D1D5DB]/30 rounded-2xl animate-pulse" />
        </div>
      </Card>
    );
  }

  const chartData = data || [];
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  return (
    <Card
      className={cn(
        'p-6 bg-[#E0E5EC]',
        'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#3D4852]">Page Views Over Time</h3>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'primary' : 'default'}
              size="sm"
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded-xl text-xs font-medium',
                period !== p && 'bg-[#E0E5EC] text-[#6B7280]'
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 800 256">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d={`
                M 0 ${256}
                ${chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 800;
                    const y = 256 - (d.views / maxViews) * 216 - 20;
                    return `L ${x} ${y}`;
                  })
                  .join(' ')}
                L 800 ${256}
                Z
              `}
              fill="url(#gradient)"
            />

            <path
              d={`
                M 0 ${256 - (chartData[0]?.views / maxViews || 0) * 216 - 20}
                ${chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 800;
                    const y = 256 - (d.views / maxViews) * 216 - 20;
                    return `L ${x} ${y}`;
                  })
                  .join(' ')}
              `}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 800;
              const y = 256 - (d.views / maxViews) * 216 - 20;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="#3B82F6" stroke="#E0E5EC" strokeWidth="2" />
                  <text
                    x={x}
                    y={248}
                    textAnchor="middle"
                    className="text-[10px] fill-[#6B7280]"
                    style={{ fontSize: '10px' }}
                  >
                    {new Date(d.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-[#6B7280] text-sm">No data available</p>
        </div>
      )}
    </Card>
  );
}

import * as React from 'react';
