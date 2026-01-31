export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "../../../components/ops/shell/PageHeader";
import DataTable from "../../../components/ops/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; col1: string; col2: string; col3: string; col4: string };

const rows: Row[] = [
  { id: "c1", col1: "Strata Managers AU", col2: "18 properties", col3: "Active", col4: "ryan.joooseph@icloud.com" },
  { id: "c2", col1: "Tower Holdings", col2: "6 towers", col3: "Active", col4: "ops@company.com" },
  { id: "c3", col1: "Private Client", col2: "1 site", col3: "Lead", col4: "client@email.com" },
];

const cols: ColumnDef<Row, unknown>[] = [
  { header: "Client", accessorKey: "col1" },
  { header: "Portfolio", accessorKey: "col2" },
  { header: "Stage", accessorKey: "col3" },
  { header: "Contact", accessorKey: "col4" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Clients" subtitle="Relationship + portfolio view. Built for scale." />
      <DataTable columns={cols} data={rows} emptyTitle="No clients yet" emptySubtitle="Add a client to start building a book of business." />
    </div>
  );
}
