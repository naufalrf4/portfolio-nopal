'use client';

import { cn } from '@/src/lib/utils';
import { Minimize2, Maximize2, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-t-2xl shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.1)] flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Chat with AI</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <span>Powered by</span>
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium">Gemini 3 Flash</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isFullPage && (
          <Link
            href="/ai-chatbot"
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-white/20 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Open full chat page"
            title="Open full page"
          >
            <ExternalLink size={18} />
          </Link>
        )}
        {onToggleSize && !isFullPage && (
          <button
            onClick={onToggleSize}
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-white/20 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
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
