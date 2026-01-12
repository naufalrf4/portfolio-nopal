'use client';

import React, { useRef, useEffect, useState } from 'react';
import { GuestbookEntry } from './GuestbookEntry';
import type { GuestbookEntry as GuestbookEntryType } from './types';

interface GuestbookListProps {
  entries: GuestbookEntryType[];
}

export function GuestbookList({ entries }: GuestbookListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || entries.length === 0 || isPaused || isDragging) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;

      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [entries.length, isPaused, isDragging]);

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

  if (entries.length === 0) {
    return null;
  }

  const duplicatedEntries = [...entries, ...entries];

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
      <div className="flex gap-4 py-4">
        {duplicatedEntries.map((entry, index) => (
          <div key={`${entry.id}-${index}`} className="flex-shrink-0">
            <GuestbookEntry entry={entry} />
          </div>
        ))}
      </div>
    </div>
  );
}
