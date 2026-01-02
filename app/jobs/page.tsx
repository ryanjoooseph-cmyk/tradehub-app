import { getBaseUrl } from '@/lib/getBaseUrl';

type Job = { id: number; title: string; created_at: string };

export default async function JobsPage() {
  const res = await fetch(`${getBaseUrl()}/api/jobs`, { cache: 'no-store' });
  const data = (await res.json()) as Job[] | { ok: true };
  const rows = Array.isArray(data) ? data : [];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Jobs</h1>
      {rows.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {rows.map((j) => (
            <li key={j.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{j.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(j.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs yet.</p>
      )}
    </div>
  );
}
