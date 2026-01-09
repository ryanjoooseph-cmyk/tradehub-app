'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>([
    { id: '1', title: 'Job', start: new Date().toISOString() }
  ])

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        editable={true}
        selectable={true}
        events={events}
        dateClick={(info) => {
          const id = String(Date.now())
          setEvents((prev) => [...prev, { id, title: 'New', start: info.dateStr }])
        }}
        eventDrop={(info) => {
          setEvents((prev) =>
            prev.map(e =>
              e.id === info.event.id ? { ...e, start: info.event.startStr, end: info.event.endStr ?? undefined } : e
            )
          )
        }}
        eventResize={(info) => {
          setEvents((prev) =>
            prev.map(e =>
              e.id === info.event.id ? { ...e, start: info.event.startStr, end: info.event.endStr ?? undefined } : e
            )
          )
        }}
      />
    </div>
  )
}
