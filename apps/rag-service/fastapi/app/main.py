from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.api.router import api_router
from app.config import settings

LLMS_TXT = """# NaufalRF Contextual RAG Service

> Portfolio-aware retrieval and chat backend for the NaufalRF ecosystem. This service handles
> contextual retrieval, chat generation, and Admin-triggered ingestion without becoming a
> general content authority.

## What this service does

- Exposes `GET /health`, `POST /chat`, and `POST /ingest`.
- Stores vectors, chunks, and ingestion runs in Postgres `rag` tables.
- Coordinates with Admin internal APIs using service-token authentication.
- Supports general assistant conversations while grounding portfolio answers when context is needed.

## Important behavior

- Direct database access is limited to approved RAG responsibilities.
- Public browser chat traffic should reach this service through the public Astro proxy, not
  directly from the browser.
- Admin remains the content authority; this service ingests and retrieves approved material.
- `/ingest` is token-protected and intended for service-to-service use.

## Related docs

- [/llms-full.txt](./llms-full.txt) - deeper implementation context for the RAG backend
"""

LLMS_FULL_TXT = """# NaufalRF Contextual RAG Service — Full LLM Context

## Overview

This FastAPI service is the retrieval and generation backend for the portfolio ecosystem. It
handles ingestion, vector retrieval, and chat response generation, while preserving Admin as
the primary content authority.

## Core responsibilities

- Ingest approved content into RAG tables and chunk/vector structures.
- Serve chat requests for the public AI assistant.
- Support general assistant behavior while using portfolio context when it is actually needed.
- Persist chat logs back to Admin internal APIs.

## Architecture

- Runtime: FastAPI inside `apps/rag-service/fastapi/` with Bun wrapper scripts at
  `apps/rag-service`.
- Database: direct Postgres / pgvector access for RAG-only tables and responsibilities.
- Integrations: Admin internal API for coordination, Gemini-powered embeddings and answer
  generation.

## Key files

- `app/main.py` — app creation, CORS, and top-level route registration.
- `app/api/router.py` — route composition.
- `app/api/routes/chat.py` — public chat endpoint.
- `app/api/routes/ingest.py` — token-protected ingest endpoint.
- `app/services/chat_service.py` — orchestration for retrieval, prompt building, tool use, and
  persistence.
- `app/services/prompt_builder.py` — query analysis and prompt construction.
- `app/services/repository.py` — retrieval queries.
- `app/services/ingest_service.py` — ingestion flow.

## Constraints

- Do not expand this service into a general content management authority.
- Preserve route compatibility for `/health`, `/chat`, and `/ingest`.
- Preserve the Admin service-token coordination boundary.

"""


def create_app() -> FastAPI:
    docs_enabled = settings.app_env.lower() != "production"

    app = FastAPI(
        title="NaufalRF Contextual RAG Service",
        version="0.1.0",
        docs_url="/docs" if docs_enabled else None,
        redoc_url="/redoc" if docs_enabled else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Service-Token"],
        allow_credentials=False,
    )

    @app.get("/llms.txt", response_class=PlainTextResponse, include_in_schema=False)
    async def llms_index() -> PlainTextResponse:
        return PlainTextResponse(LLMS_TXT)

    @app.get("/llms-full.txt", response_class=PlainTextResponse, include_in_schema=False)
    async def llms_full() -> PlainTextResponse:
        return PlainTextResponse(LLMS_FULL_TXT)

    app.include_router(api_router)
    return app


app = create_app()
