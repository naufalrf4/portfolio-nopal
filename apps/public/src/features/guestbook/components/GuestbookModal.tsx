'use client';

import React, { useState } from 'react';
import { ResponsiveModal } from '@/src/components/ui/responsive-modal';
import { NeuTextarea, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Send, AlertCircle } from 'lucide-react';
import { useLazyTurnstile, LazyTurnstile } from '@naufalrf/ui';
import { trackGuestbookEntry } from '@naufalrf/analytics';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSuccess: () => void;
}

export function GuestbookModal({ isOpen, onClose, userEmail, onSuccess }: GuestbookModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    shouldShowTurnstile,
    turnstileToken,
    turnstileRef,
    handleTurnstileSuccess,
    handleTurnstileError,
    handleTurnstileExpire,
    resetTurnstile,
    activateTurnstile,
    isTurnstileRequired,
  } = useLazyTurnstile(TURNSTILE_SITE_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isTurnstileRequired && !turnstileToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.guestbook.create({
        message: message.trim(),
        userEmail,
        turnstileToken: turnstileToken || '',
      } as any);
      setMessage('');
      resetTurnstile();
      trackGuestbookEntry();
      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message. Please try again.');
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <>
      <NeuButton variant="ghost" onClick={onClose} disabled={isLoading}>
        Cancel
      </NeuButton>
      <NeuButton
        type="submit"
        form="guestbook-form"
        variant="primary"
        isLoading={isLoading}
        disabled={!message.trim() || (isTurnstileRequired ? !turnstileToken : false)}
      >
        <Send size={16} className="mr-2" />
        Send Message
      </NeuButton>
    </>
  );

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onClose}
      title="Leave a Message"
      description="Share your thoughts and say hello!"
      footer={footer}
    >
      <form id="guestbook-form" onSubmit={handleSubmit} className="space-y-4">
        <NeuTextarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={activateTurnstile}
          onKeyDown={activateTurnstile}
          placeholder="Write your message here..."
          rows={6}
          maxLength={500}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">{message.length}/500</span>
        </div>

        {shouldShowTurnstile && (
          <LazyTurnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            theme="light"
            onSuccess={handleTurnstileSuccess}
            onError={handleTurnstileError}
            onExpire={handleTurnstileExpire}
          />
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50/90 rounded-xl border border-red-200">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </ResponsiveModal>
  );
}
