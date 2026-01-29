export type JobStatus = "Backlog" | "Quoted" | "Scheduled" | "In Progress" | "Blocked" | "Completed";
export type JobPriority = "Low" | "Med" | "High" | "Critical";

export type Client = { id: string; name: string; email?: string; phone?: string; address?: string; tags?: string[] };

export type Job = {
  id: string;
  title: string;
  clientId: string;
  status: JobStatus;
  priority: JobPriority;
  valueCents: number;
  start?: string;
  end?: string;
  assignees?: string[];
  location?: string;
  notes?: string;
};

export type InvoiceStatus = "Draft" | "Sent" | "Part Paid" | "Paid" | "Overdue";
export type Invoice = { id: string; clientId: string; jobId?: string; status: InvoiceStatus; amountCents: number; dueDate: string; issuedDate: string };

export type EscrowStatus = "Held" | "Released" | "Disputed" | "Refunded";
export type EscrowHold = { id: string; jobId: string; clientId: string; amountCents: number; status: EscrowStatus; createdAt: string; updatedAt: string };

export type LedgerEntryType = "Hold Created" | "Partial Release" | "Final Release" | "Dispute Opened" | "Dispute Resolved" | "Refund";
export type LedgerEntry = { id: string; holdId: string; type: LedgerEntryType; amountCents: number; createdAt: string; note?: string };
