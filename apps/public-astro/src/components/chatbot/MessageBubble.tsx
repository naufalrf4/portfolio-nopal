import { cn } from '@/lib/utils';
import { ArrowRight, Bot, User } from 'lucide-react';
import type { Message } from './types';
import { MarkdownMessage } from './MarkdownMessage';
import { SourcesList } from './SourcesList';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const citations = message.citations;
  const suggestedActions = message.suggestedActions;
  const answerPreview = message.content.trim();

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
        <MarkdownMessage content={message.content} isUser={isUser} isStreaming={isStreaming} />

        {!isUser && suggestedActions && suggestedActions.length > 0 ? (
          <div className="mt-3 space-y-2">
            {suggestedActions.map((action, index) => {
              const matchingCitation = citations?.find(
                (citation) => citation.route === action.target
              );
              const title =
                matchingCitation?.title ||
                matchingCitation?.routeLabel ||
                matchingCitation?.section ||
                action.label;

              return (
                <a
                  key={`${action.target}-${index}`}
                  href={action.target}
                  className={cn(
                    'flex items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left',
                    'bg-[linear-gradient(145deg,rgba(59,130,246,0.12),rgba(255,255,255,0.58))] text-[#1D4ED8]',
                    'shadow-[4px_4px_10px_rgba(163,177,198,0.18),-4px_-4px_10px_rgba(255,255,255,0.25)]',
                    'transition-all hover:-translate-y-0.5 hover:text-[#1E40AF]'
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{title}</span>
                    {answerPreview ? (
                      <span className="mt-1 block line-clamp-2 text-xs text-[#5B6B7E]">
                        {answerPreview}
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight size={14} className="mt-0.5 shrink-0" />
                </a>
              );
            })}
          </div>
        ) : null}

        {!isUser ? <SourcesList citations={citations} /> : null}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center">
          <User size={18} className="text-[#3B82F6]" />
        </div>
      )}
    </div>
  );
}
