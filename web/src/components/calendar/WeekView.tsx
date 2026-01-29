"use client";

import React from "react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type CalEvent = {
  id: string;
  title: string;
  client: string;
  location: string;
  day: number;       // 0-6
  start: number;     // hour float (e.g. 9.5)
  duration: number;  // hours float
};

const PX_PER_HOUR = 56; // visual scale
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function DayDropZone({ day, children }: { day: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `day:${day}` });
  return (
    <div
      ref={setNodeRef}
      className={[
        "relative rounded-xl border bg-card/40 overflow-hidden",
        isOver ? "ring-2 ring-foreground/30" : ""
      ].join(" ")}
      style={{ height: PX_PER_HOUR * 24 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {HOURS.map((h) => (
          <div
            key={h}
            className="border-t border-border/60"
            style={{ position: "absolute", top: h * PX_PER_HOUR, left: 0, right: 0 }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

function DraggableEvent({
  ev,
  selected,
  onSelect,
}: {
  ev: CalEvent;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `ev:${ev.id}`,
    data: { id: ev.id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    top: ev.start * PX_PER_HOUR,
    height: Math.max(40, ev.duration * PX_PER_HOUR - 6),
  };

  return (
    <button
      ref={setNodeRef}
      onClick={onSelect}
      className={[
        "absolute left-2 right-2 rounded-xl border text-left p-3",
        "bg-background/90 backdrop-blur shadow-sm",
        selected ? "ring-2 ring-foreground/40" : "",
        isDragging ? "opacity-70 cursor-grabbing" : "cursor-grab",
        "hover:bg-accent/30 transition",
      ].join(" ")}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-sm truncate">{ev.title}</div>
        <div className="text-[11px] text-muted-foreground tabular-nums">{formatTime(ev.start)} • {formatTime(ev.start + ev.duration)}</div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground truncate">{ev.client} • {ev.location}</div>
    </button>
  );
}

function formatTime(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const H = String(hh).padStart(2, "0");
  const M = String(mm).padStart(2, "0");
  return `${H}:${M}`;
}

export default function WeekView() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [events, setEvents] = React.useState<CalEvent[]>([
    { id: "1", title: "Tower 2 Rope Access Repaint", client: "ACME Strata", location: "Southbank", day: 1, start: 10.5, duration: 3.0 },
    { id: "2", title: "Quote Walkthrough", client: "Vantage Body Corp", location: "Docklands", day: 3, start: 9.0, duration: 1.5 },
    { id: "3", title: "Site Touch-ups + Photos", client: "Lumina Strata", location: "CBD", day: 4, start: 14.0, duration: 2.0 },
  ]);

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(events[0]?.id ?? null);

  const activeEvent = events.find((e) => e.id === activeId) || null;
  const selectedEvent = events.find((e) => e.id === selectedId) || null;

  function onDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    if (id.startsWith("ev:")) {
      const evId = id.slice(3);
      setActiveId(evId);
      setSelectedId(evId);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const active = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;

    setActiveId(null);

    if (!active.startsWith("ev:")) return;
    const evId = active.slice(3);

    // Update day if dropped over a day zone
    let nextDay: number | null = null;
    if (over && over.startsWith("day:")) nextDay = Number(over.slice(4));

    // Update time based on drag delta Y (snap to 15 mins)
    const deltaY = e.delta?.y ?? 0;
    const deltaHours = deltaY / PX_PER_HOUR;
    const snap = 0.25; // 15 min
    const snapped = Math.round(deltaHours / snap) * snap;

    setEvents((prev) =>
      prev.map((x) => {
        if (x.id !== evId) return x;
        const newStart = clamp(Math.round((x.start + snapped) / snap) * snap, 0, 24 - x.duration);
        return {
          ...x,
          day: nextDay === null ? x.day : clamp(nextDay, 0, 6),
          start: newStart,
        };
      })
    );
  }

  function createMockBooking() {
    const id = String(Date.now());
    setEvents((prev) => [
      ...prev,
      {
        id,
        title: "New booking",
        client: "Client name",
        location: "Location",
        day: 0,
        start: 9,
        duration: 1,
      },
    ]);
    setSelectedId(id);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Drag events between days. Drag up/down to change time (snaps to 15 mins).</p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm" type="button">Today</button>
          <button className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm" type="button">Week</button>
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:opacity-95 text-sm" type="button" onClick={createMockBooking}>
            New booking
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* calendar grid */}
        <div className="lg:col-span-9 rounded-2xl border bg-card/40 p-4">
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-8 gap-2">
              <div className="text-xs text-muted-foreground px-2 py-2">Time</div>
              {DAYS.map((d) => (
                <div key={d} className="text-xs font-medium px-2 py-2">{d}</div>
              ))}

              <div className="relative">
                <div className="relative rounded-xl border bg-background/30 overflow-hidden" style={{ height: PX_PER_HOUR * 24 }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="absolute left-2 right-2 text-[10px] text-muted-foreground font-mono"
                      style={{ top: h * PX_PER_HOUR - 7 }}
                    >
                      {String(h).padStart(2, "0")}:00
                    </div>
                  ))}
                </div>
              </div>

              {Array.from({ length: 7 }, (_, day) => (
                <DayDropZone key={day} day={day}>
                  {events
                    .filter((x) => x.day === day)
                    .map((ev) => (
                      <DraggableEvent
                        key={ev.id}
                        ev={ev}
                        selected={ev.id === selectedId}
                        onSelect={() => setSelectedId(ev.id)}
                      />
                    ))}
                </DayDropZone>
              ))}
            </div>

            {/* Active preview (simple) */}
            {activeEvent ? (
              <div className="mt-3 text-xs text-muted-foreground">
                Moving: <span className="font-medium">{activeEvent.title}</span>
              </div>
            ) : null}
          </DndContext>
        </div>

        {/* inspector */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Inspector</div>
            {selectedEvent ? (
              <div className="mt-4 space-y-2 text-sm">
                <div className="font-semibold">{selectedEvent.title}</div>
                <div className="text-muted-foreground">{selectedEvent.client}</div>
                <div className="text-muted-foreground">{selectedEvent.location}</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Day</div>
                    <div className="font-medium">{DAYS[selectedEvent.day]}</div>
                  </div>
                  <div className="rounded-xl border bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="font-medium">{formatTime(selectedEvent.start)}–{formatTime(selectedEvent.start + selectedEvent.duration)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm" type="button">Open job</button>
                  <button className="flex-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:opacity-95 text-sm" type="button">Edit</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">Select an event.</div>
            )}
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Shortcuts</div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div>• Drag between days</div>
              <div>• Drag up/down to change time</div>
              <div>• Snaps to 15 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
