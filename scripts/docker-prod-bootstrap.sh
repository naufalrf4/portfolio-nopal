#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

bash "$ROOT_DIR/scripts/docker-prod-migrate.sh"

if [ "$#" -gt 0 ]; then
  bash "$ROOT_DIR/scripts/docker-prod-up.sh" admin rag
  bash "$ROOT_DIR/scripts/docker-prod-up.sh" "$@"
else
  bash "$ROOT_DIR/scripts/docker-prod-up.sh"
fi
