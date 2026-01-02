'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitJob() {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setErr('Title is required');

    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTitle('');
      router.refresh(); // re-fetch server data for /jobs
    } catch (e) {
      setErr('Failed to create job — try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display:'flex', gap:8, margin:'16px 0' }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Job title"
        aria-label="Job title"
        style={{ flex:1, padding:8, border:'1px solid #ddd', borderRadius:6 }}
      />
      <button disabled={busy} style={{ padding:'8px 12px', borderRadius:6 }}>
        {busy ? 'Adding…' : 'Add job'}
      </button>
      {err && <span style={{ color:'#b00', marginLeft:8 }}>{err}</span>}
    </form>
  );
}
