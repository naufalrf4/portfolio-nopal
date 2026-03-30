import hashlib
from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import RagIngestionRun
from app.schemas.admin import ContentExport, KnowledgeDocument, ProjectContent, SkillItem
from app.schemas.ingest import IngestRequest, IngestResponse
from app.services.admin_client import AdminApiClient
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LlmService
from app.services.prompt_builder import (
    build_chunk_context_prompt,
    build_document_summary_prompt,
    build_source_metadata,
    source_label,
)
from app.services.repository import ChunkWritePayload, RagRepository
from app.services.tokenizer import TokenizerService


@dataclass(slots=True)
class IngestedSource:
    chunks_written: int
    source: str


class IngestService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.admin_client = AdminApiClient()
        self.embedding_service = EmbeddingService()
        self.llm_service = LlmService()
        self.tokenizer = TokenizerService()
        self.repository = RagRepository(session)

    async def ingest(self, request: IngestRequest) -> IngestResponse:
        run = await self.repository.create_ingestion_run(
            trigger_type=request.type,
            request_payload=request.model_dump(by_alias=True),
        )
        run_id = run.id
        await self.session.commit()

        try:
            if request.type == "knowledge":
                if not request.document_id:
                    raise ValueError("documentId is required for knowledge ingestion.")
                result = await self._ingest_knowledge_doc(request.document_id, run_id=run_id)
                await self.repository.update_ingestion_run(
                    run, status="completed", chunks_written=result.chunks_written
                )
                await self.session.commit()
                return IngestResponse(
                    success=True, chunksIngested=result.chunks_written, source=result.source
                )

            if request.type == "project":
                if not request.document_id:
                    raise ValueError("documentId is required for project ingestion.")
                export = await self.admin_client.get_content_export()
                result = await self._ingest_project(export, request.document_id, run_id)
                await self.repository.update_ingestion_run(
                    run, status="completed", chunks_written=result.chunks_written
                )
                await self.session.commit()
                return IngestResponse(
                    success=True, chunksIngested=result.chunks_written, source=result.source
                )

            if request.type == "about":
                export = await self.admin_client.get_content_export()
                result = await self._ingest_about(export, run_id)
                await self.repository.update_ingestion_run(
                    run, status="completed", chunks_written=result.chunks_written
                )
                await self.session.commit()
                return IngestResponse(
                    success=True, chunksIngested=result.chunks_written, source=result.source
                )

            total_chunks = 0
            export = await self.admin_client.get_content_export()
            errors: list[str] = []

            try:
                about_result = await self._ingest_about(export, run_id)
                total_chunks += about_result.chunks_written
            except Exception as exc:  # noqa: BLE001
                errors.append(f"about:{exc}")

            for project in export.projects:
                try:
                    project_result = await self._ingest_project_document(project, run_id)
                    total_chunks += project_result.chunks_written
                except Exception as exc:  # noqa: BLE001
                    errors.append(f"project:{project.slug}:{exc}")

            for doc in export.knowledge_docs:
                try:
                    knowledge_result = await self._ingest_knowledge_document(doc, run_id)
                    total_chunks += knowledge_result.chunks_written
                except Exception as exc:  # noqa: BLE001
                    errors.append(f"knowledge:{doc.id}:{exc}")

            status = "partial" if errors else "completed"
            await self.repository.update_ingestion_run(
                run,
                status=status,
                chunks_written=total_chunks,
                error_message="; ".join(errors) if errors else None,
            )
            await self.session.commit()
            return IngestResponse(success=True, chunksIngested=total_chunks, source="all")
        except Exception as exc:  # noqa: BLE001
            await self.session.rollback()
            run = await self.session.get(RagIngestionRun, run_id)
            if run is not None:
                await self.repository.update_ingestion_run(
                    run, status="failed", error_message=str(exc)
                )
                await self.session.commit()
            raise

    async def _ingest_knowledge_doc(self, document_id: str, run_id) -> IngestedSource:
        doc = await self.admin_client.get_knowledge_doc_by_id(document_id)
        return await self._ingest_knowledge_document(doc, run_id)

    async def _ingest_knowledge_document(self, doc: KnowledgeDocument, run_id) -> IngestedSource:
        result = await self._ingest_text_document(
            run_id=run_id,
            source_type="knowledge",
            source_ref=doc.id,
            title=doc.filename,
            text=doc.content,
            visibility="public",
            sensitivity="normal",
            mime_type="text/plain",
            storage_key=None,
            tags=["knowledge"],
            extra_metadata={"origin": "knowledge-doc"},
        )
        await self.admin_client.mark_knowledge_doc_indexed(doc.id)
        return result

    async def _ingest_project(self, export: ContentExport, slug: str, run_id) -> IngestedSource:
        project = next((item for item in export.projects if item.slug == slug), None)
        if project is None:
            raise ValueError(f"Project not found for slug {slug}.")
        return await self._ingest_project_document(project, run_id)

    async def _ingest_project_document(self, project: ProjectContent, run_id) -> IngestedSource:
        sections = [
            f"# {project.title}",
            f"## Summary\n{project.summary.strip()}" if project.summary else "",
            f"## Description\n{project.description.strip()}" if project.description else "",
            "## Technologies\n" + ", ".join(project.tech_stack) if project.tech_stack else "",
            self._format_project_content(project.content),
        ]

        if not project.content.strip():
            for context in project.contexts:
                sections.append(f"## {context.title}\n{context.content.strip()}")

        return await self._ingest_text_document(
            run_id=run_id,
            source_type="project",
            source_ref=project.slug,
            title=project.title,
            text="\n\n".join(section for section in sections if section),
            visibility="public",
            sensitivity="normal",
            mime_type="text/markdown",
            storage_key=None,
            tags=["project"],
            extra_metadata={"origin": "project-export"},
        )

    @staticmethod
    def _format_project_content(content: str) -> str:
        normalized = content.strip()
        if not normalized:
            return ""
        if normalized.startswith("#"):
            return normalized
        return f"## Project Details\n{normalized}"

    async def _ingest_about(self, export: ContentExport, run_id) -> IngestedSource:
        about = export.about_me
        experience_lines = [self._format_experience_item(item) for item in about.experience]
        skill_names = self._normalize_skill_names(about.skills)
        sections = [
            "# About NaufalRF",
            f"## Bio\n{about.bio.strip()}" if about.bio else "",
            "## Skills\n" + ", ".join(skill_names) if skill_names else "",
            "## Experience\n" + "\n".join(f"- {item}" for item in experience_lines)
            if experience_lines
            else "",
        ]
        return await self._ingest_text_document(
            run_id=run_id,
            source_type="about",
            source_ref="naufal",
            title="About NaufalRF",
            text="\n\n".join(section for section in sections if section),
            visibility="public",
            sensitivity="normal",
            mime_type="text/markdown",
            storage_key=None,
            tags=["about"],
            extra_metadata={"origin": "about-export"},
        )

    @staticmethod
    def _normalize_skill_names(skills: list[str | SkillItem]) -> list[str]:
        normalized: list[str] = []
        for skill in skills:
            if isinstance(skill, str):
                value = skill.strip()
            else:
                value = skill.name.strip()

            if value:
                normalized.append(value)
        return normalized

    async def _ingest_text_document(
        self,
        *,
        run_id,
        source_type: str,
        source_ref: str,
        title: str,
        text: str,
        visibility: str,
        sensitivity: str,
        mime_type: str | None,
        storage_key: str | None,
        tags: list[str],
        extra_metadata: dict[str, object],
    ) -> IngestedSource:
        if not text.strip():
            raise ValueError(f"No content available for {source_type}:{source_ref}.")

        source = source_label(source_type, source_ref, title)
        summary_prompt = build_document_summary_prompt(title, source, text[:6000])
        document_summary = await self.llm_service.summarize_document(title, source, summary_prompt)
        raw_chunks = self.tokenizer.chunk_text(text)
        contextual_chunks: list[tuple[str, str, int, int]] = []
        for chunk in raw_chunks:
            fallback_context = f"{title} ({source}) contains information relevant to this passage."
            prompt = build_chunk_context_prompt(title, source, document_summary, chunk.content)
            contextual_prefix = await self.llm_service.contextualize_chunk(prompt, fallback_context)
            contextual_content = f"{contextual_prefix}\n\n{chunk.content}".strip()
            contextual_chunks.append(
                (chunk.content, contextual_content, chunk.token_count, chunk.chunk_index)
            )

        embeddings = await self.embedding_service.embed_texts(
            [item[1] for item in contextual_chunks]
        )
        content_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
        excerpt = text[:500].strip()
        document = await self.repository.upsert_document(
            source_type=source_type,
            source_ref=source_ref,
            title=title,
            visibility=visibility,
            sensitivity=sensitivity,
            storage_key=storage_key,
            mime_type=mime_type,
            tags=tags,
            metadata={
                **build_source_metadata(source_type, source_ref, title),
                "run_id": str(run_id),
                "document_summary": document_summary,
                **extra_metadata,
            },
            content_hash=content_hash,
            content_excerpt=excerpt,
        )

        chunk_rows: list[ChunkWritePayload] = []
        for (raw_content, contextual_content, token_count, chunk_index), embedding in zip(
            contextual_chunks, embeddings, strict=True
        ):
            checksum = hashlib.sha256(contextual_content.encode("utf-8")).hexdigest()
            chunk_rows.append(
                ChunkWritePayload(
                    chunk_index=chunk_index,
                    content=raw_content,
                    contextual_content=contextual_content,
                    token_count=token_count,
                    checksum=checksum,
                    embedding=embedding,
                    metadata={
                        **build_source_metadata(source_type, source_ref, title),
                        "document_summary": document_summary,
                        **extra_metadata,
                    },
                    visibility=visibility,
                    source_type=source_type,
                    source_ref=source_ref,
                )
            )

        await self.repository.replace_chunks(document, chunk_rows)
        run = await self.session.get(RagIngestionRun, run_id)
        if run is not None:
            await self.repository.update_ingestion_run(run, status="running", document=document)
        return IngestedSource(chunks_written=len(chunk_rows), source=source)

    @staticmethod
    def _format_experience_item(item) -> str:
        period = f"{item.start_date} - {item.end_date or 'Present'}"
        location = f" ({item.location})" if item.location else ""
        summary = f"{item.type}: {item.title} at {item.organization} - {period}{location}"
        if item.description:
            return f"{summary}. {item.description.strip()}"
        return summary
