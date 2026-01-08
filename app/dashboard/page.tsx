'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Health = { ok: boolean; time?: string } | null;
type Version = { ok: boolean; ts: string; sha?: string | null; branch?: string | null } | null;

type Pr = {
  number: number;
  title: string;
  state: string;
  labels: string[];
  url: string;
  draft?: boolean;
};

type Commit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>(null);
  const [version, setVersion] = useState<Version>(null);
  const [newDeploy, setNewDeploy] = useState(false);
  const [prs, setPrs] = useState<Pr[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [prError, setPrError] = useState<string | null>(null);

  // who’s logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  // poll health + version
  useEffect(() => {
    let baselineTs: string | null = null;

    const tick = async () => {
      try {
        const h = await fetch('/api/health', { cache: 'no-store' }).then(r => r.json());
        setHealth(h);
      } catch {
        setHealth({ ok: false });
      }

      try {
        const v = await fetch('/api/version', { cache: 'no-store' }).then(r => r.json());
        setVersion(v);
        if (!baselineTs) baselineTs = v?.ts ?? null;
        if (baselineTs && v?.ts && v.ts !== baselineTs) setNewDeploy(true);
      } catch {
        setVersion(null);
      }
    };

    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  // PRs + commits
  useEffect(() => {
    const load = async () => {
      try {
        setPrError(null);
        const p = await fetch('/api/github/prs', { cache: 'no-store' }).then(r => r.json());
        if (p?.ok) setPrs(p.prs || []);
        else setPrError(p?.error || 'PR feed unavailable');

        const c = await fetch('/api/github/commits', { cache: 'no-store' }).then(r => r.json());
        setCommits(c?.commits || []);
      } catch (e: any) {
        setPrError(e?.message || 'PR feed error');
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="wrap">
      <h1>TradeHub Dashboard</h1>
      <p className="subtle">Live view while agents ship code.</p>

      {newDeploy && (
        <div className="notice">
          <strong>New deploy detected.</strong> <button onClick={() => location.reload()}>Refresh</button>
        </div>
      )}

      <div className="grid">
        <section className="card">
          <h3>Session</h3>
          <p>Signed in as <strong>{email ?? '…'}</strong></p>
          <p className="links">
            <Link href="/logout">Sign out</Link> · <Link href="/login">Login</Link> ·{' '}
            <Link href="/register">Register</Link>
          </p>
        </section>

        <section className="card">
          <h3>Deploy & Health</h3>
          <ul>
            <li>Health: {health?.ok ? 'OK ✅' : 'Down / unknown ⚠️'}</li>
            <li>Server time: <code>{health?.time ?? '…'}</code></li>
            <li>Commit: <code>{version?.sha ? version.sha.slice(0, 8) : 'n/a'}</code> {version?.branch ? `(${version.branch})` : ''}</li>
            <li>Version timestamp: <code>{version?.ts ?? '…'}</code></li>
          </ul>
          <p className="hint">Keeps checking every 5s.</p>
        </section>

        <section className="card span2">
          <h3>Recent Commits</h3>
          {commits.length === 0 ? <p className="muted">No commits yet.</p> : (
            <div className="list">
              {commits.map(c => (
                <a key={c.sha} href={c.url} target="_blank" rel="noreferrer" className="row">
                  <div className="msg">{c.message}</div>
                  <div className="meta">
                    <code>{c.sha.slice(0, 7)}</code> · {c.author} · {new Date(c.date).toLocaleString()}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="card span2">
          <h3>Open PRs</h3>
          {prError && <p className="error">{prError}</p>}
          {!prError && prs.length === 0 && <p className="muted">No open PRs.</p>}
          {!prError && prs.length > 0 && (
            <div className="grid2">
              {prs.map(pr => (
                <a key={pr.number} href={pr.url} target="_blank" rel="noreferrer" className="pr">
                  <div className="title">#{pr.number} · {pr.title}</div>
                  <div className="meta">{pr.draft ? 'draft · ' : ''}{pr.state} · {pr.labels?.join(', ') || 'no labels'}</div>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* minimal, readable styling */}
      <style jsx global>{`
        :root{
          --bg: #0b0c10;
          --panel: #16181d;
          --text: #e6e7eb;
          --muted: #a5a8b3;
          --border: #2a2e37;
          --accent: #58a6ff;
          --notice: #fff7cc;
        }
        @media (prefers-color-scheme: light){
          :root{
            --bg: #f7f8fa;
            --panel: #fff;
            --text: #0b1220;
            --muted: #586173;
            --border: #e6e8ee;
            --accent: #0b74ff;
            --notice: #fff7cc;
          }
        }
        body { background: var(--bg); color: var(--text); }
        .wrap{ max-width: 1100px; margin: 24px auto; padding: 0 16px; font: 15px/1.5 ui-sans-serif, system-ui, -apple-system; }
        h1{ margin: 0 0 4px; font-size: 24px; }
        .subtle{ color: var(--muted); margin: 0 0 16px; }
        .notice{ background: var(--notice); color: #3c2e00; border: 1px solid #e7d98b; padding: 10px 12px; border-radius: 8px; margin-bottom: 16px; }
        .grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .span2{ grid-column: 1 / span 2; }
        .card{ background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
        h3{ margin: 0 0 10px; font-size: 16px; }
        ul{ margin: 0; padding-left: 18px; }
        code{ background: rgba(127,127,127,.12); padding: 2px 6px; border-radius: 6px; }
        .links a{ color: var(--accent); text-decoration: none; }
        .links a:hover{ text-decoration: underline; }
        .hint{ color: var(--muted); margin-top: 8px; }
        .error{ color: #ffb4b4; }
        .muted{ color: var(--muted); }
        .grid2{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .pr{ display:block; text-decoration:none; color:inherit; border:1px solid var(--border); border-radius:8px; padding:10px; background: rgba(127,127,127,.06); }
        .title{ font-weight:600; margin-bottom:4px; }
        .meta{ font-size:12px; color: var(--muted); }
        .list{ display:flex; flex-direction:column; gap:8px; }
        .row{ display:block; text-decoration:none; color:inherit; border:1px solid var(--border); border-radius:8px; padding:10px; background: rgba(127,127,127,.06); }
        .row .msg{ font-weight:600; margin-bottom:4px; }
        .row .meta{ font-size:12px; color: var(--muted); }
      `}</style>
    </main>
  );
}
