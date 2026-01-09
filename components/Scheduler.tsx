'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>([]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
      selectable
      selectMirror
      editable
      eventStartEditable
      eventDurationEditable
      events={events}
      select={(info) => {
        setEvents((prev) => [
          ...prev,
          { id: String(Date.now()), title: 'New Job', start: info.startStr, end: info.endStr },
        ]);
      }}
      eventDrop={(info) => {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === info.event.id ? { ...e, start: info.event.startStr, end: info.event.endStr } : e
          )
        );
      }}
      eventResize={(info) => {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === info.event.id ? { ...e, start: info.event.startStr, end: info.event.endStr } : e
          )
        );
      }}
      height="auto"
    />
  );
}
