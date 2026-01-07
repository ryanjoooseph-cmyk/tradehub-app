from pathlib import Path
import subprocess as sp
import sys, uuid, json

REPO_ROOT = Path(__file__).resolve().parents[1]

def run(cmd, cwd=REPO_ROOT):
    r = sp.run(cmd, cwd=cwd, text=True, capture_output=True)
    if r.returncode != 0:
        print(r.stdout)
        print(r.stderr, file=sys.stderr)
        raise SystemExit(r.returncode)
    return r.stdout.strip()

def ensure_file(path: Path, content: str) -> bool:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True

def main():
    changed = 0

    # Minimal layout (only create if missing)
    layout = REPO_ROOT / "app" / "layout.tsx"
    if not layout.exists():
        changed |= ensure_file(layout, """\
export const metadata = { title: 'TradeHub' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{display:'flex',minHeight:'100vh',margin:0}}>
        <aside style={{width:220,padding:16,borderRight:'1px solid #eee'}}>
          <h3 style={{marginTop:0}}>TradeHub</h3>
          <nav style={{display:'grid',gap:8}}>
            <a href="/dashboard">Dashboard</a>
            <a href="/jobs">Jobs</a>
            <a href="/clients">Clients</a>
            <a href="/quotes">Quotes</a>
          </nav>
        </aside>
        <main style={{flex:1,padding:24}}>{children}</main>
      </body>
    </html>
  );
}
""")

    # Minimal route pages (create only if missing)
    routes = {
        "dashboard": "Dashboard",
        "jobs": "Jobs",
        "clients": "Clients",
        "quotes": "Quotes",
    }
    for slug, title in routes.items():
        p = REPO_ROOT / "app" / slug / "page.tsx"
        if not p.exists():
            changed |= ensure_file(p, f"""\
export default function Page() {{
  return <div style={{fontSize:20}}>{title}</div>;
}}
""")

    if not changed:
        print("Agent produced no changes; exiting without PR.")
        return

    # New branch for PR
    branch = f"agent/ui-shell-{uuid.uuid4().hex[:8]}"
    run(["git", "checkout", "-b", branch])
    run(["git", "add", "app"])
    run(["git", "commit", "-m", "agent(ui): scaffold UI shell (dashboard/jobs/clients/quotes)"])
    run(["git", "push", "origin", branch])

    # Handshake files for the workflow to create the PR
    (REPO_ROOT / ".agent_branch").write_text(branch, encoding="utf-8")
    (REPO_ROOT / ".agent_title").write_text("agent: scaffold UI shell", encoding="utf-8")
    body = {
        "summary": [
            "Adds minimal App Router shell:",
            "- /dashboard",
            "- /jobs",
            "- /clients",
            "- /quotes",
            "Creates layout with left nav. No deps added."
        ]
    }
    (REPO_ROOT / ".agent_body").write_text("\n".join(body["summary"]), encoding="utf-8")

if __name__ == "__main__":
    main()
