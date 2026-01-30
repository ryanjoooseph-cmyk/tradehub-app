"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { addDays, format, startOfWeek, isSameDay, parseISO } from "date-fns";
import clsx from "clsx";
import type { Job } from "@/lib/demo-data";

function DraggableJob({
  job,
  onOpen,
}: {
  job: Job;
  onOpen?: (jobId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: { jobId: job.id },
  });

  const style = transform
    ? { transform: `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)` }
    : undefined;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (isDragging) return;
        onOpen?.(job.id);
      }}
      className={clsx(
        "w-full text-left cursor-grab active:cursor-grabbing rounded-xl border px-3 py-2 text-sm shadow-sm",
        isDragging ? "border-neutral-400 bg-white" : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium truncate">{job.title}</div>
        <div className="text-[11px] rounded-full border border-neutral-200 px-2 py-0.5 text-neutral-600 shrink-0">
          {job.status}
        </div>
      </div>
      <div className="mt-1 text-xs text-neutral-600 truncate">{job.client}</div>
      <div className="mt-1 text-xs text-neutral-500 truncate">{job.site}</div>
    </button>
  );
}

function DayColumn({
  day,
  jobs,
  onOpenJob,
}: {
  day: Date;
  jobs: Job[];
  onOpenJob?: (jobId: string) => void;
}) {
  const id = `day:${day.toISOString().slice(0, 10)}`;
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { date: day.toISOString().slice(0, 10) },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "min-h-[520px] rounded-2xl border p-3 transition",
        isOver ? "border-neutral-400 bg-neutral-50" : "border-neutral-200 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{format(day, "EEE")}</div>
        <div className="text-xs text-neutral-500">{format(day, "d MMM")}</div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 px-3 py-4 text-xs text-neutral-500">
            Drop a job here
          </div>
        ) : (
          jobs.map((j) => <DraggableJob key={j.id} job={j} onOpen={onOpenJob} />)
        )}
      </div>
    </div>
  );
}

export function DragDropWeek({
  jobs,
  onUpdateJobDates,
  onOpenJob,
}: {
  jobs: Job[];
  onUpdateJobDates: (jobId: string, dateISO: string) => void;
  onOpenJob?: (jobId: string) => void;
}) {
  const [anchor] = useState(() => new Date());
  const weekStart = useMemo(() => startOfWeek(anchor, { weekStartsOn: 1 }), [anchor]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const jobsByDay = useMemo(() => {
    const map = new Map<string, Job[]>();
    for (const d of days) map.set(d.toISOString().slice(0, 10), []);
    for (const j of jobs) {
      const dt = parseISO(j.start);
      const key = dt.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(j);
    }
    for (const [k, arr] of map) {
      arr.sort((a, b) => a.start.localeCompare(b.start));
      map.set(k, arr);
    }
    return map;
  }, [days, jobs]);

  function onDragEnd(e: DragEndEvent) {
    const activeId = String(e.active?.id || "");
    const overId = String(e.over?.id || "");
    if (!activeId || !overId) return;
    if (!overId.startsWith("day:")) return;

    const dateISO = overId.replace("day:", "");
    const job = jobs.find((x) => x.id === activeId);
    if (!job) return;

    const current = parseISO(job.start);
    const target = new Date(dateISO + "T" + format(current, "HH:mm:ss") + "Z");
    const currentDay = parseISO(job.start);

    if (isSameDay(currentDay, target)) return;
    onUpdateJobDates(activeId, dateISO);
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          return <DayColumn key={key} day={d} jobs={jobsByDay.get(key) || []} onOpenJob={onOpenJob} />;
        })}
      </div>
    </DndContext>
  );
}
