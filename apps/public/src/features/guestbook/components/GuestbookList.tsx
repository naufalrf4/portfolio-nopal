'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GuestbookEntry } from './GuestbookEntry';
import type { GuestbookEntry as GuestbookEntryType } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface GuestbookListProps {
  entries: GuestbookEntryType[];
}

const ITEMS_PER_PAGE = 30;

export function GuestbookList({ entries }: GuestbookListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (entries.length === 0) {
    return null;
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const handleMouseDown = (e: React.MouseEvent, rowIndex: number) => {
    setIsDragging(true);
    setStartX(e.pageX);
    const row = rowRefs.current[rowIndex];
    if (row) {
      const rect = row.getBoundingClientRect();
      setScrollLeft(rect.left);
    }
  };

  const handleMouseMove = (e: React.MouseEvent, rowIndex: number) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    const row = rowRefs.current[rowIndex];
    if (row) {
      row.style.transform = `translateX(${walk}px)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    rowRefs.current.forEach((row) => {
      if (row) row.style.transform = '';
    });
  };

  const rows: GuestbookEntryType[][] = [];
  for (let i = 0; i < currentEntries.length; i += 6) {
    rows.push(currentEntries.slice(i, i + 6));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {rows.map((row, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;
          return (
            <div key={`row-${currentPage}-${rowIndex}`} className="overflow-x-hidden py-2">
              <div
                ref={(el) => {
                  rowRefs.current[rowIndex] = el;
                }}
                className={cn(
                  'flex gap-4 w-fit cursor-grab active:cursor-grabbing',
                  !isDragging && (isEvenRow ? 'animate-marquee' : 'animate-marquee-reverse')
                )}
                style={{
                  animationDuration: '40s',
                  animationDelay: `${rowIndex * -6}s`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                onMouseDown={(e) => handleMouseDown(e, rowIndex)}
                onMouseMove={(e) => handleMouseMove(e, rowIndex)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {[...row, ...row, ...row].map((entry, idx) => (
                  <div key={`${entry.id}-${idx}`} className="flex-shrink-0 w-[260px]">
                    <GuestbookEntry entry={entry} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
            className={cn(
              'p-3 rounded-xl bg-[#E0E5EC] text-[#3D4852]',
              'shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.5)]',
              'hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
              'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.4)]',
              'transition-all duration-200'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i;
              if (totalPages > 5) {
                if (currentPage < 3) pageNum = i;
                else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + i;
                else pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-10 h-10 rounded-xl font-medium text-sm transition-all duration-200',
                    pageNum === currentPage
                      ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[4px_4px_8px_rgba(59,130,246,0.4),-4px_-4px_8px_rgba(255,255,255,0.3)]'
                      : 'bg-[#E0E5EC] text-[#6B7280] shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.4)] hover:text-[#3D4852]'
                  )}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
            className={cn(
              'p-3 rounded-xl bg-[#E0E5EC] text-[#3D4852]',
              'shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.5)]',
              'hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
              'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.4)]',
              'transition-all duration-200'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
