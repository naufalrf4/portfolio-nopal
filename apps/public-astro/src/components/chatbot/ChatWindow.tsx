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
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    shouldScrollToBottom,
    confirmPendingAction,
    confirmingMessageId,
  } = useChat();

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl bg-bg-card',
        'shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]',
        'border border-line',
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
        onConfirmAction={confirmPendingAction}
        onQuickPrompt={sendMessage}
        confirmingMessageId={confirmingMessageId}
      />

      {error && (
        <div className="border-t border-[var(--error)]/40 bg-[var(--error)]/10 px-4 py-2">
          <div className="flex items-center gap-2 text-[var(--error)] text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
