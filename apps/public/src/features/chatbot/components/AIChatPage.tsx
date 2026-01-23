'use client';

import { cn } from '@/src/lib/utils';
import { useChat } from '@/src/features/chatbot/hooks';
import { ChatArea } from './ChatArea';
import { InputArea } from './InputArea';
import { AlertCircle } from 'lucide-react';
import { Chatbox } from './Chatbox';

export function AIChatPage() {
  const { messages, isLoading, error, sendMessage, clearMessages, shouldScrollToBottom } =
    useChat();

  return (
    <div className="h-screen bg-[#E0E5EC] flex items-center justify-center overflow-hidden">
      <div className="flex-1 flex flex-col max-w-7xl w-full h-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 flex flex-col min-h-0">
          <Chatbox onClear={clearMessages} />

          <div
            className={cn(
              'flex-1 flex flex-col min-h-0 bg-[#F0F4F8] rounded-2xl overflow-hidden backdrop-blur-sm',
              'shadow-[12px_12px_24px_rgba(163,177,198,0.5),-12px_-12px_24px_rgba(255,255,255,0.5)]',
              'border border-white/20'
            )}
          >
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              shouldScrollToBottom={shouldScrollToBottom}
            />

            {error && (
              <div className="px-4 py-3 bg-red-50/90 backdrop-blur-sm border-t border-red-200">
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <InputArea onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
