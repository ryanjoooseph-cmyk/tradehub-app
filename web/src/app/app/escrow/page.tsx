'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  GhostButton,
  PageHeader,
  PageWrap,
  Pill,
  PrimaryButton,
  StatGrid,
} from "@/components/app/filled/page";
import { Search, CheckCircle, AlertTriangle, FileText, User, Clock, Shield } from 'lucide-react';

type MilestoneState = 'DRAFT' | 'FUNDED' | 'WORK_SUBMITTED' | 'EVIDENCE_REVIEW' | 'RELEASED' | 'DISPUTED' | 'INSPECTOR_ASSIGNED' | 'RESOLVED';

type Evidence = {
  type: 'photo' | 'checklist' | 'notes';
  url?: string;
  uploadedAt: string;
};

type EscrowMilestone = {
  id: string;
  jobId: string;
  jobTitle: string;
  client: string;
  title: string;
  amount: number;
  state: MilestoneState;
  riskScore: number;
  evidenceRequired: boolean;
  evidenceCount: number;
  evidenceNeeded: number;
  evidence: Evidence[];
  fundedAt: string;
  releasedAt?: string;
  disputeReason?: string;
  disputeOpenedAt?: string;
  inspectorId?: string;
  nextAction: string;
};

// Seeded escrow milestones with state machine
const seededMilestones: EscrowMilestone[] = [
  {
    id: 'MS-001',
    jobId: 'J-1402',
    jobTitle: 'Tower A repaint',
    client: 'Acme Body Corp',
    title: 'Initial deposit',
    amount: 6450,
    state: 'RELEASED',
    riskScore: 1,
    evidenceRequired: false,
    evidenceCount: 0,
    evidenceNeeded: 0,
    evidence: [],
    fundedAt: '2026-01-29',
    releasedAt: '2026-02-01',
    nextAction: 'Completed',
  },
  {
    id: 'MS-002',
    jobId: 'J-1402',
    jobTitle: 'Tower A repaint',
    client: 'Acme Body Corp',
    title: 'Progress claim #1',
    amount: 9450,
    state: 'EVIDENCE_REVIEW',
    riskScore: 2,
    evidenceRequired: true,
    evidenceCount: 2,
    evidenceNeeded: 2,
    evidence: [
      { type: 'photo', url: 'url1', uploadedAt: '2026-02-01' },
      { type: 'photo', url: 'url2', uploadedAt: '2026-02-01' }
    ],
    fundedAt: '2026-01-30',
    nextAction: 'QA Review',
  },
  {
    id: 'MS-003',
    jobId: 'J-1411',
    jobTitle: 'Roof touch-ups',
    client: 'Brunswick Estates',
    title: 'Completion payment',
    amount: 1860,
    state: 'DISPUTED',
    riskScore: 4,
    evidenceRequired: true,
    evidenceCount: 1,
    evidenceNeeded: 5,
    evidence: [{ type: 'photo', url: 'url1', uploadedAt: '2026-01-28' }],
    fundedAt: '2026-01-28',
    disputeReason: 'Quality concerns - incomplete work',
    disputeOpenedAt: '2026-02-01',
    inspectorId: 'INSP-001',
    nextAction: 'Assign Inspector',
  },
  {
    id: 'MS-004',
    jobId: 'J-1403',
    jobTitle: 'CBD Office touch-up',
    client: 'Carlton Strata Ltd',
    title: 'Initial deposit',
    amount: 4870,
    state: 'FUNDED',
    riskScore: 1,
    evidenceRequired: false,
    evidenceCount: 0,
    evidenceNeeded: 0,
    evidence: [],
    fundedAt: '2026-02-01',
    nextAction: 'Work in Progress',
  },
  {
    id: 'MS-005',
    jobId: 'J-1405',
    jobTitle: 'QA Inspection',
    client: 'Docklands Mgmt',
    title: 'Milestone 1',
    amount: 2980,
    state: 'WORK_SUBMITTED',
    riskScore: 3,
    evidenceRequired: true,
    evidenceCount: 4,
    evidenceNeeded: 5,
    evidence: [
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'checklist', uploadedAt: '2026-02-01' },
    ],
    fundedAt: '2026-01-31',
    nextAction: 'Upload 1 more photo',
  },
  {
    id: 'MS-006',
    jobId: 'J-1407',
    jobTitle: 'Balcony sealing',
    client: 'Bayside Strata',
    title: 'Progress claim',
    amount: 8900,
    state: 'FUNDED',
    riskScore: 2,
    evidenceRequired: true,
    evidenceCount: 0,
    evidenceNeeded: 2,
    evidence: [],
    fundedAt: '2026-01-26',
    nextAction: 'Awaiting Evidence',
  },
  {
    id: 'MS-007',
    jobId: 'J-1408',
    jobTitle: 'Heritage restoration',
    client: 'South Yarra Owners',
    title: 'Final payment',
    amount: 12300,
    state: 'EVIDENCE_REVIEW',
    riskScore: 3,
    evidenceRequired: true,
    evidenceCount: 5,
    evidenceNeeded: 5,
    evidence: [
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'photo', uploadedAt: '2026-02-01' },
      { type: 'checklist', uploadedAt: '2026-02-01' },
      { type: 'notes', uploadedAt: '2026-02-01' },
    ],
    fundedAt: '2026-01-30',
    nextAction: 'Ready to Release',
  },
  {
    id: 'MS-008',
    jobId: 'J-1410',
    jobTitle: 'Paint touch-up',
    client: 'Preston Property',
    title: 'Deposit',
    amount: 5600,
    state: 'RELEASED',
    riskScore: 1,
    evidenceRequired: false,
    evidenceCount: 0,
    evidenceNeeded: 0,
    evidence: [],
    fundedAt: '2026-01-25',
    releasedAt: '2026-01-28',
    nextAction: 'Completed',
  },
];

