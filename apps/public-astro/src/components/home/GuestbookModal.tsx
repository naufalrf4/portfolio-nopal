import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Chrome, Send, UserCircle2 } from 'lucide-react';
import { getBrowserTimezone } from '@/lib/submission-context';
import { NeuButton } from '../shared/NeuButton';
import { NeuTextarea } from '../shared/NeuTextarea';
import { ResponsiveModal } from '../shared/ResponsiveModal';
import { TurnstileWidget } from '../shared/TurnstileWidget';

interface GuestbookUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  token: string;
}

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GuestbookUser | null;
  onSuccess: () => Promise<void> | void;
}

const CALLBACK_URL = '/#guestbook';

export function GuestbookModal({ isOpen, onClose, user, onSuccess }: GuestbookModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const siteKey = useMemo(() => import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '', []);
  const hasTurnstile = siteKey.length > 0;
  const shouldShowTurnstile = message.trim().length > 0;

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setError(null);
      setTurnstileToken('');
      setTurnstileError(null);
      setTurnstileResetKey((value) => value + 1);
      setIsSigningIn(false);
    }
  }, [isOpen]);

  function handleGoogleSignIn(): void {
    setError(null);
    setIsSigningIn(true);

    const redirectUrl = new URL('/api/auth/guestbook-start', window.location.origin);
    redirectUrl.searchParams.set('callbackUrl', CALLBACK_URL);
    window.location.href = redirectUrl.toString();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!user?.email || !user.token) {
      setError('Sign in with Google before posting to the guestbook.');
      return;
    }

    if (!message.trim()) {
      setError('Please write a message first.');
      return;
    }

    if (hasTurnstile && !turnstileToken) {
      setError('Complete the CAPTCHA verification before posting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          guestbookToken: user.token,
          turnstileToken: turnstileToken || undefined,
          timezone: getBrowserTimezone(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: { message?: string };
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message || 'Failed to submit guestbook entry.');
      }

      setMessage('');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      await onSuccess();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Failed to submit guestbook entry.'
      );
      if (hasTurnstile) {
        setTurnstileToken('');
        setTurnstileResetKey((value) => value + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isComposerMode = Boolean(user?.email);
  const title = isComposerMode ? 'Leave a message' : 'Sign in for guestbook';
  const description = isComposerMode
    ? 'Share a short note, greeting, or memory. Your message will appear publicly in the guestbook.'
    : 'Continue with Google to leave a message.';

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      titleId="guestbook-modal-title"
      description={description}
      disableClose={isSubmitting || isSigningIn}
      contentClassName="bg-[linear-gradient(160deg,rgba(238,243,249,0.48),rgba(220,230,241,0.42))]"
      bodyClassName="px-5 pb-5 md:px-7 md:pb-6"
      footer={
        isComposerMode ? (
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <NeuButton type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} data-analytics-button data-entity-type="guestbook_modal_cancel" data-entity-id="guestbook-modal" data-entity-label="Cancel guestbook compose">
              Cancel
            </NeuButton>
            <NeuButton
              type="submit"
              form="guestbook-modal-form"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!message.trim() || (hasTurnstile && !turnstileToken)}
            >
              <Send size={18} className="mr-2" />
              Send message
            </NeuButton>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <NeuButton type="button" variant="ghost" onClick={onClose} disabled={isSigningIn} data-analytics-button data-entity-type="guestbook_signin_cancel" data-entity-id="guestbook-signin" data-entity-label="Close guestbook sign in">
              Maybe later
            </NeuButton>
            <NeuButton
              type="button"
              variant="primary"
              isLoading={isSigningIn}
              onClick={handleGoogleSignIn}
            >
              <Chrome size={18} className="mr-2" />
              Continue with Google
            </NeuButton>
          </div>
        )
      }
    >
      {isComposerMode ? (
        <>
          <div className="mb-5 rounded-[24px] bg-white/28 p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),0_14px_30px_rgba(135,157,183,0.12)] ring-1 ring-white/28 backdrop-blur-xl md:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
              Posting as
            </p>
            <p className="mt-1 text-sm font-medium text-[#3D4852] md:text-base">
              {user?.name || user?.email}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] md:text-sm">{user?.email}</p>
          </div>

          <form id="guestbook-modal-form" onSubmit={handleSubmit} className="space-y-5">
            <NeuTextarea
              label="Message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write something kind, memorable, or useful..."
              rows={8}
              maxLength={500}
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-between text-xs text-[#6B7280] md:text-sm">
              <span>Keep it respectful and concise.</span>
              <span>{message.length}/500</span>
            </div>

            {(!hasTurnstile || shouldShowTurnstile) && (
              <TurnstileWidget
                resetKey={turnstileResetKey}
                onTokenChange={setTurnstileToken}
                onErrorChange={setTurnstileError}
              />
            )}

            {turnstileError ? (
              <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={16} />
                <span>{turnstileError}</span>
              </div>
            ) : null}

            {error ? (
              <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            ) : null}
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[28px] bg-white/24 p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),0_16px_32px_rgba(135,157,183,0.12)] ring-1 ring-white/28 backdrop-blur-xl md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0E5EC] text-[#3B82F6] shadow-[6px_6px_12px_rgba(163,177,198,0.52),-6px_-6px_12px_rgba(255,255,255,0.52)]">
                <UserCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3D4852]">Sign in with Google</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
                  You will come right back here and the guestbook composer will open automatically.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      )}
    </ResponsiveModal>
  );
}
