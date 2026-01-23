'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  ExternalLink,
  User,
  MessageSquare,
  Mail,
  Send,
  Calendar,
  BarChart3,
  Settings,
  MoreHorizontal,
  X,
  Bot,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUnreadCount() {
      try {
        const response = await fetch('/api/v1/admin/messages', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.data.unreadCount);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          void error;
        }
      }
    }

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMoreOpen]);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const allNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Contacts', href: '/contacts', icon: Send },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
    { name: 'Links', href: '/links', icon: ExternalLink },
    { name: 'About', href: '/about', icon: User },
    { name: 'Guestbook', href: '/guestbook', icon: MessageSquare },
    { name: 'Messages', href: '/messages', icon: Mail, badge: unreadCount },
    { name: 'Knowledge', href: '/knowledge', icon: FileText },
    { name: 'Chat Logs', href: '/chat-logs', icon: Bot },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const primaryItems = allNavItems.slice(0, 4);
  const moreItems = allNavItems.slice(4);

  const isActiveInMoreMenu = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  const hasMoreBadges = moreItems.some((item) => item.badge !== undefined && item.badge > 0);

  const handleNavClick = useCallback(
    (href: string) => {
      router.push(href);
      setIsMoreOpen(false);
    },
    [router]
  );

  const toggleMoreMenu = useCallback(() => {
    setIsMoreOpen((prev) => !prev);
  }, []);

  function renderNavButton(item: NavItem, size: 'normal' | 'compact' = 'normal') {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;
    const showBadge = item.badge !== undefined && item.badge > 0;
    const isCompact = size === 'compact';

    return (
      <button
        key={item.name}
        type="button"
        onClick={() => handleNavClick(item.href)}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleNavClick(item.href);
        }}
        className={cn(
          'relative flex items-center justify-center',
          isCompact ? 'h-11 w-11' : 'h-12 w-12',
          'rounded-full',
          'transition-all duration-300 ease-out',
          'touch-manipulation cursor-pointer',
          isActive
            ? cn(
                'bg-[#3B82F6]/10',
                'shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
              )
            : cn(
                'bg-transparent',
                'hover:bg-[#E0E5EC]',
                'hover:shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                'active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]'
              )
        )}
        aria-label={item.name}
        title={item.name}
      >
        <Icon
          className={cn(
            isCompact ? 'h-[18px] w-[18px]' : 'h-5 w-5',
            'transition-colors duration-300',
            isActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'
          )}
        />
        {showBadge && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'flex h-5 min-w-5 items-center justify-center',
              'rounded-full px-1.5',
              'text-[10px] font-bold text-white',
              'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
              'shadow-[2px_2px_4px_rgba(108,99,255,0.4),-1px_-1px_3px_rgba(139,132,255,0.3)]',
              'animate-pulse'
            )}
          >
            {item.badge && item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </button>
    );
  }

  function renderNavButtonWithLabel(item: NavItem) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;
    const showBadge = item.badge !== undefined && item.badge > 0;

    return (
      <button
        key={item.name}
        type="button"
        onClick={() => handleNavClick(item.href)}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleNavClick(item.href);
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-1',
          'min-h-[56px] min-w-[72px] p-2',
          'rounded-xl',
          'transition-all duration-300 ease-out',
          'touch-manipulation cursor-pointer',
          isActive
            ? cn(
                'bg-[#3B82F6]/10',
                'shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
              )
            : cn(
                'bg-[#E0E5EC]',
                'shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                'hover:shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.5)]',
                'active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]'
              )
        )}
        aria-label={item.name}
      >
        <div className="relative">
          <Icon
            className={cn(
              'h-5 w-5 transition-colors duration-300',
              isActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'
            )}
          />
          {showBadge && (
            <span
              className={cn(
                'absolute -top-2 -right-2',
                'flex h-4 min-w-4 items-center justify-center',
                'rounded-full px-1',
                'text-[9px] font-bold text-white',
                'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
                'shadow-[1px_1px_2px_rgba(108,99,255,0.4)]'
              )}
            >
              {item.badge && item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </div>
        <span
          className={cn(
            'text-[10px] font-medium transition-colors duration-300',
            isActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'
          )}
        >
          {item.name}
        </span>
      </button>
    );
  }

  return (
    <div ref={moreMenuRef} className="md:hidden">
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          'transition-all duration-300 ease-out',
          isMoreOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMoreOpen(false)}
        />

        <div
          className={cn(
            'relative mx-4 mb-20',
            'p-4 rounded-2xl',
            'bg-transparent backdrop-blur-md',
            'shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]',
            'transition-all duration-300 ease-out',
            isMoreOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#374151] pl-1">More Options</h3>
            <button
              type="button"
              onClick={() => setIsMoreOpen(false)}
              className={cn(
                'flex items-center justify-center',
                'h-8 w-8 rounded-full',
                'transition-all duration-200',
                'bg-[#E0E5EC]',
                'shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                'active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]'
              )}
              aria-label="Close menu"
            >
              <X className="h-4 w-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {moreItems.map((item) => renderNavButtonWithLabel(item))}
          </div>
        </div>
      </div>

      <nav
        className={cn('fixed bottom-0 left-0 right-0 z-50', 'pb-[env(safe-area-inset-bottom,8px)]')}
      >
        <div
          className={cn(
            'mx-4 mb-2',
            'flex items-center justify-around gap-1',
            'px-2 py-2 rounded-full',
            'bg-[#E0E5EC]',
            'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
          )}
        >
          {primaryItems.map((item) => renderNavButton(item))}

          <button
            type="button"
            onClick={toggleMoreMenu}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMoreMenu();
            }}
            className={cn(
              'relative flex items-center justify-center',
              'h-12 w-12 rounded-full',
              'transition-all duration-300 ease-out',
              'touch-manipulation cursor-pointer',
              isMoreOpen || isActiveInMoreMenu
                ? cn(
                    'bg-[#3B82F6]/10',
                    'shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
                  )
                : cn(
                    'bg-transparent',
                    'hover:bg-[#E0E5EC]',
                    'hover:shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                    'active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]'
                  )
            )}
            aria-label="More options"
            aria-expanded={isMoreOpen}
          >
            <MoreHorizontal
              className={cn(
                'h-5 w-5 transition-all duration-300',
                isMoreOpen
                  ? 'text-[#3B82F6] rotate-90'
                  : isActiveInMoreMenu
                    ? 'text-[#3B82F6]'
                    : 'text-[#6B7280]'
              )}
            />
            {hasMoreBadges && !isMoreOpen && (
              <span
                className={cn(
                  'absolute top-0 right-0',
                  'h-3 w-3 rounded-full',
                  'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
                  'shadow-[1px_1px_2px_rgba(108,99,255,0.4)]',
                  'animate-pulse'
                )}
              />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
