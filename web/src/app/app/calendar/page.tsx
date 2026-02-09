"use client";

import React from "react";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, cx } from "@/components/app/filled/page";
import { ChevronLeft, ChevronRight, GripVertical, Calendar as CalendarIcon, Sparkles, Clock, MapPin, Users, AlertTriangle } from "lucide-react";

type EventStatus = "scheduled" | "in-progress" | "completed";
type EventPriority = "normal" | "high" | "urgent";

type EventItem = {
  id: string;
  title: string;
  client: string;
  site: string;
  day: number; // 0..6
  startMin: number; // minutes from 0:00
  durMin: number;
  crew: string[];
  status: EventStatus;
  priority: EventPriority;
};

type BacklogItem = {
  id: string;
  title: string;
  crew: string[] | null;
  site: string;
  priority: EventPriority;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function minutesToShort(min: number) {
  const h = Math.floor(min / 60);
  const suffix = h >= 12 ? "p" : "a";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}${suffix}`;
}

// Enhanced seeded scheduled jobs with status and priority
const initialEvents: EventItem[] = [
  { id: 'J-1402', title: 'Tower A repaint', client: 'Acme Body Corp', site: 'Southbank', day: 3, startMin: 8 * 60, durMin: 480, crew: ['Ryan J', 'Crew A'], status: 'in-progress', priority: 'high' },
  { id: 'J-1403', title: 'High-rise touch-up', client: 'Carlton Strata', site: 'CBD', day: 0, startMin: 9 * 60, durMin: 360, crew: ['Crew B'], status: 'scheduled', priority: 'normal' },
  { id: 'J-1404', title: 'Balcony sealing', client: 'Bayside Strata', site: 'St Kilda', day: 1, startMin: 10 * 60, durMin: 240, crew: ['Crew A'], status: 'completed', priority: 'normal' },
  { id: 'J-1406', title: 'Heritage restoration', client: 'South Yarra Owners', site: 'South Yarra', day: 2, startMin: 8 * 60, durMin: 420, crew: ['Ryan J', 'Crew C'], status: 'scheduled', priority: 'urgent' },
  { id: 'J-1408', title: 'Roof deck repair', client: 'Docklands Mgmt', site: 'Docklands', day: 4, startMin: 14 * 60, durMin: 180, crew: ['QA', 'Crew B'], status: 'scheduled', priority: 'normal' },
  { id: 'J-1409', title: 'Façade inspection', client: 'Melbourne Property', site: 'Richmond', day: 5, startMin: 9 * 60, durMin: 240, crew: ['Ryan J'], status: 'scheduled', priority: 'high' },
  { id: 'J-1411', title: 'Strata QA check', client: 'Brunswick Estates', site: 'Brunswick', day: 6, startMin: 11 * 60, durMin: 180, crew: ['QA'], status: 'completed', priority: 'normal' },
];

// Seeded backlog (unscheduled)
const initialBacklog: BacklogItem[] = [
  { id: 'J-1405', title: 'QA inspection', crew: null, site: 'Docklands', priority: 'normal' },
  { id: 'J-1410', title: 'Paint touch-up', crew: null, site: 'Preston', priority: 'high' },
  { id: 'J-1412', title: 'Window sealing', crew: null, site: 'Footscray', priority: 'urgent' },
];

// Event card colors based on status and priority
function getEventStyles(status: EventStatus, priority: EventPriority, isConflict: boolean) {
  if (isConflict) {
    return "border-red-500/50 bg-red-50 dark:bg-red-950/40 ring-1 ring-red-500/20";
  }

  if (priority === 'urgent') {
    return "border-rose-400/50 bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-400/20";
  }

  if (priority === 'high') {
    return "border-amber-400/50 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-400/20";
  }

  switch (status) {
    case 'in-progress':
      return "border-blue-400/50 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-400/20";
    case 'completed':
      return "border-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-400/20";
    default:
      return "border-border/50 bg-card dark:bg-card/80 ring-1 ring-border/20";
  }
}

function getPriorityIndicator(priority: EventPriority) {
  if (priority === 'urgent') {
    return <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />;
  }
  if (priority === 'high') {
    return <span className="flex h-2 w-2 rounded-full bg-amber-500" />;
  }
  return null;
}

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
  const pxPerStep = 28; // Increased for better readability
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
  const inProgressCount = events.filter(e => e.status === 'in-progress').length;
  const highPriorityCount = events.filter(e => e.priority === 'high' || e.priority === 'urgent').length;

  return (
    <PageWrap>
      <PageHeader
        title="Calendar"
        subtitle="Drag-and-drop scheduling • Real-time conflict detection"
        right={
          <div className="flex items-center gap-2">
            <GhostButton onClick={goToToday}>
              <CalendarIcon className="h-4 w-4" />
              Today
            </GhostButton>
            <PrimaryButton>New booking</PrimaryButton>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* Week Controls */}
          <div className="rounded-2xl border bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Week Controls</div>
                <div className="text-xs text-muted-foreground">Navigate & filter</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                  type="button"
                  title="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                  type="button"
                  title="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* View Toggles */}
              <div className="flex gap-1 rounded-lg bg-muted/30 p-1">
                {(['day', 'week', 'month'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cx(
                      "flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all",
                      view === v
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/20 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">Jobs</div>
                  <div className="mt-1 text-xl font-bold">{events.length}</div>
                </div>
                <div className="rounded-xl bg-muted/20 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">In Progress</div>
                  <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</div>
                </div>
                <div className="rounded-xl bg-muted/20 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">High Priority</div>
                  <div className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{highPriorityCount}</div>
                </div>
                <div className={cx("rounded-xl p-3", conflictCount > 0 ? "bg-red-500/10" : "bg-muted/20")}>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">Conflicts</div>
                  <div className={cx("mt-1 text-xl font-bold", conflictCount > 0 ? "text-red-600 dark:text-red-400" : "")}>
                    {conflictCount}
                  </div>
                </div>
              </div>

              {/* Day Selector (Day View) */}
              {view === "day" && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground/70">Select Day</div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFocusDay(i)}
                        className={cx(
                          "rounded-lg py-2 text-xs font-semibold transition-all",
                          i === focusDay
                            ? "bg-foreground text-background"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Scheduling */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-3 ring-1 ring-violet-500/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">AI Scheduling</div>
                    <div className="text-[11px] text-muted-foreground">Auto-optimize slots</div>
                  </div>
                </div>
                <Pill tone="good">Active</Pill>
              </div>
            </div>
          </div>

          {/* Backlog */}
          <div className="rounded-2xl border bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Backlog</div>
                <div className="text-xs text-muted-foreground">{backlog.length} unscheduled</div>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {backlog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
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
                  className={cx(
                    "group flex items-start gap-3 rounded-xl border p-3 transition-all cursor-grab active:cursor-grabbing",
                    "bg-background hover:bg-muted/30 hover:border-border",
                    item.priority === 'urgent' && "border-rose-400/30 bg-rose-50/50 dark:bg-rose-950/20",
                    item.priority === 'high' && "border-amber-400/30 bg-amber-50/50 dark:bg-amber-950/20"
                  )}
                >
                  <div className="mt-0.5 text-muted-foreground/40 group-hover:text-muted-foreground/60">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIndicator(item.priority)}
                      <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                    </div>
                    <div className="mt-1 text-sm font-medium leading-tight">{item.title}</div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {item.site}
                    </div>
                  </div>
                </div>
              ))}

              {backlog.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No unscheduled jobs
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          {view === 'month' ? (
            <div className="rounded-2xl border bg-card/50 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="mt-4 text-lg font-semibold">Month View</div>
                <div className="mt-2 text-sm text-muted-foreground">Coming in the next release</div>
                <button
                  onClick={() => setView('week')}
                  className="mt-4 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  Use Week View
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card/50 overflow-hidden">
              {/* Header */}
              <div className={cx(
                "grid border-b bg-muted/20",
                view === 'day' ? 'grid-cols-[72px_1fr]' : 'grid-cols-[72px_repeat(7,minmax(0,1fr))]'
              )}>
                <div className="flex items-center justify-center border-r py-3">
                  <Clock className="h-4 w-4 text-muted-foreground/50" />
                </div>
                {gridDays.map((i) => {
                  const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  return (
                    <div
                      key={i}
                      className={cx(
                        "flex flex-col items-center justify-center border-r py-3 last:border-r-0",
                        isToday && "bg-foreground/5"
                      )}
                    >
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
                        {view === 'day' ? fullDays[i] : days[i]}
                      </div>
                      {isToday && (
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                          {new Date().getDate()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid */}
              <div className={cx(
                "grid",
                view === 'day' ? 'grid-cols-[72px_1fr]' : 'grid-cols-[72px_repeat(7,minmax(0,1fr))]'
              )}>
                {/* Time Column */}
                <div className="relative border-r" style={{ height: gridHeight }}>
                  {slots.slice(0, -1).map((m) => (
                    <div
                      key={m}
                      className="flex h-[28px] items-start justify-end pr-3 pt-0"
                    >
                      {m % 60 === 0 && (
                        <span className="text-[11px] font-medium text-muted-foreground/60 -translate-y-2">
                          {minutesToShort(m)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {gridDays.map((d) => {
                  const isToday = d === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  return (
                    <div
                      key={d}
                      className={cx(
                        "relative border-r last:border-r-0",
                        isToday && "bg-foreground/[0.02]"
                      )}
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
                      {/* Grid Lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        {slots.slice(0, -1).map((m) => (
                          <div
                            key={m}
                            className={cx(
                              "h-[28px] border-b",
                              m % 60 === 0 ? "border-border/30" : "border-border/10"
                            )}
                          />
                        ))}
                      </div>

                      {/* Events */}
                      {visibleEvents
                        .filter((e) => e.day === d)
                        .map((e) => {
                          const top = ((e.startMin - startDayMin) / stepMin) * pxPerStep + 2;
                          const h = Math.max(48, (e.durMin / stepMin) * pxPerStep - 4);
                          const isConflict = hasConflict(e);
                          const eventStyles = getEventStyles(e.status, e.priority, isConflict);

                          return (
                            <div
                              key={e.id}
                              draggable
                              onDragStart={(ev) => onDragStart(ev, e.id)}
                              className="absolute left-1 right-1 cursor-grab active:cursor-grabbing"
                              style={{ top, height: h }}
                            >
                              <div className={cx(
                                "group h-full rounded-lg border p-2 transition-all hover:shadow-md overflow-hidden",
                                eventStyles
                              )}>
                                {/* Header Row */}
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {getPriorityIndicator(e.priority)}
                                    <span className="text-[10px] font-mono font-semibold truncate">{e.id}</span>
                                  </div>
                                  {isConflict && (
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                                  )}
                                </div>

                                {/* Title */}
                                <div className="mt-1 text-xs font-semibold leading-tight line-clamp-2">
                                  {e.title}
                                </div>

                                {/* Details (only show if enough space) */}
                                {h >= 80 && (
                                  <>
                                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <MapPin className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{e.site}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Clock className="h-3 w-3 shrink-0" />
                                      <span>{minutesToShort(e.startMin)} - {minutesToShort(e.startMin + e.durMin)}</span>
                                    </div>
                                  </>
                                )}

                                {/* Crew Pills */}
                                {h >= 100 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {e.crew.slice(0, 2).map((c, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] font-medium">
                                        <Users className="h-2.5 w-2.5" />
                                        {c}
                                      </span>
                                    ))}
                                    {e.crew.length > 2 && (
                                      <span className="inline-flex items-center rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] font-medium">
                                        +{e.crew.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {/* Drop Zone Indicator */}
                      <div className="absolute inset-x-1 bottom-1 rounded-md border border-dashed border-border/30 bg-muted/5 py-1.5 text-center text-[10px] text-muted-foreground/50">
                        Drop here
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Conflict Engine" subtitle="Real-time overlap detection">
              <div className="space-y-3">
                <div className={cx(
                  "flex items-center justify-between rounded-xl p-3",
                  conflictCount > 0 ? "bg-red-500/10 ring-1 ring-red-500/20" : "bg-muted/20"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cx(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      conflictCount > 0 ? "bg-red-500/20" : "bg-emerald-500/20"
                    )}>
                      <AlertTriangle className={cx(
                        "h-4 w-4",
                        conflictCount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                      )} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Crew Overlaps</div>
                      <div className="text-xs text-muted-foreground">
                        {conflictCount > 0 ? `${conflictCount} conflict${conflictCount > 1 ? 's' : ''} detected` : 'All clear'}
                      </div>
                    </div>
                  </div>
                  <Pill tone={conflictCount > 0 ? 'bad' : 'good'}>
                    {conflictCount > 0 ? 'Review' : 'OK'}
                  </Pill>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" subtitle="Scheduling shortcuts" right={<GhostButton>Configure</GhostButton>}>
              <div className="space-y-2">
                {[
                  { title: 'Auto-fill week', desc: 'AI-optimized slot suggestions' },
                  { title: 'Export schedule', desc: 'PDF for crews & clients' },
                  { title: 'Lock schedule', desc: 'Prevent accidental edits' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex w-full items-center justify-between rounded-xl border bg-background px-3 py-2.5 text-left transition-all hover:bg-muted/30"
                  >
                    <div>
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-[11px] text-muted-foreground">{action.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
