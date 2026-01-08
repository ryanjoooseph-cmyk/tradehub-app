"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { calendarEvents as seed } from "../lib/sampleData";
import type { EventInput } from "@fullcalendar/core";
import type { DateSelectArg, EventDropArg } from "@fullcalendar/core";

export default function Scheduler() {
  const [events, setEvents] = useState<EventInput[]>(seed);

  function handleDateSelect(arg: DateSelectArg) {
    const title = window.prompt("Job title?");
    if (title) {
      setEvents((prev) =>
        prev.concat({
          id: `job-${Date.now()}`,
          title,
          start: arg.startStr,
          end: arg.endStr ?? undefined,
          allDay: arg.allDay,
        })
      );
    }
  }

  function handleEventDrop(info: EventDropArg) {
    const { event } = info;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, start: event.start ?? undefined, end: event.end ?? undefined }
          : e
      )
    );
  }

  return (
    <div className="border rounded-md bg-white p-4 dark:bg-neutral-900">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        weekends
        editable
        selectable
        selectMirror
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
      />
    </div>
  );
}
