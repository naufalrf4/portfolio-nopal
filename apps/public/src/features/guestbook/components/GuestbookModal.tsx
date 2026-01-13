'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NeuTextarea, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Send, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      await api.guestbook.create({
        message: message.trim(),
        userEmail,
      });
      setMessage('');
      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-full max-w-md bg-[#E0E5EC]',
          'shadow-[-12px_0_24px_rgba(163,177,198,0.5),12px_0_24px_rgba(255,255,255,0.5)]',
          'animate-in slide-in-from-right duration-300 ease-out',
          'md:relative md:inset-auto md:shadow-none md:w-full md:max-w-lg',
          'md:animate-in md:zoom-in-95 md:fade-in md:duration-200',
          'flex flex-col'
        )}
      >
        <div className="sticky top-0 bg-[#E0E5EC] z-10 p-4 md:p-6 border-b border-[#d1d5db]/30 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#3D4852] mb-1">Leave a Message</h2>
            <p className="text-sm text-[#6B7280]">Share your thoughts and say hello!</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#D4D9E2]/50 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <NeuTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
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
                Send Message
              </NeuButton>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50/90 rounded-xl border border-red-200">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
