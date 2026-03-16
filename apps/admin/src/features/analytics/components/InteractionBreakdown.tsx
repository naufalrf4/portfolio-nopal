'use client';

import { Card } from '@/components/ui/card';
import type { InteractionTypeStat } from '../types/analytics.types';

export function InteractionBreakdown({
  data,
  loading,
}: {
  data: InteractionTypeStat[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-6 bg-[#E0E5EC]">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 w-24 rounded bg-[#D1D5DB]/50 animate-pulse" />
              <div className="h-2 rounded-full bg-[#D1D5DB]/30 animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6 bg-[#E0E5EC] space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#3D4852]">Submission Types</h3>
        <p className="text-sm text-[#6B7280]">
          Normalized across contact, booking, guestbook, and NGL.
        </p>
      </div>
      {data.length === 0 ? (
        <div className="rounded-[28px] neu-card-inset bg-[#E0E5EC] px-4 py-10 text-center text-sm text-[#6B7280]">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            return (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#3D4852]">{item.label}</span>
                  <span className="text-[#6B7280]">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#D1D5DB]/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
