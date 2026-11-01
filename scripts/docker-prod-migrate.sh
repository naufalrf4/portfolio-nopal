#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PROD_ENV_FILE:-$ROOT_DIR/.env.docker.prod}"
if [ ! -f "$ENV_FILE" ] && [ -f "$ROOT_DIR/.env" ]; then
  # Dokploy writes its Compose variables to .env in the deployed checkout.
  ENV_FILE="$ROOT_DIR/.env"
fi
if [ ! -f "$ENV_FILE" ]; then
  echo "production env file not found: set PROD_ENV_FILE or provide .env.docker.prod" >&2
  exit 1
fi

compose() {
  docker compose \
    --env-file "$ENV_FILE" \
    -f "$ROOT_DIR/docker-compose.prod.yml" \
    "$@"
}

# Build from the CURRENT checkout first. Build these images in separate
# commands: Compose/BuildKit may overlap their stages even with --parallel 1,
# and Admin's Next.js build is memory intensive. The migrator target only
# installs dependencies and copies Drizzle source; it never runs next build.
compose --profile ops build rag-bootstrap
compose --profile ops build admin-migrate

compose --profile ops run --rm rag-bootstrap

compose --profile ops run --rm admin-migrate

# Fail loudly on drift. Without this a migration that exists in git but never
# reached the database stays invisible until app code hits the missing relation
# at runtime (Postgres 42P01).
compose --profile ops run --rm admin-migrate bun run db:verify
