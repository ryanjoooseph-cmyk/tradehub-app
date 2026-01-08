'use client';

import { useEffect, useState } from 'react';

export default function Ops() {
  const [health, setHealth] = useState<any>(null);
  const [kicking, setKicking] = useState(false);

  const load = async () => {
    const r = await fetch('/api/health', { cache: 'no-store' });
    setHealth(await r.json());
  };

  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  const redeploy = async () => {
    setKicking(true);
    try { await fetch('/api/redeploy', { method: 'POST' }); } finally { setKicking(false); }
  };

  return (
    <main style={{maxWidth:800, margin:'40px auto', fontFamily:'system-ui'}}>
      <h1>Ops</h1>
      <button onClick={redeploy} disabled={kicking} style={{padding:'8px 14px'}}>
        {kicking ? 'Triggering…' : 'Trigger Redeploy'}
      </button>
      <pre style={{background:'#f6f6f6', padding:12, marginTop:16}}>
        {JSON.stringify(health, null, 2)}
      </pre>
      <p style={{opacity:.7}}>This page auto-refreshes every 5s.</p>
    </main>
  );
}
