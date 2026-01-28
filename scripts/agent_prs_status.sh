#!/usr/bin/env bash
set -euo pipefail
REPO="ryanjoooseph-cmyk/tradehub-app"

# Shows open PRs where head branch starts with agent- or agent/
gh pr list -R "$REPO" --state open --limit 50 --json number,title,headRefName,labels,mergeStateStatus \
  --jq '
    map(select(.headRefName|startswith("agent-") or startswith("agent/")))
    | map({
        number,
        head: .headRefName,
        merge: .mergeStateStatus,
        labels: (.labels|map(.name)),
        title
      })
  '
