'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import type { EventInput } from '@fullcalendar/core';

// FullCalendar styles (v6+ uses index.css)
import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/resource-timegrid/index.css';

import { calendarEvents, resources } from '@/lib/sampleData';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>(calendarEvents);

  // Enable dragging from the "Unscheduled Jobs" list into the calendar
  useEffect(() => {
    const el = document.getElementById('unscheduled');
    if (el) {
      new Draggable(el, {
        itemSelector: '.job-chip',
        eventData: function (chipEl) {
          try {
            return JSON.parse(chipEl.getAttribute('data-event') || '{}');
          } catch {
            return { title: chipEl.textContent || 'Job' };
          }
        },
      });
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 rounded border">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
            initialView="resourceTimeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,resourceTimeGridDay',
            }}
            resources={resources}
            events={events}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
            businessHours={{ daysOfWeek: [1,2,3,4,5], startTime: '07:00', endTime: '18:00' }}
            editable={true}
            droppable={true}
            eventReceive={(info) => {
              // add to local state; wiring to your API can come next
              setEvents((prev) => [...prev, info.event.toPlainObject() as EventInput]);
            }}
            eventDrop={(info) => {
              console.log('eventDrop', info.event.toPlainObject());
            }}
            eventResize={(info) => {
              console.log('eventResize', info.event.toPlainObject());
            }}
          />
        </div>

        <aside className="rounded border p-3">
          <h3 className="font-semibold mb-2">Unscheduled Jobs</h3>
          <p className="text-sm text-gray-500 mb-2">Drag onto the calendar to schedule.</p>
          <ul id="unscheduled" className="space-y-2">
            <li className="job-chip cursor-move px-2 py-1 rounded border" data-event='{"title":"Quote – Bathroom tiling","duration":"02:00"}'>
              Quote – Bathroom tiling
            </li>
            <li className="job-chip cursor-move px-2 py-1 rounded border" data-event='{"title":"Rough-in plumbing","duration":"03:00"}'>
              Rough-in plumbing
            </li>
            <li className="job-chip cursor-move px-2 py-1 rounded border" data-event='{"title":"Electrical fit‑off","duration":"04:00"}'>
              Electrical fit‑off
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
