import { cn } from '@/lib/utils';
import { Minimize2, Maximize2, Sparkles, ExternalLink } from 'lucide-react';

interface ChatHeaderProps {
  onClose?: () => void;
  onClear?: () => void;
  onToggleSize?: () => void;
  isFullPage?: boolean;
  isExpanded?: boolean;
}

export function ChatHeader({
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
          <h3 className="text-lg font-bold">Chat with AI</h3>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <span>Powered by</span>
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              className="w-3 h-3 flex-shrink-0"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-[#3D4852]">Gemini 3 Flash</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
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
