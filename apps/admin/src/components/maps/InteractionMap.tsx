'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InteractionMapProps {
  locations: Array<{
    id: string;
    lat: number;
    lng: number;
    label?: string;
    message?: string;
    date?: string;
  }>;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

export function InteractionMap({
  locations,
  className,
  center = [-6.2088, 106.8456], // Jakarta default
  zoom = 4,
}: InteractionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      if (locations.length > 0) {
        const bounds = L.latLngBounds([]);
        locations.forEach((loc) => {
          if (loc.lat && loc.lng) {
            const marker = L.circleMarker([loc.lat, loc.lng], {
              radius: 8,
              fillColor: '#3B82F6',
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }).addTo(map);

            if (loc.label || loc.message) {
              marker.bindPopup(`
                <div class="p-2">
                  ${loc.label ? `<strong class="block mb-1">${loc.label}</strong>` : ''}
                  ${loc.message ? `<p class="text-sm">${loc.message}</p>` : ''}
                  ${loc.date ? `<p class="text-xs text-gray-500 mt-1">${loc.date}</p>` : ''}
                </div>
              `);
            }

            bounds.extend([loc.lat, loc.lng]);
          }
        });

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, center, zoom]);

  return (
    <div
      ref={mapRef}
      className={cn(
        'w-full h-64 rounded-xl bg-[#E0E5EC]',
        '[box-shadow:inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]',
        'overflow-hidden',
        className
      )}
    />
  );
}
