# FastAPI RAG Service

This directory contains the active FastAPI implementation for the portfolio RAG backend.

Current status:

- FastAPI is the active runtime
- pgvector-backed retrieval lives in PostgreSQL `rag` schema
- external routes remain `GET /health`, `POST /chat`, and `POST /ingest`
- Gemini powers embeddings, contextual chunk generation, and answer generation

Implemented boundary:

- preserve `GET /health`
- preserve `POST /chat`
- preserve `POST /ingest`
- store vectors, chunks, and ingestion runs in Postgres `rag` schema via Alembic
- use Gemini embeddings (`gemini-embedding-001`, 768 dims)
- generate contextual chunk prefixes with Gemini during ingest
- persist chat logs back to Admin internal API
- support private source ingestion and admin-only private chat

Local commands:

```bash
cd apps/rag-service/fastapi
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3005
uv run python -c "from app.main import app; print(app.title)"
```

Notes:

- `/ingest` expects `X-Service-Token` that matches `RAG_INGEST_SERVICE_TOKEN` (or legacy `ADMIN_SERVICE_TOKEN` fallback)
- Admin internal API calls from RAG use `ADMIN_INTERNAL_API_TOKEN` (or legacy `ADMIN_SERVICE_TOKEN` fallback)
- `/chat` and `/ingest` keep the same external request/response envelope used by the public chatbot and Admin ingest flows
- local Docker Compose uses `pgvector/pgvector:pg16` so the `vector` extension is available during startup
