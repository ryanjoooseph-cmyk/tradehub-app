'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// If your project already has this, keep the import.
// If not, replace with your own browser client maker.
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

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>(null);
  const [version, setVersion] = useState<Version>(null);
  const [newDeploy, setNewDeploy] = useState(false);
  const [prs, setPrs] = useState<Pr[]>([]);
  const [prError, setPrError] = useState<string | null>(null);

  // Auth sanity: who is logged in?
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  // Poll health + version for deploy change detection
  useEffect(() => {
    let baselineTs: string | null = null;

    const tick = async () => {
      try {
        const h = await fetch('/api/health', { cache: 'no-store' }).then(r => r.json());
        setHealth(h);
      } catch (e) {
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

  // Fetch open PRs (public works anon; private needs GITHUB_TOKEN on server)
  useEffect(() => {
    const load = async () => {
      try {
        setPrError(null);
        const j = await fetch('/api/github/prs', { cache: 'no-store' }).then(r => r.json());
        if (j?.ok) setPrs(j.prs || []);
        else setPrError(j?.error || 'PR feed unavailable');
      } catch (e: any) {
        setPrError(e?.message || 'PR feed error');
      }
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
      <h1 style={{ marginBottom: 6 }}>TradeHub Dashboard</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Live view while agents ship code.</p>

      {newDeploy && (
        <div style={{ margin: '16px 0', padding: 12, border: '1px solid #ddd', background: '#ffffe6' }}>
          New deploy detected. <button onClick={() => location.reload()}>Refresh</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Auth card */}
        <section style={card}>
          <h3 style={h3}>Session</h3>
          <p>Signed in as: <strong>{email ?? '…'}</strong></p>
          <p>
            <Link href="/logout">Sign out</Link> · <Link href="/login">Login</Link> ·{' '}
            <Link href="/register">Register</Link>
          </p>
        </section>

        {/* Deploy / health */}
        <section style={card}>
          <h3 style={h3}>Deploy & Health</h3>
          <ul style={ul}>
            <li>Health: {health?.ok ? 'OK ✅' : 'Down / unknown ⚠️'}</li>
            <li>Server time: {health?.time ?? '…'}</li>
            <li>Commit: {version?.sha ? version.sha.slice(0, 8) : 'n/a'} {version?.branch ? `(${version.branch})` : ''}</li>
            <li>Version timestamp: {version?.ts ?? '…'}</li>
          </ul>
          <p style={{ marginTop: 8 }}>
            Keep this page open; it auto-detects new deploys every 5s.
          </p>
        </section>

        {/* PR feed */}
        <section style={{ ...card, gridColumn: '1 / span 2' }}>
          <h3 style={h3}>Open PRs</h3>
          {prError && <p style={{ color: '#b00' }}>{prError}</p>}
          {!prError && prs.length === 0 && <p>No open PRs.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {prs.map(pr => (
              <a key={pr.number} href={pr.url} target="_blank" rel="noreferrer" style={prItem}>
                <div style={{ fontWeight: 600 }}>#{pr.number} · {pr.title}</div>
                <div style={{ fontSize: 12, color: '#555' }}>
                  {pr.draft ? 'draft · ' : ''}{pr.state} · {pr.labels?.join(', ') || 'no labels'}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  background: '#fff'
};
const h3: React.CSSProperties = { margin: '0 0 8px 0' };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 18 };
const prItem: React.CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 6,
  padding: 10,
  textDecoration: 'none',
  color: 'inherit',
  background: '#fafafa'
};
