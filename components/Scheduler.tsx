'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>([
    { id: 'seed', title: 'Example job', start: new Date().toISOString() }
  ]);

  function onSelect(s: DateSelectArg) {
    const id = String(Date.now());
    setEvents(prev => prev.concat({ id, title: 'New job', start: s.start, end: s.end, allDay: s.allDay }));
  }

  function onMove(info: any) {
    const e = info.event;
    setEvents(prev =>
      prev.map(ev => (ev.id === e.id ? { ...ev, start: e.start!, end: e.end ?? undefined } : ev))
    );
  }

  function onClick(c: EventClickArg) {
    setEvents(prev => prev.filter(ev => ev.id !== c.event.id));
  }

  return (
    <div className="bg-[var(--card)] rounded-lg p-2">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        initialView="timeGridWeek"
        editable
        selectable
        selectMirror
        dayMaxEvents
        events={events}
        select={onSelect}
        eventDrop={onMove}
        eventResize={onMove}
        eventClick={onClick}
        height="auto"
      />
    </div>
  );
}
