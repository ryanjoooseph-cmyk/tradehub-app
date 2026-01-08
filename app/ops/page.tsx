// app/ops/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Ops() {
  const [health, setHealth] = useState<any>(null);
  const [last, setLast] = useState<string>('');
  const [redeploying, setRedeploying] = useState(false);

  async function load() {
    const r = await fetch('/api/health', { cache: 'no-store' });
    const j = await r.json();
    setHealth(j);
    setLast(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  async function redeploy() {
    setRedeploying(true);
    try {
      const r = await fetch('/api/redeploy', { method: 'POST' });
      const j = await r.json();
      alert(j.ok ? 'Redeploy triggered' : `Redeploy failed (${j.status || ''})`);
    } finally {
      setRedeploying(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Ops</h1>
      <p>Auth is ON everywhere else. This page is public for monitoring.</p>

      <h3>Health</h3>
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <p>Last refresh: {last}</p>

      <button onClick={redeploy} disabled={redeploying}>
        {redeploying ? 'Triggering…' : 'Trigger redeploy'}
      </button>
    </main>
  );
}
