"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";

const seed = [
  { id: "job-1", title: "Job: Strata repaint – Site A", start: new Date().toISOString().slice(0,10) + "T09:00:00" },
  { id: "job-2", title: "Job: Roof leak – Emergency", start: new Date().toISOString().slice(0,10) + "T13:00:00" },
];

export function OpsCalendar() {
  return (
    <Card className="p-3">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable
        selectable
        droppable
        nowIndicator
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={seed}
      />
    </Card>
  );
}
