import { api } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetch(api("/api/jobs"), { cache: "no-store" });
  const jobs = await res.json();
  return (
    <main>
      <h1>TradeHub</h1>
      <p>Jobs API data:</p>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
      <p>AI test endpoint: <code>/api/ai-test</code></p>
    </main>
  );
}
