'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { calendarEvents } from '@/lib/sampleData';

const FullCalendar = dynamic(()=>import('@fullcalendar/react'), { ssr:false }) as any;

export default function Scheduler(){
  const [events, setEvents] = React.useState<any[]>(calendarEvents());

  function handleDateSelect(info:any){
    const title = prompt('New job title');
    if(title){
      setEvents(prev => prev.concat([{ id: String(Math.random()), title, start: info.startStr, end: info.endStr, allDay: info.allDay }]));
    }
  }

  function handleChange(change:any){
    const { event } = change;
    setEvents(prev => prev.map(e => (e.id === event.id) ? { ...e, start:event.start, end:event.end } : e));
  }

  return (
    <div className="card">
      <div className="hd">Jobs Calendar</div>
      <div className="bd">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
          height="auto"
          selectable
          editable
          selectMirror
          eventStartEditable
          eventDurationEditable
          select={handleDateSelect}
          events={events}
          eventDrop={handleChange}
          eventResize={handleChange}
        />
      </div>
    </div>
  );
}
