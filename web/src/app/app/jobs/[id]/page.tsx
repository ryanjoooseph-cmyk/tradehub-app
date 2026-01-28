export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Job #{id}</h1>
          <p className="text-sm text-muted-foreground">Detail view next: scope, docs, costs, payments.</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/40 p-6">
        <div className="text-sm text-muted-foreground">
          Dynamic route is healthy. Agents will wire DB fetch + actions here.
        </div>
      </div>
    </div>
  );
}
