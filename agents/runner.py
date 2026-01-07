from pathlib import Path
import subprocess, json, os

REPO_ROOT = Path(__file__).resolve().parents[1]

def run(cmd):
    subprocess.run(cmd, cwd=REPO_ROOT, check=True)

def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text() if path.exists() else None
    if existing != content:
        path.write_text(content)

def changed_files():
    out = subprocess.check_output(["git","status","--porcelain"], cwd=REPO_ROOT).decode().strip().splitlines()
    return [l for l in out if l]

def main():
    branch = f"agent/ui-shell"
    run(["git","checkout","-B",branch])

    sidebar = (
        'export default function Sidebar(){return (<aside><nav>'
        '<a href="/dashboard">Dashboard</a> '
        '<a href="/jobs">Jobs</a> '
        '<a href="/clients">Clients</a> '
        '<a href="/quotes">Quotes</a>'
        '</nav></aside>);}'
    )
    write(REPO_ROOT/"components"/"Sidebar.tsx", sidebar)

    def page(title:str):
        return f'export default function Page(){{return(<main><h1>{title}</h1></main>);}}'

    write(REPO_ROOT/"app"/"dashboard"/"page.tsx", page("Dashboard"))
    write(REPO_ROOT/"app"/"jobs"/"page.tsx", page("Jobs"))
    write(REPO_ROOT/"app"/"clients"/"page.tsx", page("Clients"))
    write(REPO_ROOT/"app"/"quotes"/"page.tsx", page("Quotes"))

    changed = changed_files()
    if not changed:
        print("Agent produced no changes; exiting without PR.")
        return

    run(["git","add","-A"])
    run(["git","commit","-m","agent: scaffold UI shell pages and sidebar"])
    run(["git","push","-u","origin",branch])

    (REPO_ROOT/".agent_branch").write_text(branch)
    (REPO_ROOT/".agent_title").write_text("agent: scaffold UI shell")
    (REPO_ROOT/".agent_body").write_text("Creates Sidebar and /dashboard, /jobs, /clients, /quotes pages.")

if __name__ == "__main__":
    main()