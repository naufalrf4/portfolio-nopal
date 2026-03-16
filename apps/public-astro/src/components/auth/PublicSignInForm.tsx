import React, { useEffect, useMemo, useState } from 'react';
import { Chrome, UserCircle2 } from 'lucide-react';
import { NeuButton } from '../shared/NeuButton';
import { NeuCard } from '../shared/NeuCard';
import { getStoredGuestbookUser, setStoredGuestbookUser } from '@/lib/guestbookIdentity';

interface PublicSignInFormProps {
  callbackUrl?: string;
}

interface SyncedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export function PublicSignInForm({ callbackUrl = '/' }: PublicSignInFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nextUrl = useMemo(() => (callbackUrl.startsWith('/') ? callbackUrl : '/'), [callbackUrl]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isSynced = url.searchParams.get('guestbook_sync') === '1';
    const email = url.searchParams.get('guestbook_email');

    if (isSynced && email) {
      const syncedUser: SyncedUser = {
        id: email,
        email,
        name: url.searchParams.get('guestbook_name'),
        image: url.searchParams.get('guestbook_image'),
      };

      setStoredGuestbookUser(syncedUser);
      window.location.replace(nextUrl);
      return;
    }

    const stored = getStoredGuestbookUser();
    if (!stored) {
      return;
    }

    if (stored?.email) {
      window.location.replace(nextUrl);
    }
  }, [nextUrl]);

  function handleGoogleSignIn(): void {
    setError(null);
    setIsLoading(true);

    const redirectUrl = new URL('/api/auth/guestbook-start', window.location.origin);
    redirectUrl.searchParams.set('callbackUrl', nextUrl);
    window.location.href = redirectUrl.toString();
  }

  return (
    <NeuCard className="mx-auto max-w-xl p-6 md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0E5EC] text-[#3B82F6] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]">
          <UserCircle2 size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#3D4852]">Sign in for guestbook</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Continue with Google to create or refresh your guestbook identity through the Admin user
            system.
          </p>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

      <NeuButton
        type="button"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <Chrome size={18} className="mr-2" />
        Continue with Google
      </NeuButton>
    </NeuCard>
  );
}
