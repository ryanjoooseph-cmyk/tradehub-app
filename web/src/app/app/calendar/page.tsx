"use client";

import React from "react";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton } from "@/components/app/filled/page";
import { ChevronLeft, ChevronRight, GripVertical, List, Rows3, Sparkles } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  client: string;
  site: string;
  day: number; // 0..6
  startMin: number; // minutes from 0:00
  durMin: number;
  lane?: string;
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

export default function CalendarPage() {
  const startDayMin = 7 * 60;
  const endDayMin = 19 * 60;
  const stepMin = 30;

  const [view, setView] = React.useState<"week" | "day">("week");
  const [focusDay, setFocusDay] = React.useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const [events, setEvents] = React.useState<EventItem[]>([
    { id: "J-1402", title: "Strata repaint — Tower A", client: "Acme Body Corp", site: "Southbank", day: 3, startMin: 10 * 60, durMin: 180, lane: "Crew A" },
    { id: "J-1403", title: "High-rise touch-up", client: "Bayside Strata", site: "St Kilda", day: 0, startMin: 9 * 60, durMin: 240, lane: "Crew B" },
    { id: "J-1405", title: "QA inspection — Roof deck", client: "Riverside Mgmt", site: "Docklands", day: 4, startMin: 14 * 60, durMin: 120, lane: "QA" },
    { id: "J-1407", title: "Balcony sealing package", client: "Bayside Strata", site: "St Kilda", day: 2, startMin: 12 * 60 + 30, durMin: 150, lane: "Crew A" },
  ]);

  const gridDays = view === "week" ? days.map((_, i) => i) : [focusDay];

  const rows = Math.ceil((endDayMin - startDayMin) / stepMin);

  const pxPerStep = 22;
  const gridHeight = rows * pxPerStep;

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

  const slots = Array.from({ length: rows + 1 }, (_, i) => startDayMin + i * stepMin);

  const visibleEvents = events.filter((ev) => gridDays.includes(ev.day));

  return (
    <PageWrap>
      <PageHeader
        title="Calendar"
        subtitle="Drag jobs across time and days. This is the ops cockpit."
        right={
          <>
            <GhostButton onClick={() => setView((v) => (v === "week" ? "day" : "week"))}>
              {view === "week" ? <Rows3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {view === "week" ? "Day view" : "Week view"}
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
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-accent/40" type="button">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-accent/40" type="button">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">This week</div>
                <div className="mt-1 text-lg font-semibold">18 jobs</div>
                <div className="mt-1 text-xs text-muted-foreground">3 crews scheduled</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">Conflicts</div>
                <div className="mt-1 text-lg font-semibold">0</div>
                <div className="mt-1 text-xs text-muted-foreground">No overlaps detected</div>
              </div>
            </div>

            {view === "day" ? (
              <div className="mt-4">
                <div className="text-xs font-semibold text-muted-foreground">Focused day</div>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {days.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFocusDay(i)}
                      className={[
                        "rounded-xl border px-2 py-2 text-xs font-semibold",
                        i === focusDay ? "bg-accent text-accent-foreground" : "bg-background hover:bg-accent/40",
                      ].join(" ")}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between rounded-2xl border bg-muted/10 p-4">
              <div>
                <div className="text-sm font-semibold">Smart scheduling</div>
                <div className="text-xs text-muted-foreground">Auto suggest crew + time slots</div>
              </div>
              <Pill tone="good"><Sparkles className="mr-1 h-3 w-3" />On</Pill>
            </div>
          </Card>

          <Card title="Unassigned" subtitle="Drag into the calendar">
            <div className="space-y-2">
              {events
                .filter((e) => e.lane === "Unassigned")
                .map((e) => (
                  <div key={e.id} className="rounded-2xl border bg-muted/10 p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 opacity-60 mt-1" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{e.id} • {e.title}</div>
                        <div className="text-xs text-muted-foreground">{e.client} • {e.site}</div>
                      </div>
                    </div>
                  </div>
                ))}
              {events.filter((e) => e.lane === "Unassigned").length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-muted/5 p-6 text-center text-sm text-muted-foreground">
                  Nothing unassigned. Good.
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-card/50 p-3">
            <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] gap-2">
              <div className="rounded-xl border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">Time</div>
              {gridDays.map((i) => (
                <div key={i} className="rounded-xl border bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  {days[i]}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-[80px_repeat(7,minmax(0,1fr))] gap-2">
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
                      return (
                        <div
                          key={e.id}
                          draggable
                          onDragStart={(ev) => onDragStart(ev, e.id)}
                          className="absolute left-2 right-2 cursor-grab active:cursor-grabbing"
                          style={{ top, height: h }}
                        >
                          <div className="h-full rounded-2xl border border-foreground/15 bg-muted/20 p-3 shadow-sm hover:bg-muted/30">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold">{e.id}</div>
                              <Pill tone="neutral">{e.lane || "Crew"}</Pill>
                            </div>
                            <div className="mt-1 text-sm font-semibold leading-tight">{e.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{e.client} • {e.site}</div>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Conflict engine" subtitle="Seed UI for real logic">
              <div className="space-y-3">
                <div className="rounded-2xl border bg-muted/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Overlap detection</div>
                    <Pill tone="good">OK</Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">No crew overlaps found in current view.</div>
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
