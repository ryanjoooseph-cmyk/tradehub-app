import { Client, Job, Invoice, EscrowHold, LedgerEntry } from "./domain";

export const demoClients: Client[] = [
  { id: "c_001", name: "Oceanview Body Corp", email: "admin@oceanview.com", phone: "0400 111 222", tags: ["Strata","High-rise"] },
  { id: "c_002", name: "Riverside Developments", email: "ops@riverside.dev", phone: "0400 333 444", tags: ["Builder"] },
  { id: "c_003", name: "Harbour Facilities", email: "facilities@harbour.com", phone: "0400 555 666", tags: ["Facilities"] },
];

export const demoJobs: Job[] = [
  { id: "j_1001", title: "Level 22 Balcony Repaint", clientId: "c_001", status: "Backlog", priority: "High", valueCents: 680000, location: "Brisbane CBD", notes: "Access: rope. Need 2 techs." },
  { id: "j_1002", title: "Facade Crack Seal + Touch-up", clientId: "c_001", status: "Quoted", priority: "Med", valueCents: 420000, location: "Brisbane CBD" },
  { id: "j_1003", title: "Stairwell Epoxy Refresh", clientId: "c_003", status: "Scheduled", priority: "Med", valueCents: 310000, location: "Southbank", start: "2026-01-30T15:45:43Z", end: "2026-01-30T19:45:43Z", assignees: ["T1","T2"] },
  { id: "j_1004", title: "Strata Lobby Feature Wall", clientId: "c_001", status: "In Progress", priority: "High", valueCents: 520000, location: "Brisbane CBD", start: "2026-01-27T16:45:43Z", end: "2026-01-27T22:45:43Z", assignees: ["T3"] },
];

export const demoInvoices: Invoice[] = [
  { id: "inv_9001", clientId: "c_001", jobId: "j_1004", status: "Sent", amountCents: 260000, issuedDate: "2026-01-23T06:45:43Z", dueDate: "2026-02-06T06:45:43Z" },
  { id: "inv_9002", clientId: "c_003", jobId: "j_1003", status: "Draft", amountCents: 310000, issuedDate: "2026-01-28T06:45:43Z", dueDate: "2026-02-12T06:45:43Z" },
];

export const demoEscrowHolds: EscrowHold[] = [
  { id: "eh_7001", jobId: "j_1003", clientId: "c_003", amountCents: 310000, status: "Held", createdAt: "2026-01-27T06:45:43Z", updatedAt: "2026-01-27T06:45:43Z" },
  { id: "eh_7002", jobId: "j_1004", clientId: "c_001", amountCents: 520000, status: "Disputed", createdAt: "2026-01-17T06:45:43Z", updatedAt: "2026-01-28T06:45:43Z" },
];

export const demoLedger: LedgerEntry[] = [
  { id: "le_1", holdId: "eh_7001", type: "Hold Created", amountCents: 310000, createdAt: "2026-01-27T06:45:43Z", note: "Client paid into escrow" },
  { id: "le_2", holdId: "eh_7002", type: "Hold Created", amountCents: 520000, createdAt: "2026-01-17T06:45:43Z" },
  { id: "le_3", holdId: "eh_7002", type: "Dispute Opened", amountCents: 0, createdAt: "2026-01-28T06:45:43Z", note: "Quality dispute - inspection requested" },
];
