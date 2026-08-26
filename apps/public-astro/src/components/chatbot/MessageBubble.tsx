import { cn } from '@/lib/utils';
import { ArrowRight, Bot, User, Check, X, Loader2 } from 'lucide-react';
import type { Message } from './types';
import { MarkdownMessage } from './MarkdownMessage';
import { SourcesList } from './SourcesList';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onConfirmAction?: (messageId: string, confirm: boolean) => Promise<void>;
  isConfirming?: boolean;
}

export function MessageBubble({
  message,
  isStreaming = false,
  onConfirmAction,
  isConfirming = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const suggestedActions = message.suggestedActions;
  const pendingAction = message.pendingAction;

  const handleConfirm = async () => {
    if (isConfirming) return;
    if (onConfirmAction && pendingAction && pendingAction.missingFields.length === 0) {
      await onConfirmAction(message.id, true);
    }
  };

  const handleDecline = async () => {
    if (isConfirming) return;
    if (onConfirmAction && pendingAction) {
      await onConfirmAction(message.id, false);
    }
  };

  return (
    <div
      className={cn(
        'flex w-full gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal flex items-center justify-center">
          <Bot size={18} className="text-bg" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-teal text-bg rounded-br-md'
            : 'bg-bg-elevated border border-line text-text-primary rounded-bl-md'
        )}
      >
        <MarkdownMessage content={message.content} isUser={isUser} isStreaming={isStreaming} />

        {}
        {!isUser && pendingAction && (
          <div className="mt-3 rounded-xl border border-[var(--teal)]/40 bg-[var(--teal-soft)] p-3">
            <p className="text-sm font-medium text-[var(--teal)] mb-2">
              {pendingAction.description}
            </p>
            {pendingAction.missingFields.length > 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                Missing: {pendingAction.missingFields.join(', ')}
              </p>
            ) : (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--teal)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[var(--teal)]/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConfirming ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Confirm
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isConfirming}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-elevated)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConfirming ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                  Decline
                </button>
              </div>
            )}
          </div>
        )}

        {!isUser && message.citations && message.citations.length > 0 && (
          <SourcesList citations={message.citations} />
        )}

        {!isUser && suggestedActions && suggestedActions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => {
              return (
                <a
                  key={`${action.target}-${index}`}
                  href={action.target}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium',
                    'border border-teal/30 bg-[var(--teal-soft)] text-teal',
                    'transition-all hover:-translate-y-0.5 hover:border-teal/50'
                  )}
                >
                  <span>{action.label}</span>
                  <ArrowRight size={14} className="shrink-0" />
                </a>
              );
            })}
          </div>
        ) : null}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-line bg-bg-elevated flex items-center justify-center">
          <User size={18} className="text-teal" />
        </div>
      )}
    </div>
  );
}
