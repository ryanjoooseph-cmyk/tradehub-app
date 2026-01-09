'use client'
import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type Ev = { id: string; title: string; start: string; end?: string; allDay?: boolean }
export default function Scheduler() {
  const [events, setEvents] = useState<Ev[]>([{ id: '1', title: 'Sample', start: new Date().toISOString() }])
  const onSelect = (sel: any) => {
    const title = prompt('Event title')
    sel.view.calendar.unselect()
    if (title) setEvents(p => [...p, { id: String(Date.now()), title, start: sel.startStr, end: sel.endStr, allDay: sel.allDay }])
  }
  const onMove = (arg: any) => {
    setEvents(p => p.map(e => e.id === arg.event.id ? { ...e, start: arg.event.startStr, end: arg.event.endStr } : e))
  }
  return (
    <div style={{ padding: 16 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        initialView="timeGridWeek"
        selectable
        editable
        events={events}
        select={onSelect}
        eventDrop={onMove}
        eventResize={onMove}
      />
    </div>
  )
}
