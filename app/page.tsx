// app/jobs/page.tsx
export const dynamic = 'force-dynamic';

async function getJobs() {
  const res = await fetch('/api/jobs', { cache: 'no-store' });
  if (!res.ok) return { data: [] as any[] };
  return res.json() as Promise<{ data: any[] }>;
}

export default async function JobsPage() {
  const { data } = await getJobs();

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Jobs</h1>

      {data?.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.map((j: any) => (
            <li key={j.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{j.title ?? '(untitled)'}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {j.created_at ? new Date(j.created_at).toLocaleString() : ''}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs yet.</p>
      )}
    </main>
  );
}
