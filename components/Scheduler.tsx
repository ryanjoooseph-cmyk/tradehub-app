'use client';

import dynamic from "next/dynamic";
import { useState } from "react";
import type { DateSelectArg, EventDropArg, EventInput } from "@fullcalendar/core";
import { calendarEvents as seed } from "../lib/sampleData";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/core/index.css";
import "@fullcalendar/daygrid/index.css";
import "@fullcalendar/timegrid/index.css";

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>(seed as EventInput[]);

  function handleDateSelect(arg: DateSelectArg) {
    setEvents(prev => prev.concat({
      id: `new-${Date.now()}`,
      title: "New Job",
      start: arg.start,
      end: arg.end
    }));
  }

  function handleEventDrop(arg: EventDropArg) {
    setEvents(prev => prev.map(e => e.id === arg.event.id ? { ...e, start: arg.event.start, end: arg.event.end } : e));
  }

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        selectable
        editable
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        height="auto"
      />
    </div>
  );
}
