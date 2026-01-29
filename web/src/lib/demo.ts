export type JobStatus = "Backlog" | "Scheduled" | "In Progress" | "Done" | "Blocked";
export type Priority = "Low" | "Med" | "High";

export type Job = {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  site: string;
  status: JobStatus;
  priority: Priority;
  value: number;
  startAt?: string;
  endAt?: string;
  updatedAt: string;
};

export type Client = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type Invoice = {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueAt: string;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: "Available" | "On job" | "Off";
};

export type EscrowStatus = "Awaiting Funds" | "Funded" | "In Dispute" | "Released" | "Refunded";
export type EscrowTxn = {
  id: string;
  jobId: string;
  clientName: string;
  amount: number;
  status: EscrowStatus;
  createdAt: string;
  releaseAt?: string;
};

const now = new Date();
const iso = (d: Date) => d.toISOString();
const addH = (h: number) => iso(new Date(now.getTime() + h * 60 * 60 * 1000));
const addD = (d: number) => iso(new Date(now.getTime() + d * 24 * 60 * 60 * 1000));

export const clients: Client[] = [
  { id: "c1", name: "ACME Strata", contact: "Sarah Blake", email: "sarah@acme.com", phone: "+61 4xx xxx xxx", address: "Southbank VIC", createdAt: addD(-60) },
  { id: "c2", name: "Lumina Body Corp", contact: "James King", email: "james@lumina.com", phone: "+61 4xx xxx xxx", address: "Melbourne CBD", createdAt: addD(-30) },
  { id: "c3", name: "Vantage Strata", contact: "Ava Chen", email: "ava@vantage.com", phone: "+61 4xx xxx xxx", address: "Docklands VIC", createdAt: addD(-20) },
];

export const jobs: Job[] = [
  { id: "1001", title: "Rope Access Repaint – Tower 2", clientId: "c1", clientName: "ACME Strata", site: "Southbank", status: "Scheduled", priority: "High", value: 24500, startAt: addH(2), endAt: addH(6), updatedAt: addH(-1) },
  { id: "1002", title: "Facade Touch-Ups + Photo Evidence", clientId: "c2", clientName: "Lumina Body Corp", site: "CBD", status: "In Progress", priority: "Med", value: 4200, startAt: addH(-2), endAt: addH(1), updatedAt: addH(-0.5) },
  { id: "1003", title: "Balcony Rail Recoat – Stage 1", clientId: "c3", clientName: "Vantage Strata", site: "Docklands", status: "Backlog", priority: "Low", value: 6800, updatedAt: addH(-8) },
  { id: "1004", title: "Quote Walkthrough + Scope Finalisation", clientId: "c1", clientName: "ACME Strata", site: "Southbank", status: "Done", priority: "Low", value: 1200, startAt: addD(-2), endAt: addD(-2), updatedAt: addD(-2) },
  { id: "1005", title: "High-rise Spot Prime + Seal (Weather window)", clientId: "c2", clientName: "Lumina Body Corp", site: "CBD", status: "Blocked", priority: "High", value: 9800, startAt: addD(1), endAt: addD(1), updatedAt: addH(-3) },
];

export const invoices: Invoice[] = [
  { id: "inv-2001", jobId: "1001", clientId: "c1", clientName: "ACME Strata", amount: 24500, status: "Sent", dueAt: addD(7), createdAt: addD(-1) },
  { id: "inv-2002", jobId: "1002", clientId: "c2", clientName: "Lumina Body Corp", amount: 4200, status: "Overdue", dueAt: addD(-3), createdAt: addD(-10) },
  { id: "inv-2003", jobId: "1004", clientId: "c1", clientName: "ACME Strata", amount: 1200, status: "Paid", dueAt: addD(-20), createdAt: addD(-25) },
];

export const team: TeamMember[] = [
  { id: "t1", name: "Ryan Joseph", role: "Ops / Director", skills: ["Scheduling", "Quotes", "Accounts"], availability: "Available" },
  { id: "t2", name: "Mason Reid", role: "Rope Access Lead", skills: ["IRATA", "High-rise", "QA"], availability: "On job" },
  { id: "t3", name: "Luca Silva", role: "Painter", skills: ["Prep", "Finish", "Touch-ups"], availability: "Available" },
  { id: "t4", name: "Ava Patel", role: "Admin", skills: ["Invoicing", "Client comms", "Docs"], availability: "Off" },
];

export const escrow: EscrowTxn[] = [
  { id: "esc-9001", jobId: "1001", clientName: "ACME Strata", amount: 24500, status: "Funded", createdAt: addD(-1), releaseAt: addD(2) },
  { id: "esc-9002", jobId: "1002", clientName: "Lumina Body Corp", amount: 4200, status: "In Dispute", createdAt: addD(-6) },
  { id: "esc-9003", jobId: "1004", clientName: "ACME Strata", amount: 1200, status: "Released", createdAt: addD(-25) },
];
