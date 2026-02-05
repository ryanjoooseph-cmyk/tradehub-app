'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrap, PageHeader, PrimaryButton, cx, Pill } from '@/components/app/filled/page';
import { Search, Filter, CheckSquare, Square } from 'lucide-react';

type Job = {
  id: string;
  jobNumber: string;
  client: string;
  site: string;
  strataPlan?: string;
  status: 'on_track' | 'waiting' | 'at_risk' | 'complete';
  nextAction: string;
  value: number;
  risk: 'low' | 'medium' | 'high';
  scheduledStart: string;
};

// Seeded data: 15+ jobs
const seededJobs: Job[] = [
  { id: 'J-1402', jobNumber: 'J-1402', client: 'Acme Body Corp', site: 'Southbank - Tower A', strataPlan: 'SP12345', status: 'on_track', nextAction: 'Crew allocation', value: 18900, risk: 'low', scheduledStart: '2026-02-06' },
  { id: 'J-1403', jobNumber: 'J-1403', client: 'Carlton Strata Ltd', site: 'CBD - Office Block 3', strataPlan: 'SP23456', status: 'waiting', nextAction: 'Quote approval', value: 24500, risk: 'medium', scheduledStart: '2026-02-10' },
  { id: 'J-1404', jobNumber: 'J-1404', client: 'Richmond Heights', site: 'Richmond - Apartment Complex', strataPlan: 'SP34567', status: 'at_risk', nextAction: 'Material delivery', value: 31200, risk: 'high', scheduledStart: '2026-02-08' },
  { id: 'J-1405', jobNumber: 'J-1405', client: 'Docklands Mgmt', site: 'Docklands - Marina View', strataPlan: 'SP45678', status: 'on_track', nextAction: 'Site inspection', value: 15600, risk: 'low', scheduledStart: '2026-02-12' },
  { id: 'J-1406', jobNumber: 'J-1406', client: 'South Yarra Owners', site: 'South Yarra - Heritage Building', strataPlan: 'SP56789', status: 'complete', nextAction: 'Final invoice', value: 42800, risk: 'low', scheduledStart: '2026-01-20' },
  { id: 'J-1407', jobNumber: 'J-1407', client: 'Fitzroy Collective', site: 'Fitzroy - Mixed Use', strataPlan: 'SP67890', status: 'on_track', nextAction: 'Progress report', value: 19400, risk: 'low', scheduledStart: '2026-02-14' },
  { id: 'J-1408', jobNumber: 'J-1408', client: 'Acme Body Corp', site: 'Southbank - Tower B', strataPlan: 'SP12346', status: 'waiting', nextAction: 'Access permit', value: 22100, risk: 'medium', scheduledStart: '2026-02-16' },
  { id: 'J-1409', jobNumber: 'J-1409', client: 'Port Melbourne Strata', site: 'Port Melbourne - Waterfront', strataPlan: 'SP78901', status: 'at_risk', nextAction: 'Weather delay review', value: 38700, risk: 'high', scheduledStart: '2026-02-09' },
  { id: 'J-1410', jobNumber: 'J-1410', client: 'St Kilda Towers', site: 'St Kilda - Beachside', strataPlan: 'SP89012', status: 'on_track', nextAction: 'Quality check', value: 27900, risk: 'low', scheduledStart: '2026-02-18' },
  { id: 'J-1411', jobNumber: 'J-1411', client: 'Brunswick Homes', site: 'Brunswick - Residential', strataPlan: 'SP90123', status: 'complete', nextAction: 'Archive', value: 16500, risk: 'low', scheduledStart: '2026-01-15' },
  { id: 'J-1412', jobNumber: 'J-1412', client: 'Carlton Strata Ltd', site: 'CBD - Tower 5', strataPlan: 'SP23457', status: 'waiting', nextAction: 'Client signoff', value: 29300, risk: 'medium', scheduledStart: '2026-02-20' },
  { id: 'J-1413', jobNumber: 'J-1413', client: 'Collingwood Group', site: 'Collingwood - Industrial', strataPlan: 'SP01234', status: 'on_track', nextAction: 'Safety audit', value: 21800, risk: 'low', scheduledStart: '2026-02-22' },
  { id: 'J-1414', jobNumber: 'J-1414', client: 'Prahran Estates', site: 'Prahran - Commercial', strataPlan: 'SP11223', status: 'at_risk', nextAction: 'Budget revision', value: 45600, risk: 'high', scheduledStart: '2026-02-11' },
  { id: 'J-1415', jobNumber: 'J-1415', client: 'Hawthorn Residences', site: 'Hawthorn - Luxury Apts', strataPlan: 'SP22334', status: 'on_track', nextAction: 'Milestone 2 start', value: 33400, risk: 'low', scheduledStart: '2026-02-24' },
  { id: 'J-1416', jobNumber: 'J-1416', client: 'Kew Gardens Strata', site: 'Kew - Garden Complex', strataPlan: 'SP33445', status: 'waiting', nextAction: 'Landscape approval', value: 17200, risk: 'medium', scheduledStart: '2026-02-26' },
  { id: 'J-1417', jobNumber: 'J-1417', client: 'Toorak Elite', site: 'Toorak - Prestige Tower', strataPlan: 'SP44556', status: 'on_track', nextAction: 'Materials sourcing', value: 52100, risk: 'medium', scheduledStart: '2026-02-28' },
];

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'on_track', label: 'On Track' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'at_risk', label: 'At Risk' },
  { key: 'complete', label: 'Complete' },
] as const;

