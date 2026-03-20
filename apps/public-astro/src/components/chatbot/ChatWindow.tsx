import { cn } from '@/lib/utils';
import { useChat } from './useChat';
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
  onToggleSize,
  isFullPage = false,
  isExpanded = false,
  className,
}: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage, clearMessages, shouldScrollToBottom } =
    useChat();

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(234,240,247,0.98),rgba(222,232,243,0.98))] backdrop-blur-sm',
        'shadow-[16px_16px_32px_rgba(163,177,198,0.34),-16px_-16px_32px_rgba(255,255,255,0.42)]',
        'border border-[#F7FAFC]/60',
        isFullPage ? 'h-full' : 'h-[500px]',
        className
      )}
    >
      <ChatHeader
        onToggleSize={onToggleSize}
        onClear={clearMessages}
        isFullPage={isFullPage}
        isExpanded={isExpanded}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        shouldScrollToBottom={shouldScrollToBottom}
      />

      {error && (
        <div className="border-t border-red-200 bg-red-50/90 px-4 py-2 backdrop-blur-sm">
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
