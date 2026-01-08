import type { EventInput } from "@fullcalendar/core";

const today = new Date();
const y = today.toISOString().slice(0, 10);

export const calendarEvents: EventInput[] = [
  { id: "job-1", title: "Site Visit – Smith", start: `${y}T09:00:00`, end: `${y}T10:30:00` },
  { id: "job-2", title: "Install – Unit 14", start: `${y}T13:00:00`, end: `${y}T15:00:00` },
];
