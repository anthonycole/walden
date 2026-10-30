#!/usr/bin/env sh
# Antigravity PostToolUse hook: auto-format and fix safe Biome issues after file edits.
# Contract: consumes JSON payload on stdin and outputs `{}` on stdout.

cat >/dev/null 2>&1 || true

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

if [ -x "$REPO_ROOT/node_modules/.bin/biome" ]; then
	"$REPO_ROOT/node_modules/.bin/biome" check --write "$REPO_ROOT/src" >/dev/null 2>&1 || true
fi

printf '{}\n'
