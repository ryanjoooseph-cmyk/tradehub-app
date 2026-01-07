import json, os, subprocess, tempfile, textwrap, pathlib, re, uuid
from dataclasses import dataclass
from typing import List, Dict, Any
from openai import OpenAI
import requests

REPO = pathlib.Path(__file__).resolve().parents[1]  # repo root
TASKS_FILE = REPO / "agents" / "tasks.json"

@dataclass
class Task:
    id: str
    title: str
    enabled: bool
    goal: str
    acceptance: List[str]

def run(cmd: str):
    print(f"$ {cmd}")
    subprocess.run(cmd, shell=True, check=True, cwd=REPO)

def build(build_cmd: str):
    run(build_cmd)

def git(*args: str) -> str:
    r = subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True, check=True)
    return r.stdout.strip()

def load_tasks() -> (Dict[str, Any], List[Task]):
    data = json.loads(TASKS_FILE.read_text())
    cfg = data["config"]
    tasks = [Task(**t) for t in data["tasks"] if t.get("enabled")]
    return cfg, tasks

def repo_glob_allow(path: str, allowed_globs: List[str]) -> bool:
    from fnmatch import fnmatch
    return any(fnmatch(path, g) for g in allowed_globs)

def blocked(path: str, blocks: List[str]) -> bool:
    from fnmatch import fnmatch
    return any(fnmatch(path, b) for b in blocks)

def ensure_changes_safe(files: Dict[str, str], cfg: Dict[str, Any]):
    for p in files.keys():
        norm = p.strip("/")

        if blocked(norm, cfg["paths_blocked"]):
            raise RuntimeError(f"Blocked file in patch: {norm}")

        if not repo_glob_allow(norm, cfg["paths_allowed_globs"]):
            raise RuntimeError(f"File outside allowed paths: {norm}")

def write_files(changes: Dict[str, str]):
    for rel, content in changes.items():
        target = (REPO / rel).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

def create_pr(branch: str, title: str, body: str):
    # push branch
    run("git add -A")
    run(f'git commit -m "{title}" || echo "nothing to commit"')
    run(f"git push -u origin {branch}")

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("No GITHUB_TOKEN; cannot open PR automatically.")
        return

    # infer owner/repo
    remote = git("config", "--get", "remote.origin.url")
    m = re.search(r"[:/]([^/]+)/([^/.]+)(?:\.git)?$", remote)
    if not m:
        print("Could not parse remote for PR.")
        return
    owner, repo = m.group(1), m.group(2)

    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
    payload = {"title": title, "head": branch, "base": "main", "body": body}
    r = requests.post(url, headers={"Authorization": f"Bearer {token}",
                                    "Accept": "application/vnd.github+json"}, json=payload)
    print("PR create status:", r.status_code, r.text[:400])

SYSTEM_PROMPT = """You are a careful code collaborator for a Next.js + TypeScript + Supabase project.
Return ONLY JSON with this schema:
{
  "summary": "one-line human summary",
  "files": {
    "<path/from/repo/root>": "<full replacement file contents>",
    "...": "..."
  }
}
Rules:
- Touch ONLY allowed paths (lib/**, app/**, public/**). NEVER modify package.json, lockfiles, or workflows.
- Keep code minimal & compiling. Use existing conventions.
- For API routes use Next.js app router handlers in app/api/**/route.ts or app/api/**/[id]/route.ts.
- For UI pages under app/**, implement simple functional components with basic forms/tables.
- Always include complete file contents (not diffs).
"""

def plan_for_task(task: Task, cfg: Dict[str, Any]) -> Dict[str, Any]:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    tree = git("ls-files")
    context = textwrap.dedent(f"""
    Repo tree (truncated to 400 lines):
    {os.linesep.join(tree.splitlines()[:400])}

    Task: {task.title}
    Goal: {task.goal}
    Acceptance criteria:
    - {"\n    - ".join(task.acceptance)}
    """).strip()

    resp = client.chat.completions.create(
        model=cfg.get("model", "gpt-4.1-mini"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": context}
        ],
        temperature=0
    )
    txt = resp.choices[0].message.content
    try:
        data = json.loads(txt)
    except Exception as e:
        raise RuntimeError(f"Model did not return JSON: {e}\n----\n{txt[:4000]}")
    return data

def main():
    cfg, tasks = load_tasks()
    if not tasks:
        print("No enabled tasks. Exiting.")
        return

    base = git("rev-parse", "--abbrev-ref", "HEAD")
    for t in tasks:
        branch = f'{cfg.get("branch_prefix","agent/")}{t.id}-{uuid.uuid4().hex[:8]}'
        run(f"git checkout -b {branch}")

        plan = plan_for_task(t, cfg)
        files = plan.get("files", {})
        ensure_changes_safe(files, cfg)

        write_files(files)
        # format (best-effort, not mandatory)
        try:
            run("npx -y prettier -w .")
        except Exception:
            pass

        # build check
        build(cfg["build_cmd"])

        title = f'agent: {t.title}'
        body = f'{t.goal}\n\nAuto-generated. Summary: {plan.get("summary","(none)")}'
        create_pr(branch, title, body)

        run(f"git checkout {base}")

if __name__ == "__main__":
    main()
