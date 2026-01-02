'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PostJobPage() {
  const r = useRouter();
  const q = useSearchParams();
  const [title, setTitle] = useState(q.get('title') || '');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: title || 'Untitled', description: desc }),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || 'Failed to create');
      r.push('/jobs');
    } catch (e: any) {
      setErr(e?.message || 'Error');
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Post a Job</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Complete bathroom tiling"
            style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
            required
          />
        </label>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Description</div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Brief scope, measurements, materials, timelines…"
            rows={6}
            style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'vertical' }}
          />
        </label>
        {err && <div style={{ color: '#b91c1c' }}>{err}</div>}
        <div>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #111827',
              background: '#111827',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {busy ? 'Posting…' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
