import Link from 'next/link';
import { getBaseUrl } from '@/lib/getBaseUrl';

async function getJobs() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/jobs`, { cache: 'no-store' });
  if (!res.ok) return [];
  return (await res.json()) as Array<{ id: string; title: string; created_at: string }>;
}

export default async function MarketPage() {
  const jobs = await getJobs();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Market</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>Live jobs posted by homeowners and businesses.</p>

      {jobs.length ? (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
          {jobs.map((j) => (
            <li key={j.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{j.title || '(untitled job)'}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(j.created_at).toLocaleString()}</div>
                </div>
                <Link href={`/post-job?from=${j.id}`} style={{ alignSelf: 'center' }}>
                  View / Quote
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs yet. Be the first to <Link href="/post-job">post a job</Link>.</p>
      )}
    </div>
  );
}
