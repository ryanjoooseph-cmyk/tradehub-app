"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

type DateClickArgLike = {
  dateStr: string;
  allDay: boolean;
};

type EventLike = {
  id: string;
  title: string;
  startStr: string;
  endStr?: string;
  allDay: boolean;
};

type EventArgLike = {
  event: EventLike;
};

function uid(): string {
  return `${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

export default function DragDropCalendar() {
  const [events, setEvents] = useState<CalEvent[]>([
    { id: "1", title: "Strata repaint · Tower A", start: "2026-02-02T09:00:00" },
    { id: "2", title: "Rope access patch", start: "2026-02-03T07:00:00" },
    { id: "3", title: "Client walkthrough", start: "2026-02-05T15:00:00" },
  ]);

  function upsert(id: string, patch: Partial<CalEvent>) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function onDateClick(arg: DateClickArgLike) {
    const title = prompt("New job title");
    if (!title) return;
    const id = uid();
    setEvents((prev) => [...prev, { id, title, start: arg.dateStr, allDay: arg.allDay }]);
  }

  function onEventClick(arg: EventArgLike) {
    const next = prompt("Rename job", arg.event.title);
    if (next === null) return;
    const t = next.trim();
    if (!t) return;
    upsert(arg.event.id, { title: t });
  }

  function onEventDrop(arg: EventArgLike) {
    upsert(arg.event.id, {
      start: arg.event.startStr,
      end: arg.event.endStr || undefined,
      allDay: arg.event.allDay,
    });
  }

  function onEventResize(arg: EventArgLike) {
    upsert(arg.event.id, {
      start: arg.event.startStr,
      end: arg.event.endStr || undefined,
    });
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
