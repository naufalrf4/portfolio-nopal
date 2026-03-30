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
    build_abstention_response,
    build_chat_prompt,
    build_query_analysis_prompt,
    fallback_query_plan,
    format_context,
    format_history,
)
from app.services.repository import RagRepository, RetrievedChunk
from app.services.tool_service import ToolService

logger = logging.getLogger(__name__)
ABOUT_FALLBACK_ACTION = SuggestedAction(
    type="open_page",
    target="/about",
    label="Open about page",
)


def _string_or_none(value: object) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


class ChatService:
    session: AsyncSession
    admin_client: AdminApiClient
    embedding_service: EmbeddingService
    llm_service: LlmService
    repository: RagRepository
    tool_service: ToolService

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
        tool_arguments = await self._build_tool_arguments(tool_name, query_plan.tool_arguments)
        tool_result = None
        if query_plan.workflow in {"tool", "hybrid"} and tool_name:
            tool_result = self.tool_service.execute(
                tool_name,
                tool_arguments,
                request.message,
                query_plan.answer_language,
            )

        retrieved_chunks: list[RetrievedChunk] = []
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

        minimum_confidence = self._minimum_retrieval_confidence(query_plan.intent)

        if tool_result is not None and query_plan.workflow == "tool":
            final_text = tool_result.text
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": 0,
                "completion": 0,
            }
        elif tool_result is not None and query_plan.workflow == "hybrid" and not retrieved_chunks:
            final_text = tool_result.text
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": 0,
                "completion": 0,
            }
        elif query_plan.needs_portfolio_context and retrieval_confidence < minimum_confidence:
            abstained = True
            final_text = build_abstention_response(
                query_plan.answer_language,
                query_plan.portfolio_areas,
                reason="no_data" if not retrieved_chunks else "low_confidence",
            )
            suggested_actions = self._build_abstention_actions(query_plan.portfolio_areas)
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
        if intent == "freelance_services" and workflow in {"tool", "hybrid"}:
            return "freelance_profile_lookup"
        return None

    async def _build_tool_arguments(
        self,
        tool_name: str | None,
        tool_arguments: dict[str, object],
    ) -> dict[str, object]:
        if tool_name not in {"feature_pricing_quote", "freelance_profile_lookup"}:
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
    def _build_citations(retrieved_chunks: list[RetrievedChunk]) -> list[ChatCitation]:
        citations: list[ChatCitation] = []
        seen: set[tuple[str, str | None]] = set()
        for chunk in retrieved_chunks:
            metadata = chunk.metadata
            route = _string_or_none(metadata.get("route"))
            key = (chunk.source, route)
            if key in seen:
                continue
            seen.add(key)
            citations.append(
                ChatCitation(
                    source=chunk.source,
                    title=_string_or_none(metadata.get("title")),
                    route=route,
                    routeLabel=_string_or_none(metadata.get("route_label")),
                    sourceType=_string_or_none(metadata.get("source_type")),
                    sourceRef=_string_or_none(metadata.get("source_ref")),
                    section=_string_or_none(metadata.get("section")),
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
    def _minimum_retrieval_confidence(intent: str) -> float:
        if intent in {
            "skills_question",
            "experience_question",
            "personal_profile",
            "contact_question",
        }:
            return 0.22
        if intent == "general_portfolio":
            return 0.3
        return 0.45

    @staticmethod
    def _build_abstention_actions(portfolio_areas: list[str]) -> list[SuggestedAction]:
        if "contact" in portfolio_areas:
            return [
                SuggestedAction(
                    type="open_page",
                    target="/contact",
                    label="Open contact page",
                )
            ]
        if "projects" in portfolio_areas:
            return [
                SuggestedAction(
                    type="open_page",
                    target="/projects",
                    label="View projects",
                )
            ]
        return [ABOUT_FALLBACK_ACTION]

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
