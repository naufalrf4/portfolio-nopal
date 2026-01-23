'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { MessageCircle, Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  shouldScrollToBottom?: boolean;
}

export function MessageList({
  messages,
  isLoading,
  shouldScrollToBottom = false,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const hasNewMessage = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (hasNewMessage && shouldScrollToBottom) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages.length, shouldScrollToBottom]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(scrollToBottom, 50);
    }
  }, [isLoading]);

  useEffect(() => {
    if (shouldScrollToBottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-y-auto p-4',
          'scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-transparent'
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div
              className={cn(
                'w-16 h-16 mx-auto rounded-2xl',
                'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
                'shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]',
                'flex items-center justify-center'
              )}
            >
              <MessageCircle size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#3D4852] text-center">
              Start a Conversation
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed text-center">
              Ask me anything about my portfolio, projects, or experience!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-4',
        'scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-transparent'
      )}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3B82F6] shadow-[4px_4px_8px_rgba(59,130,246,0.3),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className="bg-[#E0E5EC] rounded-2xl rounded-bl-md px-4 py-3 shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.5)]">
            <div className="text-sm text-[#6B7280] font-medium">Thinking...</div>
          </div>
        </div>
      )}
    </div>
  );
}
