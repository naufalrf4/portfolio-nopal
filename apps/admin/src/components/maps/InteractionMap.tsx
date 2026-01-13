'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

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
  center = [106.8456, -6.2088],
  zoom = 4,
}: InteractionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    if (!mapboxgl.accessToken || mapboxgl.accessToken === '') {
      setError('Mapbox token not configured');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      const bounds = new mapboxgl.LngLatBounds();

      locations.forEach((loc) => {
        if (loc.lat && loc.lng) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 max-w-[200px]">
              ${loc.label ? `<strong class="block text-sm mb-1">${loc.label}</strong>` : ''}
              ${loc.message ? `<p class="text-xs text-gray-600">${loc.message}</p>` : ''}
              ${loc.date ? `<p class="text-xs text-gray-400 mt-1">${loc.date}</p>` : ''}
            </div>
          `);

          new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(map);

          bounds.extend([loc.lng, loc.lat]);
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [locations, center, zoom]);

  if (error) {
    return (
      <div
        className={cn(
          'w-full h-64 rounded-xl bg-gray-100 flex items-center justify-center',
          className
        )}
      >
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={cn('w-full h-64 rounded-xl overflow-hidden', className)}
    />
  );
}
