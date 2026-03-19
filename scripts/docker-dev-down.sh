#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker compose \
  --env-file "$ROOT_DIR/.env.docker.dev" \
  -f "$ROOT_DIR/docker-compose.dev.yml" \
  down "$@"
