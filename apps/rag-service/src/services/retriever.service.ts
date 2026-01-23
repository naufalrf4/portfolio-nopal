import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../config/env';
import { embeddingService } from './embedding.service';
import { logger } from '../utils/logger';
import type { RetrievedChunk } from '@naufalrf/types';

interface UpsertChunk {
  id: string;
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
}

class RetrieverService {
  private client: QdrantClient;
  private collection = env.QDRANT_COLLECTION;

  constructor() {
    this.client = new QdrantClient({
      url: env.QDRANT_URL,
      apiKey: env.QDRANT_API_KEY,
    });
  }

  async ensureCollection(): Promise<void> {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some((c) => c.name === this.collection);

      if (!exists) {
        await this.client.createCollection(this.collection, {
          vectors: {
            size: embeddingService.dimensions,
            distance: 'Cosine',
          },
        });
        logger.info({ collection: this.collection }, 'Created Qdrant collection');
      }
    } catch (error) {
      logger.error({ error }, 'Failed to ensure collection');
      throw error;
    }
  }

  async search(query: string, topK = 5): Promise<RetrievedChunk[]> {
    try {
      const queryVector = await embeddingService.embedText(query);

      const results = await this.client.search(this.collection, {
        vector: queryVector,
        limit: topK,
        with_payload: true,
      });

      logger.info({ query, resultCount: results.length, topK }, 'Qdrant search completed');

      return results.map((r) => ({
        content: r.payload?.content as string,
        source: r.payload?.source as string,
        score: r.score,
      }));
    } catch (error) {
      logger.error({ error, query }, 'Failed to search vectors');
      throw error;
    }
  }

  async upsert(chunks: UpsertChunk[]): Promise<number> {
    if (chunks.length === 0) return 0;

    try {
      const embeddings = await embeddingService.embedTexts(chunks.map((c) => c.content));

      await this.client.upsert(this.collection, {
        wait: true,
        points: chunks.map((chunk, i) => ({
          id: chunk.id,
          vector: embeddings[i],
          payload: {
            content: chunk.content,
            source: chunk.source,
            ...chunk.metadata,
          },
        })),
      });

      logger.info({ count: chunks.length }, 'Upserted chunks to Qdrant');
      return chunks.length;
    } catch (error) {
      logger.error({ error, count: chunks.length }, 'Failed to upsert chunks');
      throw error;
    }
  }

  async deleteBySource(source: string): Promise<void> {
    try {
      await this.client.delete(this.collection, {
        wait: true,
        filter: {
          must: [{ key: 'source', match: { value: source } }],
        },
      });
      logger.info({ source }, 'Deleted chunks by source');
    } catch (error) {
      logger.error({ error, source }, 'Failed to delete by source');
      throw error;
    }
  }

  async getCollectionInfo(): Promise<{ vectorCount: number }> {
    try {
      const info = await this.client.getCollection(this.collection);
      return { vectorCount: info.points_count ?? 0 };
    } catch (error) {
      logger.error({ error }, 'Failed to get collection info');
      return { vectorCount: 0 };
    }
  }
}

export const retrieverService = new RetrieverService();
