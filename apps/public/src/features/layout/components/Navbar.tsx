'use client';

import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, OTHER_LINKS } from '@/src/lib/constants';

export function Navbar() {
  const pathname = usePathname();
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false);
  const [isClickOpen, setIsClickOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!isClickOpen) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setOtherDropdownOpen(true);
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (!isClickOpen) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setOtherDropdownOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    setIsClickOpen(!isClickOpen);
    setOtherDropdownOpen(!otherDropdownOpen);
  };

  const handleLinkClick = () => {
    setIsClickOpen(false);
    setOtherDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClickOpen(false);
        setOtherDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClickOpen(false);
        setOtherDropdownOpen(false);
      }
    };

    if (otherDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [otherDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto max-w-7xl rounded-2xl bg-[#E0E5EC]/80 backdrop-blur-md shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-[#3B82F6] hover:text-[#2563EB] transition-colors"
          >
            Nau.
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                    : 'text-[#3D4852] hover:text-[#3B82F6] hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleClick}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  otherDropdownOpen
                    ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                    : 'text-[#3D4852] hover:text-[#3B82F6] hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]'
                )}
              >
                Other
                <ChevronDown
                  size={16}
                  className={cn(
                    'transition-transform duration-200',
                    otherDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {otherDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 py-2 rounded-xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-in slide-in-from-top-2 fade-in duration-200">
                  {OTHER_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isExternal = link.external;
                    const isActive = pathname === link.href;

                    if (isExternal) {
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm text-[#3D4852] hover:text-[#3B82F6] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transition-all duration-200"
                          onClick={handleLinkClick}
                        >
                          <Icon
                            size={18}
                            className="transition-transform duration-200 group-hover:scale-110"
                          />
                          <span className="flex-1">{link.label}</span>
                          <ExternalLink
                            size={14}
                            className="text-[#6B7280] transition-opacity duration-200 group-hover:opacity-100 opacity-60"
                          />
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-200',
                          isActive
                            ? 'text-[#3B82F6] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]'
                            : 'text-[#3D4852] hover:text-[#3B82F6] hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]'
                        )}
                        onClick={handleLinkClick}
                      >
                        <Icon
                          size={18}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                        <span className="flex-1">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
