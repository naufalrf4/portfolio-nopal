'use client';

import { Card } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';
import type { TelemetryLinkStat } from '../types/analytics.types';

export function TopLinkClicks({ data, loading }: { data: TelemetryLinkStat[]; loading: boolean }) {
  if (loading) {
    return (
      <Card className="p-6 bg-[#E0E5EC]">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-14 rounded-2xl bg-[#D1D5DB]/30 animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#E0E5EC] space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#3D4852]">Top Link Clicks</h3>
          <p className="text-sm text-[#6B7280]">Telemetry from the links app.</p>
        </div>
        <MousePointerClick className="h-5 w-5 text-[#6B7280]" />
      </div>

      {data.length === 0 ? (
        <div className="rounded-[28px] neu-card-inset bg-[#E0E5EC] px-4 py-10 text-center text-sm text-[#6B7280]">
          No click telemetry yet.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-[#E0E5EC] px-4 py-3 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[#3D4852]">{item.label}</p>
                <p className="text-xs text-[#6B7280]">
                  {item.type} · {item.sourceApp}
                </p>
              </div>
              <span className="rounded-full bg-[#14B8A6] px-3 py-1 text-xs font-bold text-white">
                {item.clicks}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
