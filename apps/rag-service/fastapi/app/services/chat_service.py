import logging
import time
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.schemas.admin import ChatLogMessage
from app.schemas.chat import (
    ChatCitation,
    ChatPublicMetadata,
    ChatRequest,
    ChatResponse,
    SuggestedAction,
)
from app.services.admin_client import AdminApiClient
from app.services.embedding_service import EmbeddingService
from app.services.errors import RagServiceError
from app.services.llm_service import LlmService
from app.services.prompt_builder import (
    build_chat_prompt,
    build_query_analysis_prompt,
    fallback_query_plan,
    format_context,
    format_history,
)
from app.services.repository import RagRepository
from app.services.tool_service import ToolService

logger = logging.getLogger(__name__)
MIN_RETRIEVAL_CONFIDENCE = 0.45


class ChatService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.admin_client = AdminApiClient()
        self.embedding_service = EmbeddingService()
        self.llm_service = LlmService()
        self.repository = RagRepository(session)
        self.tool_service = ToolService()

    async def chat(
        self,
        request: ChatRequest,
        preferred_language: str | None = None,
    ) -> ChatResponse:
        started_at = time.perf_counter()
        session_id = request.session_id or uuid4()
        try:
            history = await self.admin_client.get_chat_log(str(session_id))
        except Exception:  # noqa: BLE001
            logger.warning("Failed to load chat history from admin API", exc_info=True)
            history = []

        history_text = format_history(history, settings.chat_history_limit)
        query_plan = await self.llm_service.analyze_query(
            build_query_analysis_prompt(request.message, history_text, preferred_language),
            fallback_query_plan(request.message),
        )

        tool_name = self._resolve_tool_name(
            query_plan.intent, query_plan.workflow, query_plan.tool_name
        )
        tool_arguments = await self._build_tool_arguments(
            query_plan.intent, tool_name, query_plan.tool_arguments
        )
        tool_result = None
        if query_plan.workflow in {"tool", "hybrid"} and tool_name:
            tool_result = self.tool_service.execute(
                tool_name,
                tool_arguments,
                request.message,
                query_plan.answer_language,
            )

        retrieved_chunks = []
        seen_chunks: set[tuple[str, str]] = set()
        if query_plan.workflow != "tool" and query_plan.needs_portfolio_context:
            try:
                for retrieval_query in query_plan.retrieval_queries:
                    query_embedding = (await self.embedding_service.embed_texts([retrieval_query]))[
                        0
                    ]
                    search_results = await self.repository.search_chunks_hybrid(
                        query_embedding,
                        retrieval_query,
                        settings.retrieval_limit,
                        ["public"],
                    )
                    for chunk in search_results:
                        fingerprint = (chunk.source, chunk.content)
                        if fingerprint in seen_chunks:
                            continue
                        seen_chunks.add(fingerprint)
                        retrieved_chunks.append(chunk)
            except RagServiceError:
                raise
            except Exception as exc:  # noqa: BLE001
                raise RagServiceError(
                    "The contextual retrieval database is currently unavailable.",
                    "RAG_DATABASE_UNAVAILABLE",
                    503,
                ) from exc

        retrieved_chunks = retrieved_chunks[: settings.retrieval_limit]
        sources = list(dict.fromkeys(chunk.source for chunk in retrieved_chunks))
        citations = self._build_citations(retrieved_chunks)
        suggested_actions = self._build_suggested_actions(citations, query_plan.suggested_actions)
        retrieval_confidence = max((chunk.score for chunk in retrieved_chunks), default=0.0)
        abstained = False

        if tool_result is not None:
            final_text = tool_result.text
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": 0,
                "completion": 0,
            }
        elif query_plan.needs_portfolio_context and retrieval_confidence < MIN_RETRIEVAL_CONFIDENCE:
            abstained = True
            final_text = self._build_abstention_message(query_plan.answer_language)
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": 0,
                "completion": 0,
            }
        else:
            context_sections: list[dict[str, object]] = []
            if tool_result is not None:
                context_sections.append(
                    {
                        "source": f"tool:{tool_result.tool_name}",
                        "contextual_content": tool_result.context,
                    }
                )
            context_sections.extend(
                [
                    {
                        "source": chunk.source,
                        "contextual_content": chunk.contextual_content,
                    }
                    for chunk in retrieved_chunks
                ]
            )
            context = format_context(context_sections)
            prompt = build_chat_prompt(
                request.message,
                history_text,
                context,
                preferred_language,
                needs_portfolio_context=query_plan.needs_portfolio_context,
            )
            generated = await self.llm_service.answer_question(prompt)
            final_text = generated.text
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": generated.prompt_tokens,
                "completion": generated.completion_tokens,
            }

        duration_ms = int((time.perf_counter() - started_at) * 1000)
        now = datetime.now(timezone.utc)
        new_messages: list[dict[str, object]] = [
            {
                "id": f"{session_id}-user-{int(now.timestamp())}",
                "role": "user",
                "content": request.message,
                "timestamp": now.isoformat(),
            },
            {
                "id": f"{session_id}-assistant-{int(now.timestamp())}",
                "role": "assistant",
                "content": final_text,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "metadata": {
                    "model": settings.chat_model,
                    "provider": "google",
                    "tokens": tokens["prompt"] + tokens["completion"],
                    "duration": duration_ms,
                },
            },
        ]
        persisted_messages: list[dict[str, object]] = [
            self._message_to_payload(message) for message in history
        ]
        persisted_messages.extend(new_messages)
        try:
            await self.admin_client.save_chat_log(
                str(session_id), persisted_messages, mode="append"
            )
        except Exception:  # noqa: BLE001
            logger.warning("Failed to persist chat log to admin API", exc_info=True)

        return ChatResponse(
            sessionId=session_id,
            message=final_text,
            sources=sources,
            citations=citations,
            suggestedActions=suggested_actions,
            metadata=ChatPublicMetadata(
                workflow=query_plan.workflow,
                intent=query_plan.intent,
                queryLanguage=query_plan.query_language,
                answerLanguage=query_plan.answer_language,
                retrievalConfidence=retrieval_confidence,
                abstained=abstained,
            ),
        )

    @staticmethod
    def _resolve_tool_name(intent: str, workflow: str, tool_name: str | None) -> str | None:
        if tool_name:
            return tool_name
        if intent == "freelance_quote" and workflow in {"tool", "hybrid"}:
            return "feature_pricing_quote"
        return None

    async def _build_tool_arguments(
        self,
        intent: str,
        tool_name: str | None,
        tool_arguments: dict[str, object],
    ) -> dict[str, object]:
        if tool_name != "feature_pricing_quote" or intent != "freelance_quote":
            return dict(tool_arguments)

        enriched_arguments = dict(tool_arguments)
        context = await self.admin_client.get_freelance_intent_context()
        if context.freelance_profile is not None:
            enriched_arguments["freelanceProfile"] = context.freelance_profile.model_dump(
                mode="json",
                by_alias=True,
            )
        return enriched_arguments

    @staticmethod
    def _build_citations(retrieved_chunks: list[object]) -> list[ChatCitation]:
        citations: list[ChatCitation] = []
        seen: set[tuple[str, str | None]] = set()
        for chunk in retrieved_chunks:
            metadata = getattr(chunk, "metadata", {})
            if not isinstance(metadata, dict):
                continue
            source = getattr(chunk, "source", "")
            route = metadata.get("route")
            key = (str(source), str(route) if route is not None else None)
            if key in seen:
                continue
            seen.add(key)
            citations.append(
                ChatCitation(
                    source=str(source),
                    title=str(metadata.get("title")) if metadata.get("title") else None,
                    route=str(route) if route else None,
                    routeLabel=str(metadata.get("route_label"))
                    if metadata.get("route_label")
                    else None,
                    sourceType=str(metadata.get("source_type"))
                    if metadata.get("source_type")
                    else None,
                    sourceRef=str(metadata.get("source_ref"))
                    if metadata.get("source_ref")
                    else None,
                    section=str(metadata.get("section")) if metadata.get("section") else None,
                )
            )
        return citations

    @staticmethod
    def _build_suggested_actions(
        citations: list[ChatCitation],
        fallback_actions: list[dict[str, str]],
    ) -> list[SuggestedAction]:
        citation_actions = [
            SuggestedAction(
                type="open_page",
                target=citation.route,
                label=citation.route_label or f"Open {citation.title or citation.source}",
            )
            for citation in citations
            if citation.route
        ]
        if citation_actions:
            return citation_actions
        return [
            SuggestedAction(type=action["type"], target=action["target"], label=action["label"])
            for action in fallback_actions
        ]

    @staticmethod
    def _build_abstention_message(answer_language: str) -> str:
        if answer_language == "id":
            return (
                "Saya belum menemukan bukti portofolio yang cukup kuat untuk menjawab itu "
                "dengan yakin. Coba arahkan saya ke proyek, pengalaman, atau area tertentu "
                "agar saya bisa menjawab lebih akurat."
            )
        return (
            "I haven't found enough strong portfolio evidence to answer that confidently. "
            "Try pointing me to a specific project, experience, or area so I can answer "
            "more accurately."
        )

    def _message_to_payload(self, message: ChatLogMessage) -> dict[str, object]:
        timestamp_value = message.timestamp
        timestamp = (
            timestamp_value.isoformat()
            if isinstance(timestamp_value, datetime)
            else str(timestamp_value)
        )
        payload: dict[str, object] = {
            "id": message.id or f"legacy-{uuid4()}",
            "role": message.role,
            "content": message.content,
            "timestamp": timestamp,
        }
        if message.metadata is not None:
            payload["metadata"] = message.metadata.model_dump(mode="json")
        return payload
