"use client";

import { useMemo, useState } from "react";
import { demoJobs } from "@/lib/demo-data";
import type { Job } from "@/lib/demo-data";
import { DragDropWeek } from "@/components/calendar/drag-drop-week";

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>(demoJobs);

  const sorted = useMemo(
    () => jobs.slice().sort((a, b) => a.start.localeCompare(b.start)),
    [jobs]
  );

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

  return (
    <div className="space-y-5">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Calendar</div>
        <div className="mt-1 text-sm text-neutral-600">
          Drag jobs between days. This is demo-state now; next we persist to Supabase.
        </div>
      </div>

      <DragDropWeek jobs={sorted} onUpdateJobDates={updateJobDate} />
    </div>
  );
}
