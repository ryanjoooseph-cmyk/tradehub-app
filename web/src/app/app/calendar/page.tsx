"use client";

import { Topbar } from "@/components/shell/topbar";
import { demoJobs } from "@/lib/demo-data";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function Page() {
  const events = demoJobs.map((j) => ({
    id: j.id,
    title: `${j.title} • ${j.client}`,
    start: j.start,
    end: j.end,
    extendedProps: { site: j.site, status: j.status },
  }));

  return (
    <>
      <Topbar title="Calendar" subtitle="Drag/drop scheduling (demo events from jobs)" />
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,dayGridMonth,listWeek",
            }}
            height="auto"
            editable={true}
            selectable={true}
            nowIndicator={true}
            eventOverlap={true}
            events={events}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: true }}
          />
        </div>
      </div>
    </>
  );
}
