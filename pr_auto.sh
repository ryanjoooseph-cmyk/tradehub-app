#!/usr/bin/env bash
set -euo pipefail

# Detect changes OR unpushed commits.
WORKTREE_STATUS="$(git status --porcelain)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Safety: never run on main/master
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo "Refusing to run on $BRANCH. Create a feature branch first."
  exit 1
fi

# Repo in OWNER/NAME form for gh CLI
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
if [[ -z "$REPO" ]]; then
  ORIGIN_URL="$(git remote get-url origin 2>/dev/null || true)"
  REPO="$(echo "$ORIGIN_URL" | sed -E 's#(git@github.com:|https://github.com/)([^/]+/[^/.]+)(\.git)?#\2#')"
fi
if [[ -z "$REPO" ]]; then
  echo "ERROR: Could not determine GitHub repo (REPO)."
  exit 1
fi

# Figure out upstream (if any)
UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"

AHEAD_COUNT=0
if [[ -n "$UPSTREAM" ]]; then
  AHEAD_COUNT="$(git rev-list --count "$UPSTREAM"..HEAD 2>/dev/null || echo 0)"
fi

# Only exit when: clean tree + upstream exists + not ahead
if [[ -z "$WORKTREE_STATUS" && -n "$UPSTREAM" && "$AHEAD_COUNT" -eq 0 ]]; then
  echo "No changes detected. Nothing to do."
  exit 0
fi

TITLE="auto: $(date '+%Y-%m-%d %H:%M') ($BRANCH)"

# Only run gates + commit when there are working tree changes
if [[ -n "$WORKTREE_STATUS" ]]; then
  echo "Running gates..."
  pnpm lint
  pnpm typecheck
  pnpm build

  echo "Committing..."
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "$TITLE"
  else
    echo "No staged changes after add -A. Nothing to commit."
  fi
else
  echo "Working tree clean; skipping gates/commit and proceeding to push/PR."
fi

echo "Pushing..."
if [[ -z "$UPSTREAM" ]]; then
  git push -u origin "$BRANCH"
else
  git push
fi

echo "Creating or finding PR..."
PR_URL="$(gh pr list --repo "$REPO" --state open --head "$BRANCH" --base "main" --json url --jq '.[0].url' 2>/dev/null || true)"
if [[ -z "$PR_URL" ]]; then
  PR_URL="$(gh pr create --repo "$REPO" --head "$BRANCH" --base "main" --title "$TITLE" --body "Automated PR from ${BRANCH}. Gates: pnpm lint, pnpm typecheck, pnpm build." 2>/dev/null | tail -n 1)"
fi
if [[ -z "$PR_URL" ]]; then
  echo "ERROR: Could not create or locate PR for branch: ${BRANCH}"
  exit 1
fi

echo "PR: $PR_URL"
echo "Enabling auto-merge (squash + delete branch when merged)..."
gh pr merge --auto --squash --delete-branch "$PR_URL"

echo "Watching checks (Ctrl+C to stop watching; auto-merge stays enabled)..."
gh pr checks --watch "$PR_URL"
