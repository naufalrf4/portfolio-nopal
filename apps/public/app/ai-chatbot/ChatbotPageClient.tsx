'use client';

import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ChatWindow } from '@/src/features/chatbot/components';
import { Section, NeuButton } from '@/src/features/shared/components';

export function ChatbotPageClient() {
  return (
    <main className="min-h-screen bg-[#E0E5EC]">
      <Section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-block">
              <NeuButton variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </NeuButton>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <div
              className={cn(
                'inline-flex items-center justify-center w-16 h-16 mb-4',
                'bg-[#3B82F6] text-white rounded-2xl',
                'shadow-[6px_6px_12px_rgba(59,130,246,0.3),-6px_-6px_12px_rgba(255,255,255,0.5)]'
              )}
            >
              <Bot size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D4852] mb-3">AI Assistant</h1>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Chat with my AI assistant to learn more about my projects, experience, and skills. Ask
              anything about my work!
            </p>
          </div>

          <div className="h-[calc(100vh-400px)] min-h-[500px]">
            <ChatWindow isFullPage />
          </div>
        </div>
      </Section>
    </main>
  );
}
