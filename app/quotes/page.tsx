'use client';

import React, { useEffect, useState } from 'react';

type Quote = {
  id: string;
  title: string;
  amount: number;
  status: string;
  client_id: string | null;
  created_at?: string | null;
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<'draft' | 'sent' | 'accepted' | 'rejected'>('draft');

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch('/api/quotes', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed to load quotes');
      setRows(j.data ?? []);
    } catch (e: any) {
      setErr(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addQuote(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const body = { title, amount, status };
    const r = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok) {
      setErr(j?.error || 'Create failed');
      return;
    }
    setTitle('');
    setAmount(0);
    setStatus('draft');
    await load();
  }

  async function del(id: string) {
    setErr(null);
    const r = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j?.error || 'Delete failed');
      return;
    }
    await load();
  }

  async function update(id: string, patch: Partial<Quote>) {
    setErr(null);
    const r = await fetch(`/api/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j?.error || 'Update failed');
      return;
    }
    await load();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Quotes</h1>

      <form onSubmit={addQuote} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quote title"
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, width: 120 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
        >
          <option value="draft">draft</option>
          <option value="sent">sent</option>
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
        </select>
        <button
          type="submit"
          style={{ padding: '8px 12px', border: '1px solid #222', borderRadius: 6 }}
        >
          Add
        </button>
      </form>

      {err ? <div style={{ color: 'crimson', marginBottom: 12 }}>{err}</div> : null}
      {loading ? <div>Loading…</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Amount</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>${Number(r.amount ?? 0).toFixed(2)}</td>
              <td style={{ padding: 8 }}>
                <select
                  value={r.status}
                  onChange={(e) => update(r.id, { status: e.target.value })}
                  style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="draft">draft</option>
                  <option value="sent">sent</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
              </td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => del(r.id)}
                  style={{ padding: '6px 10px', border: '1px solid #222', borderRadius: 6 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && !loading ? (
            <tr>
              <td colSpan={4} style={{ padding: 12, color: '#777' }}>
                No quotes yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
