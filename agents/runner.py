# agents/runner.py
# Fully self-contained GitHub PR runner for TradeHub.
# - Reads tasks from agents/tasks.json
# - Applies file changes only in allowlisted paths
# - Creates unique branches & PRs (no spam)
# - Labels PRs with "agent"
#
# ENV expected in GitHub Actions:
#   OPENAI_API_KEY   (if your tasks need it; not used here by default)
#   GITHUB_TOKEN     (provided by Actions)
#   REPO_FULL        (owner/repo; Actions also sets GITHUB_REPOSITORY)
#   BASE_BRANCH      (default: main)
#   ALLOW_PATHS      (optional, comma-separated regexes. default allow below)

from __future__ import annotations
import os, sys, json, re, subprocess, textwrap, time, hashlib
from pathlib import Path
from datetime import datetime, timezone
import requests

# ---------- Config ----------
REPO_ROOT = Path(__file__).resolve().parents[1]
TASKS_FILE = REPO_ROOT / "agents" / "tasks.json"
BASE_BRANCH = os.environ.get("BASE_BRANCH", "main")

DEFAULT_ALLOW = [
    r"^agents/",                # agent code
    r"^\.github/",              # workflows & configs
    r"^docs/",                  # docs
    r"^public/.*\.(svg|png|jpg|jpeg|ico)$",  # static assets
]
ALLOW_PATHS = [p.strip() for p in os.environ.get("ALLOW_PATHS", "").split(",") if p.strip()] or DEFAULT_ALLOW

LABEL_AGENT = "agent"

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
REPO_FULL = os.environ.get("REPO_FULL") or os.environ.get("GITHUB_REPOSITORY", "")
if not REPO_FULL:
    print("❌ REPO_FULL / GITHUB_REPOSITORY not set.")
    sys.exit(1)

OWNER, REPO = REPO_FULL.split("/", 1)
API = "https://api.github.com"

# ---------- Utilities ----------
def sh(cmd: list[str], cwd: Path | None = None, check: bool = True) -> str:
    """Run a shell command and return stdout."""
    r = subprocess.run(cmd, cwd=str(cwd or REPO_ROOT), capture_output=True, text=True)
    if check and r.returncode != 0:
        print(f"❌ CMD failed: {' '.join(cmd)}\nSTDOUT:\n{r.stdout}\nSTDERR:\n{r.stderr}")
        raise SystemExit(r.returncode)
    return r.stdout.strip()

def slug(s: str) -> str:
    s = re.sub(r"[^\w\-]+", "-", s.lower()).strip("-")
    return re.sub(r"-{2,}", "-", s)

def github_headers() -> dict:
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
    }

def gh_get(path: str, params: dict | None = None):
    r = requests.get(f"{API}{path}", headers=github_headers(), params=params or {})
    r.raise_for_status()
    return r.json()

def gh_post(path: str, payload: dict):
    r = requests.post(f"{API}{path}", headers=github_headers(), json=payload)
    r.raise_for_status()
    return r.json()

def gh_patch(path: str, payload: dict):
    r = requests.patch(f"{API}{path}", headers=github_headers(), json=payload)
    r.raise_for_status()
    return r.json()

def now_stamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")

def is_allowed_path(rel: str) -> bool:
    return any(re.search(rx, rel) for rx in ALLOW_PATHS)

def ensure_git_identity():
    try:
        sh(["git", "config", "--get", "user.email"])
    except SystemExit:
        sh(["git", "config", "user.email", "autopilot-bot@users.noreply.github.com"])
    try:
        sh(["git", "config", "--get", "user.name"])
    except SystemExit:
        sh(["git", "config", "user.name", "autopilot-bot"])

def ensure_base():
    sh(["git", "fetch", "origin", BASE_BRANCH, "--depth", "50"])
    sh(["git", "checkout", "-B", BASE_BRANCH, f"origin/{BASE_BRANCH}"])

def create_branch(branch: str):
    sh(["git", "checkout", "-B", branch])

def commit_all(message: str):
    sh(["git", "add", "-A"])
    # If nothing to commit, this will fail; detect and skip push
    status = sh(["git", "status", "--porcelain"])
    if not status:
        print("ℹ️  No changes to commit; skipping PR.")
        return False
    sh(["git", "commit", "-m", message])
    return True

def push_branch(branch: str):
    sh(["git", "push", "origin", f"HEAD:refs/heads/{branch}", "--force"])

def open_pr_exists(title_prefix: str) -> bool:
    prs = gh_get(f"/repos/{OWNER}/{REPO}/pulls", {"state": "open", "per_page": 100})
    return any(p["title"].startswith(title_prefix) for p in prs)

