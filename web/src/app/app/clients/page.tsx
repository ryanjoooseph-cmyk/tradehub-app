'use client';

import { useState, useMemo } from "react";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, StatGrid } from "@/components/app/filled/page";
import { Search, Briefcase, FileText } from "lucide-react";

type Client = {
  name: string;
  email: string;
  type: 'Strata' | 'Management';
  portfolio: { buildings: number; sites: string };
  status: 'Active' | 'Warm' | 'Inactive';
  paymentReliability: 'High' | 'Medium' | 'Low';
  approvalSpeed: 'Fast' | 'Medium' | 'Slow';
  scopeVolatility: 'Low' | 'Medium' | 'High';
  notes: string;
};

// Seeded data: 12 clients
const seededClients: Client[] = [
  {
    name: 'Acme Body Corp',
    email: 'lchen@acme.com',
    type: 'Strata',
    portfolio: { buildings: 12, sites: 'Southbank/Docklands' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Medium',
    scopeVolatility: 'Low',
    notes: 'Prefers staged invoicing + progress photos'
  },
  {
    name: 'Bayside Strata',
    email: 'ops@bayside.com',
    type: 'Strata',
    portfolio: { buildings: 6, sites: 'St Kilda/Elwood' },
    status: 'Warm',
    paymentReliability: 'Medium',
    approvalSpeed: 'Slow',
    scopeVolatility: 'Medium',
    notes: 'Awaiting scope clarification on balcony package'
  },
  {
    name: 'Riverside Mgmt',
    email: 'apatel@riverside.com',
    type: 'Management',
    portfolio: { buildings: 3, sites: 'Docklands' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Fast',
    scopeVolatility: 'Low',
    notes: 'Fast approvals when QA evidence is attached'
  },
  {
    name: 'Carlton Strata Ltd',
    email: 'info@carlton.com.au',
    type: 'Strata',
    portfolio: { buildings: 8, sites: 'CBD/Carlton' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Medium',
    scopeVolatility: 'Low',
    notes: 'Requires 3 quotes for jobs over $20k'
  },
  {
    name: 'South Yarra Owners',
    email: 'admin@syowners.com',
    type: 'Strata',
    portfolio: { buildings: 2, sites: 'South Yarra' },
    status: 'Inactive',
    paymentReliability: 'Low',
    approvalSpeed: 'Slow',
    scopeVolatility: 'High',
    notes: 'Payment delays, consider prepayment terms'
  },
  {
    name: 'Melbourne Property Group',
    email: 'projects@melbprop.com',
    type: 'Management',
    portfolio: { buildings: 15, sites: 'CBD/Richmond/Collingwood' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Fast',
    scopeVolatility: 'Low',
    notes: 'Bulk discounts negotiated, excellent referrals'
  },
  {
    name: 'Docklands Towers',
    email: 'strata@docklands.net',
    type: 'Strata',
    portfolio: { buildings: 4, sites: 'Docklands' },
    status: 'Warm',
    paymentReliability: 'Medium',
    approvalSpeed: 'Medium',
    scopeVolatility: 'Medium',
    notes: 'Annual maintenance contract under review'
  },
  {
    name: 'Preston Property Services',
    email: 'hello@prestonps.com.au',
    type: 'Management',
    portfolio: { buildings: 7, sites: 'Preston/Reservoir' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Medium',
    scopeVolatility: 'Low',
    notes: 'Prefers email communication over phone'
  },
  {
    name: 'Brunswick Estates',
    email: 'accounts@brunswick.com',
    type: 'Strata',
    portfolio: { buildings: 5, sites: 'Brunswick' },
    status: 'Warm',
    paymentReliability: 'Medium',
    approvalSpeed: 'Fast',
    scopeVolatility: 'Medium',
    notes: 'New committee elected, relationships rebuilding'
  },
  {
    name: 'Toorak Elite Management',
    email: 'pm@toorakelite.com.au',
    type: 'Management',
    portfolio: { buildings: 10, sites: 'Toorak/Armadale' },
    status: 'Active',
    paymentReliability: 'High',
    approvalSpeed: 'Fast',
    scopeVolatility: 'Low',
    notes: 'High-end clientele, quality expectations'
  },
  {
    name: 'Footscray Community Corp',
    email: 'manager@footscray.org',
    type: 'Strata',
    portfolio: { buildings: 3, sites: 'Footscray' },
    status: 'Inactive',
    paymentReliability: 'Low',
    approvalSpeed: 'Slow',
    scopeVolatility: 'High',
    notes: 'Multiple disputes, recommend caution'
  },
  {
    name: 'Hawthorn Holdings',
    email: 'contact@hawthornhold.com',
    type: 'Management',
    portfolio: { buildings: 6, sites: 'Hawthorn/Kew' },
    status: 'Active',
    paymentReliability: 'Medium',
    approvalSpeed: 'Medium',
    scopeVolatility: 'Medium',
    notes: 'Regular maintenance schedule, predictable workflow'
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Strata' | 'Management'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Warm' | 'Inactive'>('All');

  const filtered = useMemo(() => {
    let result = seededClients;

    // Type filter
    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.portfolio.sites.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, typeFilter, statusFilter]);

  const getHealthColor = (level: 'High' | 'Medium' | 'Low' | 'Fast' | 'Slow'): 'good' | 'warn' | 'bad' | 'neutral' => {
    if (level === 'High' || level === 'Fast') return 'good';
    if (level === 'Low' || level === 'Slow') return 'bad';
    return 'warn';
  };

  return (
    <PageWrap>
      <PageHeader
        title="Clients"
        subtitle="Owners, strata managers, builders — all relationships, one view."
        right={
          <>
            <GhostButton>Segments</GhostButton>
            <PrimaryButton>New Client</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Total Clients", value: seededClients.length.toString(), hint: "Active + archived" },
          { label: "Active", value: seededClients.filter(c => c.status === 'Active').length.toString(), hint: "Currently engaged" },
          { label: "High Reliability", value: seededClients.filter(c => c.paymentReliability === 'High').length.toString(), hint: "Payment track record" },
          { label: "Fast Approvals", value: seededClients.filter(c => c.approvalSpeed === 'Fast').length.toString(), hint: "Quick decisions" },
        ]}
      />

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border bg-muted/10 px-3 py-2">
          <Search className="h-4 w-4 opacity-60" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search clients by name, email, company, building…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Type:</span>
          {(['All', 'Strata', 'Management'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === t
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-foreground/20 bg-background hover:bg-muted/40'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">Status:</span>
          {(['All', 'Active', 'Warm', 'Inactive'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Client Directory" subtitle={`${filtered.length} of ${seededClients.length} clients`}>
            {filtered.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[800px] text-sm">
                  <thead className="bg-muted/20 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Client</th>
                      <th className="px-3 py-2 text-left font-semibold">Type</th>
                      <th className="px-3 py-2 text-left font-semibold">Portfolio</th>
                      <th className="px-3 py-2 text-left font-semibold">Status</th>
                      <th className="px-3 py-2 text-left font-semibold">Health Signals</th>
                      <th className="px-3 py-2 text-left font-semibold">Notes</th>
                      <th className="px-3 py-2 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((client, i) => (
                      <tr key={i} className="border-t hover:bg-muted/10">
                        <td className="px-3 py-3">
                          <div className="font-semibold">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        </td>
                        <td className="px-3 py-3">
                          <Pill tone="neutral">{client.type}</Pill>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium">{client.portfolio.buildings} buildings</div>
                          <div className="text-xs text-muted-foreground">{client.portfolio.sites}</div>
                        </td>
                        <td className="px-3 py-3">
                          <Pill tone={client.status === 'Active' ? 'good' : client.status === 'Warm' ? 'warn' : 'neutral'}>
                            {client.status}
                          </Pill>
                        </td>
                        <td className="px-3 py-3">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Pay:</span>
                              <Pill tone={getHealthColor(client.paymentReliability)}>{client.paymentReliability}</Pill>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Appr:</span>
                              <Pill tone={getHealthColor(client.approvalSpeed)}>{client.approvalSpeed}</Pill>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Scope:</span>
                              <Pill tone={client.scopeVolatility === 'Low' ? 'good' : client.scopeVolatility === 'High' ? 'bad' : 'warn'}>
                                {client.scopeVolatility}
                              </Pill>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-muted-foreground">{client.notes}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <button className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40">
                              <Briefcase className="h-3 w-3" />
                              New Job
                            </button>
                            <button className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40">
                              <FileText className="h-3 w-3" />
                              Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/5 py-16">
                <div className="text-6xl opacity-20">👥</div>
                <div className="mt-4 text-lg font-semibold">No clients found</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </div>
              </div>
            )}
          </Card>

          <Card title="Relationship Intelligence" subtitle="The stuff that makes you money (seed)">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Portfolio heatmap</div>
                <div className="mt-1 text-xs text-muted-foreground">Which buildings are due for repaint cycles.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Referral engine</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-identify managers connected across buildings.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Risk flags</div>
                <div className="mt-1 text-xs text-muted-foreground">Payment friction, scope creep, dispute frequency.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Client Health" subtitle="Operational signals">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Payment reliability</div>
                  <Pill tone="good">High</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Track average days to pay and claim disputes.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Approval speed</div>
                  <Pill tone="warn">Medium</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Measure quote acceptance time by manager.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Scope volatility</div>
                  <Pill tone="neutral">Low</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Detect variations & change requests.</div>
              </div>
            </div>
          </Card>

          <Card title="Quick Actions" subtitle="Make it move" right={<GhostButton>Configure</GhostButton>}>
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Send proposal pack</div>
                <div className="text-xs text-muted-foreground">Scope, inclusions, timeline</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Request site access</div>
                <div className="text-xs text-muted-foreground">Permits, keys, hoist bookings</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Create escrow plan</div>
                <div className="text-xs text-muted-foreground">Milestones + release rules</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
