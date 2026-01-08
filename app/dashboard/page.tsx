'use client';
import { useEffect, useMemo, useState } from 'react';

type Health = { ok: boolean; time: string; commit?: string; versionTime?: string };
type PR = { number: number; title: string; state: string; labels: string[]; html_url: string; user: string; updated_at: string; head?: string; base?: string };
type Commit = { sha: string; short: string; message: string; author: string; date: string; url: string };

export default function Dashboard() {
  const [health, setHealth] = useState<Health | null>(null);
  const [prs, setPrs] = useState<PR[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [redeploying, setRedeploying] = useState(false);
  const [ghRate, setGhRate] = useState<{remaining?:string|null,limit?:string|null}>({});

  // Poll health & GH every 5s
  useEffect(() => {
    let lastCommit = '';
    const tick = async () => {
      try {
        const h = await fetch('/api/health', { cache: 'no-store' }).then(r=>r.json());
        const parsed: Health = {
          ok: !!h?.ok,
          time: h?.time ?? new Date().toISOString(),
          commit: h?.commit ?? h?.git?.sha ?? h?.version,
          versionTime: h?.versionTime ?? h?.buildTime,
        };
        setHealth(parsed);
        if (lastCommit && parsed.commit && parsed.commit !== lastCommit) {
          setBanner('New deploy detected.');
        }
        if (parsed.commit) lastCommit = parsed.commit;
      } catch {}

      try {
        const { prs, rate } = await fetch('/api/gh/prs', { cache: 'no-store' }).then(r=>r.json());
        setPrs(prs || []);
        setGhRate(rate || {});
      } catch {}

      try {
        const { commits } = await fetch('/api/gh/commits', { cache: 'no-store' }).then(r=>r.json());
        setCommits(commits || []);
      } catch {}
    };

    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  const openCount = prs.length;
  const riskyCount = useMemo(()=> prs.filter(p => p.labels?.some(l => /risky|touches/i.test(l))).length, [prs]);

  const triggerRedeploy = async () => {
    setRedeploying(true);
    try {
      const r = await fetch('/api/ops/redeploy', { method: 'POST' });
      const j = await r.json();
      setBanner(j.ok ? 'Redeploy triggered.' : `Redeploy failed (${j.status}).`);
    } catch {
      setBanner('Redeploy failed.');
    } finally {
      setRedeploying(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: '0 auto', color: '#E6E8EB' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>TradeHub Dashboard</h1>

      {banner && (
        <div
          onClick={() => setBanner(null)}
          style={{
            background: '#FFE8A3', color: '#222', padding: '10px 14px', borderRadius: 8,
            marginBottom: 12, cursor: 'pointer', fontWeight: 600
          }}
        >
          {banner} <span style={{ fontWeight: 400, marginLeft: 6 }}>(click to dismiss)</span>
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card title="Session">
          <p>You’re signed in. Keep this page open to watch merges & deploys roll in.</p>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={triggerRedeploy}
              disabled={redeploying}
              style={{
                padding: '8px 12px', borderRadius: 6, border: '1px solid #3A3F44',
                background: redeploying ? '#444' : '#2E7D32', color: '#fff'
              }}
            >
              {redeploying ? 'Triggering…' : 'Trigger redeploy'}
            </button>
          </div>
        </Card>

        <Card title="Deploy & Health">
          <Row k="Health" v={health?.ok ? 'OK ✅' : 'Fail ❌'} />
          <Row k="Server time" v={health?.time ?? '—'} />
          <Row k="Commit" v={health?.commit ?? '—'} monospace />
          <Row k="Version time" v={health?.versionTime ?? '—'} />
        </Card>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card title={`Open PRs (${openCount})`}>
          {prs.length === 0 && <Dim>None</Dim>}
          <div style={{ display: 'grid', gap: 8 }}>
            {prs.map(p => (
              <a key={p.number} href={p.html_url} target="_blank" rel="noreferrer"
                 style={{
                   display: 'block', padding: '10px 12px', borderRadius: 8,
                   border: '1px solid #3A3F44', background: '#0F141A'
                 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>#{p.number} — {p.title}</div>
                    <Dim>{p.head} → {p.base} • by {p.user}</Dim>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {p.labels?.slice(0,3).map(l => (
                      <span key={l} style={{
                        fontSize: 12, padding: '2px 6px', borderRadius: 999,
                        background: /automerge/i.test(l) ? '#234' : /risky|touches/i.test(l) ? '#5b2d2d' : '#333',
                        border: '1px solid #3A3F44'
                      }}>{l}</span>
                    ))}
                  </div>
                </div>
                <Dim>Updated {new Date(p.updated_at).toLocaleString()}</Dim>
              </a>
            ))}
          </div>
          {!!riskyCount && <Dim style={{ marginTop: 8 }}>{riskyCount} PRs flagged as “risky” (left for manual review)</Dim>}
          <Dim style={{ marginTop: 6 }}>GitHub rate: {ghRate.remaining ?? '—'}/{ghRate.limit ?? '—'}</Dim>
        </Card>

        <Card title="Recent commits (main)">
          {commits.length === 0 && <Dim>None</Dim>}
          <div style={{ display: 'grid', gap: 8 }}>
            {commits.map(c => (
              <a key={c.sha} href={c.url} target="_blank" rel="noreferrer"
                 style={{ display: 'block', padding: '10px 12px', borderRadius: 8, border: '1px solid #3A3F44', background: '#0F141A' }}>
                <div style={{ fontWeight: 700 }}>{c.message}</div>
                <Dim>{c.short} • {c.author} • {new Date(c.date).toLocaleString()}</Dim>
              </a>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div style={{ border: '1px solid #3A3F44', borderRadius: 12, background: '#0B1117', padding: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Row({ k, v, monospace }: { k: string; v?: string; monospace?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '4px 0' }}>
      <div style={{ opacity: 0.8 }}>{k}</div>
      <div style={{ fontFamily: monospace ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined }}>{v ?? '—'}</div>
    </div>
  );
}

function Dim({ children, style }: any) {
  return <div style={{ opacity: 0.7, fontSize: 13, ...style }}>{children}</div>;
}
