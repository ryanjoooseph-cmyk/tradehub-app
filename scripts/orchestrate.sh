#!/usr/bin/env bash
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN not set}"

REPO="$(git remote get-url origin | sed -E 's#.*github\.com[:/]+([^/]+/[^/.]+)(\.git)?#\1#')"

OPEN_CAP=10
OPEN_NOW="$(gh pr list -R "$REPO" --state open --search 'head:agent/' --json number --jq 'length')"
if [ "$OPEN_NOW" -ge "$OPEN_CAP" ]; then
  echo "open agent PR cap reached ($OPEN_NOW/$OPEN_CAP), exiting"
  exit 0
fi

gh label create -R "$REPO" agent-job --color 0E8A16 --description "Queued job for agents" 2>/dev/null || true
gh label create -R "$REPO" agent-in-progress --color FBCA04 --description "Job has been spawned into a PR" 2>/dev/null || true

MAX_SPAWN=3
mapfile -t ISSUE_NUMS < <(
  gh issue list -R "$REPO" --label agent-job --state open --search '-label:"agent-in-progress"' \
    --json number,createdAt --jq 'sort_by(.createdAt) | .[].number' | head -n "$MAX_SPAWN"
)

if [ "${#ISSUE_NUMS[@]}" -eq 0 ]; then
  echo "no queued agent-job issues to spawn"
  exit 0
fi

git fetch origin
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

for N in "${ISSUE_NUMS[@]}"; do
  TITLE="$(gh issue view -R "$REPO" "$N" --json title --jq .title)"
  BODY="$(gh issue view -R "$REPO" "$N" --json body --jq .body)"

  TS="$(date -u +%Y%m%d-%H%M%S)"
  SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-40)"
  BRANCH="agent/issue-${N}-${SLUG}-${TS}"

  git checkout -B "$BRANCH" origin/main

  mkdir -p .agent/tasks
  TASK_FILE=".agent/tasks/${TS}-issue-${N}.md"
  cat > "$TASK_FILE" <<EOF
# Agent Job (Issue #$N)

## Title
$TITLE

## Objective
$BODY
EOF

  git add "$TASK_FILE"
  git commit -m "chore(agent): seed job from issue #$N"
  git push -u origin "$BRANCH"

  gh pr create -R "$REPO" --head "$BRANCH" --base main --title "agent: $TITLE (fixes #$N)" --body "Fixes #$N" || true
  gh issue edit -R "$REPO" "$N" --add-label agent-in-progress || true
done
