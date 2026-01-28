#!/usr/bin/env bash
set -euo pipefail

cd ~/tradehub-app
REPO="$(git remote get-url origin | sed -E 's#.*github\.com[:/]+([^/]+/[^/.]+)(\.git)?#\1#')"

JOBS_FILE="${1:-agent_jobs.txt}"
[ -f "$JOBS_FILE" ] || { echo "FAIL: missing $JOBS_FILE"; exit 1; }

git checkout main
  git pull --ff-only
git pull --ff-only

i=0
while IFS= read -r job; do
  job="$(echo "$job" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
  [ -z "$job" ] && continue
  i=$((i+1))

  slug="$(echo "$job" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-40)"
  ts="$(date +%Y%m%d-%H%M%S)"
  BR="agent/job-${i}-${slug}-${ts}"

  echo "==> Creating $BR"
  git checkout -b "$BR" main

  mkdir -p .agent/tasks
  TASK_FILE=".agent/tasks/${ts}-job-${i}.md"
  cat > "$TASK_FILE" <<EOF
# Agent Task ${i}

## Objective
${job}

## Rules
- Work only on what is needed to complete the objective.
- Keep changes minimal and production-safe.
- Ensure \`npm run typecheck\` and \`npm run build\` pass.
- If you touch env vars: update docs, do NOT commit secrets.
EOF

  git add "$TASK_FILE"
  git commit -m "chore(agent): add task ${i}"

  git push -u origin HEAD

  # Open PR (your automation will label + auto-merge once checks pass)
  scripts/agent_pr_open.sh "$BR" "agent job ${i}: ${job}" \
"Auto-generated agent job PR. See .agent/AGENT_TASK.md for instructions."

  git checkout main
done < "$JOBS_FILE"

echo "✅ Spawned $i agent PR(s)."
