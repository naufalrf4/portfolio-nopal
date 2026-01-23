'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { cn } from '@/src/lib/utils';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue('');
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="p-4 border-t border-[#D1D5DB]/50 bg-[#F0F4F8]">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className={cn(
            'flex-1 px-4 py-3 rounded-xl bg-[#E0E5EC] text-[#3D4852]',
            'shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.5)]',
            'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50',
            'placeholder:text-[#6B7280]',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Chat message input"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className={cn(
            'px-4 py-3 rounded-xl',
            'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white',
            'shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]',
            'hover:shadow-[8px_8px_16px_rgba(59,130,246,0.5),-8px_-8px_16px_rgba(255,255,255,0.4)]',
            'hover:scale-105',
            'active:scale-95',
            'active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
