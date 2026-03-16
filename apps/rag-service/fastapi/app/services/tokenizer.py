import re
from dataclasses import dataclass

import tiktoken

from app.config import settings


@dataclass(slots=True)
class TokenChunk:
    content: str
    chunk_index: int
    token_count: int


class TokenizerService:
    def __init__(self) -> None:
        self.encoding = tiktoken.get_encoding('cl100k_base')

    def count_tokens(self, text: str) -> int:
        return len(self.encoding.encode(text))

    def chunk_text(self, text: str) -> list[TokenChunk]:
        normalized = text.replace('\r\n', '\n').strip()
        if not normalized:
            return []

        paragraphs = [part.strip() for part in re.split(r'\n\s*\n', normalized) if part.strip()]
        if not paragraphs:
            paragraphs = [normalized]

        raw_chunks: list[str] = []
        current_parts: list[str] = []

        for paragraph in paragraphs:
            candidate = '\n\n'.join(current_parts + [paragraph]) if current_parts else paragraph
            if self.count_tokens(candidate) <= settings.chunk_target_tokens:
                current_parts.append(paragraph)
                continue

            if current_parts:
                raw_chunks.append('\n\n'.join(current_parts))
                current_parts = []

            if self.count_tokens(paragraph) <= settings.chunk_target_tokens:
                current_parts = [paragraph]
                continue

            raw_chunks.extend(self._split_large_block(paragraph))

        if current_parts:
            raw_chunks.append('\n\n'.join(current_parts))

        chunks: list[TokenChunk] = []
        previous_tail = ''
        for index, raw_chunk in enumerate(raw_chunks):
            content = f'{previous_tail}\n\n{raw_chunk}'.strip() if previous_tail else raw_chunk
            token_count = self.count_tokens(content)
            chunks.append(TokenChunk(content=content, chunk_index=index, token_count=token_count))
            previous_tail = self._tail_overlap(raw_chunk)

        return chunks

    def _split_large_block(self, block: str) -> list[str]:
        sentences = [part.strip() for part in re.split(r'(?<=[.!?])\s+', block) if part.strip()]
        if not sentences:
            return [block]

        chunks: list[str] = []
        current: list[str] = []

        for sentence in sentences:
            candidate = ' '.join(current + [sentence]) if current else sentence
            if self.count_tokens(candidate) <= settings.chunk_target_tokens:
                current.append(sentence)
                continue

            if current:
                chunks.append(' '.join(current))
                current = []

            if self.count_tokens(sentence) <= settings.chunk_target_tokens:
                current = [sentence]
                continue

            chunks.extend(self._split_by_tokens(sentence))

        if current:
            chunks.append(' '.join(current))

        return chunks

    def _split_by_tokens(self, text: str) -> list[str]:
        tokens = self.encoding.encode(text)
        step = max(1, settings.chunk_target_tokens - settings.chunk_overlap_tokens)
        chunks: list[str] = []
        for start in range(0, len(tokens), step):
            token_slice = tokens[start : start + settings.chunk_target_tokens]
            chunks.append(self.encoding.decode(token_slice).strip())
            if start + settings.chunk_target_tokens >= len(tokens):
                break
        return [chunk for chunk in chunks if chunk]

    def _tail_overlap(self, text: str) -> str:
        tokens = self.encoding.encode(text)
        if not tokens:
            return ''
        tail = tokens[-settings.chunk_overlap_tokens :]
        return self.encoding.decode(tail).strip()
