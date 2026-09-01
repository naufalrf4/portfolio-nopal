#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${PORTFOLIO_WEBHOOK_REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
LOCK_FILE="${PORTFOLIO_WEBHOOK_LOCK_FILE:-/var/lib/portfolio-webhook/deploy.lock}"
LOG_FILE="${PORTFOLIO_WEBHOOK_LOG_FILE:-/var/log/portfolio-webhook/deploy.log}"
BRANCH="${PORTFOLIO_WEBHOOK_BRANCH:-main}"
export TZ="${TZ:-Asia/Jakarta}"

mkdir -p "$(dirname "$LOCK_FILE")" "$(dirname "$LOG_FILE")"

exec 9>"$LOCK_FILE"
flock 9

deploy_targets() {
  local old_sha="$1" new_sha="$2"

  if [ -z "$old_sha" ]; then
    echo "__FULL__"
    return 0
  fi
  if [ "$old_sha" = "$new_sha" ]; then
    echo "__SKIP__"
    return 0
  fi

  local changed
  if ! changed="$(git -C "$ROOT_DIR" diff --name-only "$old_sha" "$new_sha" 2>/dev/null)"; then
    echo "__FULL__"
    return 0
  fi

  if printf '%s\n' "$changed" | grep -qE '^(package\.json|bun\.lock|tsconfig\.json|docker-compose\.prod\.yml|scripts/docker-prod-(up|migrate)\.sh|packages/)'; then
    echo "__FULL__"
    return 0
  fi

  local targets=()
  if printf '%s\n' "$changed" | grep -q '^apps/admin/'; then targets+=(admin admin-cron notification-dispatch); fi
  if printf '%s\n' "$changed" | grep -q '^apps/rag-service/'; then targets+=(rag); fi
  if printf '%s\n' "$changed" | grep -q '^apps/public-astro/'; then targets+=(public); fi
  if printf '%s\n' "$changed" | grep -q '^apps/links-astro/'; then targets+=(links); fi
  if printf '%s\n' "$changed" | grep -q '^apps/ngl-svelte/'; then targets+=(ngl); fi
  if printf '%s\n' "$changed" | grep -q '^apps/live-presence/'; then targets+=(live-presence); fi

  if [ "${#targets[@]}" -eq 0 ]; then
    echo "__NONE__"
    return 0
  fi

  printf '%s\n' "${targets[@]}"
}

{
	printf '\n[%s] deploy start\n' "$(date -Iseconds)"
	printf 'delivery=%s\n' "${1:-manual}"
	printf 'target_branch=%s\n' "$BRANCH"
	OLD_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || true)"
	git -C "$ROOT_DIR" fetch origin
	git -C "$ROOT_DIR" checkout "$BRANCH"
	git -C "$ROOT_DIR" pull --ff-only origin "$BRANCH"
	NEW_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD)"

	mapfile -t DEPLOY_TARGETS < <(deploy_targets "$OLD_SHA" "$NEW_SHA")

	case "${DEPLOY_TARGETS[0]:-}" in
	__SKIP__)
		printf 'no changes since last deploy (%s); skipping build/up and migrate\n' "$NEW_SHA"
		printf '[%s] deploy success (no-op)\n' "$(date -Iseconds)"
		exit 0
		;;
	__NONE__)
		printf 'changed files do not affect any service; skipping build/up\n'
		;;
	__FULL__)
		printf 'shared config/dependency change (or first deploy); full rebuild\n'
		;;
	*)
		printf 'scoped rebuild: %s\n' "${DEPLOY_TARGETS[*]}"
		;;
	esac

	# Migrate BEFORE starting app services. Starting first means new code boots
	# against the old schema and crashes on missing relations (Postgres 42P01),
	# and because `up` waits on healthchecks it can roll back before migrate ever
	# runs. Additive migrations are backward compatible with the currently
	# running image, so schema-first is the safe order.
	bash "$ROOT_DIR/scripts/docker-prod-migrate.sh"

	case "${DEPLOY_TARGETS[0]:-}" in
	__NONE__) ;;
	__FULL__)
		bash "$ROOT_DIR/scripts/docker-prod-up.sh"
		;;
	*)
		bash "$ROOT_DIR/scripts/docker-prod-up.sh" "${DEPLOY_TARGETS[@]}"
		;;
	esac

	printf '[%s] deploy success\n' "$(date -Iseconds)"
} >>"$LOG_FILE" 2>&1
