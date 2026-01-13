'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { formatDistanceToNow } from '@/src/lib/utils';
import { MessageCircle, Bot, User } from 'lucide-react';
import type { Message } from '@/src/features/chatbot/types';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageThread({ messages, isLoading }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <div
            className={cn(
              'w-20 h-20 mb-6 rounded-2xl',
              'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
              'shadow-[8px_8px_16px_rgba(59,130,246,0.4),-8px_-8px_16px_rgba(255,255,255,0.3)]',
              'flex items-center justify-center'
            )}
          >
            <MessageCircle size={40} className="text-white" />
          </div>
          <h3 className="font-semibold text-xl text-[#3D4852] mb-2">Start a conversation</h3>
          <p className="text-[#6B7280] max-w-md">
            Ask me anything about my projects, experience, or skills. I'm here to help you learn
            more about my work!
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-4 justify-start">
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
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500',
        isUser ? 'justify-end' : 'justify-start'
      )}
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

      <div className="flex flex-col gap-2 max-w-[70%]">
        <div
          className={cn(
            'rounded-2xl px-5 py-4',
            isUser
              ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white rounded-tr-md shadow-[8px_8px_16px_rgba(59,130,246,0.5),-8px_-8px_16px_rgba(255,255,255,0.3)]'
              : 'bg-[#E0E5EC] text-[#3D4852] rounded-tl-md shadow-[8px_8px_16px_rgba(163,177,198,0.5),-8px_-8px_16px_rgba(255,255,255,0.5)]'
          )}
        >
          <div className={cn('text-sm leading-relaxed', isUser ? 'text-white' : 'text-[#3D4852]')}>
            {isUser ? (
              message.content
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={line ? '' : 'h-2'}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'text-xs px-1',
            isUser ? 'text-right text-[#6B7280]' : 'text-left text-[#6B7280]'
          )}
        >
          {formatDistanceToNow(new Date(message.timestamp))}
        </div>
      </div>

      {isUser && (
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl',
            'bg-[#E0E5EC]',
            'shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.5)]',
            'flex items-center justify-center'
          )}
        >
          <User size={20} className="text-[#3B82F6]" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '0ms', animationDuration: '600ms' }}
      />
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '150ms', animationDuration: '600ms' }}
      />
      <div
        className={cn('w-2 h-2 rounded-full bg-[#6B7280]', 'animate-bounce')}
        style={{ animationDelay: '300ms', animationDuration: '600ms' }}
      />
    </div>
  );
}
