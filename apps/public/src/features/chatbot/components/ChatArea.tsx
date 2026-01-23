'use client';

import { cn } from '@/src/lib/utils';
import { MessageThread } from './MessageThread';
import type { Message } from '@/src/features/chatbot/types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  shouldScrollToBottom?: boolean;
}

export function ChatArea({ messages, isLoading, shouldScrollToBottom = false }: ChatAreaProps) {
  return (
    <div
      className={cn(
        'flex-1 h-full overflow-y-auto p-6',
        'scrollbar-thin scrollbar-thumb-[#3B82F6] scrollbar-track-transparent'
      )}
    >
      <MessageThread
        messages={messages}
        isLoading={isLoading}
        shouldScrollToBottom={shouldScrollToBottom}
      />
    </div>
  );
}
