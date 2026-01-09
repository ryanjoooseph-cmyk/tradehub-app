'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

type CalEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

export default function Scheduler() {
  const [events, setEvents] = useState<CalEvent[]>([
    { id: '1', title: 'New Job', start: new Date().toISOString() }
  ]);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        droppable={true}
        events={events}
        dateClick={(info) => {
          const id = String(Date.now());
          setEvents((prev) => [
            ...prev,
            { id, title: 'New Job', start: info.date.toISOString(), allDay: info.allDay }
          ]);
        }}
        eventDrop={(info) => {
          const e = info.event;
          setEvents((prev) =>
            prev.map((x) =>
              x.id === e.id
                ? {
                    ...x,
                    start: e.start ? e.start.toISOString() : '',
                    end: e.end ? e.end.toISOString() : undefined,
                    allDay: e.allDay
                  }
                : x
            )
          );
        }}
        eventResize={(info) => {
          const e = info.event;
          setEvents((prev) =>
            prev.map((x) =>
              x.id === e.id
                ? {
                    ...x,
                    start: e.start ? e.start.toISOString() : '',
                    end: e.end ? e.end.toISOString() : undefined
                  }
                : x
            )
          );
        }}
        height="auto"
      />
    </div>
  );
}