export default function EscrowPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'funds_held' | 'ready_to_release' | 'on_hold' | 'disputes'>('all');

  const filtered = useMemo(() => {
    let result = seededMilestones;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'funds_held') {
        result = result.filter(m => m.state === 'FUNDED');
      } else if (statusFilter === 'ready_to_release') {
        result = result.filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidenceCount >= m.evidenceNeeded);
      } else if (statusFilter === 'on_hold') {
        result = result.filter(m => m.state === 'WORK_SUBMITTED' || m.state === 'FUNDED');
      } else if (statusFilter === 'disputes') {
        result = result.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED');
      }
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.jobId.toLowerCase().includes(q) ||
        m.jobTitle.toLowerCase().includes(q) ||
        m.client.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const fundsHeld = seededMilestones.filter(m => m.state !== 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const readyToRelease = seededMilestones.filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidenceCount >= m.evidenceNeeded).reduce((sum, m) => sum + m.amount, 0);
    const onHold = seededMilestones.filter(m => m.state === 'FUNDED' || m.state === 'WORK_SUBMITTED').reduce((sum, m) => sum + m.amount, 0);
    const disputes = seededMilestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length;
    const releasedCount = seededMilestones.filter(m => m.state === 'RELEASED').length;
    const totalReleased = seededMilestones.filter(m => m.state === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const avgTimeToRelease = 2.4; // Mock average days
    const fundsInDispute = seededMilestones.filter(m => m.state === 'DISPUTED').reduce((sum, m) => sum + m.amount, 0);
    
    return { fundsHeld, readyToRelease, onHold, disputes, releasedCount, totalReleased, avgTimeToRelease, fundsInDispute };
  }, []);

  const releaseQueue = useMemo(() => {
    return seededMilestones
      .filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidenceCount >= m.evidenceNeeded)
      .sort((a, b) => new Date(a.fundedAt).getTime() - new Date(b.fundedAt).getTime());
  }, []);

  const getStateColor = (state: MilestoneState): 'good' | 'warn' | 'bad' | 'neutral' => {
    switch (state) {
      case 'RELEASED':
      case 'RESOLVED':
        return 'good';
      case 'DISPUTED':
      case 'INSPECTOR_ASSIGNED':
        return 'bad';
      case 'EVIDENCE_REVIEW':
      case 'WORK_SUBMITTED':
        return 'warn';
      default:
        return 'neutral';
    }
  };

  const getRiskColor = (score: number): string => {
    if (score <= 1) return 'text-green-600 dark:text-green-400';
    if (score <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getEvidenceStatus = (m: EscrowMilestone): { label: string; color: string } => {
    if (!m.evidenceRequired) return { label: 'Not Required', color: 'text-muted-foreground' };
    if (m.evidenceCount >= m.evidenceNeeded) return { label: 'Complete', color: 'text-green-600 dark:text-green-400' };
    return { label: `${m.evidenceCount}/${m.evidenceNeeded}`, color: 'text-yellow-600 dark:text-yellow-400' };
  };

  const getQuickActions = (m: EscrowMilestone) => {
    switch (m.state) {
      case 'FUNDED':
        return [{ label: 'Track Progress', icon: Clock }];
      case 'WORK_SUBMITTED':
        return [{ label: 'Request Evidence', icon: FileText }];
      case 'EVIDENCE_REVIEW':
        if (m.evidenceCount >= m.evidenceNeeded) {
          return [{ label: 'Release Funds', icon: CheckCircle }];
        }
        return [{ label: 'Mark QA Complete', icon: CheckCircle }];
      case 'DISPUTED':
        return [{ label: 'Assign Inspector', icon: User }, { label: 'View Dispute', icon: AlertTriangle }];
      case 'INSPECTOR_ASSIGNED':
        return [{ label: 'View Report', icon: FileText }];
      case 'RELEASED':
        return [{ label: 'View Receipt', icon: CheckCircle }];
      default:
        return [];
    }
  };

  return (
    <PageWrap>
      <PageHeader
        title="Escrow Operations"
        subtitle="Milestones, releases, disputes — the TradeHub moat."
        right={
          <>
            <GhostButton>Policies</GhostButton>
            <PrimaryButton>New Escrow</PrimaryButton>
          </>
        }
      />

      <StatGrid
        items={[
          { label: "Funds Held", value: `$${(stats.fundsHeld / 1000).toFixed(1)}k`, hint: "Across active jobs" },
          { label: "Ready to Release", value: `$${(stats.readyToRelease / 1000).toFixed(1)}k`, hint: `${releaseQueue.length} milestones` },
          { label: "Avg Time to Release", value: `${stats.avgTimeToRelease}d`, hint: "Trend improving" },
          { label: "In Dispute", value: `$${(stats.fundsInDispute / 1000).toFixed(1)}k`, hint: `${stats.disputes} cases` },
          { label: "Released (30d)", value: `$${(stats.totalReleased / 1000).toFixed(1)}k`, hint: `${stats.releasedCount} milestones` },
          { label: "On Hold", value: `$${(stats.onHold / 1000).toFixed(1)}k`, hint: "Pending evidence" },
        ]}
      />

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border bg-muted/10 px-3 py-2">
          <Search className="h-4 w-4 opacity-60" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search by job, client, milestone, reference…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          {[
            { key: 'all', label: 'All' },
            { key: 'funds_held', label: 'Funds Held' },
            { key: 'ready_to_release', label: 'Ready to Release' },
            { key: 'on_hold', label: 'On Hold' },
            { key: 'disputes', label: 'Disputes' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key as typeof statusFilter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-foreground/20 bg-background hover:bg-muted/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Release Queue - Priority Section */}
      {releaseQueue.length > 0 && (
        <Card title="Release Queue" subtitle={`${releaseQueue.length} milestone${releaseQueue.length > 1 ? 's' : ''} ready for release`}>
          <div className="space-y-3">
            {releaseQueue.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border bg-green-50 p-4 dark:bg-green-950/30">
                <div>
                  <div className="font-semibold">{m.jobId} - {m.title}</div>
                  <div className="text-sm text-muted-foreground">{m.client} • Evidence complete</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold">${m.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Funded {m.fundedAt}</div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Release Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pipeline View */}
      <Card title="Pipeline Overview" subtitle="Milestone states across the escrow workflow">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl border bg-muted/10 p-4">
            <div className="text-xs text-muted-foreground">Funded</div>
            <div className="mt-1 text-2xl font-bold">
              {seededMilestones.filter(m => m.state === 'FUNDED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Work in progress</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-4">
            <div className="text-xs text-muted-foreground">Work Submitted</div>
            <div className="mt-1 text-2xl font-bold">
              {seededMilestones.filter(m => m.state === 'WORK_SUBMITTED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Evidence pending</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-4">
            <div className="text-xs text-muted-foreground">Evidence Review</div>
            <div className="mt-1 text-2xl font-bold">
              {seededMilestones.filter(m => m.state === 'EVIDENCE_REVIEW').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">QA in progress</div>
          </div>
          <div className="rounded-2xl border bg-red-50 p-4 dark:bg-red-950/30">
            <div className="text-xs text-muted-foreground">Disputed</div>
            <div className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              {seededMilestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Needs resolution</div>
          </div>
          <div className="rounded-2xl border bg-green-50 p-4 dark:bg-green-950/30">
            <div className="text-xs text-muted-foreground">Released</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {seededMilestones.filter(m => m.state === 'RELEASED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </Card>

      {/* Main Escrow Table */}
      <Card title="All Escrow Transactions" subtitle={`${filtered.length} of ${seededMilestones.length} milestones`}>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-muted/20 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Client</th>
                  <th className="px-3 py-2 text-left font-semibold">Milestone</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-center font-semibold">Risk</th>
                  <th className="px-3 py-2 text-center font-semibold">Evidence</th>
                  <th className="px-3 py-2 text-left font-semibold">Next Action</th>
                  <th className="px-3 py-2 text-right font-semibold">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const evidenceStatus = getEvidenceStatus(m);
                  const actions = getQuickActions(m);
                  
                  return (
                    <tr key={m.id} className="border-t hover:bg-muted/10">
                      <td className="px-3 py-3">
                        <div className="font-semibold">{m.jobId}</div>
                        <div className="text-xs text-muted-foreground">{m.jobTitle}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{m.client}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{m.title}</div>
                        <div className="text-xs text-muted-foreground">{m.id}</div>
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={getStateColor(m.state)}>
                          {m.state.replace(/_/g, ' ')}
                        </Pill>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-lg font-bold ${getRiskColor(m.riskScore)}`}>
                          {m.riskScore}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-semibold ${evidenceStatus.color}`}>
                          {evidenceStatus.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {m.nextAction}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-semibold">${m.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          {actions.map((action, i) => (
                            <button
                              key={i}
                              className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                              title={action.label}
                            >
                              <action.icon className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/5 py-16">
            <div className="text-6xl opacity-20">🔒</div>
            <div className="mt-4 text-lg font-semibold">No milestones found</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </Card>

      {/* Dispute Cases */}
      {seededMilestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length > 0 && (
        <Card title="Active Disputes" subtitle="Escalated cases requiring resolution">
          <div className="space-y-3">
            {seededMilestones
              .filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED')
              .map((m) => {
                const hoursSinceDispute = m.disputeOpenedAt 
                  ? Math.floor((new Date().getTime() - new Date(m.disputeOpenedAt).getTime()) / (1000 * 60 * 60))
                  : 0;
                const slaRemaining = Math.max(0, 48 - hoursSinceDispute);
                
                return (
                  <div key={m.id} className="rounded-xl border bg-red-50 p-4 dark:bg-red-950/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-semibold">{m.jobId} - {m.title}</span>
                          <Pill tone="bad">{m.state === 'INSPECTOR_ASSIGNED' ? 'Inspector Assigned' : 'Disputed'}</Pill>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Reason:</span> {m.disputeReason || 'Not specified'}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-muted-foreground">Client:</span> {m.client}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className={slaRemaining <= 12 ? 'font-semibold text-red-600' : 'text-muted-foreground'}>
                            SLA: {slaRemaining}h remaining
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${m.amount.toLocaleString()}</div>
                        {m.state === 'DISPUTED' ? (
                          <button className="mt-3 inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
                            <User className="h-4 w-4" />
                            Book Inspector
                          </button>
                        ) : (
                          <button className="mt-3 inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
                            <FileText className="h-4 w-4" />
                            View Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Policy Controls & Evidence Rules */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Evidence Requirements" subtitle="Risk-based gating rules">
          <div className="space-y-3">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Low Risk (Score 0-1)</div>
                  <div className="mt-1 text-xs text-muted-foreground">Buyer approval only</div>
                </div>
                <Pill tone="good">Simple</Pill>
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Medium Risk (Score 2-3)</div>
                  <div className="mt-1 text-xs text-muted-foreground">2 photos + checklist</div>
                </div>
                <Pill tone="warn">Standard</Pill>
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">High Risk (Score 4+)</div>
                  <div className="mt-1 text-xs text-muted-foreground">5 photos + checklist + completion notes</div>
                </div>
                <Pill tone="bad">Strict</Pill>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Release Engine" subtitle="Automated controls + manual overrides">
          <div className="space-y-3">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Evidence gates</div>
                <Pill tone="good">
                  <Shield className="mr-1 h-3 w-3" />
                  Active
                </Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Photo proof + acknowledgement before release
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Dispute window</div>
                <Pill tone="warn">48h</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Hold period before escalation
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Audit trail</div>
                <Pill tone="neutral">Enabled</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Immutable event log for all state changes
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Scoring */}
      <Card title="Risk Scoring Model" subtitle="Automated risk calculation">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">Job value &gt; $10k</div>
            <div className="mt-1 text-lg font-bold">+1</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">New client</div>
            <div className="mt-1 text-lg font-bold">+1</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">New provider</div>
            <div className="mt-1 text-lg font-bold">+1</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">Dispute history</div>
            <div className="mt-1 text-lg font-bold">+2</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">High-risk category</div>
            <div className="mt-1 text-lg font-bold">+1</div>
          </div>
        </div>
      </Card>
    </PageWrap>
  );
}
