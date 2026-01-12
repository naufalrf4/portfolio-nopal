'use client';

import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, OTHER_LINKS } from '@/src/lib/constants';

export function Navbar() {
  const pathname = usePathname();
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto max-w-7xl rounded-2xl bg-[#E0E5EC]/80 backdrop-blur-md shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-[#3D4852] hover:text-[#3B82F6] transition-colors"
          >
            NaufalRF
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
              className="relative"
              onMouseEnter={() => setOtherDropdownOpen(true)}
              onMouseLeave={() => setOtherDropdownOpen(false)}
            >
              <button
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
                <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
                  {OTHER_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#3D4852] hover:text-[#3B82F6] hover:bg-[#E0E5EC]/50 transition-colors"
                      >
                        <Icon size={18} />
                        <span className="flex-1">{link.label}</span>
                        <ExternalLink size={14} className="text-[#6B7280]" />
                      </a>
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
