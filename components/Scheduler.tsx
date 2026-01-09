'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';

import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { calendarEvents as seed } from '@/lib/sampleData';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function Scheduler() {
  const [events] = useState<EventInput[]>(seed as EventInput[]);
  return (
    <div style={{ padding: 16 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        selectable
        editable
        droppable
        nowIndicator
        height="auto"
        events={events}
      />
    </div>
  );
}
