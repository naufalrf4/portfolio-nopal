import logging
from dataclasses import dataclass
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
from app.services.llm_service import GeneratedText, LlmService, QueryPlan
from app.services.prompt_builder import (
    build_abstention_response,
    build_chat_prompt,
    build_grounded_actions,
    build_query_analysis_prompt,
    build_source_metadata,
    fallback_query_plan,
    format_context,
    format_history,
    is_freelance_intent,
)
from app.services.repository import RagRepository, RetrievedChunk
from app.services.tool_service import ToolExecutionResult, ToolService

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class ChatHistoryContext:
    history: list[ChatLogMessage]
    history_text: str


@dataclass(slots=True)
class ChatExecutionContext:
    query_plan: QueryPlan
    intent_context: dict[str, object]
    tool_result: ToolExecutionResult | None


@dataclass(slots=True)
class ChatRetrievalContext:
    retrieved_chunks: list[RetrievedChunk]
    sources: list[str]
    citations: list[ChatCitation]
    response_actions: list[SuggestedAction]
    retrieval_confidence: float
    should_abstain: bool


class ChatService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.admin_client = AdminApiClient()
        self.embedding_service = EmbeddingService()
        self.llm_service = LlmService()
        self.repository = RagRepository(session)
        self.tool_service = ToolService()

    async def chat(self, request: ChatRequest) -> ChatResponse:
        session_id = request.session_id or uuid4()
        history_context = await self._load_history_context(session_id)
        execution_context = await self._prepare_execution_context(
            request.message, history_context.history_text
        )
        retrieval_context = await self._build_retrieval_context(execution_context.query_plan)
        final_text, tokens = await self._generate_response(
            request.message,
            history_context.history_text,
            execution_context,
            retrieval_context,
        )
        await self._persist_chat_log(
            session_id,
            request.message,
            final_text,
            tokens,
        )

        return ChatResponse(
            sessionId=session_id,
            message=final_text,
            sources=retrieval_context.sources,
            citations=retrieval_context.citations,
            suggestedActions=retrieval_context.response_actions,
            metadata=ChatPublicMetadata(
                workflow=execution_context.query_plan.workflow,
                intent=execution_context.query_plan.intent,
                queryLanguage=execution_context.query_plan.query_language,
                answerLanguage=execution_context.query_plan.answer_language,
                retrievalConfidence=retrieval_context.retrieval_confidence,
                abstained=retrieval_context.should_abstain,
            ),
        )

    async def _load_history_context(self, session_id) -> ChatHistoryContext:
        try:
            history = await self.admin_client.get_chat_log(str(session_id))
        except Exception:  # noqa: BLE001
            logger.warning("Failed to load chat history from admin API", exc_info=True)
            history = []

        return ChatHistoryContext(
            history=history,
            history_text=format_history(history, settings.chat_history_limit),
        )

    async def _prepare_execution_context(
        self, message: str, history_text: str
    ) -> ChatExecutionContext:
        query_plan = await self.llm_service.analyze_query(
            build_query_analysis_prompt(message, history_text),
            fallback_query_plan(message),
        )
        if (
            is_freelance_intent(query_plan.intent)
            and query_plan.workflow in {"tool", "hybrid"}
            and not query_plan.tool_name
        ):
            query_plan.tool_name = "feature_pricing_quote"

        intent_context = await self._load_intent_context(query_plan.intent, query_plan.tool_name)
        tool_result = self._execute_tool_if_needed(message, query_plan, intent_context)
        return ChatExecutionContext(
            query_plan=query_plan,
            intent_context=intent_context,
            tool_result=tool_result,
        )

    def _execute_tool_if_needed(
        self, message: str, query_plan: QueryPlan, intent_context: dict[str, object]
    ) -> ToolExecutionResult | None:
        if query_plan.workflow not in {"tool", "hybrid"} or not query_plan.tool_name:
            return None

        tool_arguments = dict(query_plan.tool_arguments)
        if intent_context:
            tool_arguments.update(intent_context)
        return self.tool_service.execute(
            query_plan.tool_name,
            tool_arguments,
            message,
            query_plan.answer_language,
        )

    async def _build_retrieval_context(self, query_plan: QueryPlan) -> ChatRetrievalContext:
        retrieved_chunks = await self._retrieve_chunks(query_plan)
        citations = self._build_citations(retrieved_chunks)
        citation_payload = [
            citation.model_dump(mode="json", by_alias=True) for citation in citations
        ]
        grounded_actions = build_grounded_actions(query_plan.suggested_actions, citation_payload)
        retrieval_confidence = self._compute_retrieval_confidence(retrieved_chunks)
        should_abstain = (
            query_plan.workflow == "rag"
            and query_plan.needs_portfolio_context
            and self._should_abstain(retrieved_chunks, retrieval_confidence)
        )
        return ChatRetrievalContext(
            retrieved_chunks=retrieved_chunks,
            sources=list(dict.fromkeys(chunk.source for chunk in retrieved_chunks)),
            citations=citations,
            response_actions=[SuggestedAction(**action) for action in grounded_actions],
            retrieval_confidence=retrieval_confidence,
            should_abstain=should_abstain,
        )

    async def _retrieve_chunks(self, query_plan: QueryPlan) -> list[RetrievedChunk]:
        retrieved_chunk_map: dict[tuple[str, str], RetrievedChunk] = {}
        if query_plan.workflow == "tool" or not query_plan.needs_portfolio_context:
            return []

        try:
            for retrieval_query in query_plan.retrieval_queries:
                query_embedding = (await self.embedding_service.embed_texts([retrieval_query]))[0]
                search_results = await self.repository.search_chunks_hybrid(
                    query_embedding,
                    retrieval_query,
                    settings.retrieval_limit,
                    ["public"],
                )
                for chunk in search_results:
                    fingerprint = (chunk.source, chunk.content)
                    existing = retrieved_chunk_map.get(fingerprint)
                    if existing is None or chunk.score > existing.score:
                        retrieved_chunk_map[fingerprint] = chunk
                        continue
                    for reason in chunk.match_reasons:
                        if reason not in existing.match_reasons:
                            existing.match_reasons.append(reason)
                    existing.dense_score = max(existing.dense_score, chunk.dense_score)
                    existing.lexical_score = max(existing.lexical_score, chunk.lexical_score)
                    existing.score = max(existing.score, chunk.score)
        except RagServiceError:
            raise
        except Exception as exc:  # noqa: BLE001
            raise RagServiceError(
                "The contextual retrieval database is currently unavailable.",
                "RAG_DATABASE_UNAVAILABLE",
                503,
            ) from exc

        return sorted(retrieved_chunk_map.values(), key=lambda chunk: chunk.score, reverse=True)[
            : settings.retrieval_limit
        ]

    async def _generate_response(
        self,
        message: str,
        history_text: str,
        execution_context: ChatExecutionContext,
        retrieval_context: ChatRetrievalContext,
    ) -> tuple[str, dict[str, int]]:
        query_plan = execution_context.query_plan
        tool_result = execution_context.tool_result
        if self._should_return_tool_result(query_plan, tool_result):
            assert tool_result is not None
            return tool_result.text, self._build_analysis_only_tokens(query_plan)
        if retrieval_context.should_abstain:
            return build_abstention_response(
                query_plan.answer_language, query_plan.portfolio_areas
            ), self._build_analysis_only_tokens(query_plan)

        context = self._build_generation_context(
            execution_context.intent_context,
            tool_result,
            retrieval_context.retrieved_chunks,
        )
        prompt = build_chat_prompt(
            message,
            history_text,
            context,
            query_plan.answer_language,
        )
        generated: GeneratedText = await self.llm_service.answer_question(prompt)
        return generated.text, {
            "analysisPrompt": query_plan.prompt_tokens,
            "analysisCompletion": query_plan.completion_tokens,
            "prompt": generated.prompt_tokens,
            "completion": generated.completion_tokens,
        }

    @staticmethod
    def _should_return_tool_result(
        query_plan: QueryPlan, tool_result: ToolExecutionResult | None
    ) -> bool:
        if tool_result is None:
            return False
        if query_plan.workflow == "tool":
            return True
        if not is_freelance_intent(query_plan.intent):
            return False
        if query_plan.workflow != "hybrid":
            return False

        status = str(tool_result.metadata.get("status") or "").strip().lower()
        return status == "completed"

    @staticmethod
    def _build_analysis_only_tokens(query_plan: QueryPlan) -> dict[str, int]:
        return {
            "analysisPrompt": query_plan.prompt_tokens,
            "analysisCompletion": query_plan.completion_tokens,
            "prompt": 0,
            "completion": 0,
        }

    def _build_generation_context(
        self,
        intent_context: dict[str, object],
        tool_result: ToolExecutionResult | None,
        retrieved_chunks: list[RetrievedChunk],
    ) -> str:
        context_sections: list[dict[str, object]] = []
        if tool_result is not None:
            context_sections.append(
                {
                    "source": f"tool:{tool_result.tool_name}",
                    "contextual_content": tool_result.context,
                }
            )
        context_sections.extend(self._build_intent_context_sections(intent_context))
        context_sections.extend(
            [
                {
                    "source": chunk.source,
                    "contextual_content": chunk.contextual_content,
                }
                for chunk in retrieved_chunks
            ]
        )
        return format_context(context_sections)

    async def _persist_chat_log(
        self,
        session_id,
        user_message: str,
        final_text: str,
        tokens: dict[str, int],
    ) -> None:
        now = datetime.now(timezone.utc)
        new_messages: list[dict[str, object]] = [
            {
                "id": f"{session_id}-user-{int(now.timestamp())}",
                "role": "user",
                "content": user_message,
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
                    "tokens": sum(tokens.values()),
                },
            },
        ]
        try:
            await self.admin_client.save_chat_log(str(session_id), new_messages, mode="append")
        except Exception:  # noqa: BLE001
            logger.warning("Failed to persist chat log to admin API", exc_info=True)

    @staticmethod
    def _build_citations(chunks) -> list[ChatCitation]:
        citations: list[ChatCitation] = []
        seen: set[tuple[str | None, str | None, str | None]] = set()
        for chunk in chunks:
            metadata = dict(chunk.metadata or {})
            citation = ChatCitation(
                source=chunk.source,
                title=str(metadata.get("title")) if metadata.get("title") else None,
                route=str(metadata.get("route")) if metadata.get("route") else None,
                routeLabel=str(metadata.get("route_label"))
                if metadata.get("route_label")
                else None,
                sourceType=str(metadata.get("source_type"))
                if metadata.get("source_type")
                else None,
                sourceRef=str(metadata.get("source_ref")) if metadata.get("source_ref") else None,
                section=str(metadata.get("section")) if metadata.get("section") else None,
            )
            key = (citation.source_type, citation.source_ref, citation.route)
            if key in seen:
                continue
            seen.add(key)
            citations.append(citation)
        return citations

    @staticmethod
    def _compute_retrieval_confidence(chunks) -> float:
        if not chunks:
            return 0.0
        top_score = chunks[0].score
        second_score = chunks[1].score if len(chunks) > 1 else 0.0
        coverage_bonus = min(0.1, len(chunks) * 0.03)
        lexical_bonus = (
            0.05 if any("lexical" in chunk.match_reasons for chunk in chunks[:2]) else 0.0
        )
        return min(1.0, (top_score * 0.75) + (second_score * 0.2) + coverage_bonus + lexical_bonus)

    @staticmethod
    def _should_abstain(chunks, confidence: float) -> bool:
        if not chunks:
            return True
        return confidence < 0.45

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
            payload["metadata"] = message.metadata.model_dump(mode="json", by_alias=True)
        return payload

    async def _load_intent_context(self, intent: str, tool_name: str | None) -> dict[str, object]:
        if not is_freelance_intent(intent) and tool_name != "feature_pricing_quote":
            return {}

        try:
            context = await self.admin_client.get_freelance_intent_context()
        except Exception:  # noqa: BLE001
            logger.warning("Failed to load tool intent context from admin API", exc_info=True)
            return {}

        profile = context.freelance_profile
        if profile is None:
            return {}

        payload = profile.model_dump(mode="json", by_alias=True)
        has_content = (
            payload.get("hourlyRate") is not None
            or payload.get("completedProjects") is not None
            or bool(payload.get("pricingNotes"))
            or bool(payload.get("featurePricing"))
            or bool(payload.get("projectReferences"))
        )
        return {"freelanceProfile": payload} if has_content else {}

    @staticmethod
    def _build_intent_context_sections(
        intent_context: dict[str, object],
    ) -> list[dict[str, object]]:
        profile = intent_context.get("freelanceProfile")
        if not isinstance(profile, dict):
            return []

        summary_lines = ["Freelance profile reference data from Admin."]
        hourly_rate = profile.get("hourlyRate")
        currency = profile.get("currency") or "IDR"
        completed_projects = profile.get("completedProjects")
        pricing_notes = str(profile.get("pricingNotes") or "").strip()
        feature_pricing = profile.get("featurePricing")
        project_references = profile.get("projectReferences")

        if hourly_rate is not None:
            summary_lines.append(f"Reference hourly rate: {hourly_rate} {currency}.")
        if completed_projects is not None:
            summary_lines.append(f"Completed freelance projects: {completed_projects}.")
        if isinstance(feature_pricing, list) and feature_pricing:
            summary_lines.append(f"Feature pricing references available: {len(feature_pricing)}.")
        if isinstance(project_references, list) and project_references:
            summary_lines.append(f"Project references available: {len(project_references)}.")
        if pricing_notes:
            summary_lines.append(f"Pricing notes: {pricing_notes}")

        metadata = build_source_metadata("knowledge", "freelance-profile", "Freelance Profile")
        return [
            {
                "source": metadata["source_label"],
                "contextual_content": " ".join(summary_lines),
            }
        ]
