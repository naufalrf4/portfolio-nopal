import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import type { Message } from './types';

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
          'flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.58),transparent_44%),linear-gradient(180deg,rgba(231,238,246,0.62),rgba(226,234,244,0.86))] p-5',
          'scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-transparent'
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div
              className={cn(
                'mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]',
                'bg-[linear-gradient(145deg,rgba(221,232,248,0.98),rgba(236,242,249,0.94))]',
                'shadow-[8px_8px_16px_rgba(163,177,198,0.28),-8px_-8px_16px_rgba(255,255,255,0.34)]'
              )}
            >
              <MessageCircle size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#3D4852] text-center">
              Start a Conversation
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed text-center">
              Ask about my work, random ideas, general knowledge, or just start a casual
              conversation.
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
        'flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.58),transparent_44%),linear-gradient(180deg,rgba(231,238,246,0.62),rgba(226,234,244,0.86))] p-5 space-y-4',
        'scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-transparent'
      )}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(59,130,246,0.96),rgba(37,99,235,0.96))] shadow-[4px_4px_10px_rgba(59,130,246,0.22),-4px_-4px_8px_rgba(255,255,255,0.25)]">
            <Bot size={18} className="text-white" />
          </div>
          <div className="rounded-2xl rounded-bl-md bg-[linear-gradient(145deg,rgba(223,233,245,0.98),rgba(237,242,248,0.94))] px-4 py-3 shadow-[6px_6px_12px_rgba(163,177,198,0.26),-6px_-6px_12px_rgba(255,255,255,0.34)]">
            <div className="text-sm text-[#6B7280] font-medium">Thinking...</div>
          </div>
        </div>
      )}
    </div>
  );
}
