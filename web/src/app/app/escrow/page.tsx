export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "../../../components/ops/shell/PageHeader";
import DataTable from "../../../components/ops/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; col1: string; col2: string; col3: string; col4: string };

const rows: Row[] = [
  { id: "e1", col1: "Tower A repaint", col2: "$18,000", col3: "Held", col4: "Release after QA" },
  { id: "e2", col1: "Balcony patch", col2: "$4,800", col3: "Released", col4: "Auto" },
  { id: "e3", col1: "Rope access seal", col2: "$12,900", col3: "Dispute", col4: "Inspector assigned" },
];

const cols: ColumnDef<Row, unknown>[] = [
  { header: "Contract", accessorKey: "col1" },
  { header: "Amount", accessorKey: "col2" },
  { header: "State", accessorKey: "col3" },
  { header: "Rule", accessorKey: "col4" },
];

export default function EscrowPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow"
        subtitle="The moat. Funds control, approvals, disputes, evidence."
        right={
          <a className="inline-flex h-10 items-center justify-center rounded-xl border bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90" href="/escrow">
            Escrow ops
          </a>
        }
      />
      <DataTable columns={cols} data={rows} emptyTitle="No escrow contracts yet" emptySubtitle="Escrow will populate when payment rails are wired." />
    </div>
  );
}
