 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CalJob = {
  id: string;
  title: string;
  client: string;
  site: string;
  status: "Scheduled" | "In Progress" | "Done";
  priority: "Low" | "Med" | "High";
  value: number;
  start: string;
  end: string;
};

const seed: CalJob[] = [
  {
    id: "1001",
    title: "Rope Access Repaint – Tower 2",
    client: "ACME Strata",
    site: "Southbank",
    status: "Scheduled",
    priority: "High",
    value: 24500,
    start: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "1002",
    title: "Facade Touch-Ups + Photos",
    client: "Lumina Body Corp",
    site: "CBD",
    status: "In Progress",
    priority: "Med",
    value: 4200,
    start: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "1003",
    title: "Balcony Rail Recoat",
    client: "Vantage Strata",
    site: "Docklands",
    status: "Scheduled",
    priority: "Low",
    value: 6800,
    start: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
  },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function statusClass(status: CalJob["status"]) {
  if (status === "In Progress") return "ev-inprogress";
  if (status === "Done") return "ev-done";
  return "ev-scheduled";
}

export default function CalendarPage() {
  const router = useRouter();
  const calendarRef = React.useRef<any>(null);
  const [jobs] = React.useState(seed);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Click an event to open the job. Mini-month navigates the week.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button">New booking</Button>
          <Button variant="outline" className="rounded-xl" type="button" onClick={() => calendarRef.current?.getApi().today()}>
            Today
          </Button>
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
                dayMaxEvents={true}
                dateClick={(info) => calendarRef.current?.getApi().gotoDate(info.date)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-muted-foreground">Upcoming</div>
            <div className="mt-3 space-y-3">
              {jobs.slice(0, 4).map((j) => (
                <button
                  key={j.id}
                  className="w-full text-left rounded-2xl border bg-background/60 p-3 hover:bg-accent/30"
                  type="button"
                  onClick={() => router.push(`/app/jobs/${j.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold leading-snug">{j.title}</div>
                    <Badge variant="outline" className="rounded-full text-[11px]">{j.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{j.client} • {j.site}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full text-[11px]">#{j.id}</Badge>
                    <div className="text-xs font-semibold">{money(j.value)}</div>
                  </div>
                </button>
              ))}
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
              editable={true}
              droppable={true}
              eventDurationEditable={true}
              eventStartEditable={true}
              headerToolbar={{ left: "prev,next", center: "title", right: "timeGridDay,timeGridWeek,dayGridMonth" }}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              eventClick={(arg) => router.push(`/app/jobs/${arg.event.id}`)}
              eventClassNames={(arg) => {
                const e: any = arg.event.extendedProps;
                const cls: string[] = [statusClass(e?.status)];
                if (e?.priority === "High") cls.push("ev-high");
                return cls;
              }}
              events={jobs.map((j) => ({ id: j.id, title: j.title, start: j.start, end: j.end, extendedProps: j }))}
              eventContent={(arg) => {
                const e: any = arg.event.extendedProps;
                return (
                  <div className="fc-event-inner">
                    <div className="fc-event-title">{arg.event.title}</div>
                    <div className="fc-event-sub">{e.client} • {e.site} • {money(e.value)}</div>
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
