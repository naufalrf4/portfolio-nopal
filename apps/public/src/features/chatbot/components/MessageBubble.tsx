'use client';

import { cn } from '@/src/lib/utils';
import { formatDistanceToNow } from '@/src/lib/utils';
import { SourcesList } from './SourcesList';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-[#3B82F6] text-white rounded-br-md'
            : 'bg-[#E0E5EC] text-[#3D4852] rounded-bl-md shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.4)]'
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

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesList sources={message.sources} />
        )}

        <div className={cn('text-xs mt-2', isUser ? 'text-white/70' : 'text-[#6B7280]')}>
          {formatDistanceToNow(new Date(message.timestamp))}
        </div>
      </div>
    </div>
  );
}
