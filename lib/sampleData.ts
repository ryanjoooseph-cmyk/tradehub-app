import type { EventInput } from '@fullcalendar/core';

// Demo resources: rows in resourceTimeGrid
export const resources = [
  { id: 'team-1', title: 'Team 1' },
  { id: 'team-2', title: 'Team 2' },
  { id: 'ute-1',  title: 'Ute #1' },
];

// Seed events (replace with API data later)
const today = new Date();
function iso(d: Date) { return d.toISOString().slice(0,19); }

const start1 = new Date(today); start1.setHours(9,0,0,0);
const end1   = new Date(today); end1.setHours(11,0,0,0);

const start2 = new Date(today); start2.setHours(12,0,0,0);
const end2   = new Date(today); end2.setHours(15,0,0,0);

export const calendarEvents: EventInput[] = [
  { id: 'job-3501', title: 'JOB‑3501 – Rough‑in', start: iso(start1), end: iso(end1), resourceId: 'team-1' },
  { id: 'job-3502', title: 'JOB‑3502 – Fit‑off',   start: iso(start2), end: iso(end2), resourceId: 'team-2' },
];
