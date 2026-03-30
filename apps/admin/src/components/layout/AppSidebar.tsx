'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Link as LinkIcon,
  Send,
  User,
  BarChart3,
  LogOut,
  Lock,
  FileText,
  BookOpen,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  session: Session | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'About Me', href: '/about', icon: User },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Contact', href: '/contacts', icon: Send },
  { name: 'Links', href: '/links', icon: LinkIcon },
  { name: 'AI Service', href: '/knowledge', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

function NeuBadge({ count }: { count: number }) {
  return (
    <span
      className={cn(
        'ml-auto flex h-5 min-w-5 items-center justify-center',
        'rounded-full px-1.5 text-xs font-bold text-white',
        'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
        'shadow-[2px_2px_4px_rgba(108,99,255,0.4),-1px_-1px_3px_rgba(139,132,255,0.3)]',
        'animate-pulse'
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

function NeuAvatar({
  image,
  name,
  initial,
  size = 'md',
}: {
  image?: string | null;
  name: string;
  initial: string;
  size?: 'sm' | 'md';
}) {
  const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const insetShadow = cn(
    'rounded-full',
    'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
    'bg-[#E0E5EC]'
  );

  if (image) {
    return (
      <div className={cn(insetShadow, sizeClasses, 'p-0.5')}>
        <img src={image} alt={name} className="h-full w-full rounded-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        insetShadow,
        sizeClasses,
        'flex items-center justify-center',
        'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
        'text-white font-semibold',
        textSize
      )}
    >
      {initial}
    </div>
  );
}

export function AppSidebar({ session }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [contactUpdatesCount, setContactUpdatesCount] = useState(0);

  const isCollapsed = state === 'collapsed';

  useEffect(() => {
    const controller = new AbortController();

    async function fetchContactUpdates() {
      try {
        const [contactsResponse, messagesResponse, bookingsResponse] = await Promise.all([
          fetch('/api/v1/admin/contacts', { signal: controller.signal }),
          fetch('/api/v1/admin/messages', { signal: controller.signal }),
          fetch('/api/v1/admin/bookings?limit=100', { signal: controller.signal }),
        ]);

        const [contactsData, messagesData, bookingsData] = await Promise.all([
          contactsResponse.json(),
          messagesResponse.json(),
          bookingsResponse.json(),
        ]);

        const unreadContacts = contactsData.success ? (contactsData.data.unreadCount ?? 0) : 0;
        const unreadMessages = messagesData.success ? (messagesData.data.unreadCount ?? 0) : 0;
        const pendingBookings =
          bookingsData.success && Array.isArray(bookingsData.data)
            ? bookingsData.data.filter(
                (booking: { status: string }) => booking.status === 'PENDING'
              ).length
            : 0;

        setContactUpdatesCount(unreadContacts + unreadMessages + pendingBookings);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          void error;
        }
      }
    }

    fetchContactUpdates();

    const interval = setInterval(fetchContactUpdates, 30000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const user = session?.user;
  const userName = user?.name || 'Admin User';
  const userEmail = user?.email || '';
  const userImage = user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className={cn(
          'bg-[#E0E5EC] border-none',
          'shadow-[4px_0_15px_rgba(163,177,198,0.3)]',
          'transition-all duration-300 ease-out',
          'overflow-hidden'
        )}
      >
        <SidebarHeader className="p-4 pb-6">
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                'bg-[#E0E5EC]',
                'shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.5)]'
              )}
            >
              <Lock className="h-5 w-5 text-[#3B82F6]" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-[#3D4852] tracking-tight">
                  NaufalRF Portfolio
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280] font-medium">Access Restricted</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]',
                      'text-white shadow-sm'
                    )}
                  >
                    Authorized
                  </span>
                </div>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 overflow-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  const showBadge = item.href === '/contacts' && contactUpdatesCount > 0;

                  const buttonContent = (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? item.name : undefined}
                      className={cn(
                        'rounded-2xl min-h-[44px] px-3',
                        'transition-all duration-300 ease-out',
                        'border-none outline-none',
                        'overflow-hidden',
                        isCollapsed && 'w-full flex items-center justify-center',
                        isActive
                          ? cn(
                              'bg-[#E0E5EC]',
                              'shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]',
                              'text-[#3B82F6] font-medium'
                            )
                          : cn(
                              'bg-transparent text-[#6B7280]',
                              'hover:bg-[#E0E5EC]',
                              'hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]',
                              'hover:text-[#3D4852]',
                              'hover:scale-[1.02]',
                              'active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
                              'active:scale-[0.98]'
                            )
                      )}
                    >
                      <Link href={item.href} className="flex w-full items-center justify-between">
                        <div
                          className={cn(
                            'flex items-center gap-3',
                            isCollapsed && 'justify-center w-full'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5 shrink-0 transition-colors duration-300',
                              isActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'
                            )}
                          />
                          {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {showBadge && !isCollapsed && <NeuBadge count={contactUpdatesCount} />}
                      </Link>
                    </SidebarMenuButton>
                  );

                  return (
                    <SidebarMenuItem key={item.name}>
                      {isCollapsed && showBadge ? (
                        <div className="relative flex items-center justify-center">
                          {buttonContent}
                          <span
                            className={cn(
                              'absolute right-0 top-0 flex h-4 w-4 items-center justify-center',
                              'rounded-full text-[10px] font-bold text-white',
                              'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]',
                              'shadow-[1px_1px_3px_rgba(108,99,255,0.4)]',
                              'animate-pulse'
                            )}
                          >
                            {contactUpdatesCount > 9 ? '9+' : contactUpdatesCount}
                          </span>
                        </div>
                      ) : (
                        buttonContent
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 pt-6">
          <div
            className={cn(
              'rounded-2xl p-3',
              'bg-[#E0E5EC]',
              'shadow-[5px_5px_10px_rgba(163,177,198,0.5),-5px_-5px_10px_rgba(255,255,255,0.5)]'
            )}
          >
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <NeuAvatar
                image={userImage}
                name={userName}
                initial={userInitial}
                size={isCollapsed ? 'sm' : 'md'}
              />

              {!isCollapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#3D4852]">{userName}</p>
                    <p className="truncate text-xs text-[#6B7280]">{userEmail}</p>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleSignOut}
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                          'bg-[#E0E5EC] text-[#6B7280]',
                          'transition-all duration-300 ease-out',
                          'hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]',
                          'hover:text-[#EF4444] hover:scale-105',
                          'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
                          'active:scale-95'
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#3D4852] text-white border-none">
                      Sign out
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>

            {isCollapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      'mt-3 flex h-8 w-full items-center justify-center rounded-xl',
                      'bg-[#E0E5EC] text-[#6B7280]',
                      'transition-all duration-300 ease-out',
                      'hover:shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]',
                      'hover:text-[#EF4444]',
                      'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#3D4852] text-white border-none">
                  Sign out
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
