#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" == "main" ]]; then
  echo "ERROR: You are on main. Checkout a feature branch first."
  exit 1
fi

# If nothing changed, exit cleanly
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes detected. Nothing to do."
  exit 0
fi

echo "Running gates..."
pnpm lint
pnpm typecheck
pnpm build

echo "Committing..."
git add -A
if git diff --cached --quiet; then
  echo "No staged changes after add -A. Nothing to commit."
  exit 0
fi

TITLE="auto: $(date '+%Y-%m-%d %H:%M') ($BRANCH)"
git commit -m "$TITLE"

echo "Pushing..."
git push -u origin "$BRANCH"

echo "Creating or finding PR..."
PR_URL="$(gh pr view --head "$BRANCH" --json url -q .url 2>/dev/null || true)"
if [[ -z "$PR_URL" ]]; then
  PR_URL="$(gh pr create --base main --head "$BRANCH" --title "$TITLE" --body "Automated PR from $BRANCH. Gates run: pnpm lint, pnpm typecheck, pnpm build." --json url -q .url)"
fi

echo "PR: $PR_URL"
echo "Enabling auto-merge (squash + delete branch when merged)..."
gh pr merge --auto --squash --delete-branch "$PR_URL"

echo "Watching checks (Ctrl+C to stop watching; auto-merge stays enabled)..."
gh pr checks --watch "$PR_URL"
