import os, json, subprocess, time, pathlib, sys
from datetime import datetime
from openai import OpenAI

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
TASKS_FILE = REPO_ROOT / "agents" / "tasks.json"

MODEL = os.getenv("AGENT_MODEL", "gpt-4.1-mini")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("Missing OPENAI_API_KEY secret. Add it in GitHub → Settings → Secrets → Actions.", file=sys.stderr)
    sys.exit(1)

client = OpenAI(api_key=OPENAI_API_KEY)

def run(cmd, **kw):
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True, cwd=REPO_ROOT, **kw)

def load_tasks():
    if TASKS_FILE.exists():
        data = json.loads(TASKS_FILE.read_text())
        return [t for t in data if t.get("enabled", True)]
    # Fallback single task if file missing
    return [{
        "title": "Scaffold TradeHub dashboard shell",
        "goal":  "Create production-safe UI shell pages without touching server config.",
        "paths": ["app", "components", "lib"],
        "details": (
            "Next.js App Router (TS). Add a left sidebar layout with routes: /dashboard, /jobs, /clients, /quotes. "
            "Create simple, compilable TSX with no external deps. Keep styling minimal (plain CSS modules). "
            "Do NOT modify package.json scripts; DO NOT delete public/sw.js or public/ping.txt. "
            "Files must compile under Next 14/15."
        )
    }]

def ask_model(task):
    system = (
        "You modify a Next.js (App Router, TypeScript) repo. "
        "Respond ONLY as valid JSON with key 'files': an array of objects "
        "having {\"path\":\"relative/path\",\"content\":\"file contents\"}. "
        "Only add or replace files inside allowed paths. Do not delete files. "
        "No placeholders; code must compile."
    )
    user = {
        "task": task,
        "constraints": {
            "allowed_paths": task.get("paths", ["app","components","lib"]),
            "forbidden": ["package.json", "server.cjs", "public/sw.js", "public/ping.txt", "next.config.*"]
        },
        "repo_notes": "Project already deployed. Keep changes additive and safe."
    }
    resp = client.chat.completions.create(
        model=MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role":"system","content":system},
            {"role":"user","content":json.dumps(user)}
        ],
        temperature=0.2
    )
    return json.loads(resp.choices[0].message.content)

def write_files(files):
    changed = []
    for f in files:
        path = f["path"].lstrip("/").replace("\\", "/")
        content = f["content"]
        # ensure path stays in repo
        dest = (REPO_ROOT / path).resolve()
        if not str(dest).startswith(str(REPO_ROOT)):
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(content)
        changed.append(path)
    return changed

def main():
    tasks = load_tasks()
    if not tasks:
        print("No tasks to run.")
        return

    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    branch = f"agent/task-{ts}"
    run(["git", "checkout", "-b", branch])

    summary_lines = []
    total_changes = 0

    for task in tasks:
        result = ask_model(task)
        files = result.get("files", [])
        changed = write_files(files)
        if changed:
            run(["git", "add"] + changed)
            run(["git", "commit", "-m", f"agent: {task['title']} ({len(changed)} files)"])
            total_changes += len(changed)
            summary_lines.append(f"- {task['title']}: {len(changed)} files")
        else:
            summary_lines.append(f"- {task['title']}: no changes produced")

    if total_changes == 0:
        print("Agent produced no changes; exiting without PR.")
        return

    run(["git", "push", "origin", branch])

    pr_title = f"agent: {tasks[0]['title']}"
    pr_body = "### Agent summary\n" + "\n".join(summary_lines) + "\n\n_This PR was created by the autopilot agent._"

    (REPO_ROOT / ".agent_branch").write_text(branch)
    (REPO_ROOT / ".agent_title").write_text(pr_title)
    (REPO_ROOT / ".agent_body").write_text(pr_body)

if __name__ == "__main__":
    main()
