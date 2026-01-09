import type { EventInput } from "@fullcalendar/core";

export const kpis = [
  { label: "Escrow", value: "$136,420" },
  { label: "Avg time to release", value: "27h" },
  { label: "Dispute Rate", value: "2.3%" }
];

export const recentActivity = [
  { time: "09:12", event: "Milestone Funded", details: "JOB-3522 · $3,250 · Client: Lee" },
  { time: "09:45", event: "Dispute Opened", details: "JOB-3581 · Electrical variation" },
  { time: "09:07", event: "KYC Passed", details: "Trade ABN 45 987 654 321" }
];

export const disputes = [
  { caseId: "DSP-126", jobId: "JOB-3501", status: "Inspector Assigned", sla: "16h" }
];

const today = new Date().toISOString().slice(0, 10);
export const calendarEvents: EventInput[] = [
  { id: "job-1", title: "Site Visit – Smith", start: `${today}T09:00:00`, end: `${today}T10:30:00` },
  { id: "job-2", title: "Install – Unit 14", start: `${today}T13:00:00`, end: `${today}T15:00:00` }
];
