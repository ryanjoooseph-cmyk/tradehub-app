export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import PageHeader from "../../../components/ops/shell/PageHeader";
import DataTable from "../../../components/ops/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; col1: string; col2: string; col3: string; col4: string };

const rows: Row[] = [
  { id: "1", col1: "Tower A repaint", col2: "In progress", col3: "High", col4: "Ryan J" },
  { id: "2", col1: "Balcony patch", col2: "Scheduled", col3: "Medium", col4: "Team A" },
  { id: "3", col1: "Lobby touch-ups", col2: "Quoted", col3: "Low", col4: "Ops" },
  { id: "4", col1: "Rope access seal", col2: "Review", col3: "High", col4: "Admin" },
];

const cols: ColumnDef<Row, unknown>[] = [
  { header: "Job", accessorKey: "col1" },
  { header: "Status", accessorKey: "col2" },
  { header: "Risk", accessorKey: "col3" },
  { header: "Owner", accessorKey: "col4" },
];

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Pipeline-grade job ops: status, risk, owners, and timing."
        right={
          <Link
            className="inline-flex h-10 items-center justify-center rounded-xl border bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
            href="/app/calendar"
          >
            Schedule job
          </Link>
        }
      />
      <DataTable columns={cols} data={rows} emptyTitle="No jobs yet" emptySubtitle="Create your first job to populate the pipeline." />
    </div>
  );
}
