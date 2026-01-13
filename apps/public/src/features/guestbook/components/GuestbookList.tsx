'use client';

import React, { useRef, useEffect, useState } from 'react';
import { GuestbookEntry } from './GuestbookEntry';
import type { GuestbookEntry as GuestbookEntryType } from './types';

interface GuestbookListProps {
  entries: GuestbookEntryType[];
}

function MarqueeRow({
  entries,
  direction = 'right',
  speed = 0.4,
}: {
  entries: GuestbookEntryType[];
  direction?: 'right' | 'left';
  speed?: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const duplicatedEntries = [...entries, ...entries];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || entries.length === 0 || isPaused || isDragging) return;

    let animationFrameId: number;
    let scrollPosition = 0;

    const animate = () => {
      if (direction === 'right') {
        scrollPosition += speed;
        if (scrollPosition >= container.scrollWidth / 2) {
          scrollPosition = 0;
        }
      } else {
        scrollPosition -= speed;
        if (Math.abs(scrollPosition) >= container.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }

      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [entries.length, isPaused, isDragging, direction, speed]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  if (entries.length === 0) return null;

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsPaused(true)}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex gap-3 py-3">
        {duplicatedEntries.map((entry, index) => (
          <div key={`${entry.id}-${index}`} className="flex-shrink-0">
            <GuestbookEntry entry={entry} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuestbookList({ entries }: GuestbookListProps) {
  if (entries.length === 0) {
    return null;
  }

  const third = Math.ceil(entries.length / 3);
  const row1 = entries.slice(0, third);
  const row2 = entries.slice(third, third * 2);
  const row3 = entries.slice(third * 2);

  return (
    <div className="space-y-3">
      <MarqueeRow entries={row1} direction="right" speed={0.4} />
      <MarqueeRow entries={row2} direction="left" speed={0.35} />
      <MarqueeRow entries={row3} direction="right" speed={0.45} />
    </div>
  );
}
