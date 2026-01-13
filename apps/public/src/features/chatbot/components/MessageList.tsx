'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { MessageCircle, Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-4',
        'scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-transparent'
      )}
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-[#3B82F6] shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)] flex items-center justify-center">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h3 className="font-semibold text-[#3D4852] mb-2">Start a conversation</h3>
          <p className="text-sm text-[#6B7280]">
            Ask me anything about my projects, experience, or skills!
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3B82F6] shadow-[4px_4px_8px_rgba(59,130,246,0.3),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className="bg-[#E0E5EC] rounded-2xl rounded-bl-md shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.5)]">
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
