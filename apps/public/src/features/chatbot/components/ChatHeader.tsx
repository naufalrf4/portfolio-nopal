'use client';

import { cn } from '@/src/lib/utils';
import { X, Trash2, Minimize2, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onClear: () => void;
  onToggleSize?: () => void;
  isFullPage?: boolean;
  isExpanded?: boolean;
}

export function ChatHeader({
  onClose,
  onClear,
  onToggleSize,
  isFullPage = false,
  isExpanded = false,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#3B82F6] text-white rounded-t-2xl">
      <div>
        <h3 className="font-bold text-lg">Chat with AI</h3>
        <p className="text-sm text-white/80">Ask me anything about my work</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className={cn(
            'p-2 rounded-lg',
            'hover:bg-white/20 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Clear chat history"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
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
        {!isFullPage && (
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-white/20 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
