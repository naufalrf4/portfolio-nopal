'use client';

import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/chat.service';
import { useChatSession } from './useChatSession';
import type { Message } from '../types';

interface UseChat {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useChat(): UseChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sessionId, setSessionId, clearSession } = useChatSession();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendChatMessage({
          sessionId: sessionId || undefined,
          message: content.trim(),
        });

        if (response.sessionId) {
          setSessionId(response.sessionId);
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          sources: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, setSessionId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    clearSession();
  }, [clearSession]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
