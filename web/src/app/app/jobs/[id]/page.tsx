export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function JobDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Job #{id}</h1>
          <p className="text-sm text-muted-foreground">
            Job detail scaffold (Next 16 params Promise fixed). Next: tabs, timeline, photos, notes, invoice panel.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:opacity-95" type="button">
            Edit
          </button>
          <button className="h-9 rounded-xl border bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent" type="button">
            Create invoice
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-card/40 p-5">
          <div className="font-medium">Overview</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground">Client</div>
              <div className="mt-1 font-medium">ACME Strata</div>
            </div>
            <div className="rounded-xl border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground">Site</div>
              <div className="mt-1 font-medium">Southbank</div>
            </div>
            <div className="rounded-xl border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="mt-1 font-medium">Scheduled</div>
            </div>
            <div className="rounded-xl border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground">Value</div>
              <div className="mt-1 font-medium">A$24,500</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/40 p-5">
          <div className="font-medium">Activity</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border bg-background/60 p-3">
              <div className="font-medium">Scope approved</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
            <div className="rounded-xl border bg-background/60 p-3">
              <div className="font-medium">Crew assigned</div>
              <div className="text-xs text-muted-foreground">Yesterday</div>
            </div>
            <div className="rounded-xl border bg-background/60 p-3">
              <div className="font-medium">Photos uploaded</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
