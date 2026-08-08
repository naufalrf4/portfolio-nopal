import { cn } from '@/lib/utils';
import { Minimize2, Maximize2, Sparkles, ExternalLink, RotateCcw } from 'lucide-react';

interface ChatHeaderProps {
  onClose?: () => void;
  onClear?: () => void;
  onToggleSize?: () => void;
  isFullPage?: boolean;
  isExpanded?: boolean;
}

export function ChatHeader({
  onClear,
  onToggleSize,
  isFullPage = false,
  isExpanded = false,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-bg-elevated px-5 py-4 text-text-primary md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal/30 bg-[var(--teal-soft)]">
          <Sparkles size={20} className="text-teal" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-display">Nau AI</h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onClear ? (
          <button
            onClick={onClear}
            className={cn(
              'rounded-lg p-2.5 text-text-secondary',
              'hover:bg-bg-card hover:text-teal transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal/40'
            )}
            aria-label="Reset chat"
            title="Reset chat"
          >
            <RotateCcw size={18} />
          </button>
        ) : null}
        {!isFullPage && (
          <a
            href="/ai-chatbot"
            className={cn(
              'rounded-lg p-2.5 text-text-secondary',
              'hover:bg-bg-card hover:text-teal transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal/40'
            )}
            aria-label="Open full chat page"
            title="Open full page"
          >
            <ExternalLink size={18} />
          </a>
        )}
        {onToggleSize && !isFullPage && (
          <button
            onClick={onToggleSize}
            className={cn(
              'rounded-lg p-2.5 text-text-secondary',
              'hover:bg-bg-card hover:text-teal transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal/40'
            )}
            aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
