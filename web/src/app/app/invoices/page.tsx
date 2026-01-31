export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "../../../components/ops/shell/PageHeader";
import DataTable from "../../../components/ops/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; col1: string; col2: string; col3: string; col4: string };

const rows: Row[] = [
  { id: "i1", col1: "INV-1042", col2: "$8,420", col3: "Due", col4: "Tower A repaint" },
  { id: "i2", col1: "INV-1043", col2: "$3,150", col3: "Paid", col4: "Balcony patch" },
  { id: "i3", col1: "INV-1044", col2: "$12,900", col3: "Overdue", col4: "Rope access seal" },
];

const cols: ColumnDef<Row, unknown>[] = [
  { header: "Invoice", accessorKey: "col1" },
  { header: "Amount", accessorKey: "col2" },
  { header: "Status", accessorKey: "col3" },
  { header: "Job", accessorKey: "col4" },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" subtitle="Cashflow control. Track due, overdue and paid." />
      <DataTable columns={cols} data={rows} emptyTitle="No invoices yet" emptySubtitle="Invoices will appear here once billing is enabled." />
    </div>
  );
}
