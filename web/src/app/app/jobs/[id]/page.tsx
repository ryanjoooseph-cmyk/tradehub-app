import Link from "next/link";

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Job #{id}</h1>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs border bg-background/40">
              Scheduled
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            ACME Strata • Southbank VIC • Rope access repaint — Tower 2
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="font-medium">$4,200</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Created 2 days ago</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Message client</button>
          <button className="px-4 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Create invoice</button>
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:opacity-95 text-sm">
            Mark in progress
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Activity</div>
              <div className="text-xs text-muted-foreground">Latest first</div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["Today 10:12", "Crew assigned: Ryan + 1"],
                ["Yesterday 16:44", "Schedule updated: Thu 10:30–13:30"],
                ["Yesterday 09:05", "Client approved quote"],
                ["2 days ago", "Job created"],
              ].map(([t, e]) => (
                <div key={t} className="flex gap-3 rounded-xl border bg-background/40 p-3">
                  <div className="text-xs font-mono text-muted-foreground w-28">{t}</div>
                  <div className="text-sm">{e}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Notes</div>
            <div className="mt-3 rounded-xl border bg-background/40 p-3 text-sm text-muted-foreground">
              Add internal notes, access details, hazards, client preferences…
            </div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 px-3 py-2 rounded-xl border bg-card/40 text-sm" placeholder="Write a note…" />
              <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow text-sm">Add</button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Attachments</div>
              <button className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Upload</button>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl border bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Schedule</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">Thu</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">10:30–13:30</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Crew</span><span className="font-medium">Ryan + 1</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/app/calendar" className="flex-1 text-center px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">
                Open calendar
              </Link>
              <button className="flex-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground shadow text-sm">Reschedule</button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Client</div>
            <div className="mt-3 text-sm">
              <div className="font-medium">ACME Strata</div>
              <div className="text-muted-foreground">accounts@acmestrata.com</div>
              <div className="text-muted-foreground">Southbank VIC</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">View client</button>
              <button className="flex-1 px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Call</button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Next actions</div>
            <div className="mt-3 space-y-2">
              {["Confirm access", "Upload photos", "Send invoice"].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-xl border bg-background/40 px-3 py-2 text-sm">
                  <span>{x}</span>
                  <button className="px-2 py-1 rounded-lg border bg-card/40 hover:bg-accent/50 text-xs">Done</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
