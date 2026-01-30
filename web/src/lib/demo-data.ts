export type JobStatus = "Draft" | "Scheduled" | "In Progress" | "Completed" | "Disputed";
export type JobPriority = "Low" | "Medium" | "High";

export type Job = {
  id: string;
  title: string;

  clientId: string;
  client: string;

  site: string;
  location?: string;

  start: string;
  end: string;

  status: JobStatus;
  priority: JobPriority;

  valueCents: number;
  escrowCents: number;

  notes?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Invoice = {
  id: string;
  jobId: string;
  client: string;
  amountCents: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  issuedAt: string;
};

export type EscrowHold = {
  id: string;
  jobId: string;
  amountCents: number;
  status: "Held" | "Released" | "Refunded" | "Disputed";
  createdAt: string;
};

export type LedgerEntry = {
  id: string;
  jobId: string;
  type: "Hold" | "Release" | "Refund" | "Fee";
  amountCents: number;
  createdAt: string;
  note?: string;
};

const now = new Date();
const iso = (d: Date) => d.toISOString();
const addHours = (base: Date, h: number) => new Date(base.getTime() + h * 60 * 60 * 1000);
const addDays = (base: Date, days: number) => new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

export const demoClients: Client[] = [
  { id: "c_001", name: "Harbourview Body Corp", email: "admin@harbourview.com", phone: "+61 400 000 001", address: "1 Ocean Ave, Brisbane QLD" },
  { id: "c_002", name: "Skyline Facilities", email: "ops@skylinefacilities.au", phone: "+61 400 000 002", address: "88 Queen St, Brisbane QLD" },
  { id: "c_003", name: "Eastpoint Commercial", email: "accounts@eastpoint.com.au", phone: "+61 400 000 003", address: "12 Wharf Rd, Brisbane QLD" }
];

const clientIdByName = new Map(demoClients.map((c) => [c.name, c.id] as const));

export const demoJobs: Job[] = [
  {
    id: "j_1001",
    title: "High-rise façade wash + touch-ups",
    client: "Harbourview Body Corp",
    clientId: clientIdByName.get("Harbourview Body Corp") || "c_001",
    site: "Harbourview Tower",
    location: "Brisbane QLD",
    start: iso(addDays(addHours(now, 2), 1)),
    end: iso(addDays(addHours(now, 5), 1)),
    status: "Scheduled",
    priority: "High",
    valueCents: 245000,
    escrowCents: 245000,
    notes: "Access plan confirmed. Notify residents 24h prior."
  },
  {
    id: "j_1002",
    title: "Rope access repaint – balcony rails",
    client: "Skyline Facilities",
    clientId: clientIdByName.get("Skyline Facilities") || "c_002",
    site: "Aurora Apartments",
    location: "Brisbane CBD",
    start: iso(addDays(addHours(now, 1), 2)),
    end: iso(addDays(addHours(now, 7), 2)),
    status: "In Progress",
    priority: "Medium",
    valueCents: 890000,
    escrowCents: 450000,
    notes: "Stage 1 underway. QA photos required end of day."
  },
  {
    id: "j_1003",
    title: "Commercial strata inspection + scope",
    client: "Eastpoint Commercial",
    clientId: clientIdByName.get("Eastpoint Commercial") || "c_003",
    site: "Eastpoint Plaza",
    location: "Fortitude Valley",
    start: iso(addDays(addHours(now, 3), 3)),
    end: iso(addDays(addHours(now, 4), 3)),
    status: "Draft",
    priority: "Low",
    valueCents: 120000,
    escrowCents: 0,
    notes: "Awaiting client confirmation for inspection window."
  },
  {
    id: "j_1004",
    title: "Defect rectification – water ingress",
    client: "Harbourview Body Corp",
    clientId: clientIdByName.get("Harbourview Body Corp") || "c_001",
    site: "Harbourview Tower",
    location: "Brisbane QLD",
    start: iso(addDays(addHours(now, 2), -1)),
    end: iso(addDays(addHours(now, 6), -1)),
    status: "Disputed",
    priority: "High",
    valueCents: 360000,
    escrowCents: 360000,
    notes: "Client dispute opened. Awaiting independent inspection."
  },
  {
    id: "j_1005",
    title: "End-of-lease commercial repaint",
    client: "Eastpoint Commercial",
    clientId: clientIdByName.get("Eastpoint Commercial") || "c_003",
    site: "Eastpoint Plaza",
    location: "Brisbane QLD",
    start: iso(addDays(addHours(now, 2), 5)),
    end: iso(addDays(addHours(now, 9), 5)),
    status: "Scheduled",
    priority: "Medium",
    valueCents: 540000,
    escrowCents: 540000,
    notes: "Paint spec locked. Prep crew day before."
  }
];

export const demoInvoices: Invoice[] = [
  { id: "inv_7001", jobId: "j_1001", client: "Harbourview Body Corp", amountCents: 245000, status: "Sent", issuedAt: iso(addDays(now, -2)) },
  { id: "inv_7002", jobId: "j_1002", client: "Skyline Facilities", amountCents: 890000, status: "Paid", issuedAt: iso(addDays(now, -6)) },
  { id: "inv_7003", jobId: "j_1004", client: "Harbourview Body Corp", amountCents: 360000, status: "Overdue", issuedAt: iso(addDays(now, -10)) }
];

export const demoEscrowHolds: EscrowHold[] = demoJobs
  .filter((j) => j.escrowCents > 0)
  .map((j, idx) => ({
    id: `eh_${idx + 1}`,
    jobId: j.id,
    amountCents: j.escrowCents,
    status: j.status === "Disputed" ? "Disputed" : "Held",
    createdAt: j.start
  }));

export const demoLedger: LedgerEntry[] = demoEscrowHolds.flatMap((h, idx) => {
  const fee = Math.round(h.amountCents * 0.008);
  return [
    { id: `le_${idx + 1}_1`, jobId: h.jobId, type: "Hold", amountCents: h.amountCents, createdAt: h.createdAt, note: "Client funded escrow" },
    { id: `le_${idx + 1}_2`, jobId: h.jobId, type: "Fee", amountCents: fee, createdAt: h.createdAt, note: "Platform fee" }
  ];
});

export const money = (cents: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);

export const kpis = () => {
  const totalValue = demoJobs.reduce((a, j) => a + j.valueCents, 0);
  const escrowHeld = demoJobs.reduce((a, j) => a + j.escrowCents, 0);
  const disputed = demoJobs.filter((j) => j.status === "Disputed").length;
  const active = demoJobs.filter((j) => j.status === "Scheduled" || j.status === "In Progress").length;
  return { totalValue, escrowHeld, disputed, active };
};
