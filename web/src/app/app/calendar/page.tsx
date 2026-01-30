"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  Timer,
  AlertTriangle,
  Briefcase,
} from "lucide-react";

type JobChip = {
  id: string;
  title: string;
  client: string;
  day: number;
  status: "Scheduled" | "In Progress" | "Blocked";
  hold: number;
};

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipClass(status: JobChip["status"]) {
  if (status === "In Progress") return "border-sky-300 bg-sky-50 text-sky-800";
  if (status === "Blocked") return "border-amber-300 bg-amber-50 text-amber-800";
  return "border-violet-300 bg-violet-50 text-violet-800";
}

const chips: JobChip[] = [
  { id: "J-187", title: "Facade repaint", client: "Arcadia", day: 3, status: "In Progress", hold: 16800 },
  { id: "J-188", title: "Patch + seal", client: "Northpoint", day: 4, status: "Scheduled", hold: 5200 },
  { id: "J-191", title: "Wash + prep", client: "Beacon", day: 5, status: "Scheduled", hold: 1800 },
  { id: "J-189", title: "Balcony deposit", client: "Lakeside", day: 1, status: "Blocked", hold: 0 },
];

export default function CalendarPage() {
  const [monthLabel, setMonthLabel] = useState("Feb 2026");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<JobChip | null>(chips[0] || null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return chips;
    return chips.filter((c) => `${c.id} ${c.title} ${c.client} ${c.status}`.toLowerCase().includes(s));
  }, [q]);

  const kpis = useMemo(() => {
    const hold = chips.reduce((a, c) => a + c.hold, 0);
    const blocked = chips.filter((c) => c.status === "Blocked").length;
    const inProg = chips.filter((c) => c.status === "In Progress").length;
    return { hold, blocked, inProg, scheduled: chips.filter((c) => c.status === "Scheduled").length };
  }, []);

  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Job cards are visible on the calendar. Drag/drop-ready layout comes next."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Week view</Button>
            <Button className="rounded-xl">New job <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Escrow held" value={moneyAUD(kpis.hold)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="In progress" value={String(kpis.inProg)} icon={<Timer className="h-4 w-4" />} />
        <StatCard label="Scheduled" value={String(kpis.scheduled)} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Jobs" value={String(chips.length)} icon={<Briefcase className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setMonthLabel(monthLabel)}><ChevronLeft className="h-4 w-4" /></Button>
              <div className="text-sm font-semibold">{monthLabel}</div>
              <Button variant="outline" className="rounded-xl" onClick={() => setMonthLabel(monthLabel)}><ChevronRight className="h-4 w-4" /></Button>
              <Badge variant="outline" className="rounded-full">Premium</Badge>
            </div>

            <div className="relative w-full md:w-[420px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scheduled jobs…" className="h-10 rounded-2xl pl-9" />
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                <div key={d} className="px-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const dayChips = filtered.filter((c) => c.day === d).slice(0, 3);
                return (
                  <div key={d} className="min-h-[110px] rounded-2xl border bg-background p-2 hover:bg-muted/20 transition">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold">{d <= 28 ? d : ""}</div>
                      {dayChips.length > 0 ? <span className="text-[10px] text-muted-foreground">{dayChips.length} job(s)</span> : null}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayChips.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelected(c)}
                          className={cn(
                            "w-full text-left rounded-xl border px-2 py-1 text-[11px] leading-tight",
                            chipClass(c.status)
                          )}
                        >
                          <div className="font-semibold truncate">{c.title}</div>
                          <div className="opacity-80 truncate">{c.client} · {c.id}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">
              Next: true drag/drop dispatch, capacity heatmap, crew lanes, SLA timers, and escalation routing.
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Job drawer</div>
            <Badge variant="outline" className="rounded-full">Preview</Badge>
          </div>

          {!selected ? (
            <div className="p-6 text-sm text-muted-foreground">Select a job card to view details.</div>
          ) : (
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-base font-semibold truncate">{selected.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.client} · {selected.id}</div>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-xs", chipClass(selected.status))}>{selected.status}</span>
              </div>

              <Separator />

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-xs text-muted-foreground">Escrow hold</div>
                <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.hold)}</div>
              </div>

              <div className="grid gap-2">
                <Button className="rounded-xl">Open job <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                <Button variant="outline" className="rounded-xl">Dispatch controls</Button>
                <Button variant="outline" className="rounded-xl">Evidence pack</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
