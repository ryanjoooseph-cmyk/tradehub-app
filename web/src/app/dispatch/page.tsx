"use client";

import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { demoJobs, demoClients } from "@/lib/demo-data";
import type { Job } from "@/lib/domain";

type CalEvent = {
  id: string;
  title: string;
  start?: string;
  end?: string;
  extendedProps?: { jobId: string };
};

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

function clientName(clientId: string) {
  return demoClients.find((c) => c.id === clientId)?.name ?? "Unknown Client";
}

export default function DispatchPage() {
  const backlogRef = useRef<HTMLDivElement | null>(null);
  const [jobs, setJobs] = useState<Job[]>(demoJobs);

  const scheduledEvents: CalEvent[] = useMemo(() => {
    return jobs
      .filter((j) => j.start && j.end)
      .map((j) => ({
        id: j.id,
        title: `${j.title} • ${clientName(j.clientId)} • ${money(j.valueCents)}`,
        start: j.start,
        end: j.end,
        extendedProps: { jobId: j.id },
      }));
  }, [jobs]);

  const backlogJobs = useMemo(() => jobs.filter((j) => !j.start || !j.end), [jobs]);

  React.useEffect(() => {
    if (!backlogRef.current) return;
    const el = backlogRef.current;

    const draggable = new Draggable(el, {
      itemSelector: "[data-job-id]",
      eventData: (eventEl) => {
        const jobId = (eventEl as HTMLElement).dataset.jobId!;
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return { title: "Job" };
        return {
          id: job.id,
          title: `${job.title} • ${clientName(job.clientId)} • ${money(job.valueCents)}`,
          extendedProps: { jobId: job.id },
          duration: "02:00",
        };
      },
    });

    return () => draggable.destroy();
  }, [jobs]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dispatch Board</h1>
          <p className="text-sm text-muted-foreground">
            Drag a job from Backlog onto the calendar. Reschedule by dragging events.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border px-3 py-1">Backlog: {backlogJobs.length}</span>
          <span className="rounded-full border px-3 py-1">Scheduled: {scheduledEvents.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <div className="font-semibold">Backlog</div>
              <div className="text-xs text-muted-foreground">Drag → schedule. No more invisible jobs.</div>
            </div>
            <div ref={backlogRef} className="p-4 space-y-3">
              {backlogJobs.map((j) => (
                <div key={j.id} data-job-id={j.id} className="cursor-grab active:cursor-grabbing rounded-lg border bg-background p-3 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{j.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{clientName(j.clientId)} • {j.location ?? "—"}</div>
                    </div>
                    <div className="text-xs font-medium">{money(j.valueCents)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-muted px-2 py-0.5">{j.status}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5">{j.priority}</span>
                  </div>
                </div>
              ))}
              {backlogJobs.length === 0 && (
                <div className="text-sm text-muted-foreground">Backlog empty.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-xl border bg-card p-4">
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridDay,timeGridWeek,dayGridMonth,listWeek" }}
              height="auto"
              nowIndicator={true}
              editable={true}
              droppable={true}
              eventOverlap={false}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              businessHours={[
                { daysOfWeek: [1, 2, 3, 4, 5], startTime: "07:00", endTime: "18:00" },
                { daysOfWeek: [6], startTime: "08:00", endTime: "14:00" },
              ]}
              events={scheduledEvents}
              eventReceive={(info) => {
                const jobId = info.event.extendedProps?.jobId as string;
                const start = info.event.start?.toISOString();
                const end = info.event.end?.toISOString();
                setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, start, end, status: "Scheduled" } : j)));
              }}
              eventDrop={(info) => {
                const jobId = info.event.extendedProps?.jobId as string;
                const start = info.event.start?.toISOString();
                const end = info.event.end?.toISOString();
                setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, start, end } : j)));
              }}
              eventResize={(info) => {
                const jobId = info.event.extendedProps?.jobId as string;
                const start = info.event.start?.toISOString();
                const end = info.event.end?.toISOString();
                setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, start, end } : j)));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
