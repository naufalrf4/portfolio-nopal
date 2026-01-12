'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const MAX_CHARACTERS = 500;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface ApiResponse {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
}

export function MessageForm() {
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const charactersRemaining = MAX_CHARACTERS - message.length;
  const isOverLimit = charactersRemaining < 0;
  const isEmpty = message.trim().length === 0;
  const canSubmit = !isEmpty && !isOverLimit && formState !== 'loading';

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!canSubmit) return;

      setFormState('loading');
      setErrorMessage('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/public/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: message.trim() }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setErrorMessage('Too many messages. Please try again later.');
          } else if (data.error?.message) {
            setErrorMessage(data.error.message);
          } else {
            setErrorMessage('Failed to send message. Please try again.');
          }
          setFormState('error');
          return;
        }

        setFormState('success');
        setMessage('');
      } catch {
        setErrorMessage('Network error. Please check your connection.');
        setFormState('error');
      }
    },
    [canSubmit, message]
  );

  const handleReset = useCallback(() => {
    setFormState('idle');
    setErrorMessage('');
  }, []);

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center py-8 opacity-0 animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-[#38B2AC]/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#38B2AC]" />
        </div>
        <h2 className="text-xl font-semibold text-[#3D4852] mb-2">Message Sent!</h2>
        <p className="text-sm text-[#6B7280] text-center mb-6">
          Your anonymous message has been delivered.
        </p>
        <button
          onClick={handleReset}
          className="neu-button px-6 py-3 text-sm font-medium text-[#3D4852]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={5}
          maxLength={MAX_CHARACTERS + 50}
          disabled={formState === 'loading'}
          className="neu-textarea w-full px-4 py-3 text-[#3D4852] placeholder:text-[#A0AEC0] resize-none disabled:opacity-50"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={`text-xs font-medium transition-colors ${
              isOverLimit
                ? 'text-[#EF4444]'
                : charactersRemaining <= 50
                  ? 'text-[#F59E0B]'
                  : 'text-[#A0AEC0]'
            }`}
          >
            {charactersRemaining}
          </span>
        </div>
      </div>

      {formState === 'error' && errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="neu-button neu-button-primary w-full py-4 flex items-center justify-center gap-2 font-medium"
      >
        {formState === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
