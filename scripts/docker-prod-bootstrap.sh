#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker compose \
  --env-file "$ROOT_DIR/.env.docker.prod" \
  -f "$ROOT_DIR/docker-compose.prod.yml" \
  up --build -d admin rag

bash "$ROOT_DIR/scripts/docker-prod-migrate.sh"

docker compose \
  --env-file "$ROOT_DIR/.env.docker.prod" \
  -f "$ROOT_DIR/docker-compose.prod.yml" \
  up --build -d "$@"
