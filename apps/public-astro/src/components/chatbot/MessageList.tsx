import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import type { Message } from './types';

const QUICK_PROMPTS = [
  'What projects have you built?',
  'What is your tech stack?',
  'Are you available for freelance work?',
  'Tell me about your experience',
];

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  shouldScrollToBottom?: boolean;
  onConfirmAction?: (messageId: string, confirm: boolean) => Promise<void>;
  onQuickPrompt?: (prompt: string) => void;
  confirmingMessageId?: string | null;
}

export function MessageList({
  messages,
  isLoading,
  shouldScrollToBottom = false,
  onConfirmAction,
  onQuickPrompt,
  confirmingMessageId = null,
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
          'flex-1 overflow-y-auto bg-bg-card p-5',
          'scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent'
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div
              className={cn(
                'mx-auto flex h-16 w-16 items-center justify-center rounded-xl',
                'border border-teal/30 bg-[var(--teal-soft)]'
              )}
            >
              <MessageCircle size={32} className="text-teal" />
            </div>
            <h3 className="text-lg font-semibold font-display text-text-primary text-center">
              Start a Conversation
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed text-center">
              Ask about my work, random ideas, general knowledge, or just start a casual
              conversation.
            </p>
            {onQuickPrompt && (
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onQuickPrompt(prompt)}
                    className={cn(
                      'rounded-full border border-line bg-bg-elevated px-3 py-1.5',
                      'text-xs font-medium text-text-secondary transition-colors',
                      'hover:border-teal/40 hover:text-teal hover:bg-[var(--teal-soft)]'
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto bg-bg-card p-5 space-y-4',
        'scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent'
      )}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onConfirmAction={onConfirmAction}
          isConfirming={confirmingMessageId === message.id}
        />
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal">
            <Bot size={18} className="text-bg" />
          </div>
          <div className="rounded-2xl rounded-bl-md border border-line bg-bg-elevated px-4 py-3">
            <div className="text-sm text-text-secondary font-medium">Thinking...</div>
          </div>
        </div>
      )}
    </div>
  );
}
