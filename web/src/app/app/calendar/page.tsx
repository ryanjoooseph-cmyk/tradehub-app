"use client";

import React from "react";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton } from "@/components/app/filled/page";
import { ChevronLeft, ChevronRight, GripVertical, Calendar as CalendarIcon, Sparkles } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  client: string;
  site: string;
  day: number; // 0..6
  startMin: number; // minutes from 0:00
  durMin: number;
  crew: string[];
};

type BacklogItem = {
  id: string;
  title: string;
  crew: string[] | null;
  site: string;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function minutesToLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Seeded scheduled jobs
const initialEvents: EventItem[] = [
  { id: 'J-1402', title: 'Tower A repaint', client: 'Acme Body Corp', site: 'Southbank', day: 3, startMin: 8 * 60, durMin: 480, crew: ['Ryan J', 'Crew A'] },
  { id: 'J-1403', title: 'High-rise touch-up', client: 'Carlton Strata', site: 'CBD', day: 0, startMin: 9 * 60, durMin: 360, crew: ['Crew B'] },
  { id: 'J-1404', title: 'Balcony sealing', client: 'Bayside Strata', site: 'St Kilda', day: 1, startMin: 10 * 60, durMin: 240, crew: ['Crew A'] },
  { id: 'J-1406', title: 'Heritage restoration', client: 'South Yarra Owners', site: 'South Yarra', day: 2, startMin: 8 * 60, durMin: 420, crew: ['Ryan J', 'Crew C'] },
  { id: 'J-1408', title: 'Roof deck repair', client: 'Docklands Mgmt', site: 'Docklands', day: 4, startMin: 14 * 60, durMin: 180, crew: ['QA', 'Crew B'] },
  { id: 'J-1409', title: 'Façade inspection', client: 'Melbourne Property', site: 'Richmond', day: 5, startMin: 9 * 60, durMin: 240, crew: ['Ryan J'] },
  { id: 'J-1411', title: 'Strata QA check', client: 'Brunswick Estates', site: 'Brunswick', day: 6, startMin: 11 * 60, durMin: 180, crew: ['QA'] },
];

// Seeded backlog (unscheduled)
const initialBacklog: BacklogItem[] = [
  { id: 'J-1405', title: 'QA inspection', crew: null, site: 'Docklands' },
  { id: 'J-1410', title: 'Paint touch-up', crew: null, site: 'Preston' },
  { id: 'J-1412', title: 'Window sealing', crew: null, site: 'Footscray' },
];

export default function CalendarPage() {
  const startDayMin = 7 * 60;
  const endDayMin = 19 * 60;
  const stepMin = 30;

  const [view, setView] = React.useState<"day" | "week" | "month">("week");
  const [focusDay, setFocusDay] = React.useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const [events, setEvents] = React.useState<EventItem[]>(initialEvents);
  const [backlog] = React.useState<BacklogItem[]>(initialBacklog);

  const gridDays = view === "day" ? [focusDay] : view === "week" ? days.map((_, i) => i) : [];

  const rows = Math.ceil((endDayMin - startDayMin) / stepMin);
  const pxPerStep = 22;
  const gridHeight = rows * pxPerStep;

  // Detect conflicts (overlapping jobs for same crew)
  const hasConflict = (event: EventItem): boolean => {
    const eventEnd = event.startMin + event.durMin;
    return events.some(other => {
      if (other.id === event.id || other.day !== event.day) return false;
      const otherEnd = other.startMin + other.durMin;
      const timeOverlap = event.startMin < otherEnd && eventEnd > other.startMin;
      const crewOverlap = event.crew.some(c => other.crew.includes(c));
      return timeOverlap && crewOverlap;
    });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent, day: number, startMin: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setEvents((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, day, startMin: clamp(Math.round(startMin / stepMin) * stepMin, startDayMin, endDayMin - stepMin) }
          : x
      )
    );
  };

  const goToToday = () => {
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    setFocusDay(today);
  };

  const slots = Array.from({ length: rows + 1 }, (_, i) => startDayMin + i * stepMin);
  const visibleEvents = events.filter((ev) => gridDays.includes(ev.day));
  const conflictCount = events.filter(hasConflict).length;

  return (
    <PageWrap>
      <PageHeader
        title="Calendar"
        subtitle="Drag jobs across time and days. This is the ops cockpit."
        right={
          <>
            <GhostButton onClick={goToToday}>
              <CalendarIcon className="h-4 w-4" />
              Today
            </GhostButton>
            <PrimaryButton>New booking</PrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card
            title="Week Controls"
            subtitle="High-signal scheduling"
            right={
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-accent/40"
                  type="button"
                  title="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-accent/40"
                  type="button"
                  title="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            }
          >
            {/* View Toggles */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setView('day')}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold ${view === 'day' ? 'bg-accent text-accent-foreground' : 'bg-background hover:bg-accent/40'}`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold ${view === 'week' ? 'bg-accent text-accent-foreground' : 'bg-background hover:bg-accent/40'}`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold ${view === 'month' ? 'bg-accent text-accent-foreground' : 'bg-background hover:bg-accent/40'}`}
              >
                Month
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">This week</div>
                <div className="mt-1 text-lg font-semibold">{events.length} jobs</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {Array.from(new Set(events.flatMap(e => e.crew))).length} crews
                </div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">Conflicts</div>
                <div className={`mt-1 text-lg font-semibold ${conflictCount > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                  {conflictCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {conflictCount > 0 ? 'Overlaps detected' : 'No overlaps'}
                </div>
              </div>
            </div>

            {view === "day" && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-muted-foreground">Focused day</div>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {days.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFocusDay(i)}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold ${i === focusDay ? 'bg-accent text-accent-foreground' : 'bg-background hover:bg-accent/40'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between rounded-2xl border bg-muted/10 p-4">
              <div>
                <div className="text-sm font-semibold">Smart scheduling</div>
                <div className="text-xs text-muted-foreground">Auto suggest crew + time slots</div>
              </div>
              <Pill tone="good">
                <Sparkles className="mr-1 h-3 w-3" />
                On
              </Pill>
            </div>
          </Card>

          <Card title="Backlog" subtitle="Unscheduled jobs - drag to schedule">
            <div className="space-y-2">
              {backlog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    // Add to events as unscheduled, will be positioned on drop
                    e.dataTransfer.setData("text/plain", JSON.stringify({
                      isBacklog: true,
                      id: item.id,
                      title: item.title,
                      crew: item.crew || [],
                      site: item.site,
                      client: 'Unassigned',
                    }));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className="rounded-2xl border bg-muted/10 p-3 cursor-grab hover:bg-muted/20"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 opacity-60 mt-1" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{item.id} • {item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.site} • {item.crew ? item.crew.join(', ') : 'No crew assigned'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {view === 'month' ? (
            <Card title="Month View" subtitle="Coming soon">
              <div className="rounded-2xl border bg-muted/5 p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 opacity-20" />
                <div className="mt-4 text-sm font-semibold">Month view in development</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Use Day or Week view for now
                </div>
              </div>
            </Card>
          ) : (
            <div className="rounded-2xl border bg-card/50 p-3">
              <div className={`grid ${view === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_repeat(7,minmax(0,1fr))]'} gap-2`}>
                <div className="rounded-xl border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">Time</div>
                {gridDays.map((i) => (
                  <div key={i} className="rounded-xl border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {days[i]}
                  </div>
                ))}
              </div>

              <div className={`mt-2 grid ${view === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_repeat(7,minmax(0,1fr))]'} gap-2`}>
                <div className="relative" style={{ height: gridHeight }}>
                  {slots.slice(0, -1).map((m) => (
                    <div key={m} className="h-[22px] flex items-center justify-center text-[10px] text-muted-foreground">
                      {m % 60 === 0 ? minutesToLabel(m) : ""}
                    </div>
                  ))}
                </div>

                {gridDays.map((d) => (
                  <div
                    key={d}
                    className="relative overflow-hidden rounded-2xl border bg-background/40"
                    style={{ height: gridHeight }}
                    onDragOver={allowDrop}
                    onDrop={(ev) => {
                      const rect = (ev.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const y = ev.clientY - rect.top;
                      const stepIndex = Math.floor(y / pxPerStep);
                      const startMin = startDayMin + stepIndex * stepMin;
                      onDrop(ev, d, startMin);
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      {slots.slice(0, -1).map((m) => (
                        <div key={m} className="h-[22px] border-b border-foreground/5" />
                      ))}
                    </div>

                    {visibleEvents
                      .filter((e) => e.day === d)
                      .map((e) => {
                        const top = ((e.startMin - startDayMin) / stepMin) * pxPerStep + 2;
                        const h = Math.max(2, (e.durMin / stepMin) * pxPerStep - 4);
                        const isConflict = hasConflict(e);
                        return (
                          <div
                            key={e.id}
                            draggable
                            onDragStart={(ev) => onDragStart(ev, e.id)}
                            className="absolute left-2 right-2 cursor-grab active:cursor-grabbing"
                            style={{ top, height: h }}
                          >
                            <div className={`h-full rounded-2xl border p-3 shadow-sm hover:bg-muted/30 ${
                              isConflict 
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/30' 
                                : 'border-foreground/15 bg-muted/20'
                            }`}>
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-xs font-semibold">{e.id}</div>
                                {isConflict && <Pill tone="bad">Conflict</Pill>}
                              </div>
                              <div className="mt-1 text-sm font-semibold leading-tight">{e.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{e.client} • {e.site}</div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {e.crew.map((c, i) => (
                                  <Pill key={i} tone="neutral">{c}</Pill>
                                ))}
                              </div>
                              <div className="mt-2 text-[10px] text-muted-foreground">
                                {minutesToLabel(e.startMin)} – {minutesToLabel(e.startMin + e.durMin)}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    <div className="absolute inset-x-2 bottom-2 rounded-xl border border-dashed bg-muted/5 px-2 py-2 text-center text-[10px] text-muted-foreground">
                      Drop to schedule
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Conflict engine" subtitle="Real-time overlap detection">
              <div className="space-y-3">
                <div className="rounded-2xl border bg-muted/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Overlap detection</div>
                    <Pill tone={conflictCount > 0 ? 'bad' : 'good'}>
                      {conflictCount > 0 ? 'Conflicts' : 'OK'}
                    </Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {conflictCount > 0 
                      ? `${conflictCount} crew overlap${conflictCount > 1 ? 's' : ''} detected - see highlighted jobs`
                      : 'No crew overlaps found in current view'}
                  </div>
                </div>
                <div className="rounded-2xl border bg-muted/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Travel buffer</div>
                    <Pill tone="warn">Review</Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Add travel-time constraints (next upgrade).</div>
                </div>
              </div>
            </Card>

            <Card title="Ops shortcuts" subtitle="Fast actions" right={<GhostButton>Configure</GhostButton>}>
              <div className="grid gap-2">
                <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                  <div className="text-sm font-semibold">Auto-fill week</div>
                  <div className="text-xs text-muted-foreground">Suggest slots by crew capacity</div>
                </button>
                <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                  <div className="text-sm font-semibold">Generate daily brief</div>
                  <div className="text-xs text-muted-foreground">For crews & client updates</div>
                </button>
                <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                  <div className="text-sm font-semibold">Lock schedule</div>
                  <div className="text-xs text-muted-foreground">Prevent accidental edits</div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
