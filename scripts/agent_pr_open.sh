#!/usr/bin/env bash
set -euo pipefail

REPO="ryanjoooseph-cmyk/tradehub-app"

# Usage:
#   scripts/agent_pr_open.sh <branch> <title> [body]
# Example:
#   scripts/agent_pr_open.sh agent-feature-x "feat: X" "Implements X end-to-end"
BR="${1:?branch required}"
TITLE="${2:?title required}"
BODY="${3:-}"

if [[ "$BR" != agent-* && "$BR" != agent/* ]]; then
  echo "ERROR: branch must start with agent- or agent/ (got: $BR)" >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"

git fetch origin
git checkout -B "$BR"

# Ensure branch has at least 1 commit ahead of origin/main BEFORE attempting PR creation
git fetch origin main >/dev/null 2>&1 || true
AHEAD="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
if [ "${AHEAD:-0}" -le 0 ]; then
  echo "ERROR: No commits ahead of origin/main on $BR. Make a change + commit first." >&2
  echo "Hint:"
  echo "  git add -A && git commit -m \"feat: ...\" && git push -u origin HEAD"
  exit 1
fi

# Push branch
git push -u origin HEAD

# Create PR (use --json if available, fallback to URL parsing)
set +e
PR_NUM="$(gh pr create -R "$REPO" --base main --head "$BR" --title "$TITLE" --body "$BODY" --json number --jq .number 2>/dev/null)"
set -e

if [ -z "${PR_NUM:-}" ]; then
  PR_URL="$(gh pr create -R "$REPO" --base main --head "$BR" --title "$TITLE" --body "$BODY")"
  PR_NUM="$(echo "$PR_URL" | sed -E 's|.*/pull/([0-9]+).*|\1|')"
fi

if [ -z "${PR_NUM:-}" ]; then
  echo "ERROR: Failed to determine PR number." >&2
  exit 1
fi

echo "PR_NUM=$PR_NUM"

# Wait for checks to attach + watch
scripts/pr_watch_until_checks.sh "$PR_NUM"

# Final state
gh pr view "$PR_NUM" -R "$REPO" --json number,state,mergeStateStatus,autoMergeRequest,labels \
  --jq '{number,state,mergeStateStatus,autoMergeRequest,labels}'
