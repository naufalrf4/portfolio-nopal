from typing import Any

import httpx

from app.config import settings
from app.schemas.admin import (
    ChatLogMessage,
    ChatLogRecord,
    ContentExport,
    FreelanceIntentContext,
    KnowledgeDocument,
)
from app.services.errors import RagServiceError


class AdminApiClient:
    def __init__(self) -> None:
        self.base_url = settings.admin_api_url.rstrip("/")
        self.timeout = httpx.Timeout(settings.admin_api_timeout_ms / 1000)

    def _headers(self) -> dict[str, str]:
        admin_internal_api_token = settings.admin_internal_api_token or settings.admin_service_token

        if not admin_internal_api_token:
            raise RagServiceError(
                "ADMIN_INTERNAL_API_TOKEN is not configured.",
                "ADMIN_INTERNAL_API_TOKEN_NOT_CONFIGURED",
                503,
            )

        return {
            "Content-Type": "application/json",
            "X-Service-Token": admin_internal_api_token,
        }

    async def _request(self, method: str, path: str, json: dict[str, Any] | None = None) -> Any:
        url = f"{self.base_url}{path}"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.request(method, url, headers=self._headers(), json=json)
        except httpx.TimeoutException as exc:
            raise RagServiceError(
                f"Admin API request timed out for {path}.",
                "ADMIN_API_TIMEOUT",
                504,
            ) from exc
        except httpx.HTTPError as exc:
            raise RagServiceError(
                f"Admin API request failed for {path}.",
                "ADMIN_API_UNAVAILABLE",
                502,
            ) from exc

        payload = response.json() if response.content else {}
        if not response.is_success:
            message = payload.get("error", {}).get("message") if isinstance(payload, dict) else None
            code = payload.get("error", {}).get("code") if isinstance(payload, dict) else None
            raise RagServiceError(
                message or f"Admin API returned {response.status_code} for {path}.",
                code or "ADMIN_API_ERROR",
                response.status_code,
            )

        if isinstance(payload, dict) and "data" in payload:
            return payload["data"]

        return payload

    async def get_content_export(self) -> ContentExport:
        payload = await self._request("GET", "/api/v1/internal/content")
        return ContentExport.model_validate(payload)

    async def get_freelance_intent_context(self) -> FreelanceIntentContext:
        payload = await self._request("GET", "/api/v1/internal/intent-context/freelance-profile")
        return FreelanceIntentContext.model_validate(payload)

    async def get_knowledge_doc_by_id(self, document_id: str) -> KnowledgeDocument:
        payload = await self._request("GET", f"/api/v1/internal/knowledge/{document_id}")
        return KnowledgeDocument.model_validate(payload)

    async def get_knowledge_docs(self) -> list[KnowledgeDocument]:
        payload = await self._request("GET", "/api/v1/internal/knowledge")
        return [KnowledgeDocument.model_validate(item) for item in payload]

    async def mark_knowledge_doc_indexed(self, document_id: str) -> None:
        await self._request("PATCH", f"/api/v1/internal/knowledge/{document_id}/indexed")

    async def get_chat_log(self, session_id: str) -> list[ChatLogMessage]:
        payload = await self._request("GET", f"/api/v1/internal/chat-logs?sessionId={session_id}")
        if not payload:
            return []
        return ChatLogRecord.model_validate(payload).messages

    async def save_chat_log(
        self, session_id: str, messages: list[dict[str, object]], mode: str = "replace"
    ) -> None:
        await self._request(
            "POST",
            "/api/v1/internal/chat-logs",
            json={
                "sessionId": session_id,
                "messages": messages,
                "mode": mode,
            },
        )
