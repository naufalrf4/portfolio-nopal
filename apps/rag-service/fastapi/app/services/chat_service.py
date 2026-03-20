import logging
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.schemas.admin import ChatLogMessage
from app.schemas.chat import ChatPublicMetadata, ChatRequest, ChatResponse, SuggestedAction
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
        retrieval_confidence = max((chunk.score for chunk in retrieved_chunks), default=0.0)

        sources = list(dict.fromkeys(chunk.source for chunk in retrieved_chunks))
        if query_plan.workflow == "tool" and tool_result is not None:
            final_text = tool_result.text
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
            },
        ]
        persisted_messages: list[dict[str, object]] = []
        for message in history:
            persisted_messages.append(self._message_to_payload(message))
        persisted_messages.extend(new_messages)
        try:
            await self.admin_client.save_chat_log(str(session_id), persisted_messages)
        except Exception:  # noqa: BLE001
            logger.warning("Failed to persist chat log to admin API", exc_info=True)

        public_metadata = ChatPublicMetadata.model_validate(
            {
                "workflow": query_plan.workflow,
                "intent": query_plan.intent,
                "queryLanguage": query_plan.query_language,
                "answerLanguage": query_plan.answer_language,
                "retrievalConfidence": retrieval_confidence,
                "abstained": False,
            }
        )
        suggested_actions = [SuggestedAction(**action) for action in query_plan.suggested_actions]

        return ChatResponse.model_validate(
            {
                "sessionId": session_id,
                "message": final_text,
                "sources": sources,
                "suggestedActions": [
                    action.model_dump(by_alias=True) for action in suggested_actions
                ],
                "metadata": public_metadata.model_dump(by_alias=True),
            }
        )

    def _message_to_payload(self, message: ChatLogMessage) -> dict[str, object]:
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
