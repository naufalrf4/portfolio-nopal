#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
apps=("$@")

if ((${#apps[@]} == 0)); then
  apps=(admin public links ngl rag)
fi

for app in "${apps[@]}"; do
  case "$app" in
    admin) app_dir=admin ;;
    public) app_dir=public-astro ;;
    links) app_dir=links-astro ;;
    ngl) app_dir=ngl-svelte ;;
    rag) app_dir=rag-service ;;
    *) echo "Unknown build target: $app (choose admin, public, links, ngl, rag)" >&2; exit 2 ;;
  esac
  if [[ ! -f "$ROOT_DIR/apps/$app_dir/package.json" ]]; then
    echo "Missing app manifest: apps/$app_dir/package.json (initialize submodules first)" >&2
    exit 1
  fi
  echo "Building apps/$app_dir"
  (cd "$ROOT_DIR/apps/$app_dir" && bun run build)
done
