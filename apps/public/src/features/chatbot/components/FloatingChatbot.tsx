'use client';

import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { NeuCard, NeuButton } from '@/src/features/shared/components';
import { MessageCircle, X } from 'lucide-react';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-20 md:bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full',
          'bg-[#3B82F6] text-white',
          'shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(255,255,255,0.3)]',
          'hover:shadow-[8px_8px_16px_rgba(59,130,246,0.5),-8px_-8px_16px_rgba(255,255,255,0.4)]',
          'transition-all duration-300',
          'flex items-center justify-center'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className={cn('fixed bottom-36 md:bottom-24 right-6 z-50', 'w-80 md:w-96')}>
          <NeuCard className="p-0 overflow-hidden">
            <div className="bg-[#3B82F6] text-white p-4">
              <h3 className="font-bold">Chat with AI</h3>
              <p className="text-sm opacity-90">Ask me anything about my work</p>
            </div>

            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-[#6B7280] mb-4" />
              <p className="text-[#6B7280] mb-2">Chat feature coming soon!</p>
              <p className="text-sm text-[#6B7280]">
                In the meantime, feel free to reach out via the contact form.
              </p>
            </div>
          </NeuCard>
        </div>
      )}
    </>
  );
}
