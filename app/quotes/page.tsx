'use client';
import { useEffect, useState } from 'react';

type Quote = {
  id: string;
  client_id: string;
  title: string;
  total: number;
  status: string;
  created_at: string;
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [form, setForm] = useState({ client_id: '', title: '', total: '' });

  const load = async () => {
    const res = await fetch('/api/quotes');
    const json = await res.json();
    setQuotes(json.quotes ?? []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: form.client_id,
        title: form.title,
        total: form.total ? Number(form.total) : 0
      })
    });
    setForm({ client_id: '', title: '', total: '' });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Quotes</h1>

      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input placeholder="Client ID" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} required />
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Total" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
        <button>Add Quote</button>
      </form>

      <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Client</th>
            <th align="left">Total</th>
            <th align="left">Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {quotes.map(q => (
            <tr key={q.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{q.title}</td>
              <td>{q.client_id}</td>
              <td>{q.total.toFixed(2)}</td>
              <td>{q.status}</td>
              <td><button onClick={() => remove(q.id)}>Delete</button></td>
            </tr>
          ))}
          {!quotes.length && (
            <tr><td colSpan={5} style={{ padding: 16, color: '#666' }}>No quotes yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
