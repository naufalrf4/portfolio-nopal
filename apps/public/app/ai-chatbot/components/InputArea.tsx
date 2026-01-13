'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { cn } from '@/src/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function InputArea({ onSend, isLoading }: InputAreaProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue('');
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="p-6 border-t border-[#D1D5DB]/50 bg-[#F0F4F8]">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              disabled={isLoading}
              rows={1}
              className={cn(
                'w-full px-5 py-4 rounded-xl bg-[#E0E5EC] text-[#3D4852]',
                'shadow-[inset_8px_8px_16px_rgba(163,177,198,0.6),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]',
                'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50',
                'placeholder:text-[#6B7280]',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'resize-none min-h-[56px] max-h-[200px]'
              )}
              aria-label="Chat message input"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              'px-6 py-4 rounded-xl',
              'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white',
              'shadow-[8px_8px_16px_rgba(59,130,246,0.5),-8px_-8px_16px_rgba(255,255,255,0.3)]',
              'hover:shadow-[10px_10px_20px_rgba(59,130,246,0.6),-10px_-10px_20px_rgba(255,255,255,0.4)]',
              'hover:scale-105',
              'active:scale-95',
              'active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'transition-all duration-200',
              'flex items-center justify-center gap-2'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="hidden sm:inline">Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-[#6B7280] mt-3 text-center">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
