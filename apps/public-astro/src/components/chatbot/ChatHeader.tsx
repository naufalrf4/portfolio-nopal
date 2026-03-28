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
    <div className="flex items-center justify-between border-b border-[#C8D6E8]/70 bg-[linear-gradient(180deg,rgba(226,235,246,0.96),rgba(219,230,242,0.92))] px-5 py-4 text-[#314155] shadow-[0_10px_24px_rgba(214,224,236,0.55)] md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(220,232,248,0.96),rgba(235,241,248,0.94))] shadow-[6px_6px_12px_rgba(163,177,198,0.26),-6px_-6px_12px_rgba(255,255,255,0.36)]">
          <Sparkles size={20} className="text-[#2563EB]" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Nau AI</h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onClear ? (
          <button
            onClick={onClear}
            className={cn(
              'rounded-xl p-2.5 text-[#5B6B7E]',
              'hover:bg-[#DCE8FF] hover:text-[#2563EB] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#93C5FD]'
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
              'rounded-xl p-2.5 text-[#5B6B7E]',
              'hover:bg-[#DCE8FF] hover:text-[#2563EB] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#93C5FD]'
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
              'rounded-xl p-2.5 text-[#5B6B7E]',
              'hover:bg-[#DCE8FF] hover:text-[#2563EB] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#93C5FD]'
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
