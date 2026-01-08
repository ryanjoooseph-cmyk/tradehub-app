'use client';
import { useEffect, useState } from 'react';

type Health = { ok?: boolean; time?: string; commit?: string; version?: string };

const PAGES = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/clients',   label: 'Clients' },
  { path: '/invoices',  label: 'Invoices' },
  { path: '/quotes',    label: 'Quotes' },
  { path: '/jobs',      label: 'Jobs' },
  { path: '/payments',  label: 'Payments' },
  { path: '/tenants',   label: 'Tenants' },
  { path: '/disputes',  label: 'Disputes' },
];

export default function Screens() {
  const [ver, setVer] = useState(0);
  const [health, setHealth] = useState<Health>({});

  // Pull health/commit every 15s so you see new deploys roll in
  useEffect(() => {
    const tick = () => fetch('/api/health')
      .then(r => r.json()).then(setHealth).catch(() => {});
    tick();
    const id = setInterval(() => { setVer(v => v + 1); tick(); }, 15000);
    return () => clearInterval(id);
  }, []);

  const bust = `v=${ver}`;

  return (
    <main style={{ padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>TradeHub Screens</h1>
        <span style={{ opacity: 0.7 }}>
          {health?.ok ? 'Health: OK ' : ''} 
          {health?.commit ? `• commit ${health.commit.slice(0,7)}` : ''} 
          {health?.time ? `• ${health.time}` : ''}
        </span>
        <button onClick={() => setVer(v => v + 1)} style={{ marginLeft: 'auto' }}>
          Hard refresh
        </button>
      </header>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: 16
      }}>
        {PAGES.map(p => (
          <div key={p.path} style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden', background: '#111' }}>
            <div style={{ padding: 8, fontWeight: 600 }}>{p.label} <small style={{ opacity: .6 }}>{p.path}</small></div>
            <iframe
              src={`${p.path}?${bust}`}
              style={{ width: '100%', height: 520, border: 0, background: 'white' }}
            />
          </div>
        ))}
      </section>
      <p style={{ marginTop: 12, opacity: .7 }}>
        Tip: if any tile shows the login form, open <code>/login</code> in a tab, sign in once, then refresh this page.
      </p>
    </main>
  );
}
