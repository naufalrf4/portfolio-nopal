'use client';

import { Card } from '@/components/ui/card';
import type { RecentInteraction } from '../types/analytics.types';

export function RecentInteractions({
  data,
  loading,
}: {
  data: RecentInteraction[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-6 bg-[#E0E5EC]">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-16 rounded-2xl bg-[#D1D5DB]/30 animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#E0E5EC] space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#3D4852]">Recent Interactions</h3>
        <p className="text-sm text-[#6B7280]">
          Latest submissions captured with normalized metadata.
        </p>
      </div>
      {data.length === 0 ? (
        <div className="rounded-[28px] neu-card-inset bg-[#E0E5EC] px-4 py-10 text-center text-sm text-[#6B7280]">
          No recent interactions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#E0E5EC] px-4 py-3 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#3D4852]">{item.label}</p>
                  <p className="text-xs text-[#6B7280]">
                    {item.type} · {item.sourceApp} · {item.sourcePath}
                  </p>
                  {(item.city || item.country) && (
                    <p className="text-xs text-[#6B7280] mt-1">
                      {[item.city, item.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-[#6B7280]">
                  {new Date(item.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Jakarta',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
