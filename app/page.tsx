// app/page.tsx
import { getBaseUrl } from '../lib/getBaseUrl';

type Job = { id: string; title: string; created_at?: string | null };

async function getJobs(): Promise<Job[]> {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/api/jobs`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    // If the instance is waking or DNS hiccups, don't crash the page
    return [];
  }
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>TradeHub</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Minimal dashboard. Server fetches <code>/api/jobs</code> with a normalized absolute base URL.
      </p>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Jobs</h2>
        {jobs.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No jobs yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {jobs.map((j) => (
              <li key={j.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{j.title}</div>
                {j.created_at ? (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {new Date(j.created_at).toLocaleString()}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
