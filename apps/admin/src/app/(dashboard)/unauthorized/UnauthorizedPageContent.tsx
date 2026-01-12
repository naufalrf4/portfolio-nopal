'use client';

import { signOut } from 'next-auth/react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnauthorizedPageContentProps {
  userEmail: string;
}

export function UnauthorizedPageContent({ userEmail }: UnauthorizedPageContentProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E0E5EC]">
      <div
        className={cn(
          'max-w-lg w-full p-8 rounded-3xl',
          'bg-[#E0E5EC]',
          'shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]'
        )}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-full',
              'bg-[#E0E5EC]',
              'shadow-[inset_8px_8px_16px_rgba(163,177,198,0.6),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]'
            )}
          >
            <Lock className="h-10 w-10 text-[#EF4444]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-[#3D4852]">
              Access Denied
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed">
              This account does not have access to NaufalRF Portfolio Admin.
              <br />
              Please contact the administrator.
            </p>
          </div>

          <div
            className={cn(
              'w-full p-4 rounded-2xl',
              'bg-[#E0E5EC]',
              'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
            )}
          >
            <p className="text-sm text-[#6B7280]">Account email:</p>
            <p className="text-base font-semibold text-[#3D4852] mt-1 break-all">{userEmail}</p>
          </div>

          <button
            onClick={handleSignOut}
            type="button"
            className={cn(
              'w-full py-3 px-6 rounded-2xl',
              'bg-[#E0E5EC] text-[#EF4444] font-semibold',
              'transition-all duration-300 ease-out',
              'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
              'hover:shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)]',
              'hover:scale-[1.02]',
              'active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
              'active:scale-[0.98]'
            )}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
