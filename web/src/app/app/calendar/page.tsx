"use client";

import { useMemo, useState } from "react";
import { demoJobs } from "@/lib/demo-data";
import type { Job } from "@/lib/demo-data";
import { DragDropWeek } from "@/components/calendar/drag-drop-week";
import { JobDrawer } from "@/components/jobs/job-drawer";

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>(demoJobs);
  const [selected, setSelected] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => jobs.slice().sort((a, b) => a.start.localeCompare(b.start)), [jobs]);

  function updateJobDate(jobId: string, dateISO: string) {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const start = new Date(j.start);
        const end = new Date(j.end);
        const startTime = start.toISOString().slice(11, 19);
        const endTime = end.toISOString().slice(11, 19);
        const newStart = new Date(`${dateISO}T${startTime}Z`).toISOString();
        const newEnd = new Date(`${dateISO}T${endTime}Z`).toISOString();
        return { ...j, start: newStart, end: newEnd, status: "Scheduled" };
      })
    );
  }

  function openJobById(jobId: string) {
    const j = jobs.find((x) => x.id === jobId) || null;
    setSelected(j);
    setOpen(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Calendar</div>
        <div className="mt-1 text-sm text-neutral-600">Drag jobs between days. Click a job to open details.</div>
      </div>

      <DragDropWeek jobs={sorted} onUpdateJobDates={updateJobDate} onOpenJob={openJobById} />

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="text-sm font-semibold">Quick open</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sorted.slice(0, 10).map((j) => (
            <button
              key={j.id}
              type="button"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              onClick={() => openJobById(j.id)}
            >
              {j.title}
            </button>
          ))}
        </div>
      </div>

      <JobDrawer job={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
