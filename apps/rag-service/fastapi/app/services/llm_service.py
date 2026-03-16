import json
from dataclasses import dataclass
from typing import cast

from google import genai
from google.genai import types as genai_types

from app.config import settings
from app.services.errors import RagServiceError


@dataclass(slots=True)
class GeneratedText:
    text: str
    prompt_tokens: int
    completion_tokens: int


@dataclass(slots=True)
class QueryPlan:
    workflow: str
    intent: str
    needs_portfolio_context: bool
    tool_name: str | None
    tool_arguments: dict[str, object]
    retrieval_queries: list[str]
    portfolio_areas: list[str]
    suggested_actions: list[dict[str, str]]
    prompt_tokens: int
    completion_tokens: int


class LlmService:
    def __init__(self) -> None:
        self._client = (
            genai.Client(api_key=settings.gemini_api_key) if settings.gemini_api_key else None
        )

    async def summarize_document(self, title: str, source: str, prompt: str) -> str:
        if self._client is None:
            return (
                f"{title} ({source}) contains information relevant to NaufalRF portfolio queries."
            )

        try:
            result = await self._generate(
                model=settings.context_model, prompt=prompt, temperature=0.2
            )
        except RagServiceError:
            return (
                f"{title} ({source}) contains information relevant to NaufalRF portfolio queries."
            )

        return (
            result.text
            or f"{title} ({source}) contains information relevant to NaufalRF portfolio queries."
        )

    async def contextualize_chunk(self, prompt: str, fallback: str) -> str:
        if self._client is None:
            return fallback

        try:
            result = await self._generate(
                model=settings.context_model, prompt=prompt, temperature=0.1
            )
        except RagServiceError:
            return fallback

        return result.text or fallback

    async def answer_question(self, prompt: str) -> GeneratedText:
        if self._client is None:
            raise RagServiceError(
                "GEMINI_API_KEY is not configured.", "GEMINI_API_KEY_NOT_CONFIGURED", 503
            )

        return await self._generate(model=settings.chat_model, prompt=prompt, temperature=0.2)

    async def analyze_query(self, prompt: str, fallback: dict[str, object]) -> QueryPlan:
        if self._client is None:
            return self._build_fallback_query_plan(fallback)

        try:
            result = await self._generate(model=settings.chat_model, prompt=prompt, temperature=0.1)
            payload = json.loads(result.text)
        except (RagServiceError, json.JSONDecodeError, TypeError, ValueError):
            return self._build_fallback_query_plan(fallback)

        retrieval_queries = self._as_string_list(
            payload.get("retrievalQueries"),
            self._as_string_list(fallback.get("retrievalQueries")),
        )
        portfolio_areas = self._as_string_list(
            payload.get("portfolioAreas"),
            self._as_string_list(fallback.get("portfolioAreas"), ["general"]),
        )
        suggested_actions = self._as_action_list(
            payload.get("suggestedActions"),
            self._as_action_list(fallback.get("suggestedActions")),
        )

        workflow = str(payload.get("workflow", fallback.get("workflow", "rag"))).strip().lower()
        if workflow not in {"rag", "tool", "hybrid"}:
            workflow = str(fallback.get("workflow", "rag"))

        tool_name = payload.get("toolName", fallback.get("toolName"))
        if tool_name is not None:
            tool_name = str(tool_name).strip() or None

        tool_arguments = self._as_object_dict(payload.get("toolArguments"))
        if not tool_arguments:
            tool_arguments = self._as_object_dict(fallback.get("toolArguments"))

        return QueryPlan(
            workflow=workflow,
            intent=str(payload.get("intent", fallback.get("intent", "portfolio_question"))),
            needs_portfolio_context=bool(payload.get("needsPortfolioContext", True)),
            tool_name=tool_name,
            tool_arguments=tool_arguments,
            retrieval_queries=retrieval_queries[:3],
            portfolio_areas=portfolio_areas,
            suggested_actions=suggested_actions,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
        )

    async def _generate(self, model: str, prompt: str, temperature: float) -> GeneratedText:
        if self._client is None:
            raise RagServiceError(
                "GEMINI_API_KEY is not configured.", "GEMINI_API_KEY_NOT_CONFIGURED", 503
            )

        client = self._client.aio
        response = await client.models.generate_content(
            model=model,
            contents=prompt,
            config=genai_types.GenerateContentConfig(temperature=temperature),
        )

        text = (getattr(response, "text", None) or "").strip()
        if not text:
            raise RagServiceError("LLM response was empty.", "LLM_RESPONSE_EMPTY", 502)

        usage = getattr(response, "usage_metadata", None)
        prompt_tokens = int(getattr(usage, "prompt_token_count", 0) or 0)
        completion_tokens = int(getattr(usage, "candidates_token_count", 0) or 0)

        return GeneratedText(
            text=text,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
        )

    def _build_fallback_query_plan(self, fallback: dict[str, object]) -> QueryPlan:
        return QueryPlan(
            workflow=str(fallback.get("workflow", "rag")),
            intent=str(fallback.get("intent", "portfolio_question")),
            needs_portfolio_context=bool(fallback.get("needsPortfolioContext", True)),
            tool_name=(str(fallback.get("toolName", "")).strip() or None),
            tool_arguments=self._as_object_dict(fallback.get("toolArguments")),
            retrieval_queries=self._as_string_list(fallback.get("retrievalQueries"))[:3],
            portfolio_areas=self._as_string_list(fallback.get("portfolioAreas")),
            suggested_actions=self._as_action_list(fallback.get("suggestedActions")),
            prompt_tokens=0,
            completion_tokens=0,
        )

    def _as_object_dict(self, value: object) -> dict[str, object]:
        if not isinstance(value, dict):
            return {}
        typed_value = cast(dict[object, object], value)
        return {str(key): cast_value for key, cast_value in typed_value.items()}

    def _as_string_list(self, value: object, default: list[str] | None = None) -> list[str]:
        if not isinstance(value, list):
            return default.copy() if default is not None else []

        typed_value = cast(list[object], value)
        result = [str(item).strip() for item in typed_value if str(item).strip()]
        return result or (default.copy() if default is not None else [])

    def _as_action_list(
        self, value: object, default: list[dict[str, str]] | None = None
    ) -> list[dict[str, str]]:
        if not isinstance(value, list):
            return default.copy() if default is not None else []

        actions: list[dict[str, str]] = []
        typed_value = cast(list[object], value)
        for item in typed_value:
            if not isinstance(item, dict):
                continue
            typed_item = cast(dict[object, object], item)
            action_type = str(typed_item.get("type", "")).strip()
            target = str(typed_item.get("target", "")).strip()
            label = str(typed_item.get("label", "")).strip()
            if action_type and target and label:
                actions.append({"type": action_type, "target": target, "label": label})

        return actions or (default.copy() if default is not None else [])
