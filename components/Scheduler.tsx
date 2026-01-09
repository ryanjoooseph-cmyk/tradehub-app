'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

type EventInput = { id?: string; title: string; start: string; end?: string; allDay?: boolean };

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>([
    { title: 'Job', start: new Date().toISOString().slice(0, 10) }
  ]);

  return (
    <div style={{ padding: 16 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        selectable
        editable
        droppable
        events={events}
        select={(info) => {
          setEvents((prev) => [...prev, { title: 'New', start: info.startStr, end: info.endStr, allDay: info.allDay }]);
        }}
        eventDrop={(info) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.title === info.event.title ? { ...e, start: info.event.startStr, end: info.event.endStr } : e
            )
          );
        }}
        eventResize={(info) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.title === info.event.title ? { ...e, start: info.event.startStr, end: info.event.endStr } : e
            )
          );
        }}
        height="auto"
      />
    </div>
  );
}
