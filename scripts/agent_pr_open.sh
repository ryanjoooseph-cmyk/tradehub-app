#!/usr/bin/env bash
set -euo pipefail

REPO="ryanjoooseph-cmyk/tradehub-app"

# Usage:
#   scripts/agent_pr_open.sh "agent-foo-bar" "Title" "Body text"
BR="${1:?branch required (must start with agent- or agent/)}"
TITLE="${2:?title required}"
BODY="${3:-}"

if [[ "$BR" != agent-* && "$BR" != agent/* ]]; then
  echo "ERROR: branch must start with agent- or agent/ (got: $BR)" >&2
  exit 1
fi

git fetch origin
git checkout main
git pull --ff-only
git checkout -B "$BR"

echo "==> Make your changes now, then run:"
echo "    git add -A && git commit -m \"...\" && git push -u origin HEAD"
echo
echo "Press enter when you've pushed at least one commit on $BR..."
read -r _

# Ensure branch is pushed
git push -u origin HEAD

echo "==> Create PR"
PR_URL="$(gh pr create -R "$REPO" --base main --head "$BR" --title "$TITLE" --body "$BODY")"
echo "PR_URL=$PR_URL"

PR_NUM="$(echo "$PR_URL" | sed -E 's|.*/pull/([0-9]+).*|\1|')"
if [ -z "${PR_NUM:-}" ]; then
  echo "ERROR: couldn't parse PR number from: $PR_URL" >&2
  exit 1
fi

echo "PR_NUM=$PR_NUM"
echo "==> Watch checks"
gh pr checks "$PR_NUM" -R "$REPO" --watch || true

echo "==> Final state"
gh pr view "$PR_NUM" -R "$REPO" --json number,state,mergeStateStatus,autoMergeRequest,labels \
  --jq '{number,state,mergeStateStatus,autoMergeRequest,labels}'
