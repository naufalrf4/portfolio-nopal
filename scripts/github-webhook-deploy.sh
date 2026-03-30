#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${PORTFOLIO_WEBHOOK_REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
LOCK_FILE="${PORTFOLIO_WEBHOOK_LOCK_FILE:-/var/lib/portfolio-webhook/deploy.lock}"
LOG_FILE="${PORTFOLIO_WEBHOOK_LOG_FILE:-/var/log/portfolio-webhook/deploy.log}"
BRANCH="${PORTFOLIO_WEBHOOK_BRANCH:-main}"

mkdir -p "$(dirname "$LOCK_FILE")" "$(dirname "$LOG_FILE")"

exec 9>"$LOCK_FILE"
flock 9

{
	printf '\n[%s] deploy start\n' "$(date -Iseconds)"
	printf 'delivery=%s\n' "${1:-manual}"
	printf 'target_branch=%s\n' "$BRANCH"
	git -C "$ROOT_DIR" fetch origin
	git -C "$ROOT_DIR" checkout "$BRANCH"
	git -C "$ROOT_DIR" pull --ff-only origin "$BRANCH"
	bash "$ROOT_DIR/scripts/docker-prod-up.sh"
	bash "$ROOT_DIR/scripts/docker-prod-migrate.sh"
	printf '[%s] deploy success\n' "$(date -Iseconds)"
} >>"$LOG_FILE" 2>&1
