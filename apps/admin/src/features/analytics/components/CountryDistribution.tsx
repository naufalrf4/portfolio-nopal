'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface CountryDistributionProps {
  data?: Array<{ country: string; code: string; count: number; percentage: number }>;
  loading?: boolean;
}

export function CountryDistribution({ data, loading }: CountryDistributionProps) {
  if (loading) {
    return (
      <Card
        className={cn(
          'p-6 bg-[#E0E5EC]',
          'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#3D4852]">Geographic Distribution</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#D1D5DB]/50 rounded-full animate-pulse" />
                    <div className="h-3 w-24 bg-[#D1D5DB]/50 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-12 bg-[#D1D5DB]/50 rounded animate-pulse" />
                </div>
                <div className="h-2 bg-[#D1D5DB]/30 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const countriesData = data || [];
  const totalVisitors = countriesData.reduce((sum, c) => sum + c.count, 0);

  return (
    <Card
      className={cn(
        'p-6 bg-[#E0E5EC]',
        'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#3D4852]">Geographic Distribution</h3>
        <Globe className="w-5 h-5 text-[#6B7280]" />
      </div>

      {countriesData.length > 0 ? (
        <div className="space-y-5">
          {countriesData.map((country) => (
            <div key={country.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getFlagEmoji(country.code)}</span>
                  <span className="font-medium text-[#3D4852]">{country.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#3D4852]">
                    {country.count.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">{country.percentage}%</span>
                </div>
              </div>

              <div className="h-2 bg-[#D1D5DB]/30 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]'
                  )}
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center">
          <Globe className="w-12 h-12 text-[#D1D5DB] mb-3" />
          <p className="text-[#6B7280] text-sm">No geographic data available</p>
        </div>
      )}
    </Card>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
