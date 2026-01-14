import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import type { LLMProvider } from '@naufalrf/types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GenerateOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

interface GenerateResult {
  content: string;
  model: string;
  provider: LLMProvider;
  tokens: {
    prompt: number;
    completion: number;
  };
  durationMs: number;
}

const PROVIDER_MODELS: Record<LLMProvider, string> = {
  openai: 'gpt-4o-mini',
  google: 'gemini-3-flash-preview',
  groq: 'llama-3.3-70b-versatile',
  deepseek: 'deepseek-chat',
};

class LLMService {
  private providers: Map<
    LLMProvider,
    | ReturnType<typeof createOpenAI>
    | ReturnType<typeof createGoogleGenerativeAI>
    | ReturnType<typeof createGroq>
  >;

  constructor() {
    this.providers = new Map();

    if (env.OPENAI_API_KEY) {
      this.providers.set('openai', createOpenAI({ apiKey: env.OPENAI_API_KEY }));
    }

    if (env.GOOGLE_API_KEY) {
      this.providers.set('google', createGoogleGenerativeAI({ apiKey: env.GOOGLE_API_KEY }));
    }

    if (env.GROQ_API_KEY) {
      this.providers.set('groq', createGroq({ apiKey: env.GROQ_API_KEY }));
    }

    if (env.DEEPSEEK_API_KEY) {
      this.providers.set(
        'deepseek',
        createOpenAI({
          apiKey: env.DEEPSEEK_API_KEY,
          baseURL: 'https://api.deepseek.com',
        })
      );
    }

    logger.info({ providers: Array.from(this.providers.keys()) }, 'LLM providers initialized');
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const providerOrder: LLMProvider[] = [env.PRIMARY_LLM, env.FALLBACK_LLM];
    const uniqueProviders = [...new Set(providerOrder)];

    for (const providerName of uniqueProviders) {
      const provider = this.providers.get(providerName);
      if (!provider) {
        logger.warn({ provider: providerName }, 'Provider not configured, skipping');
        continue;
      }

      try {
        const startTime = Date.now();
        const modelName = PROVIDER_MODELS[providerName];

        const result = await generateText({
          model: provider(modelName),
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 1024,
        });

        const durationMs = Date.now() - startTime;

        logger.info(
          {
            provider: providerName,
            model: modelName,
            tokens: result.usage,
            durationMs,
          },
          'LLM generation successful'
        );

        return {
          content: result.text,
          model: modelName,
          provider: providerName,
          tokens: {
            prompt: result.usage.inputTokens ?? 0,
            completion: result.usage.outputTokens ?? 0,
          },
          durationMs,
        };
      } catch (error) {
        logger.warn(
          { provider: providerName, error: error instanceof Error ? error.message : error },
          'LLM provider failed, trying fallback'
        );
      }
    }

    throw new Error('All LLM providers failed');
  }

  getAvailableProviders(): LLMProvider[] {
    return Array.from(this.providers.keys());
  }
}

export const llmService = new LLMService();
