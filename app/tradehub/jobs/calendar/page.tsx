"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalEvent = {
  id?: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
};

export default function Page() {
  const [events, setEvents] = useState<CalEvent[]>([
    { id: "1", title: "Job A", start: new Date().toISOString() }
  ]);

  return (
    <div style={{ padding: 16 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        editable
        droppable
        selectable
        events={events}
        eventDrop={(info) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === info.event.id
                ? { ...e, start: info.event.start!, end: info.event.end ?? undefined, allDay: info.event.allDay }
                : e
            )
          );
        }}
        eventResize={(info) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === info.event.id
                ? { ...e, start: info.event.start!, end: info.event.end ?? undefined }
                : e
            )
          );
        }}
        dateClick={(info) => {
          const id = Math.random().toString(36).slice(2);
          setEvents((prev) => prev.concat([{ id, title: "New Job", start: info.date }]));
        }}
      />
    </div>
  );
}
