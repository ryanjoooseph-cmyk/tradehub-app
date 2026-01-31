"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg, EventClickArg, EventDropArg, EventResizeDoneArg } from "@fullcalendar/interaction";

type CalEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

function iso(d: Date) {
  return d.toISOString();
}

export default function DragDropCalendar() {
  const seed = useMemo<CalEvent[]>(
    () => [
      { id: "1", title: "Strata repaint · Tower A", start: iso(new Date(Date.now() + 86400000 * 1 + 3600000 * 9)) },
      { id: "2", title: "Rope access patch", start: iso(new Date(Date.now() + 86400000 * 2 + 3600000 * 7)) },
      { id: "3", title: "Client walkthrough", start: iso(new Date(Date.now() + 86400000 * 4 + 3600000 * 15)) },
    ],
    []
  );

  const [events, setEvents] = useState<CalEvent[]>(seed);

  function upsert(id: string, patch: Partial<CalEvent>) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function onDateClick(arg: DateClickArg) {
    const title = prompt("New job title");
    if (!title) return;
    const id = crypto.randomUUID();
    setEvents((prev) => [...prev, { id, title, start: arg.dateStr, allDay: arg.allDay }]);
  }

  function onEventClick(arg: EventClickArg) {
    const id = arg.event.id;
    const next = prompt("Rename job", arg.event.title);
    if (next === null) return;
    if (next.trim() === "") return;
    upsert(id, { title: next.trim() });
  }

  function onEventDrop(arg: EventDropArg) {
    const id = arg.event.id;
    upsert(id, { start: arg.event.startStr, end: arg.event.endStr || undefined, allDay: arg.event.allDay });
  }

  function onEventResize(arg: EventResizeDoneArg) {
    const id = arg.event.id;
    upsert(id, { start: arg.event.startStr, end: arg.event.endStr || undefined });
  }

  return (
    <div className="rounded-2xl border bg-background/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Scheduler</div>
          <div className="text-xs text-muted-foreground">Drag jobs to reschedule. Click empty space to add.</div>
        </div>
        <div className="text-xs text-muted-foreground">Drag · Drop · Resize</div>
      </div>

      <div className="rounded-xl border bg-background p-2">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay,dayGridMonth",
          }}
          height="75vh"
          nowIndicator
          editable
          selectable
          selectMirror
          dayMaxEvents
          weekends
          events={events}
          dateClick={onDateClick}
          eventClick={onEventClick}
          eventDrop={onEventDrop}
          eventResize={onEventResize}
        />
      </div>
    </div>
  );
}
