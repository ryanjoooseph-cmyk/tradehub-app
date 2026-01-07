'use client';

import { useEffect, useState } from 'react';

type Quote = {
  id: string;
  title: string;
  amount: number;
  status: string;
  client_id: string | null;
  created_at?: string;
};

export default function Page() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState('draft');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const r = await fetch('/api/quotes', { cache: 'no-store' });
    const j = await r.json();
    setRows(j.data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    setBusy(true); setErr(null);
    const r = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, amount, status }),
    });
    const j = await r.json();
    if (!r.ok) setErr(j.error || 'Failed');
    setTitle(''); setAmount(0);
    await load();
    setBusy(false);
  }

  async function del(id: string) {
    setBusy(true); setErr(null);
    const r = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const j = await r.json(); setErr(j.error || 'Failed');
    }
    await load();
    setBusy(false);
  }

  async function markSent(q: Quote) {
    setBusy(true); setErr(null);
    const r = await fetch(`/api/quotes/${q.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: q.status === 'sent' ? 'draft' : 'sent' }),
    });
    if (!r.ok) {
      const j = await r.json(); setErr(j.error || 'Failed');
    }
    await load();
    setBusy(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Quotes</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Quote title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ padding: 8, width: 120, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="draft">draft</option>
          <option value="sent">sent</option>
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
        </select>
        <button disabled={busy || !title.trim()} onClick={add}>Add</button>
      </div>
      {err && <div style={{ color: 'crimson', marginBottom: 8 }}>{err}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Amount</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>${(r.amount ?? 0).toFixed(2)}</td>
              <td style={{ padding: 8 }}>{r.status}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <button onClick={() => markSent(r)}>Toggle sent</button>
                <button onClick={() => del(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={4} style={{ padding: 8, color: '#777' }}>No quotes yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
