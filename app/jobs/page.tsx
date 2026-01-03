import { api } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const res = await fetch(api("/api/jobs"), { cache: "no-store" });
  const jobs = await res.json();
  return (
    <main>
      <h2>/jobs</h2>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </main>
  );
}
