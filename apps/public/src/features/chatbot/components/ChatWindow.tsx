'use client';

import { cn } from '@/src/lib/utils';
import { useChat } from '../hooks';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { AlertCircle } from 'lucide-react';

interface ChatWindowProps {
  onClose?: () => void;
  onToggleSize?: () => void;
  isFullPage?: boolean;
  isExpanded?: boolean;
  className?: string;
}

export function ChatWindow({
  onClose,
  onToggleSize,
  isFullPage = false,
  isExpanded = false,
  className,
}: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  return (
    <div
      className={cn(
        'flex flex-col bg-[#F0F4F8] rounded-2xl overflow-hidden',
        'shadow-[12px_12px_24px_rgba(163,177,198,0.5),-12px_-12px_24px_rgba(255,255,255,0.5)]',
        isFullPage ? 'h-full' : 'h-[500px]',
        className
      )}
    >
      <ChatHeader
        onClose={onClose || (() => {})}
        onClear={clearMessages}
        onToggleSize={onToggleSize}
        isFullPage={isFullPage}
        isExpanded={isExpanded}
      />

      <MessageList messages={messages} isLoading={isLoading} />

      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
