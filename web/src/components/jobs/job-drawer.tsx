"use client";

import type { Job } from "@/lib/demo-data";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { money } from "@/lib/demo-data";
import { CalendarDays, MapPin, User2, Shield, FileText } from "lucide-react";

function toneForStatus(s: Job["status"]) {
  if (s === "Completed") return "success";
  if (s === "In Progress") return "default";
  if (s === "Scheduled") return "default";
  if (s === "Disputed") return "danger";
  return "warning";
}

function toneForPriority(p: Job["priority"]) {
  if (p === "High") return "danger";
  if (p === "Medium") return "warning";
  return "default";
}

export function JobDrawer({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!job) {
    return <Dialog open={open} onClose={onClose} title="Job" widthClass="max-w-2xl"><div className="text-sm text-neutral-600">No job selected.</div></Dialog>;
  }

  return (
    <Dialog open={open} onClose={onClose} title={job.title} widthClass="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={toneForStatus(job.status)}>{job.status}</Badge>
          <Badge variant={toneForPriority(job.priority)}>{job.priority} priority</Badge>
          <Badge variant={job.escrowCents > 0 ? "success" : "default"}>{job.escrowCents > 0 ? "Escrow enabled" : "No escrow"}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
              <User2 className="h-4 w-4" /> Client
            </div>
            <div className="mt-2 text-sm font-semibold">{job.client}</div>
            <div className="mt-1 text-xs text-neutral-600">Client ID: {job.clientId}</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
              <MapPin className="h-4 w-4" /> Site
            </div>
            <div className="mt-2 text-sm font-semibold">{job.site}</div>
            <div className="mt-1 text-xs text-neutral-600">{job.location || "—"}</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
              <CalendarDays className="h-4 w-4" /> Schedule
            </div>
            <div className="mt-2 text-sm font-semibold">{new Date(job.start).toLocaleString()}</div>
            <div className="mt-1 text-xs text-neutral-600">End: {new Date(job.end).toLocaleString()}</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
              <Shield className="h-4 w-4" /> Financials
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-neutral-600">Value</div>
              <div className="text-sm font-semibold">{money(job.valueCents)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-neutral-600">Escrow</div>
              <div className="text-sm font-semibold">{money(job.escrowCents)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
            <FileText className="h-4 w-4" /> Notes
          </div>
          <div className="mt-2 text-sm text-neutral-800 whitespace-pre-wrap">{job.notes || "—"}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            onClick={() => alert("Next: wire actions to Supabase + escrow lifecycle")}
          >
            Actions
          </button>
        </div>
      </div>
    </Dialog>
  );
}
