#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="$ROOT_DIR/apps/public-astro/public/presentations-app"

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"
cp -r "$ROOT_DIR/apps/slidedeck/dist/." "$DEST_DIR/"
