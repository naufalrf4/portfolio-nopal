import type { ReactNode } from 'react';
import { safeAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ThemeToggler } from '@/components/layout/ThemeToggler';
import { WibClock } from '@/components/layout/WibClock';
import { isEmailAllowed } from '@/lib/auth-security';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await safeAuth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  if (!isEmailAllowed(session.user.email)) {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="hidden md:block">
          <AppSidebar session={session} />
        </div>

        <SidebarInset className="w-full bg-background">
          <header className="sticky top-0 z-40 hidden md:flex h-16 shrink-0 items-center gap-4 glass-bar px-4 md:px-6 lg:px-8">
            <SidebarTrigger className="icon-btn h-10 w-10 text-foreground/70 hover:text-foreground" />

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <WibClock />
              <ThemeToggler />
            </div>
          </header>

          <div className="divider-line mx-4 md:mx-6 lg:mx-8 hidden md:block" />

          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-8 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>

        <BottomNav />
      </SidebarProvider>
    </div>
  );
}
