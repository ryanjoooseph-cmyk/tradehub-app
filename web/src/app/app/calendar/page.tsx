"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarDays, Filter, Plus, Briefcase, MapPin, Clock, Users } from "lucide-react";

type JobChip = {
  id: string;
  title: string;
  client: string;
  location: string;
  start: string;
  end: string;
  status: "scheduled" | "in_progress" | "completed" | "blocked";
};

const DEMO: JobChip[] = [
  { id: "J-1042", title: "Strata repaint – Balcony edge", client: "Evergreen Body Corp", location: "Southbank", start: "08:30", end: "11:00", status: "scheduled" },
  { id: "J-1043", title: "Rope access washdown", client: "Civic Towers", location: "CBD", start: "11:30", end: "13:00", status: "in_progress" },
  { id: "J-1044", title: "Paint touch-ups – Level 9", client: "Harbor Residences", location: "Docklands", start: "14:00", end: "16:30", status: "blocked" },
  { id: "J-1045", title: "Quote walkthrough", client: "Lakeside Apartments", location: "St Kilda", start: "16:45", end: "17:30", status: "completed" },
];

function statusChip(s: JobChip["status"]) {
  if (s === "completed") return <Badge variant="outline" className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700">Completed</Badge>;
  if (s === "in_progress") return <Badge variant="outline" className="rounded-full border-sky-300 bg-sky-50 text-sky-800">In progress</Badge>;
  if (s === "blocked") return <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-800">Blocked</Badge>;
  return <Badge variant="outline" className="rounded-full">Scheduled</Badge>;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

export default function CalendarPage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [team, setTeam] = useState<string>("all");
  const [selected, setSelected] = useState<JobChip | null>(DEMO[1]);

  const kpis = useMemo(() => {
    const scheduled = DEMO.filter((j) => j.status === "scheduled").length;
    const inProgress = DEMO.filter((j) => j.status === "in_progress").length;
    const blocked = DEMO.filter((j) => j.status === "blocked").length;
    return { scheduled, inProgress, blocked, total: DEMO.length };
  }, []);

  const hours = useMemo(() => Array.from({ length: 11 }).map((_, i) => 7 + i), []);
  const filtered = useMemo(() => (team === "all" ? DEMO : DEMO), [team]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Operational calendar designed for jobs, crews, and client timelines."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" />Filters</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Total today" value={String(kpis.total)} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Scheduled" value={String(kpis.scheduled)} />
        <StatCard label="In progress" value={String(kpis.inProgress)} />
        <StatCard label="Blocked" value={String(kpis.blocked)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b bg-background px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="week" className="rounded-xl">Week</TabsTrigger>
                  <TabsTrigger value="day" className="rounded-xl">Day</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger className="h-10 w-[200px] rounded-2xl">
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All team</SelectItem>
                    <SelectItem value="rope">Rope access</SelectItem>
                    <SelectItem value="paint">Painting crew</SelectItem>
                    <SelectItem value="quote">Sales / quotes</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="h-10 rounded-2xl">Today</Button>
              </div>
            </div>
          </div>

          <div className="bg-background">
            <div className="grid grid-cols-[80px_1fr]">
              <div className="border-r bg-muted/20">
                {hours.map((h) => (
                  <div key={h} className="h-20 border-b px-3 py-2 text-xs text-muted-foreground">
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              <div className="relative">
                {hours.map((h) => (
                  <div key={h} className="h-20 border-b" />
                ))}

                <div className="absolute inset-0 p-3">
                  <div className="grid gap-3">
                    {filtered
                      .slice()
                      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
                      .map((j) => (
                        <button
                          key={j.id}
                          onClick={() => setSelected(j)}
                          className={cn(
                            "w-full rounded-2xl border bg-background p-3 text-left shadow-sm transition hover:bg-muted/30",
                            selected?.id === j.id ? "ring-2 ring-primary/30" : ""
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <div className="truncate text-sm font-semibold">{j.title}</div>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{j.client}</span>
                                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.start}–{j.end}</span>
                              </div>
                            </div>
                            {statusChip(j.status)}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t bg-muted/10 px-4 py-3 text-xs text-muted-foreground md:px-6">
              Drag & drop scheduling is next (UI wired first, then interactions).
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b bg-background px-4 py-4">
            <div className="text-sm font-semibold tracking-tight">Job details</div>
            <div className="mt-1 text-xs text-muted-foreground">Select a job chip to inspect.</div>
          </div>

          {selected ? (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{selected.title}</div>
                <div className="text-xs text-muted-foreground">{selected.id}</div>
              </div>

              <div className="flex flex-wrap gap-2">{statusChip(selected.status)}</div>

              <Separator />

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Client</div>
                  <div className="font-medium">{selected.client}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Location</div>
                  <div className="font-medium">{selected.location}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-medium">{selected.start}–{selected.end}</div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Button className="rounded-xl">Open job</Button>
                <Button variant="outline" className="rounded-xl">Reschedule</Button>
                <Button variant="outline" className="rounded-xl border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100">Blocker / dispute</Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="rounded-2xl border bg-background p-8 text-center text-sm text-muted-foreground">
                Select a job to view details.
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