export default function JobsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filter and search logic
  const filtered = useMemo(() => {
    let result = seededJobs;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(j => j.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.jobNumber.toLowerCase().includes(q) ||
        j.client.toLowerCase().includes(q) ||
        j.site.toLowerCase().includes(q) ||
        (j.strataPlan && j.strataPlan.toLowerCase().includes(q))
      );
    }

    return result;
  }, [search, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every(j => selected.has(j.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(j => j.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleRowClick = (id: string) => {
    router.push(`/app/jobs/${id}`);
  };

  const statusPill = (status: Job['status']) => {
    const map: Record<Job['status'], { label: string; tone: 'good' | 'neutral' | 'warn' | 'bad' }> = {
      on_track: { label: 'On Track', tone: 'good' },
      waiting: { label: 'Waiting', tone: 'neutral' },
      at_risk: { label: 'At Risk', tone: 'bad' },
      complete: { label: 'Complete', tone: 'good' },
    };
    const { label, tone } = map[status];
    return <Pill tone={tone}>{label}</Pill>;
  };

  const riskBadge = (risk: Job['risk']) => {
    const map: Record<Job['risk'], { label: string; color: string; tooltip: string }> = {
      low: { label: 'Low', color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400', tooltip: 'Low risk - on schedule, no blockers' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400', tooltip: 'Medium risk - minor delays or dependencies' },
      high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400', tooltip: 'High risk - critical blockers or schedule slippage' },
    };
    const { label, color, tooltip } = map[risk];
    return (
      <span className={cx('inline-flex items-center rounded-full px-2 py-1 text-xs font-medium', color)} title={tooltip}>
        {label}
      </span>
    );
  };

  return (
    <PageWrap>
      <PageHeader
        title="Jobs"
        subtitle={`${filtered.length} of ${seededJobs.length} jobs`}
        right={<PrimaryButton onClick={() => router.push('/app/jobs/new')}>New Job</PrimaryButton>}
      />

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border bg-muted/10 px-3 py-2">
          <Search className="h-4 w-4 opacity-60" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search by job number, client, site, strata plan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cx(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                statusFilter === f.key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-foreground/20 bg-background hover:bg-muted/40'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border bg-blue-50 px-4 py-3 dark:bg-blue-950">
          <div className="text-sm font-medium">
            {selected.size} job{selected.size > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Assign team
            </button>
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Update status
            </button>
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Export selected
            </button>
            <button className="rounded-xl border bg-background px-3 py-1.5 text-xs hover:bg-muted/40">
              Send reminders
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

      {/* Jobs Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/20 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">
                  <button onClick={toggleAll} className="inline-flex items-center">
                    {allSelected ? <CheckSquare className="h-4 w-4" /> : someSelected ? <Square className="h-4 w-4 opacity-50" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th className="px-3 py-2 text-left font-semibold">Job Number</th>
                <th className="px-3 py-2 text-left font-semibold">Client</th>
                <th className="px-3 py-2 text-left font-semibold">Site</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Next Action</th>
                <th className="px-3 py-2 text-right font-semibold">Value</th>
                <th className="px-3 py-2 text-center font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="border-t transition-colors hover:bg-muted/30"
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleRow(job.id)} className="inline-flex items-center">
                      {selected.has(job.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="cursor-pointer px-3 py-3 font-medium" onClick={() => handleRowClick(job.id)}>
                    {job.jobNumber}
                  </td>
                  <td className="cursor-pointer px-3 py-3" onClick={() => handleRowClick(job.id)}>
                    {job.client}
                  </td>
                  <td className="cursor-pointer px-3 py-3" onClick={() => handleRowClick(job.id)}>
                    {job.site}
                  </td>
                  <td className="cursor-pointer px-3 py-3" onClick={() => handleRowClick(job.id)}>
                    {statusPill(job.status)}
                  </td>
                  <td className="cursor-pointer px-3 py-3 text-muted-foreground" onClick={() => handleRowClick(job.id)}>
                    {job.nextAction}
                  </td>
                  <td className="cursor-pointer px-3 py-3 text-right font-medium" onClick={() => handleRowClick(job.id)}>
                    ${job.value.toLocaleString()}
                  </td>
                  <td className="cursor-pointer px-3 py-3 text-center" onClick={() => handleRowClick(job.id)}>
                    {riskBadge(job.risk)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/5 py-16">
          <div className="text-6xl opacity-20">📋</div>
          <div className="mt-4 text-lg font-semibold">
            {search.trim() ? 'No jobs found' : 'No jobs yet'}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {search.trim() ? 'Try adjusting your search or filters' : 'Create your first job to get started'}
          </div>
          {!search.trim() && (
            <PrimaryButton onClick={() => router.push('/app/jobs/new')}>
              Create Job
            </PrimaryButton>
          )}
        </div>
      )}
    </PageWrap>
  );
}
