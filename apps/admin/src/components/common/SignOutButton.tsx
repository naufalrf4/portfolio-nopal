'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const neuStyles = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  blue: '#3B82F6',
  extruded: '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
};

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] touch-manipulation"
      style={{
        background: neuStyles.blue,
        color: '#FFFFFF',
        boxShadow: `6px 6px 12px rgba(59,130,246,0.4), -6px -6px 12px rgba(255,255,255,0.5)`,
      }}
    >
      <LogOut className="h-5 w-5" />
      <span>Sign Out</span>
    </button>
  );
}
