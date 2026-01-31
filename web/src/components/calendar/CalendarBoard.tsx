"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
type Job = {
  id: string;
  title?: string | null;
  address?: string | null;
  start_at?: string | null;
  end_at?: string | null;
};

type CalEvent = {
  id: string;
  title: string;
  start?: string;
  end?: string;
  allDay?: boolean;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}



async function persistSchedule(id: string, start?: string, end?: string) {
  try {
    const r = await fetch("/api/jobs", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id,
        start_at: start ?? null,
        end_at: end ?? null,
      }),
    });
    if (!r.ok) {
      // best effort: don't crash UI
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
export default function CalendarBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const externalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch jobs (best effort; stays UI-first)
    void (async () => {
      try {
        const res = await fetch("/api/jobs", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { jobs?: Job[] } | Job[];
        const list = Array.isArray(data) ? data : data.jobs ?? [];
        setJobs(list);

        // seed events from scheduled jobs if present
        const seeded: CalEvent[] = list
          .filter((j) => j.start_at)
          .map((j) => ({
            id: j.id,
            title: j.title?.trim() || "Job",
            start: j.start_at || undefined,
            end: j.end_at || undefined,
          }));
        setEvents(seeded);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!externalRef.current) return;

    // Make external job chips draggable into the calendar
    const d = new Draggable(externalRef.current, {
      itemSelector: "[data-job]",
      eventData: (el) => {
        const id = el.getAttribute("data-id") || crypto.randomUUID();
        const title = el.getAttribute("data-title") || "Job";
        return { id, title };
      },
    });

    return () => d.destroy();
  }, []);

  const unscheduled = useMemo(
    () => jobs.filter((j) => !j.start_at).slice(0, 50),
    [jobs]
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
      {/* Left panel */}
      <section className="rounded-xl border bg-background p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold">Drag Jobs into Calendar</div>
          <div className="text-xs text-muted-foreground">
            Drag a job chip onto a date/time. Resize and move events freely.
          </div>
        </div>

        <div
          ref={externalRef}
          className="max-h-[70dvh] overflow-auto rounded-lg border bg-background p-2"
        >
          {unscheduled.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No unscheduled jobs found.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {unscheduled.map((j) => {
                const title = (j.title?.trim() || "Job").slice(0, 60);
                const sub = j.address?.trim();
                return (
                  <div
                    key={j.id}
                    data-job="1"
                    data-id={j.id}
                    data-title={title}
                    className={cx(
                      "cursor-grab select-none rounded-lg border bg-accent/30 p-3",
                      "hover:bg-accent/40 active:cursor-grabbing"
                    )}
                  >
                    <div className="text-sm font-semibold">{title}</div>
                    {sub ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {sub}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-3 rounded-lg border bg-gradient-to-br from-accent/30 to-transparent p-3">
          <div className="text-xs text-muted-foreground">Pro tip</div>
          <div className="text-sm">
            Use <span className="font-semibold">Week</span> view for time-slot planning.
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="rounded-xl border bg-background p-4">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">Operations Calendar</div>
            <div className="text-xs text-muted-foreground">
              Drag/drop enabled • Resize enabled • Week/Month/List views
            </div>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,dayGridMonth,listWeek",
          }}
          height="auto"
          nowIndicator
          editable
          droppable
          selectable
          eventResizableFromStart
          events={events}
          drop={(info) => {
            const id =
              info.draggedEl.getAttribute("data-id") || crypto.randomUUID();
            const title = info.draggedEl.getAttribute("data-title") || "Job";
            const start = info.dateStr;

            setEvents((prev) => [
              ...prev.filter((e) => e.id !== id),
              { id, title, start },
            ]);

            void persistSchedule(id, new Date(start).toISOString(), undefined);
          }}
          eventDrop={(info) => {
            const id = String(info.event.id);
            setEvents((prev) =>
              prev.map((e) =>
                e.id === id
                  ? {
                      ...e,
                      start: info.event.start?.toISOString(),
                      end: info.event.end?.toISOString(),
                    }
                  : e
              )
            );
          }}
          eventResize={(info) => {
            const id = String(info.event.id);
            setEvents((prev) =>
              prev.map((e) =>
                e.id === id
                  ? {
                      ...e,
                      start: info.event.start?.toISOString(),
                      end: info.event.end?.toISOString(),
                    }
                  : e
              )
            );
          }}
        />
      </section>
    </div>
  );
}