def unique_pr_title(base_title: str) -> str:
    if not open_pr_exists(base_title):
        return base_title
    # increment suffix (2), (3), ...
    n = 2
    while open_pr_exists(f"{base_title} ({n})"):
        n += 1
    return f"{base_title} ({n})"

def create_pr(branch: str, title: str, body: str) -> int:
    payload = {"title": title, "head": branch, "base": BASE_BRANCH, "body": body, "draft": False}
    pr = gh_post(f"/repos/{OWNER}/{REPO}/pulls", payload)
    gh_post(f"/repos/{OWNER}/{REPO}/issues/{pr['number']}/labels", {"labels": [LABEL_AGENT]})
    return pr["number"]

def changed_files_from_git() -> list[str]:
    out = sh(["git", "diff", "--name-only", f"origin/{BASE_BRANCH}...HEAD"])
    return [ln.strip() for ln in out.splitlines() if ln.strip()]

def safe_files_only(files: list[str]) -> bool:
    return files and all(is_allowed_path(f) for f in files)

# ---------- Task application ----------
def load_tasks() -> list[dict]:
    if not TASKS_FILE.exists():
        print(f"ℹ️  No tasks file found at {TASKS_FILE}; nothing to do.")
        return []
    data = json.loads(TASKS_FILE.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        tasks = data.get("tasks", [])
    else:
        tasks = data
    # normalize
    norm = []
    for t in tasks:
        if not t or not t.get("enabled", True):
            continue
        title = t.get("title") or "agent change"
        files = t.get("files") or []
        body = t.get("body") or ""
        norm.append({"title": title, "files": files, "body": body})
    return norm

def apply_file_change(spec: dict):
    """
    spec = {
      "path": "docs/README.md",
      "mode": "overwrite" | "append" | "prepend",
      "content": "..."
    }
    """
    rel = spec.get("path", "").lstrip("./")
    if not rel:
        raise RuntimeError("Task file spec missing 'path'")
    if not is_allowed_path(rel):
        raise RuntimeError(f"Blocked write outside allowlist: {rel}")

    mode = (spec.get("mode") or "overwrite").lower()
    content = spec.get("content", "")

    abs_path = REPO_ROOT / rel
    abs_path.parent.mkdir(parents=True, exist_ok=True)
    if mode == "overwrite" or not abs_path.exists():
        abs_path.write_text(content, encoding="utf-8")
    elif mode == "append":
        with abs_path.open("a", encoding="utf-8") as f:
            f.write(content)
    elif mode == "prepend":
        prev = abs_path.read_text(encoding="utf-8") if abs_path.exists() else ""
        abs_path.write_text(content + prev, encoding="utf-8")
    else:
        raise RuntimeError(f"Unknown mode: {mode}")

def run_task(task: dict):
    base_title = task["title"].strip()
    pr_title = unique_pr_title(base_title)
    branch = f"agent/run-{now_stamp()}-{slug(base_title)[:40]}"
    pr_body = task.get("body") or f"Automated change for: **{base_title}**"

    print(f"⛏️  Running task: {base_title}")
    ensure_base()
    create_branch(branch)

    # Apply file changes
    for f in task["files"]:
        apply_file_change(f)

    if not commit_all(pr_title):
        # no changes -> nothing to push or PR
        sh(["git", "checkout", BASE_BRANCH])
        sh(["git", "branch", "-D", branch])
        print("✅ Task produced no diff; skipped.")
        return

    # safety gate: only allowed paths changed
    files = changed_files_from_git()
    if not safe_files_only(files):
        print("❌ Task attempted to change non-allowlisted files:")
        for f in files:
            if not is_allowed_path(f):
                print("   -", f)
        print("Reverting branch.")
        # hard reset & delete branch
        sh(["git", "reset", "--hard", f"origin/{BASE_BRANCH}"])
        sh(["git", "checkout", BASE_BRANCH])
        sh(["git", "branch", "-D", branch])
        return

    push_branch(branch)
    pr_number = create_pr(branch, pr_title, pr_body)
    print(f"✅ Opened PR #{pr_number}: {pr_title}")

def main():
    if not GITHUB_TOKEN:
        print("❌ GITHUB_TOKEN missing.")
        sys.exit(1)
    ensure_git_identity()

    tasks = load_tasks()
    if not tasks:
        print("ℹ️  No enabled tasks. Done.")
        return

    for t in tasks:
        try:
            run_task(t)
        except Exception as e:
            print(f"⚠️ Task '{t.get('title','(untitled)')}' failed: {e}")

if __name__ == "__main__":
    main()
