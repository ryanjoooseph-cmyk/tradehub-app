'use client';
import { useEffect, useState } from 'react';
type Payment = { id: string; invoice_id?: string; amount?: number; method?: string; status?: string };

export default function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [form, setForm] = useState<Partial<Payment>>({ status: 'created' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/payments', { cache: 'no-store' });
    const j = await r.json(); setItems(j.payments ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { setForm({ status: 'created' }); await load(); }
  };
  const del = async (id: string) => { await fetch(`/api/payments/${id}`, { method: 'DELETE' }); await load(); };

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Payments</h1>
      <form onSubmit={create} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input placeholder="Invoice ID" value={form.invoice_id ?? ''} onChange={e => setForm(f => ({ ...f, invoice_id: e.target.value }))}/>
        <input placeholder="Amount" type="number" value={(form.amount as any) ?? ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}/>
        <input placeholder="Method (card/bank…)" value={form.method ?? ''} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}/>
        <input placeholder="Status" value={form.status ?? ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}/>
        <button type="submit">Add Payment</button>
      </form>
      {loading ? <p>Loading…</p> : (
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>ID</th><th>Invoice</th><th>Amount</th><th>Status</th><th/></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{x.id}</td><td>{x.invoice_id ?? ''}</td><td>{x.amount ?? ''}</td><td>{x.status}</td>
                <td><button onClick={() => del(x.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
