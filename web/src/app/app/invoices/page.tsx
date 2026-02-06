'use client';

import { useState, useMemo } from "react";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, StatGrid } from "@/components/app/filled/page";
import { Search, Mail, AlertTriangle, CheckCircle, Square, CheckSquare } from "lucide-react";

type Invoice = {
  number: string;
  client: string;
  job: string;
  status: 'sent' | 'paid' | 'overdue';
  due: string;
  amount: number;
  note: string;
};

// Seeded data: 12 invoices
const seededInvoices: Invoice[] = [
  { number: 'INV-22018', client: 'Acme Body Corp', job: 'J-1402', status: 'sent', due: '2026-02-06', amount: 9450, note: 'Progress claim #2' },
  { number: 'INV-22017', client: 'Carlton Strata Ltd', job: 'J-1403', status: 'sent', due: '2026-02-08', amount: 4870, note: 'Initial deposit' },
  { number: 'INV-22016', client: 'Docklands Mgmt', job: 'J-1405', status: 'overdue', due: '2026-01-28', amount: 8900, note: 'Final completion' },
  { number: 'INV-22015', client: 'Melbourne Property Group', job: 'J-1408', status: 'paid', due: '2026-01-30', amount: 6450, note: 'Milestone 1' },
  { number: 'INV-22014', client: 'Riverside Mgmt', job: 'J-1409', status: 'sent', due: '2026-02-10', amount: 12300, note: 'Progress claim #1' },
  { number: 'INV-22013', client: 'Bayside Strata', job: 'J-1407', status: 'overdue', due: '2026-01-24', amount: 3200, note: 'Variation work' },
  { number: 'INV-22012', client: 'Preston Property Services', job: 'J-1410', status: 'paid', due: '2026-01-25', amount: 5600, note: 'Deposit' },
  { number: 'INV-22011', client: 'Toorak Elite Management', job: 'J-1411', status: 'paid', due: '2026-01-22', amount: 8750, note: 'Final claim' },
  { number: 'INV-22010', client: 'Brunswick Estates', job: 'J-1412', status: 'sent', due: '2026-02-12', amount: 7890, note: 'Progress claim' },
  { number: 'INV-22009', client: 'Hawthorn Holdings', job: 'J-1413', status: 'paid', due: '2026-01-20', amount: 4320, note: 'Completion' },
  { number: 'INV-22008', client: 'South Yarra Owners', job: 'J-1414', status: 'overdue', due: '2026-01-26', amount: 6700, note: 'Milestone 2' },
  { number: 'INV-22007', client: 'Footscray Community Corp', job: 'J-1415', status: 'sent', due: '2026-02-14', amount: 5450, note: 'Initial work' },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'paid' | 'overdue'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = seededInvoices;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(inv =>
        inv.number.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q) ||
        inv.job.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const outstanding = seededInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = seededInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const paid30d = seededInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    return { outstanding, overdue, paid30d };
  }, []);

  const allSelected = filtered.length > 0 && filtered.every(inv => selected.has(inv.number));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(inv => inv.number)));
    }
  };

  const toggleRow = (number: string) => {
    const next = new Set(selected);
    if (next.has(number)) {
      next.delete(number);
    } else {
      next.add(number);
    }
    setSelected(next);
  };

  const getStatusColor = (status: Invoice['status']): 'good' | 'warn' | 'bad' => {
    if (status === 'paid') return 'good';
    if (status === 'overdue') return 'bad';
    return 'warn';
  };

  return (
    <PageWrap>
      <PageHeader
        title="Invoices"
        subtitle="Progress claims, staged payments, and accounts receivable — no chaos."
        right={
          <>
            <GhostButton>Reminders</GhostButton>
            <PrimaryButton>New Invoice</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Outstanding", value: `$${(stats.outstanding / 1000).toFixed(1)}k`, hint: "A/R total" },
          { label: "Overdue", value: `$${(stats.overdue / 1000).toFixed(1)}k`, hint: "Needs follow-up" },
          { label: "Paid (30d)", value: `$${(stats.paid30d / 1000).toFixed(1)}k`, hint: "Collections" },
          { label: "Avg. Days to Pay", value: "12.4", hint: "Trend improving" },
        ]}
      />

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border bg-muted/10 px-3 py-2">
          <Search className="h-4 w-4 opacity-60" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search invoices by client, job, number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          {(['all', 'sent', 'paid', 'overdue'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-foreground/20 bg-background hover:bg-muted/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border bg-blue-50 px-4 py-3 dark:bg-blue-950">
          <div className="text-sm font-medium">
            {selected.size} invoice{selected.size > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Send reminders
            </button>
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Mark paid
            </button>
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Export selected
            </button>
            <button
              className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Accounts Receivable" subtitle={`${filtered.length} of ${seededInvoices.length} invoices`}>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-muted/20 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">
                      <button onClick={toggleAll} className="inline-flex items-center">
                        {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </button>
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Invoice</th>
                    <th className="px-3 py-2 text-left font-semibold">Client</th>
                    <th className="px-3 py-2 text-left font-semibold">Job</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Due</th>
                    <th className="px-3 py-2 text-right font-semibold">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((invoice) => (
                    <tr key={invoice.number} className="border-t hover:bg-muted/10">
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleRow(invoice.number)} className="inline-flex items-center">
                          {selected.has(invoice.number) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-semibold">{invoice.number}</div>
                        <div className="text-xs text-muted-foreground">{invoice.note}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{invoice.client}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{invoice.job}</div>
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={getStatusColor(invoice.status)}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Pill>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{invoice.due}</div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-semibold">${invoice.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          {invoice.status === 'sent' && (
                            <button
                              className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                              title="Send reminder"
                            >
                              <Mail className="h-3 w-3" />
                            </button>
                          )}
                          {invoice.status === 'overdue' && (
                            <button
                              className="inline-flex items-center gap-1 rounded-lg border bg-red-50 px-2 py-1.5 text-xs text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
                              title="Escalate now"
                            >
                              <AlertTriangle className="h-3 w-3" />
                            </button>
                          )}
                          {invoice.status !== 'paid' && (
                            <button
                              className="inline-flex items-center gap-1 rounded-lg border bg-green-50 px-2 py-1.5 text-xs text-green-600 hover:bg-green-100 dark:bg-green-950 dark:text-green-400"
                              title="Mark paid"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Automation Rules" subtitle="This is where TradeHub becomes lethal" right={<GhostButton>New Rule</GhostButton>}>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Escrow-linked releases</div>
                <div className="mt-1 text-xs text-muted-foreground">Invoices unlock automatically when QA evidence is present.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Overdue escalation</div>
                <div className="mt-1 text-xs text-muted-foreground">Nudges → reminders → fee triggers → dispute pathway.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Send reminders</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-send payment reminders 3 days before due date.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Cashflow Snapshot" subtitle="Next 7 days">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">Expected collections</div>
                <div className="mt-1 text-2xl font-semibold">$14,320</div>
                <div className="mt-1 text-xs text-muted-foreground">Due within 7 days</div>
              </div>
              <div className="rounded-2xl border bg-red-50 p-4 dark:bg-red-950/30">
                <div className="text-xs text-muted-foreground">High risk</div>
                <div className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">$8,900</div>
                <div className="mt-1 text-xs text-muted-foreground">Overdue - escalate now</div>
              </div>
            </div>
          </Card>

          <Card title="One-click actions" subtitle="Move money faster">
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Send reminders</div>
                <div className="text-xs text-muted-foreground">Batch {seededInvoices.filter(inv => inv.status === 'overdue').length} overdue invoices</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Generate progress claim</div>
                <div className="text-xs text-muted-foreground">From job milestones</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Link to escrow</div>
                <div className="text-xs text-muted-foreground">Release rules & audit trail</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
