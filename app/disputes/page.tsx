'use client';
import { useEffect, useState } from 'react';
type Dispute = { id: string; job_id?: string; invoice_id?: string; reason?: string; status?: string };

export default function DisputesPage() {
  const [items, setItems] = useState<Dispute[]>([]);
  const [form, setForm] = useState<Partial<Dispute>>({ status: 'open' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/disputes', { cache: 'no-store' });
    const j = await r.json(); setItems(j.disputes ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch('/api/disputes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { setForm({ status: 'open' }); await load(); }
  };
  const del = async (id: string) => { await fetch(`/api/disputes/${id}`, { method: 'DELETE' }); await load(); };

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Disputes</h1>
      <form onSubmit={create} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input placeholder="Job ID (optional)" value={form.job_id ?? ''} onChange={e => setForm(f => ({ ...f, job_id: e.target.value }))}/>
        <input placeholder="Invoice ID (optional)" value={form.invoice_id ?? ''} onChange={e => setForm(f => ({ ...f, invoice_id: e.target.value }))}/>
        <input placeholder="Reason" value={form.reason ?? ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}/>
        <input placeholder="Status" value={form.status ?? ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}/>
        <button type="submit">Add Dispute</button>
      </form>
      {loading ? <p>Loading…</p> : (
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>ID</th><th>Job</th><th>Invoice</th><th>Status</th><th/></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{x.id}</td><td>{x.job_id ?? ''}</td><td>{x.invoice_id ?? ''}</td><td>{x.status}</td>
                <td><button onClick={() => del(x.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
