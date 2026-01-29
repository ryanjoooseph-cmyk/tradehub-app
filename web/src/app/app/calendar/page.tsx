"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Job = {
  id: string;
  title: string;
  clientName: string;
  site: string;
  status: string;
  priority: string;
  value: number;
  startAt?: string;
  endAt?: string;
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function statusClass(s: string) {
  if (s === "In Progress") return "ev-inprogress";
  if (s === "Done") return "ev-done";
  if (s === "Blocked") return "ev-blocked";
  return "ev-scheduled";
}

export default function CalendarPage() {
  const router = useRouter();
  const calendarRef = React.useRef<any>(null);
  const [jobs, setJobs] = React.useState<Job[]>([]);

  React.useEffect(() => {
    fetch("/api/jobs", { cache: "no-store" })
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => setJobs([]));
  }, []);

  const events = jobs
    .filter((j) => j.startAt && j.endAt)
    .map((j) => ({
      id: j.id,
      title: j.title,
      start: j.startAt!,
      end: j.endAt!,
      extendedProps: j,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Jobs render from /api/jobs (requires startAt/endAt). Click to open the job.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button" onClick={() => calendarRef.current?.getApi().today()}>Today</Button>
          <Button variant="outline" className="rounded-xl" type="button" onClick={() => calendarRef.current?.getApi().changeView("timeGridWeek")}>Week</Button>
          <Button variant="outline" className="rounded-xl" type="button" onClick={() => calendarRef.current?.getApi().changeView("dayGridMonth")}>Month</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-3 rounded-2xl border bg-card/40 p-4">
          <div className="font-medium">Navigator</div>
          <div className="mt-3 rounded-2xl border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Mini month</div>
            <div className="mt-2">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                headerToolbar={{ left: "", center: "title", right: "" }}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                dateClick={(info) => calendarRef.current?.getApi().gotoDate(info.date)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-muted-foreground">Scheduled</div>
            <div className="mt-3 space-y-2">
              {events.slice(0, 6).map((e: any) => (
                <button key={e.id} type="button" className="w-full text-left rounded-2xl border bg-background/60 p-3 hover:bg-accent/30" onClick={() => router.push(`/app/jobs/${e.id}`)}>
                  <div className="text-sm font-semibold">#{e.id} {e.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{e.extendedProps.clientName} • {e.extendedProps.site} • {money(e.extendedProps.value)}</div>
                </button>
              ))}
              {events.length === 0 ? (
                <div className="rounded-2xl border bg-background/60 p-3 text-xs text-muted-foreground">
                  No jobs have start/end times yet. Fix /api/jobs to return startAt/endAt and events will appear.
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-9 rounded-2xl border bg-card/40 p-4">
          <div className="calendar-premium">
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              height="auto"
              nowIndicator={true}
              eventDisplay="block"
              headerToolbar={{ left: "prev,next", center: "title", right: "timeGridDay,timeGridWeek,dayGridMonth" }}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              scrollTime="07:00:00"
              events={events}
              eventClassNames={(arg) => {
                const e: any = arg.event.extendedProps;
                const out: string[] = [statusClass(e?.status)];
                if (e?.priority === "High") out.push("ev-high");
                return out;
              }}
              eventClick={(arg) => router.push(`/app/jobs/${arg.event.id}`)}
              eventContent={(arg) => {
                const e: any = arg.event.extendedProps;
                return (
                  <div className="fc-event-inner">
                    <div className="fc-event-title">{arg.event.title}</div>
                    <div className="fc-event-sub">{e.clientName} • {e.site} • {money(e.value)}</div>
                  </div>
                );
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
