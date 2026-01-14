'use client';

import { cn } from '@/src/lib/utils';
import { Bot, Sparkles, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  onClear: () => void;
}

export function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div
          className={cn(
            'w-16 h-16 rounded-2xl',
            'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
            'shadow-[8px_8px_16px_rgba(59,130,246,0.4),-8px_-8px_16px_rgba(255,255,255,0.3)]',
            'flex items-center justify-center',
            'animate-pulse'
          )}
        >
          <Bot size={32} className="text-white" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D4852]">AI Assistant</h1>
            <Sparkles size={24} className="text-[#3B82F6]" />
          </div>
          <p className="text-[#6B7280] mb-1">
            Ask me anything about my projects, experience, and skills
          </p>
          <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
            <span>Powered by</span>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-[#3B82F6]">Gemini 3 Flash</span>
          </div>
        </div>

        <button
          onClick={onClear}
          className={cn(
            'ml-auto p-3 rounded-xl',
            'bg-[#E0E5EC] text-[#6B7280]',
            'shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.5)]',
            'hover:shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.6)]',
            'hover:text-[#3B82F6]',
            'active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
            'transition-all duration-200'
          )}
          aria-label="Clear chat history"
          title="Clear chat"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
}
