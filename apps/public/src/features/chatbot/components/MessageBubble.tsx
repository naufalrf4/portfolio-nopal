'use client';

import { cn } from '@/src/lib/utils';
import { formatDistanceToNow } from '@/src/lib/utils';
import { User, Bot } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3B82F6] shadow-[4px_4px_8px_rgba(59,130,246,0.3),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white rounded-br-md shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]'
            : 'bg-[#E0E5EC] text-[#3D4852] rounded-bl-md shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.5)]'
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

        <div className={cn('text-xs mt-2', isUser ? 'text-white/70' : 'text-[#6B7280]')}>
          {formatDistanceToNow(new Date(message.timestamp))}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center">
          <User size={18} className="text-[#3B82F6]" />
        </div>
      )}
    </div>
  );
}
