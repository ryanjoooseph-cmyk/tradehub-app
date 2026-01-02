// app/jobs/page.tsx
import { getBaseUrl } from "../../lib/getBaseUrl";

type Job = { id: string; title: string; created_at: string };

export const dynamic = "force-dynamic";

async function getJobs(): Promise<Job[]> {
  const base = getBaseUrl();
  const url = base ? new URL("/api/jobs", base).toString() : "/api/jobs";

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? (data as Job[]) : [];
}

export default async function JobsPage() {
  const data = await getJobs();

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Jobs</h1>

      {data.length ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {data.map((j) => (
            <li key={j.id} style={{ marginBottom: 10 }}>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{j.title || "(untitled)"}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(j.created_at).toLocaleString()}
                </div>
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
