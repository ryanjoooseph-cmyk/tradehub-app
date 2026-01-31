"use client";

import React from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ColId = "backlog" | "scheduled" | "in_progress" | "done";

type Job = {
  id: string;
  title: string;
  client: string;
  site: string;
  value: number;
  col: ColId;
  due: string;
  priority: "Low" | "Med" | "High";
};

const cols: { id: ColId; label: string; hint: string }[] = [
  { id: "backlog", label: "Backlog", hint: "Unscheduled" },
  { id: "scheduled", label: "Scheduled", hint: "Locked in" },
  { id: "in_progress", label: "In Progress", hint: "On site" },
  { id: "done", label: "Done", hint: "Closed out" },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function DroppableCol({ id, children }: { id: ColId; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${id}` });
  return (
    <div
      ref={setNodeRef}
      className={[
        "rounded-2xl border bg-card/40 p-3 min-h-[520px]",
        isOver ? "ring-2 ring-foreground/30" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: `job:${job.id}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  const pr =
    job.priority === "High" ? "bg-red-500/15 text-red-500 border-red-500/20"
    : job.priority === "Med" ? "bg-amber-500/15 text-amber-500 border-amber-500/20"
    : "bg-emerald-500/15 text-emerald-500 border-emerald-500/20";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-2xl border bg-background/70 backdrop-blur p-4 shadow-sm",
        isDragging ? "opacity-70 cursor-grabbing" : "cursor-grab hover:bg-accent/25",
      ].join(" ")}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold tracking-tight text-sm leading-snug">{job.title}</div>
        <span className={["text-[11px] px-2 py-1 rounded-full border", pr].join(" ")}>{job.priority}</span>
      </div>

      <div className="mt-2 text-xs text-muted-foreground truncate">{job.client} • {job.site}</div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{money(job.value)}</div>
        <Badge variant="default" className="rounded-full text-[11px]">{job.due}</Badge>
      </div>

      <div className="mt-3">
        <Link href={`/app/jobs/${job.id}`} className="text-xs font-medium underline underline-offset-4 hover:opacity-80">
          Open job
        </Link>
      </div>
    </div>
  );
}

export default function Kanban() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [jobs, setJobs] = React.useState<Job[]>([
    { id: "1001", title: "Rope Access Repaint – Tower 2", client: "ACME Strata", site: "Southbank", value: 24500, col: "scheduled", due: "Fri", priority: "High" },
    { id: "1002", title: "Facade Touch-Ups + Photos", client: "Lumina Body Corp", site: "CBD", value: 4200, col: "in_progress", due: "Today", priority: "Med" },
    { id: "1003", title: "Balcony Rail Recoat", client: "Vantage Strata", site: "Docklands", value: 6800, col: "backlog", due: "Mon", priority: "Low" },
    { id: "1004", title: "Quote Walkthrough + Scope", client: "Harbour Mgmt", site: "Richmond", value: 1200, col: "done", due: "Wed", priority: "Low" },
    { id: "1005", title: "High-rise Spot Prime + Seal", client: "Zenith Body Corp", site: "St Kilda", value: 9800, col: "scheduled", due: "Tue", priority: "Med" },
  ]);

  function onDragEnd(e: DragEndEvent) {
    const a = String(e.active.id);
    const o = e.over?.id ? String(e.over.id) : null;
    if (!a.startsWith("job:")) return;
    if (!o || !o.startsWith("col:")) return;

    const jobId = a.slice(4);
    const colId = o.slice(4) as ColId;

    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, col: colId } : j)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Drag cards between columns. Click a job to open details.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button">New Job</Button>
          <Button variant="default" className="rounded-xl" type="button">Import</Button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.id} className="space-y-3">
              <div className="flex items-baseline justify-between px-1">
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.hint}</div>
              </div>

              <DroppableCol id={c.id}>
                <div className="space-y-3">
                  {jobs.filter((j) => j.col === c.id).map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              </DroppableCol>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
