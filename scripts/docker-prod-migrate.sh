#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

compose() {
  docker compose \
    --env-file "$ROOT_DIR/.env.docker.prod" \
    -f "$ROOT_DIR/docker-compose.prod.yml" \
    "$@"
}

# Build from the CURRENT checkout first. `compose run` reuses a stale image if
# one already exists, which would apply yesterday's migration set and silently
# leave a new migration unapplied.
compose --profile ops build rag-bootstrap admin-migrate

compose --profile ops run --rm rag-bootstrap

compose run --rm admin-migrate

# Fail loudly on drift. Without this a migration that exists in git but never
# reached the database stays invisible until app code hits the missing relation
# at runtime (Postgres 42P01).
compose run --rm admin-migrate bun run db:verify
