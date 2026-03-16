#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

services=(
  "public|$ROOT_DIR/apps/public-astro|bun run dev"
  "admin|$ROOT_DIR/apps/admin|bun run dev"
  "links|$ROOT_DIR/apps/links-astro|bun run dev"
  "ngl|$ROOT_DIR/apps/ngl-svelte|bun run dev"
  "presence|$ROOT_DIR/apps/live-presence|bun run dev"
  "rag|$ROOT_DIR/apps/rag-service|bun run dev"
)

pids=()

cleanup() {
  for pid in "${pids[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
}

trap cleanup EXIT INT TERM

for service in "${services[@]}"; do
  IFS='|' read -r name workdir command <<<"$service"
  (
    cd "$workdir"
    bash -lc "$command" 2>&1 | sed "s/^/[$name] /"
  ) &
  pids+=("$!")
  sleep 1
done

wait
