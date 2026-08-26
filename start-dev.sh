#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Startup order matters: admin + rag first (data/api providers), then consumers.
providers=(
  "admin|$ROOT_DIR/apps/admin|bun run dev|http://localhost:3001"
  "rag|$ROOT_DIR/apps/rag-service|bun run dev|http://localhost:3005/health"
  "presence|$ROOT_DIR/apps/live-presence|bun run dev|http://localhost:3006"
  "links|$ROOT_DIR/apps/links-astro|bun run dev|http://localhost:3002"
  "ngl|$ROOT_DIR/apps/ngl-svelte|bun run dev|http://localhost:3003"
  "public|$ROOT_DIR/apps/public-astro|bun run dev|http://localhost:3000"
  "slidedeck|$ROOT_DIR/apps/slidedeck|bun run dev|http://localhost:3007"
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

start_service() {
  local name="$1" workdir="$2" command="$3"
  (
    cd "$workdir"
    bash -o pipefail -lc "$command" 2>&1 | sed "s/^/[$name] /"
  ) &
  pids+=("$!")
}

wait_ready() {
  local name="$1" url="$2"
  local attempts=60
  for ((i = 0; i < attempts; i++)); do
    if curl -s -o /dev/null --max-time 2 "$url" 2>/dev/null; then
      echo "[dev] $name ready ($url)"
      return 0
    fi
    sleep 1
  done
  echo "[dev] $name did not become ready after ${attempts}s; continuing" >&2
  return 1
}

for service in "${providers[@]}"; do
  IFS='|' read -r name workdir command health <<<"$service"
  start_service "$name" "$workdir" "$command"
  if [[ "$name" == "admin" || "$name" == "rag" ]]; then
    wait_ready "$name" "$health" || true
  else
    sleep 1
  fi
done

wait
