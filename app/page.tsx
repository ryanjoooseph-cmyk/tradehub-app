// app/page.tsx
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

async function getJobs() {
  const base = getBaseUrl();
  const r = await fetch(`${base}/api/jobs`, { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

export default async function Page() {
  const jobs = await getJobs();

  return (
    <main style={{ padding: 24 }}>
      <h1>TradeHub</h1>
      <p>Jobs queued: {Array.isArray(jobs) ? jobs.length : 0}</p>
      <ul>
        {Array.isArray(jobs) &&
          jobs.map((j: any, i: number) => (
            <li key={i}>{j.title ?? "Untitled job"}</li>
          ))}
      </ul>
      <p>
        <a href="/jobs">Open jobs page →</a>
      </p>
      <p>
        <a href="/api/ai/ping" target="_blank" rel="noreferrer">
          Run OpenAI smoke test →
        </a>
      </p>
    </main>
  );
}
