'use client';
import { useEffect, useState } from 'react';
type Invoice = { id: string; total?: number; status?: string; client_id?: string; due_on?: string };

export default function InvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [form, setForm] = useState<Partial<Invoice>>({ status: 'draft' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/invoices', { cache: 'no-store' });
    const j = await r.json(); setItems(j.invoices ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { setForm({ status: 'draft' }); await load(); }
  };
  const del = async (id: string) => { await fetch(`/api/invoices/${id}`, { method: 'DELETE' }); await load(); };

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Invoices</h1>
      <form onSubmit={create} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input placeholder="Client ID" value={form.client_id ?? ''} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}/>
        <input placeholder="Total" type="number" value={(form.total as any) ?? ''} onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))}/>
        <input placeholder="Due (YYYY-MM-DD)" value={form.due_on ?? ''} onChange={e => setForm(f => ({ ...f, due_on: e.target.value }))}/>
        <input placeholder="Status" value={form.status ?? ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}/>
        <button type="submit">Add Invoice</button>
      </form>
      {loading ? <p>Loading…</p> : (
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>ID</th><th>Total</th><th>Status</th><th>Due</th><th/></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{x.id}</td><td>{x.total ?? ''}</td><td>{x.status}</td><td>{x.due_on ?? ''}</td>
                <td><button onClick={() => del(x.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
