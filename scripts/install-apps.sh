#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
apps=("$@")

if ((${#apps[@]} == 0)); then
  apps=(admin public-astro links-astro ngl-svelte rag-service)
fi

for app in "${apps[@]}"; do
  app_dir="$ROOT_DIR/apps/$app"
  if [[ ! -f "$app_dir/package.json" ]]; then
    echo "Missing app manifest: apps/$app/package.json (initialize submodules first)" >&2
    exit 1
  fi
  echo "Installing apps/$app"
  (cd "$app_dir" && bun install --frozen-lockfile)
done
