'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type EventInput = {
  id?: string
  title: string
  start: string
  end?: string
  allDay?: boolean
}

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>([
    { id: 'seed-1', title: 'Example event', start: new Date().toISOString() }
  ])

  return (
    <div className="p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView="dayGridMonth"
        editable
        selectable
        events={events}
        dateClick={(info) => {
          const id = crypto.randomUUID()
          setEvents(prev => [...prev, { id, title: 'New event', start: info.dateStr, allDay: true }])
        }}
      />
    </div>
  )
}
