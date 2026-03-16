import { useState, useCallback, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
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
    <div className="border-t border-[#C8D6E8]/70 bg-[linear-gradient(180deg,rgba(228,236,246,0.98),rgba(220,230,241,0.98))] p-4 md:p-5">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className={cn(
            'flex-1 rounded-[18px] bg-[linear-gradient(145deg,rgba(222,232,244,0.96),rgba(238,243,249,0.94))] px-4 py-3 text-[#3D4852]',
            'shadow-[inset_6px_6px_12px_rgba(163,177,198,0.34),inset_-6px_-6px_12px_rgba(255,255,255,0.42)]',
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
            'rounded-[18px] px-4 py-3',
            'bg-[linear-gradient(145deg,#3B82F6,#2563EB)] text-white',
            'shadow-[8px_8px_16px_rgba(59,130,246,0.28),-8px_-8px_16px_rgba(255,255,255,0.22)]',
            'hover:shadow-[10px_10px_18px_rgba(59,130,246,0.34),-10px_-10px_18px_rgba(255,255,255,0.26)]',
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
