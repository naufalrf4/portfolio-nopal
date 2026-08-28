#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WAIT_TIMEOUT="${PROD_HEALTH_WAIT_TIMEOUT:-240}"
ROLLBACK_FILE="$ROOT_DIR/.docker-prod-rollback.yml"

ALL_SERVICES=(admin admin-cron notification-dispatch rag public links ngl live-presence)
if [ "$#" -gt 0 ]; then
  TARGETS=("$@")
else
  TARGETS=("${ALL_SERVICES[@]}")
fi

compose() {
  docker compose \
    --env-file "$ROOT_DIR/.env.docker.prod" \
    -f "$ROOT_DIR/docker-compose.prod.yml" \
    "$@"
}

running_image() {
  local cid
  cid="$(compose ps -q "$1" 2>/dev/null | head -1)"
  [ -n "$cid" ] || return 0
  docker inspect --format '{{.Image}}' "$cid" 2>/dev/null || true
}

declare -A PREVIOUS_IMAGE=()
for svc in "${TARGETS[@]}"; do
  PREVIOUS_IMAGE["$svc"]="$(running_image "$svc")"
done

cleanup() {
  rm -f "$ROLLBACK_FILE"
}
trap cleanup EXIT

rollback() {
  echo "deploy failed: rolling back to previously running images" >&2

  local pinned=0
  printf 'services:\n' >"$ROLLBACK_FILE"
  for svc in "${TARGETS[@]}"; do
    local image="${PREVIOUS_IMAGE[$svc]:-}"
    [ -n "$image" ] || continue
    printf '  %s:\n    image: %s\n' "$svc" "$image" >>"$ROLLBACK_FILE"
    pinned=1
  done

  if [ "$pinned" -eq 0 ]; then
    echo "no previously running images to roll back to; stopping failed services" >&2
    compose stop "${TARGETS[@]}" || true
    return 1
  fi

  if docker compose \
    --env-file "$ROOT_DIR/.env.docker.prod" \
    -f "$ROOT_DIR/docker-compose.prod.yml" \
    -f "$ROLLBACK_FILE" \
    up -d --no-build --wait --wait-timeout "$WAIT_TIMEOUT" "${TARGETS[@]}"; then
    echo "rollback complete: services restored to previous images" >&2
  else
    echo "ROLLBACK DEGRADED: previous images did not become healthy either; prod needs manual attention" >&2
    compose ps >&2 || true
  fi

  return 1
}

compose build "${TARGETS[@]}"

if ! compose up -d --wait --wait-timeout "$WAIT_TIMEOUT" "${TARGETS[@]}"; then
  compose ps
  compose logs --tail 50 "${TARGETS[@]}" || true
  rollback
fi

echo "deploy healthy: ${TARGETS[*]}"
