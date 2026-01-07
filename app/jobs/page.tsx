'use client';
import { useEffect, useState } from 'react';

type Job = {
  id: string;
  client_id: string;
  title: string;
  status: string;
  scheduled_on: string | null;
  amount: number | null;
  created_at: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({ client_id: '', title: '', status: 'new', scheduled_on: '', amount: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/jobs');
    const json = await res.json();
    setJobs(json.jobs ?? []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: form.client_id,
        title: form.title,
        status: form.status,
        scheduled_on: form.scheduled_on || null,
        amount: form.amount ? Number(form.amount) : 0
      })
    });
    setForm({ client_id: '', title: '', status: 'new', scheduled_on: '', amount: '' });
    setLoading(false);
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Jobs</h1>

      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input placeholder="Client ID" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} required />
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
        <input placeholder="Scheduled on (YYYY-MM-DD)" value={form.scheduled_on} onChange={e => setForm({ ...form, scheduled_on: e.target.value })} />
        <input placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <button disabled={loading}>{loading ? 'Saving…' : 'Add Job'}</button>
      </form>

      <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Client</th>
            <th align="left">Status</th>
            <th align="left">Scheduled</th>
            <th align="left">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{j.title}</td>
              <td>{j.client_id}</td>
              <td>{j.status}</td>
              <td>{j.scheduled_on ?? '—'}</td>
              <td>{(j.amount ?? 0).toFixed(2)}</td>
              <td><button onClick={() => remove(j.id)}>Delete</button></td>
            </tr>
          ))}
          {!jobs.length && (
            <tr><td colSpan={6} style={{ padding: 16, color: '#666' }}>No jobs yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
