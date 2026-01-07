'use client';

import { useEffect, useState } from 'react';

type Job = {
  id: string;
  title: string;
  status: string;
  client_id: string | null;
  created_at?: string;
};

export default function Page() {
  const [rows, setRows] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('pending');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const r = await fetch('/api/jobs', { cache: 'no-store' });
    const j = await r.json();
    setRows(j.data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    setBusy(true); setErr(null);
    const r = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });
    const j = await r.json();
    if (!r.ok) setErr(j.error || 'Failed');
    setTitle('');
    await load();
    setBusy(false);
  }

  async function del(id: string) {
    setBusy(true); setErr(null);
    const r = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const j = await r.json(); setErr(j.error || 'Failed');
    }
    await load();
    setBusy(false);
  }

  async function toggleStatus(row: Job) {
    const next = row.status === 'done' ? 'pending' : 'done';
    setBusy(true); setErr(null);
    const r = await fetch(`/api/jobs/${row.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (!r.ok) {
      const j = await r.json(); setErr(j.error || 'Failed');
    }
    await load();
    setBusy(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Jobs</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="pending">pending</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <button disabled={busy || !title.trim()} onClick={add}>Add</button>
      </div>
      {err && <div style={{ color: 'crimson', marginBottom: 8 }}>{err}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>{r.status}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <button onClick={() => toggleStatus(r)}>Toggle status</button>
                <button onClick={() => del(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={3} style={{ padding: 8, color: '#777' }}>No jobs yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
