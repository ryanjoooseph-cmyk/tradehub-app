# agents/pr_guard.py
import os, re, requests

GITHUB_API = "https://api.github.com"

def _repo_parts():
    # e.g. "owner/repo"
    repo = os.environ.get("REPO_FULL") or os.environ.get("GITHUB_REPOSITORY")
    if not repo:
        raise RuntimeError("REPO_FULL/GITHUB_REPOSITORY not set")
    owner, name = repo.split("/", 1)
    return owner, name

def open_pr_exists(title_prefix: str) -> bool:
    token = os.environ.get("GITHUB_TOKEN", "")
    owner, repo = _repo_parts()
    url = f"{GITHUB_API}/repos/{owner}/{repo}/pulls?state=open&per_page=100"
    r = requests.get(url, headers={"Authorization": f"Bearer {token}",
                                   "Accept":"application/vnd.github+json"})
    r.raise_for_status()
    return any(p["title"].startswith(title_prefix) for p in r.json())

def ensure_unique_title(title: str) -> str:
    if not open_pr_exists(title):
        return title
    # bump suffix: " (2)", " (3)", ...
    m = re.match(r"^(.*?)(?: \((\d+)\))?$", title)
    base, n = (m.group(1), int(m.group(2) or "1")+1)
    while open_pr_exists(f"{base} ({n})"):
        n += 1
    return f"{base} ({n})"
