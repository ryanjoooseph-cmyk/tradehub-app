"use client";

import React from "react";
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

function chip(status: CalJob["status"]) {
  if (status === "In Progress") return "bg-amber-500/15 text-amber-500 border-amber-500/20";
  if (status === "Done") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20";
  return "bg-indigo-500/15 text-indigo-500 border-indigo-500/20";
}

export default function CalendarPage() {
  const [jobs] = React.useState(seed);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Drag & drop scheduling (Tradify-level, better). Wiring to Supabase next.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button">New booking</Button>
          <Button variant="outline" className="rounded-xl" type="button">Filters</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-3 rounded-2xl border bg-card/40 p-4">
          <div className="font-medium">Quick controls</div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="rounded-xl" type="button">Today</Button>
            <Button size="sm" variant="outline" className="rounded-xl" type="button">Week</Button>
          </div>

          <div className="mt-4 rounded-2xl border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Mini month (next)</div>
            <div className="mt-2 h-40 rounded-xl border bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10" />
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-muted-foreground">Upcoming</div>
            <div className="mt-3 space-y-3">
              {jobs.slice(0, 3).map((j) => (
                <div key={j.id} className="rounded-2xl border bg-background/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold leading-snug">{j.title}</div>
                    <span className={["text-[11px] px-2 py-1 rounded-full border", chip(j.status)].join(" ")}>
                      {j.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{j.client} • {j.site}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full text-[11px]">#{j.id}</Badge>
                    <div className="text-xs font-semibold">{money(j.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-9 rounded-2xl border bg-card/40 p-4">
          <div className="calendar-premium">
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              height="auto"
              nowIndicator={true}
              editable={true}
              droppable={true}
              eventDurationEditable={true}
              eventStartEditable={true}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridDay,timeGridWeek,dayGridMonth",
              }}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              weekends={true}
              events={jobs.map((j) => ({
                id: j.id,
                title: j.title,
                start: j.start,
                end: j.end,
                extendedProps: j,
              }))}
              eventContent={(arg) => {
                const e: any = arg.event.extendedProps;
                return (
                  <div className="fc-event-inner">
                    <div className="fc-event-title">{arg.event.title}</div>
                    <div className="fc-event-sub">
                      {e.client} • {e.site} • {money(e.value)}
                    </div>
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
