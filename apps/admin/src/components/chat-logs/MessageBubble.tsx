'use client';

import { cn } from '@/lib/utils';
import { User, Bot, Clock, Cpu, Zap, Hash } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    provider?: string;
    tokens?: number;
    duration?: number;
  };
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div
          className={cn(
            'px-4 py-2 rounded-xl text-sm text-[#6B7280] bg-[#E0E5EC]',
            '[box-shadow:inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]'
          )}
        >
          <span className="italic">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          'bg-[#E0E5EC]',
          isUser
            ? '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]'
            : '[box-shadow:inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-[#3B82F6]" />
        ) : (
          <Bot className="h-5 w-5 text-[#38B2AC]" />
        )}
      </div>

      <div className={cn('flex flex-col max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            'bg-[#E0E5EC]',
            isUser
              ? '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] rounded-tr-sm'
              : '[box-shadow:inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] rounded-tl-sm'
          )}
        >
          <p className="text-[#3D4852] whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 mt-1.5 px-2">
          <span className="text-xs text-[#6B7280] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(message.timestamp)}
          </span>

          {!isUser && message.metadata && (
            <>
              {message.metadata.model && (
                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  {message.metadata.model}
                </span>
              )}
              {message.metadata.tokens !== undefined && (
                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {message.metadata.tokens} tokens
                </span>
              )}
              {message.metadata.duration !== undefined && (
                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {(message.metadata.duration / 1000).toFixed(2)}s
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
