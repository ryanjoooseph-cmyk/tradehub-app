#!/usr/bin/env bash
set -euo pipefail
REPO="ryanjoooseph-cmyk/tradehub-app"

# Closes all open PRs with label ci-failed, unless keep-open label exists
prs="$(gh pr list -R "$REPO" --state open --label ci-failed --json number,labels --jq '.[] | select((.labels|map(.name)|index("keep-open"))|not) | .number')"

if [ -z "${prs:-}" ]; then
  echo "No open ci-failed PRs to close (excluding keep-open)."
  exit 0
fi

echo "$prs" | while read -r pr; do
  echo "Closing PR #$pr and deleting branch"
  gh pr close "$pr" -R "$REPO" --delete-branch || true
done
