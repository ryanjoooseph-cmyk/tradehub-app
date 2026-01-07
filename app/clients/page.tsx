'use client';

import { useEffect, useState, useTransition } from 'react';

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export default function Page() {
  const [items, setItems] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch('/api/clients', { cache: 'no-store' });
    if (!res.ok) {
      setErr('Failed to load');
      setLoading(false);
      return;
    }
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, phone }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? 'Create failed');
      return;
    }
    setName(''); setEmail(''); setPhone('');
    startTransition(load);
  }

  async function remove(id: string) {
    setErr(null);
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? 'Delete failed');
      return;
    }
    startTransition(load);
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Clients</h1>

      <form onSubmit={addClient} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Name *"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: 8, minWidth: 160 }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 8, minWidth: 180 }}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ padding: 8, minWidth: 140 }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          {pending ? 'Adding…' : 'Add'}
        </button>
      </form>

      {err && <div style={{ color: 'crimson', marginBottom: 8 }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div>No clients yet</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Phone</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.email ?? '—'}</td>
                <td style={{ padding: 8 }}>{c.phone ?? '—'}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <button
                    onClick={() => remove(c.id)}
                    style={{ padding: '6px 10px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
