type Job = { id: string; title: string; created_at: string };

async function getJobs(): Promise<Job[]> {
  // Keep it static for now so the page compiles cleanly
  return [{ id: '1', title: 'Example role', created_at: new Date().toISOString() }];
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return (
    <main>
      <h1>Jobs</h1>
      <ul>
        {jobs.map(j => (<li key={j.id}>{j.title}</li>))}
      </ul>
    </main>
  );
}
