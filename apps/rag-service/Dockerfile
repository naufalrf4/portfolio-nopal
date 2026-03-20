FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential curl libmagic1 poppler-utils tesseract-ocr && rm -rf /var/lib/apt/lists/* && pip install uv

FROM base AS dev
WORKDIR /app/fastapi
COPY fastapi/pyproject.toml fastapi/uv.lock ./
RUN uv sync --frozen
CMD ["sh", "-lc", "uv sync --frozen && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3005"]

FROM base AS prod
WORKDIR /app/fastapi
COPY fastapi/pyproject.toml fastapi/uv.lock ./
RUN uv sync --frozen --no-dev
RUN groupadd --system app && useradd --system --gid app --create-home --home-dir /home/app app
COPY --chown=app:app fastapi ./
USER app
EXPOSE 3005
CMD [".venv/bin/python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3005"]
