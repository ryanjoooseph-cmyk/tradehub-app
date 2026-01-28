#!/usr/bin/env bash
set -euo pipefail
REPO="ryanjoooseph-cmyk/tradehub-app"
PR="${1:?usage: scripts/pr_watch_until_checks.sh <PR_NUMBER>}"

echo "==> Waiting for check-runs to attach..."
for i in $(seq 1 60); do
  if gh pr checks "$PR" -R "$REPO" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

gh pr checks "$PR" -R "$REPO" --watch || true
gh pr view "$PR" -R "$REPO" --json number,state,mergeStateStatus,autoMergeRequest,labels \
  --jq '{number,state,mergeStateStatus,autoMergeRequest,labels}'
