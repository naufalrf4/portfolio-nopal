import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmbeddingService {
  private getModel() {
    if (env.EMBEDDING_PROVIDER === 'google') {
      return google.textEmbeddingModel('text-embedding-004');
    }
    return openai.embedding('text-embedding-3-small');
  }

  get dimensions(): number {
    return env.EMBEDDING_PROVIDER === 'google' ? 768 : 1536;
  }

  async embedText(text: string): Promise<number[]> {
    try {
      const { embedding } = await embed({
        model: this.getModel(),
        value: text,
      });
      return embedding;
    } catch (error) {
      logger.error({ error }, 'Failed to generate embedding');
      throw error;
    }
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    try {
      const { embeddings } = await embedMany({
        model: this.getModel(),
        values: texts,
      });
      return embeddings;
    } catch (error) {
      logger.error({ error, count: texts.length }, 'Failed to generate embeddings batch');
      throw error;
    }
  }
}

export const embeddingService = new EmbeddingService();
