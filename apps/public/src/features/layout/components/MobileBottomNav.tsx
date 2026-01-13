'use client';

import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, FolderKanban, FileText, Mail, MoreHorizontal, X, ExternalLink } from 'lucide-react';
import { OTHER_LINKS } from '@/src/lib/constants';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/blogs', label: 'Blogs', icon: FileText },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <>
      {otherOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOtherOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div
            className="absolute bottom-24 right-4 w-56 py-3 rounded-2xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pb-2 mb-2 border-b border-[#d1d5db]">
              <span className="text-sm font-semibold text-[#3D4852]">Other Links</span>
              <button
                onClick={() => setOtherOpen(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#3B82F6]"
              >
                <X size={18} />
              </button>
            </div>

            {OTHER_LINKS.map((link) => {
              const Icon = link.icon;
              const LinkComponent = link.external ? 'a' : Link;
              const linkProps = link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  {...linkProps}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#3D4852] hover:text-[#3B82F6] hover:bg-[#E0E5EC]/50 transition-colors"
                  onClick={() => setOtherOpen(false)}
                >
                  <Icon size={20} />
                  <span className="flex-1">{link.label}</span>
                  {link.external && <ExternalLink size={14} className="text-[#6B7280]" />}
                </LinkComponent>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 safe-area-pb">
        <div className="flex items-center justify-around px-1 py-2 rounded-2xl bg-[#E0E5EC] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-[#3B82F6] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
                    : 'text-[#6B7280] hover:text-[#3B82F6]'
                )}
                aria-label={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setOtherOpen(!otherOpen)}
            className={cn(
              'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1.5 rounded-xl transition-all duration-200',
              otherOpen
                ? 'text-[#3B82F6] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
                : 'text-[#6B7280] hover:text-[#3B82F6]'
            )}
            aria-label="Other links"
          >
            <MoreHorizontal size={20} strokeWidth={otherOpen ? 2.5 : 2} />
            <span className="text-[10px] mt-0.5 font-medium">Other</span>
          </button>
        </div>
      </nav>
    </>
  );
}
