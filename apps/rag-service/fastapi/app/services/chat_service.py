import logging
import time
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.schemas.admin import ChatLogMessage
from app.schemas.chat import ChatRequest, ChatResponse
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

        tool_result = None
        if query_plan.workflow in {"tool", "hybrid"} and query_plan.tool_name:
            tool_result = self.tool_service.execute(
                query_plan.tool_name, query_plan.tool_arguments, request.message
            )

        retrieved_chunks = []
        seen_chunks: set[tuple[str, str]] = set()
        if query_plan.workflow != "tool" and query_plan.needs_portfolio_context:
            try:
                for retrieval_query in query_plan.retrieval_queries:
                    query_embedding = (await self.embedding_service.embed_texts([retrieval_query]))[
                        0
                    ]
                    search_results = await self.repository.search_chunks(
                        query_embedding,
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
        if query_plan.workflow == "tool" and tool_result is not None:
            final_text = tool_result.text
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
            prompt = build_chat_prompt(request.message, history_text, context, preferred_language)
            generated = await self.llm_service.answer_question(prompt)
            final_text = generated.text
            tokens = {
                "analysisPrompt": query_plan.prompt_tokens,
                "analysisCompletion": query_plan.completion_tokens,
                "prompt": generated.prompt_tokens,
                "completion": generated.completion_tokens,
            }

        now = datetime.now(timezone.utc)
        new_messages = [
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
            },
        ]
        persisted_messages = [
            self._message_to_payload(message) for message in history
        ] + new_messages
        try:
            await self.admin_client.save_chat_log(str(session_id), persisted_messages)
        except Exception:  # noqa: BLE001
            logger.warning("Failed to persist chat log to admin API", exc_info=True)

        duration_ms = int((time.perf_counter() - started_at) * 1000)
        return ChatResponse(
            sessionId=session_id,
            message=final_text,
            sources=sources,
            metadata={
                "model": settings.chat_model,
                "provider": "google",
                "workflow": query_plan.workflow,
                "intent": query_plan.intent,
                "needsPortfolioContext": query_plan.needs_portfolio_context,
                "toolName": query_plan.tool_name,
                "toolArguments": query_plan.tool_arguments,
                "toolResult": tool_result.metadata if tool_result is not None else None,
                "retrievalQueries": query_plan.retrieval_queries,
                "portfolioAreas": query_plan.portfolio_areas,
                "suggestedActions": query_plan.suggested_actions,
                "retrievalPasses": len(query_plan.retrieval_queries),
                "retrievedChunkCount": len(retrieved_chunks),
                "preferredLanguage": preferred_language,
                "tokens": tokens,
                "durationMs": duration_ms,
            },
        )

    def _message_to_payload(self, message: ChatLogMessage) -> dict[str, str]:
        timestamp_value = message.timestamp
        timestamp = (
            timestamp_value.isoformat()
            if isinstance(timestamp_value, datetime)
            else str(timestamp_value)
        )
        return {
            "id": message.id or f"legacy-{uuid4()}",
            "role": message.role,
            "content": message.content,
            "timestamp": timestamp,
        }
