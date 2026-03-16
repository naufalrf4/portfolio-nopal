import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import String, bindparam, cast, delete, func, select
from sqlalchemy import text as sql_text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import RagChunk, RagDocument, RagIngestionRun


@dataclass(slots=True)
class ChunkWritePayload:
    chunk_index: int
    content: str
    contextual_content: str
    token_count: int
    checksum: str
    embedding: list[float]
    metadata: dict[str, Any]
    visibility: str
    source_type: str
    source_ref: str


@dataclass(slots=True)
class RetrievedChunk:
    source: str
    content: str
    contextual_content: str
    score: float
    metadata: dict[str, Any]
    dense_score: float = 0.0
    lexical_score: float = 0.0
    match_reasons: list[str] = field(default_factory=list)


def merge_retrieved_chunks(
    dense_results: list[RetrievedChunk], lexical_results: list[RetrievedChunk], limit: int
) -> list[RetrievedChunk]:
    merged: dict[tuple[str, str], RetrievedChunk] = {}
    max_lexical_score = max((chunk.lexical_score for chunk in lexical_results), default=0.0)

    for chunk in dense_results:
        key = (chunk.source, chunk.content)
        merged[key] = RetrievedChunk(
            source=chunk.source,
            content=chunk.content,
            contextual_content=chunk.contextual_content,
            score=chunk.dense_score,
            metadata=dict(chunk.metadata),
            dense_score=chunk.dense_score,
            lexical_score=0.0,
            match_reasons=["dense"],
        )

    for chunk in lexical_results:
        key = (chunk.source, chunk.content)
        normalized_lexical = (
            chunk.lexical_score / max_lexical_score if max_lexical_score > 0 else 0.0
        )
        existing = merged.get(key)
        if existing is None:
            merged[key] = RetrievedChunk(
                source=chunk.source,
                content=chunk.content,
                contextual_content=chunk.contextual_content,
                score=normalized_lexical,
                metadata=dict(chunk.metadata),
                dense_score=0.0,
                lexical_score=normalized_lexical,
                match_reasons=["lexical"],
            )
            continue
        existing.lexical_score = max(existing.lexical_score, normalized_lexical)
        if "lexical" not in existing.match_reasons:
            existing.match_reasons.append("lexical")

    for chunk in merged.values():
        chunk.score = min(1.0, (chunk.dense_score * 0.7) + (chunk.lexical_score * 0.3))

    return sorted(merged.values(), key=lambda chunk: chunk.score, reverse=True)[:limit]


class RagRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def upsert_document(
        self,
        *,
        source_type: str,
        source_ref: str,
        title: str,
        visibility: str,
        sensitivity: str,
        storage_key: str | None,
        mime_type: str | None,
        tags: list[str],
        metadata: dict[str, Any],
        content_hash: str | None,
        content_excerpt: str | None,
    ) -> RagDocument:
        result = await self.session.execute(
            select(RagDocument).where(
                RagDocument.source_type == source_type,
                RagDocument.source_ref == source_ref,
            )
        )
        document = result.scalar_one_or_none()
        if document is None:
            document = RagDocument(
                source_type=source_type,
                source_ref=source_ref,
                title=title,
                visibility=visibility,
                sensitivity=sensitivity,
                storage_key=storage_key,
                mime_type=mime_type,
                tags=tags,
                document_metadata=metadata,
                content_hash=content_hash,
                content_excerpt=content_excerpt,
            )
            self.session.add(document)
            await self.session.flush()
            return document

        document.title = title
        document.visibility = visibility
        document.sensitivity = sensitivity
        document.storage_key = storage_key
        document.mime_type = mime_type
        document.tags = tags
        document.document_metadata = metadata
        document.content_hash = content_hash
        document.content_excerpt = content_excerpt
        document.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return document

    async def replace_chunks(self, document: RagDocument, chunks: list[ChunkWritePayload]) -> None:
        await self.session.execute(delete(RagChunk).where(RagChunk.document_id == document.id))

        created_at = datetime.now(timezone.utc)
        for chunk in chunks:
            embedding_literal = self._format_embedding(chunk.embedding)
            await self.session.execute(
                sql_text(
                    f"""
                    INSERT INTO rag.chunks (
                        id,
                        document_id,
                        chunk_index,
                        source_type,
                        source_ref,
                        visibility,
                        content,
                        contextual_content,
                        token_count,
                        checksum,
                        metadata,
                        embedding,
                        created_at
                    ) VALUES (
                        :id,
                        :document_id,
                        :chunk_index,
                        :source_type,
                        :source_ref,
                        :visibility,
                        :content,
                        :contextual_content,
                        :token_count,
                        :checksum,
                        CAST(:metadata AS jsonb),
                        '{embedding_literal}'::vector,
                        :created_at
                    )
                    """
                ),
                {
                    "id": str(uuid4()),
                    "document_id": str(document.id),
                    "chunk_index": chunk.chunk_index,
                    "source_type": chunk.source_type,
                    "source_ref": chunk.source_ref,
                    "visibility": chunk.visibility,
                    "content": chunk.content,
                    "contextual_content": chunk.contextual_content,
                    "token_count": chunk.token_count,
                    "checksum": chunk.checksum,
                    "metadata": json.dumps(chunk.metadata),
                    "created_at": created_at,
                },
            )
        document.status = "ready"
        document.last_ingested_at = datetime.now(timezone.utc)
        await self.session.flush()

    async def create_ingestion_run(
        self, trigger_type: str, request_payload: dict[str, Any]
    ) -> RagIngestionRun:
        run = RagIngestionRun(
            trigger_type=trigger_type, request_payload=request_payload, status="pending"
        )
        self.session.add(run)
        await self.session.flush()
        return run

    async def update_ingestion_run(
        self,
        run: RagIngestionRun,
        *,
        status: str,
        document: RagDocument | None = None,
        chunks_written: int | None = None,
        error_message: str | None = None,
    ) -> None:
        run.status = status
        run.document = document
        if chunks_written is not None:
            run.chunks_written = chunks_written
        run.error_message = error_message
        if status in {"completed", "partial", "failed"}:
            run.completed_at = datetime.now(timezone.utc)
        await self.session.flush()

    async def search_chunks(
        self,
        query_embedding: list[float],
        limit: int,
        visibilities: list[str],
    ) -> list[RetrievedChunk]:
        return await self.search_chunks_dense(query_embedding, limit, visibilities)

    async def search_chunks_hybrid(
        self,
        query_embedding: list[float],
        query_text: str,
        limit: int,
        visibilities: list[str],
    ) -> list[RetrievedChunk]:
        candidate_limit = max(limit * 3, limit)
        dense_results = await self.search_chunks_dense(
            query_embedding, candidate_limit, visibilities
        )
        lexical_results = await self.search_chunks_lexical(
            query_text, candidate_limit, visibilities
        )
        return merge_retrieved_chunks(dense_results, lexical_results, limit)

    async def search_chunks_dense(
        self,
        query_embedding: list[float],
        limit: int,
        visibilities: list[str],
    ) -> list[RetrievedChunk]:
        query_vector = cast(
            bindparam(
                "query_embedding",
                self._format_embedding(query_embedding),
                type_=String(),
            ),
            Vector(dim=self._embedding_dimensions()),
        )
        distance = RagChunk.embedding.cosine_distance(query_vector)
        result = await self.session.execute(
            select(RagChunk, distance.label("distance"))
            .join(RagDocument, RagChunk.document_id == RagDocument.id)
            .where(RagChunk.visibility.in_(visibilities), RagDocument.status == "ready")
            .order_by(distance)
            .limit(limit)
        )

        rows: list[RetrievedChunk] = []
        for chunk, score in result.all():
            metadata = dict(chunk.chunk_metadata or {})
            dense_score = max(0.0, 1 - float(score))
            rows.append(
                RetrievedChunk(
                    source=str(
                        metadata.get("source_label") or f"{chunk.source_type}:{chunk.source_ref}"
                    ),
                    content=chunk.content,
                    contextual_content=chunk.contextual_content,
                    score=dense_score,
                    metadata=metadata,
                    dense_score=dense_score,
                    lexical_score=0.0,
                    match_reasons=["dense"],
                )
            )
        return rows

    async def search_chunks_lexical(
        self, query_text: str, limit: int, visibilities: list[str]
    ) -> list[RetrievedChunk]:
        normalized_query = query_text.strip()
        if not normalized_query:
            return []

        lexical_document = func.to_tsvector(
            "simple",
            func.concat(
                func.coalesce(RagChunk.contextual_content, ""),
                " ",
                func.coalesce(RagChunk.content, ""),
            ),
        )
        ts_query = func.websearch_to_tsquery("simple", normalized_query)
        lexical_rank = func.ts_rank_cd(lexical_document, ts_query)

        result = await self.session.execute(
            select(RagChunk, lexical_rank.label("lexical_rank"))
            .join(RagDocument, RagChunk.document_id == RagDocument.id)
            .where(
                RagChunk.visibility.in_(visibilities),
                RagDocument.status == "ready",
                lexical_document.op("@@")(ts_query),
            )
            .order_by(lexical_rank.desc())
            .limit(limit)
        )

        rows: list[RetrievedChunk] = []
        for chunk, score in result.all():
            metadata = dict(chunk.chunk_metadata or {})
            lexical_score = max(0.0, float(score or 0.0))
            rows.append(
                RetrievedChunk(
                    source=str(
                        metadata.get("source_label") or f"{chunk.source_type}:{chunk.source_ref}"
                    ),
                    content=chunk.content,
                    contextual_content=chunk.contextual_content,
                    score=lexical_score,
                    metadata=metadata,
                    dense_score=0.0,
                    lexical_score=lexical_score,
                    match_reasons=["lexical"],
                )
            )
        return rows

    @staticmethod
    def _embedding_dimensions() -> int:
        return RagChunk.embedding.type.dim

    @staticmethod
    def _format_embedding(values: list[float]) -> str:
        return "[" + ",".join(str(value) for value in values) + "]"
