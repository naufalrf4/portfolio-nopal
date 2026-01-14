'use client';

import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chat.service';
import { useChatSession } from './useChatSession';
import type { Message } from '../types';

interface UseChat {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  streamingMessageId: string | null;
  shouldScrollToBottom: boolean;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function simulateStreaming(text: string, onChunk: (chunk: string) => void, onComplete: () => void) {
  const words = text.split(' ');
  let currentIndex = 0;
  let accumulated = '';

  const interval = setInterval(() => {
    if (currentIndex < words.length) {
      accumulated += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
      onChunk(accumulated);
      currentIndex++;
    } else {
      clearInterval(interval);
      onComplete();
    }
  }, 50);

  return interval;
}

export function useChat(): UseChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const { sessionId, setSessionId, clearSession } = useChatSession();
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setShouldScrollToBottom(true);
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

        setIsLoading(false);

        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          sources: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setShouldScrollToBottom(true);
        setStreamingMessageId(assistantMessageId);

        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
        }

        streamingIntervalRef.current = simulateStreaming(
          response.message,
          (chunk) => {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: chunk } : msg))
            );
          },
          () => {
            setStreamingMessageId(null);
            streamingIntervalRef.current = null;
            setShouldScrollToBottom(false);
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        setIsLoading(false);
      }
    },
    [sessionId, setSessionId]
  );

  const clearMessages = useCallback(() => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setMessages([]);
    setError(null);
    setStreamingMessageId(null);
    setShouldScrollToBottom(false);
    clearSession();
  }, [clearSession]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    streamingMessageId,
    shouldScrollToBottom,
  };
}
