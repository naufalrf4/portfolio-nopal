'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { AnonymousMessage } from '../types/messages.types';

interface LocationStat {
  countryCode: string;
  country: string;
  count: number;
}

interface LocationMapProps {
  messages: AnonymousMessage[];
  onCountrySelect?: (countryCode: string | null) => void;
  selectedCountry?: string | null;
  height?: string;
}

export function LocationMap({
  messages,
  onCountrySelect,
  selectedCountry,
  height = '400px',
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [locationStats, setLocationStats] = useState<LocationStat[]>([]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    setMapboxToken(token || null);

    const stats = new Map<string, LocationStat>();
    messages.forEach((msg) => {
      if (msg.countryCode && msg.country) {
        const existing = stats.get(msg.countryCode);
        if (existing) {
          existing.count++;
        } else {
          stats.set(msg.countryCode, {
            countryCode: msg.countryCode,
            country: msg.country,
            count: 1,
          });
        }
      }
    });
    setLocationStats(Array.from(stats.values()).sort((a, b) => b.count - a.count));
    setLoading(false);
  }, [messages]);

  const getFlagEmoji = (countryCode: string) => {
    const flagMap: Record<string, string> = {
      US: '🇺🇸',
      GB: '🇬🇧',
      ID: '🇮🇩',
      AU: '🇦🇺',
      CA: '🇨🇦',
      DE: '🇩🇪',
      FR: '🇫🇷',
      JP: '🇯🇵',
      KR: '🇰🇷',
      CN: '🇨🇳',
      BR: '🇧🇷',
      IN: '🇮🇳',
      MY: '🇲🇾',
      SG: '🇸🇬',
      NL: '🇳🇱',
      ES: '🇪🇸',
      IT: '🇮🇹',
      RU: '🇷🇺',
      MX: '🇲🇽',
      ZA: '🇿🇦',
      PH: '🇵🇭',
      VN: '🇻🇳',
      TH: '🇹🇭',
      NZ: '🇳🇿',
    };
    return flagMap[countryCode] || '🌍';
  };

  const getMarkerSize = (count: number) => {
    const maxCount = Math.max(...locationStats.map((s) => s.count), 1);
    const normalized = count / maxCount;
    const minSize = 24;
    const maxSize = 48;
    return minSize + normalized * (maxSize - minSize);
  };

  const handleMarkerClick = (countryCode: string) => {
    onCountrySelect?.(countryCode === selectedCountry ? null : countryCode);
  };

  const handleClearFilter = () => {
    onCountrySelect?.(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#3D4852] flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Message Locations
        </h3>
        {selectedCountry && (
          <button onClick={handleClearFilter} className="text-sm text-[#3B82F6] hover:underline">
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <div
          className="neu-inset rounded-2xl bg-[#E0E5EC] flex items-center justify-center"
          style={{ height }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
            <span className="text-sm text-[#6B7280]">Loading map...</span>
          </div>
        </div>
      ) : !mapboxToken ? (
        <div
          className="neu-inset rounded-2xl bg-[#E0E5EC] flex items-center justify-center"
          style={{ height }}
        >
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <MapPin className="h-12 w-12 text-[#6B7280]" />
            <div>
              <p className="text-sm font-medium text-[#3D4852] mb-1">
                Mapbox Access Token Required
              </p>
              <p className="text-xs text-[#6B7280]">
                Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables to enable the map
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative neu-inset rounded-2xl overflow-hidden bg-[#E0E5EC]"
          style={{ height }}
        >
          <div ref={mapRef} className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <MapPin className="h-12 w-12 text-[#6B7280]" />
              <div>
                <p className="text-sm font-medium text-[#3D4852] mb-1">
                  Interactive Map Coming Soon
                </p>
                <p className="text-xs text-[#6B7280]">
                  Install mapbox-gl and react-mapbox-gl packages to enable map visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {locationStats.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#3D4852]">Top Locations</h4>
          <div className="space-y-2">
            {locationStats.slice(0, 5).map((stat) => (
              <button
                key={stat.countryCode}
                onClick={() => handleMarkerClick(stat.countryCode)}
                className={`w-full neu-extruded rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)] ${
                  selectedCountry === stat.countryCode ? 'ring-2 ring-[#3B82F6]' : ''
                }`}
              >
                <span className="text-xl">{getFlagEmoji(stat.countryCode)}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-[#3D4852]">{stat.country}</div>
                  <div className="text-xs text-[#6B7280]">
                    {stat.count} message{stat.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div
                  className="rounded-full bg-[#3B82F6] text-white text-xs font-bold flex items-center justify-center neu-extruded-sm"
                  style={{
                    width: `${getMarkerSize(stat.count)}px`,
                    height: `${getMarkerSize(stat.count)}px`,
                  }}
                >
                  {stat.count}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
