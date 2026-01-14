'use client';

import React, { useState, useRef } from 'react';
import { NeuTextarea, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Send, AlertCircle } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

interface GuestbookFormProps {
  userEmail: string;
  onSuccess?: () => void;
}

export function GuestbookForm({ userEmail, onSuccess }: GuestbookFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
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
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message. Please try again.');
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NeuTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Leave a message..."
        rows={3}
        maxLength={500}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6B7280]">{message.length}/500</span>
        <NeuButton
          type="submit"
          variant="accent"
          size="sm"
          isLoading={isLoading}
          disabled={!message.trim() || (TURNSTILE_SITE_KEY ? !turnstileToken : false)}
        >
          <Send size={16} className="mr-2" />
          Post
        </NeuButton>
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            options={{ theme: 'light' }}
            onSuccess={setTurnstileToken}
            onError={() => turnstileRef.current?.reset()}
            onExpire={() => turnstileRef.current?.reset()}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
