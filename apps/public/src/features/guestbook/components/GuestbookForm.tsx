'use client';

import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { NeuTextarea, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api/client';
import { Send, AlertCircle } from 'lucide-react';

interface GuestbookFormProps {
  onSuccess?: () => void;
}

export function GuestbookForm({ onSuccess }: GuestbookFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      await api.guestbook.create(message.trim());
      setMessage('');
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to post message. Please sign in first.'
      );
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
          disabled={!message.trim()}
        >
          <Send size={16} className="mr-2" />
          Post
        </NeuButton>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
