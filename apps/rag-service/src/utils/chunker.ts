import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

interface ChunkResult {
  id: string;
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export function chunkText(
  text: string,
  source: string,
  metadata?: Record<string, unknown>
): ChunkResult[] {
  const chunkSize = env.CHUNK_SIZE;
  const overlap = env.CHUNK_OVERLAP;
  const chunks: ChunkResult[] = [];

  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (cleanedText.length === 0) return [];

  const paragraphs = cleanedText.split(/\n\n+/);
  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    if (currentChunk.length + trimmedParagraph.length + 2 <= chunkSize * 4) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    } else {
      if (currentChunk) {
        chunks.push({
          id: uuidv4(),
          content: currentChunk,
          source,
          metadata: { ...metadata, chunkIndex },
        });
        chunkIndex++;

        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(overlap / 4));
        currentChunk = overlapWords.join(' ') + '\n\n' + trimmedParagraph;
      } else {
        currentChunk = trimmedParagraph;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      id: uuidv4(),
      content: currentChunk.trim(),
      source,
      metadata: { ...metadata, chunkIndex },
    });
  }

  return chunks;
}

export function chunkByTokenEstimate(
  text: string,
  source: string,
  metadata?: Record<string, unknown>
): ChunkResult[] {
  const targetTokens = env.CHUNK_SIZE;
  const overlapTokens = env.CHUNK_OVERLAP;
  const chunks: ChunkResult[] = [];

  const estimateTokens = (str: string) => Math.ceil(str.length / 4);

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    const combinedLength = estimateTokens(currentChunk + ' ' + trimmedSentence);

    if (combinedLength <= targetTokens) {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push({
          id: uuidv4(),
          content: currentChunk,
          source,
          metadata: { ...metadata, chunkIndex },
        });
        chunkIndex++;

        const words = currentChunk.split(/\s+/);
        const overlapWordCount = Math.floor(overlapTokens / 1.5);
        const overlapWords = words.slice(-overlapWordCount);
        currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
      } else {
        currentChunk = trimmedSentence;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      id: uuidv4(),
      content: currentChunk.trim(),
      source,
      metadata: { ...metadata, chunkIndex },
    });
  }

  return chunks;
}
