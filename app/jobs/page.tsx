'use client';

import React, { useEffect, useState } from 'react';

type Job = {
  id: string;
  title: string;
  status: string;
  client_id: string | null;
  created_at?: string | null;
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const [rows, setRows] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'pending' | 'active' | 'done'>('pending');

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch('/api/jobs', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed to load jobs');
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

  async function addJob(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const body = { title, status };
    const r = await fetch('/api/jobs', {
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
    setStatus('pending');
    await load();
  }

  async function del(id: string) {
    setErr(null);
    const r = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j?.error || 'Delete failed');
      return;
    }
    await load();
  }

  async function update(id: string, patch: Partial<Job>) {
    setErr(null);
    const r = await fetch(`/api/jobs/${id}`, {
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
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Jobs</h1>

      <form onSubmit={addJob} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job title"
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
        >
          <option value="pending">pending</option>
          <option value="active">active</option>
          <option value="done">done</option>
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
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8 }}>{r.title}</td>
              <td style={{ padding: 8 }}>
                <select
                  value={r.status}
                  onChange={(e) => update(r.id, { status: e.target.value })}
                  style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="done">done</option>
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
              <td colSpan={3} style={{ padding: 12, color: '#777' }}>
                No jobs yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
