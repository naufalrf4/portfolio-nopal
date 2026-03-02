import { v4 as uuidv4 } from 'uuid';
import { llmService } from './llm.service';
import { retrieverService } from './retriever.service';
import { sessionService } from './session.service';
import { adminApiService } from './admin-api.service';
import { buildSystemPrompt, formatContextFromChunks } from '../utils/prompt-builder';
import { logger } from '../utils/logger';
import type { ChatRequest, ChatResponse, ChatMessage } from '../types';

class ChatService {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const sessionId = request.sessionId || uuidv4();
    const startTime = Date.now();

    logger.info({ sessionId, messageLength: request.message.length }, 'Processing chat request');

    const relevantChunks = await retrieverService.search(request.message, 5);
    const context = formatContextFromChunks(relevantChunks);
    const sources = [...new Set(relevantChunks.map((c) => c.source))];

    const history = sessionService.getHistory(sessionId, 6);
    const systemPrompt = buildSystemPrompt(context);

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: request.message },
    ];

    const result = await llmService.generate({ messages });

    sessionService.addMessage(sessionId, 'user', request.message);
    sessionService.addMessage(sessionId, 'assistant', result.content);

    this.persistChatLogAsync(sessionId);

    const totalDuration = Date.now() - startTime;
    logger.info(
      {
        sessionId,
        provider: result.provider,
        model: result.model,
        tokens: result.tokens,
        durationMs: totalDuration,
      },
      'Chat request completed'
    );

    return {
      sessionId,
      message: result.content,
      sources,
      metadata: {
        model: result.model,
        provider: result.provider,
        tokens: result.tokens,
        durationMs: result.durationMs,
      },
    };
  }

  private persistChatLogAsync(sessionId: string): void {
    setImmediate(async () => {
      try {
        const history = sessionService.getHistory(sessionId, 100);
        const messages: ChatMessage[] = history.map((m, i) => ({
          id: `${sessionId}-${i}`,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }));

        await adminApiService.saveChatLog(sessionId, messages);
      } catch (error) {
        logger.error({ error, sessionId }, 'Failed to persist chat log');
      }
    });
  }
}

export const chatService = new ChatService();
