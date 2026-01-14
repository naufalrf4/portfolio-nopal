'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { formatDistanceToNow } from '@/src/lib/utils';
import { MessageCircle, Bot, User } from 'lucide-react';
import type { Message } from '@/src/features/chatbot/types';
import { MarkdownMessage } from '@/src/features/chatbot/components/MarkdownMessage';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  shouldScrollToBottom?: boolean;
}

export function MessageThread({
  messages,
  isLoading,
  shouldScrollToBottom = false,
}: MessageThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = () => {
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
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
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div
            className={cn(
              'w-20 h-20 mx-auto rounded-2xl',
              'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
              'shadow-[8px_8px_16px_rgba(59,130,246,0.4),-8px_-8px_16px_rgba(255,255,255,0.3)]',
              'flex items-center justify-center'
            )}
          >
            <MessageCircle size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#3D4852] text-center">Start a Conversation</h3>
          <p className="text-[#6B7280] leading-relaxed text-center">
            Ask me anything about my portfolio, projects, or experience. I'm here to help!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl mx-auto">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            key={message.id}
            className={cn('flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500', {
              'justify-end': isUser,
              'justify-start': !isUser,
            })}
          >
            {!isUser && (
              <div
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-xl',
                  'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
                  'shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]',
                  'flex items-center justify-center'
                )}
              >
                <Bot size={20} className="text-white" />
              </div>
            )}

            <div
              className={cn('max-w-[70%] rounded-2xl px-5 py-4 shadow-lg', {
                'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white rounded-br-md shadow-[8px_8px_16px_rgba(59,130,246,0.4),-8px_-8px_16px_rgba(255,255,255,0.3)]':
                  isUser,
                'bg-[#E0E5EC] text-[#3D4852] rounded-tl-md shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.5)]':
                  !isUser,
              })}
            >
              <MarkdownMessage content={message.content} isUser={isUser} />

              <div className={cn('text-xs mt-3', isUser ? 'text-white/70' : 'text-[#6B7280]')}>
                {formatDistanceToNow(new Date(message.timestamp))}
              </div>
            </div>

            {isUser && (
              <div
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-xl',
                  'bg-[#E0E5EC]',
                  'shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.4)]',
                  'flex items-center justify-center'
                )}
              >
                <User size={20} className="text-[#3B82F6]" />
              </div>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl',
              'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
              'shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]',
              'flex items-center justify-center'
            )}
          >
            <Bot size={20} className="text-white" />
          </div>
          <div
            className={cn(
              'bg-[#E0E5EC] rounded-2xl rounded-tl-md px-5 py-4',
              'shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.5)]'
            )}
          >
            <div className="text-sm text-[#6B7280] font-medium">Thinking...</div>
          </div>
        </div>
      )}
    </div>
  );
}
