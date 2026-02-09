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
import { Search, CheckCircle, AlertTriangle, FileText, User, Clock, Shield, Play, Upload } from 'lucide-react';
import type { Milestone, MilestoneState, AuditEvent, Actor } from '@/lib/escrow/types';
import { transition } from '@/lib/escrow/stateMachine';
import { calcRiskScore, evidencePolicyForRisk } from '@/lib/escrow/risk';

type Evidence = {
  type: 'photo' | 'checklist' | 'notes';
  url?: string;
  uploadedAt: string;
};

type EscrowMilestone = Milestone & {
  jobTitle: string;
  client: string;
  evidence_items: Evidence[];
  fundedAt: string;
  releasedAt?: string;
  disputeReason?: string;
  disputeOpenedAt?: string;
  inspectorId?: string;
  nextAction: string;
};

// Seeded escrow milestones with state machine
const initialSeededMilestones: EscrowMilestone[] = [
  {
    id: 'MS-001',
    jobId: 'J-1402',
    jobTitle: 'Tower A repaint',
    client: 'Acme Body Corp',
    title: 'Initial deposit',
    amount: 6450,
    state: 'RELEASED',
    risk: { score: 0, level: 'LOW' },
    evidence: { required: false, count: 0, needed: 0 },
    evidence_items: [],
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: true, count: 2, needed: 2 },
    evidence_items: [
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: true, count: 1, needed: 5 },
    evidence_items: [{ type: 'photo', url: 'url1', uploadedAt: '2026-01-28' }],
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: false, count: 0, needed: 0 },
    evidence_items: [],
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: true, count: 4, needed: 5 },
    evidence_items: [
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: true, count: 0, needed: 2 },
    evidence_items: [],
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: true, count: 5, needed: 5 },
    evidence_items: [
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
    risk: { score: 0, level: 'LOW' },
    evidence: { required: false, count: 0, needed: 0 },
    evidence_items: [],
    fundedAt: '2026-01-25',
    releasedAt: '2026-01-28',
    nextAction: 'Completed',
  },
  {
    id: 'MS-009',
    jobId: 'J-1412',
    jobTitle: 'New high-value project',
    client: 'Big Corp Ltd',
    title: 'Initial milestone',
    amount: 18500,
    state: 'DRAFT',
    risk: { score: 30, level: 'MEDIUM' },
    evidence: { required: true, count: 0, needed: 2 },
    evidence_items: [],
    fundedAt: '',
    nextAction: 'Awaiting funding',
  },
];

// Initialize risk on seeded data
function initializeMilestones(): EscrowMilestone[] {
  return initialSeededMilestones.map(m => {
    // Calculate risk using the engine
    const riskFactors = {
      jobValue: m.amount * 3, // proxy for full job value
      isNewClient: false,
      isNewProvider: false,
      disputeHistoryCount: 0,
      isHighRiskCategory: false,
    };
    const riskResult = calcRiskScore(riskFactors);
    const evidencePolicy = evidencePolicyForRisk(riskResult.level);
    
    // For milestones that already have evidence requirements set, keep them
    // For new ones (like DRAFT), use the policy
    const evidence = m.state === 'DRAFT' || !m.evidence.needed
      ? { required: evidencePolicy.required, count: 0, needed: evidencePolicy.needed }
      : m.evidence;
    
    return {
      ...m,
      risk: riskResult,
      evidence,
    };
  });
}

export default function EscrowPage() {
  const [milestones, setMilestones] = useState<EscrowMilestone[]>(initializeMilestones());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'funds_held' | 'ready_to_release' | 'on_hold' | 'disputes'>('all');
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<Set<string>>(new Set());

  const handleTransition = (milestoneId: string, to: MilestoneState, actor: Actor, note?: string, payload?: Record<string, unknown>) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        alert('Milestone not found');
        return;
      }

      const result = transition({ milestone, to, actor, note, payload });
      
      // Update milestones
      setMilestones(prev => prev.map(m => 
        m.id === milestoneId 
          ? { ...m, ...result.milestone }
          : m
      ));
      
      // Prepend audit event (newest first)
      setAuditEvents(prev => [result.event, ...prev]);
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Transition failed');
    }
  };

  const handleAddEvidence = (milestoneId: string) => {
    setMilestones(prev => prev.map(m => 
      m.id === milestoneId && m.evidence.required
        ? { ...m, evidence: { ...m.evidence, count: m.evidence.count + 1 } }
        : m
    ));
  };

  const filtered = useMemo(() => {
    let result = milestones;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'funds_held') {
        result = result.filter(m => m.state === 'FUNDED');
      } else if (statusFilter === 'ready_to_release') {
        result = result.filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidence.count >= m.evidence.needed);
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
  }, [milestones, search, statusFilter]);

  const stats = useMemo(() => {
    const fundsHeld = milestones.filter(m => m.state !== 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const readyToRelease = milestones.filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidence.count >= m.evidence.needed).reduce((sum, m) => sum + m.amount, 0);
    const onHold = milestones.filter(m => m.state === 'FUNDED' || m.state === 'WORK_SUBMITTED').reduce((sum, m) => sum + m.amount, 0);
    const disputes = milestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length;
    const releasedCount = milestones.filter(m => m.state === 'RELEASED').length;
    const totalReleased = milestones.filter(m => m.state === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
    const avgTimeToRelease = 2.4; // Mock average days
    const fundsInDispute = milestones.filter(m => m.state === 'DISPUTED').reduce((sum, m) => sum + m.amount, 0);
    
    return { fundsHeld, readyToRelease, onHold, disputes, releasedCount, totalReleased, avgTimeToRelease, fundsInDispute };
  }, [milestones]);

  const releaseQueue = useMemo(() => {
    return milestones
      .filter(m => m.state === 'EVIDENCE_REVIEW' && m.evidence.count >= m.evidence.needed)
      .sort((a, b) => new Date(a.fundedAt).getTime() - new Date(b.fundedAt).getTime());
  }, [milestones]);

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
    if (score < 25) return 'text-green-600 dark:text-green-400';
    if (score < 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getEvidenceStatus = (m: EscrowMilestone): { label: string; color: string } => {
    if (!m.evidence.required) return { label: 'Not Required', color: 'text-muted-foreground' };
    if (m.evidence.count >= m.evidence.needed) return { label: 'Complete', color: 'text-green-600 dark:text-green-400' };
    return { label: `${m.evidence.count}/${m.evidence.needed}`, color: 'text-yellow-600 dark:text-yellow-400' };
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

      {/* Bulk Operations Toolbar */}
      {selectedMilestoneIds.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 p-4 ring-1 ring-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
              {selectedMilestoneIds.size}
            </div>
            <span className="font-semibold">milestone{selectedMilestoneIds.size > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Bulk release ${selectedMilestoneIds.size} milestone(s). In production, this would validate evidence and release funds.`);
                setSelectedMilestoneIds(new Set());
              }}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Bulk Release
            </button>
            <button
              onClick={() => setSelectedMilestoneIds(new Set())}
              className="rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

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
                  <button 
                    onClick={() => handleTransition(m.id, 'RELEASED', { type: 'BUYER', name: 'Client' }, 'Approved for release')}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
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
              {milestones.filter(m => m.state === 'FUNDED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Work in progress</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-4">
            <div className="text-xs text-muted-foreground">Work Submitted</div>
            <div className="mt-1 text-2xl font-bold">
              {milestones.filter(m => m.state === 'WORK_SUBMITTED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Evidence pending</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-4">
            <div className="text-xs text-muted-foreground">Evidence Review</div>
            <div className="mt-1 text-2xl font-bold">
              {milestones.filter(m => m.state === 'EVIDENCE_REVIEW').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">QA in progress</div>
          </div>
          <div className="rounded-2xl border bg-red-50 p-4 dark:bg-red-950/30">
            <div className="text-xs text-muted-foreground">Disputed</div>
            <div className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              {milestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Needs resolution</div>
          </div>
          <div className="rounded-2xl border bg-green-50 p-4 dark:bg-green-950/30">
            <div className="text-xs text-muted-foreground">Released</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {milestones.filter(m => m.state === 'RELEASED').length}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </Card>

      {/* Main Escrow Table */}
      <Card title="All Escrow Transactions" subtitle={`${filtered.length} of ${milestones.length} milestones`}>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-muted/20 text-xs text-muted-foreground">
                <tr>
                  <th className="w-12 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every(m => selectedMilestoneIds.has(m.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMilestoneIds(new Set(filtered.map(m => m.id)));
                        } else {
                          setSelectedMilestoneIds(new Set());
                        }
                      }}
                      className="h-4 w-4 rounded border-border"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                  <th className="px-3 py-2 text-left font-semibold">Client</th>
                  <th className="px-3 py-2 text-left font-semibold">Milestone</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-center font-semibold">Risk</th>
                  <th className="px-3 py-2 text-center font-semibold">Evidence</th>
                  <th className="px-3 py-2 text-right font-semibold">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const evidenceStatus = getEvidenceStatus(m);
                  const isSelected = selectedMilestoneIds.has(m.id);
                  
                  return (
                    <tr key={m.id} className={`border-t hover:bg-muted/10 ${isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newSet = new Set(selectedMilestoneIds);
                            if (e.target.checked) {
                              newSet.add(m.id);
                            } else {
                              newSet.delete(m.id);
                            }
                            setSelectedMilestoneIds(newSet);
                          }}
                          className="h-4 w-4 rounded border-border"
                        />
                      </td>
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
                        <div className={`text-lg font-bold ${getRiskColor(m.risk.score)}`}>
                          {m.risk.score}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.risk.level}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-semibold ${evidenceStatus.color}`}>
                          {evidenceStatus.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-semibold">${m.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {m.state === 'DRAFT' && (
                            <button
                              onClick={() => handleTransition(m.id, 'FUNDED', { type: 'OPS', name: 'System' }, 'Escrow funded')}
                              className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                              title="Fund Escrow"
                            >
                              <Play className="h-3 w-3" />
                              Fund
                            </button>
                          )}
                          {m.state === 'FUNDED' && (
                            <>
                              <button
                                onClick={() => handleTransition(m.id, 'WORK_SUBMITTED', { type: 'PROVIDER', name: 'Provider' }, 'Work completed')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                                title="Submit Work"
                              >
                                <FileText className="h-3 w-3" />
                                Submit
                              </button>
                              <button
                                onClick={() => handleTransition(m.id, 'DISPUTED', { type: 'BUYER', name: 'Client' }, 'Quality issue raised')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-red-50 px-2 py-1.5 text-xs hover:bg-red-100 dark:bg-red-950/30"
                                title="Dispute"
                              >
                                <AlertTriangle className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {m.state === 'WORK_SUBMITTED' && (
                            <>
                              <button
                                onClick={() => handleTransition(m.id, 'EVIDENCE_REVIEW', { type: 'OPS', name: 'Ops' }, 'QA started')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                                title="Start Review"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Review
                              </button>
                              {m.evidence.required && (
                                <button
                                  onClick={() => handleAddEvidence(m.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border bg-blue-50 px-2 py-1.5 text-xs hover:bg-blue-100 dark:bg-blue-950/30"
                                  title="Add Evidence"
                                >
                                  <Upload className="h-3 w-3" />
                                  +1
                                </button>
                              )}
                              <button
                                onClick={() => handleTransition(m.id, 'DISPUTED', { type: 'BUYER', name: 'Client' }, 'Issue raised')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-red-50 px-2 py-1.5 text-xs hover:bg-red-100 dark:bg-red-950/30"
                                title="Dispute"
                              >
                                <AlertTriangle className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {m.state === 'EVIDENCE_REVIEW' && (
                            <>
                              {m.evidence.required && (
                                <button
                                  onClick={() => handleAddEvidence(m.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border bg-blue-50 px-2 py-1.5 text-xs hover:bg-blue-100 dark:bg-blue-950/30"
                                  title="Add Evidence"
                                >
                                  <Upload className="h-3 w-3" />
                                  +1
                                </button>
                              )}
                              <button
                                onClick={() => handleTransition(m.id, 'RELEASED', { type: 'BUYER', name: 'Client' }, 'QA approved')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-green-50 px-2 py-1.5 text-xs hover:bg-green-100 dark:bg-green-950/30"
                                title="Release Funds"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Release
                              </button>
                              <button
                                onClick={() => handleTransition(m.id, 'DISPUTED', { type: 'BUYER', name: 'Client' }, 'Failed QA')}
                                className="inline-flex items-center gap-1 rounded-lg border bg-red-50 px-2 py-1.5 text-xs hover:bg-red-100 dark:bg-red-950/30"
                                title="Dispute"
                              >
                                <AlertTriangle className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {m.state === 'DISPUTED' && (
                            <button
                              onClick={() => handleTransition(m.id, 'INSPECTOR_ASSIGNED', { type: 'OPS', name: 'Ops' }, 'Inspector assigned', { inspectorId: 'INSP-' + Date.now() })}
                              className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs hover:bg-muted/40"
                              title="Assign Inspector"
                            >
                              <User className="h-3 w-3" />
                              Assign
                            </button>
                          )}
                          {m.state === 'INSPECTOR_ASSIGNED' && (
                            <>
                              <button
                                onClick={() => handleTransition(m.id, 'RESOLVED', { type: 'INSPECTOR', name: 'Inspector' }, 'Approved', { resolution: 'RELEASE_APPROVED' })}
                                className="inline-flex items-center gap-1 rounded-lg border bg-green-50 px-2 py-1.5 text-xs hover:bg-green-100 dark:bg-green-950/30"
                                title="Resolve & Approve"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleTransition(m.id, 'RESOLVED', { type: 'INSPECTOR', name: 'Inspector' }, 'Hold funds', { resolution: 'HOLD' })}
                                className="inline-flex items-center gap-1 rounded-lg border bg-red-50 px-2 py-1.5 text-xs hover:bg-red-100 dark:bg-red-950/30"
                                title="Resolve & Hold"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Hold
                              </button>
                            </>
                          )}
                          {m.state === 'RESOLVED' && (
                            <button
                              onClick={() => handleTransition(m.id, 'RELEASED', { type: 'OPS', name: 'Ops' }, 'Final release', { resolution: 'RELEASE_APPROVED' })}
                              className="inline-flex items-center gap-1 rounded-lg border bg-green-50 px-2 py-1.5 text-xs hover:bg-green-100 dark:bg-green-950/30"
                              title="Release Funds"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Release
                            </button>
                          )}
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

      {/* Audit Timeline */}
      {auditEvents.length > 0 && (
        <Card title="Audit Timeline" subtitle={`${auditEvents.length} state transition${auditEvents.length > 1 ? 's' : ''} recorded`}>
          <div className="space-y-2">
            {auditEvents.map((event) => {
              const milestone = milestones.find(m => m.id === event.milestoneId);
              return (
                <div key={event.id} className="rounded-xl border bg-muted/10 p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">
                        {milestone?.title || event.milestoneId} ({event.jobId})
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">{event.from}</span> → <span className="font-medium">{event.to}</span>
                        {' '} by {event.actor.type} ({event.actor.name})
                      </div>
                      {event.note && (
                        <div className="mt-1 text-xs text-muted-foreground italic">{event.note}</div>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{new Date(event.ts).toLocaleTimeString()}</div>
                      <div>{new Date(event.ts).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Dispute Cases */}
      {milestones.filter(m => m.state === 'DISPUTED' || m.state === 'INSPECTOR_ASSIGNED').length > 0 && (
        <Card title="Active Disputes" subtitle="Escalated cases requiring resolution">
          <div className="space-y-3">
            {milestones
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
                          <button 
                            onClick={() => handleTransition(m.id, 'INSPECTOR_ASSIGNED', { type: 'OPS', name: 'Ops' }, 'Inspector booked', { inspectorId: 'INSP-' + Date.now() })}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
                          >
                            <User className="h-4 w-4" />
                            Book Inspector
                          </button>
                        ) : (
                          <div className="mt-3 space-y-1">
                            <button
                              onClick={() => handleTransition(m.id, 'RESOLVED', { type: 'INSPECTOR', name: 'Inspector' }, 'Inspection complete - approved', { resolution: 'RELEASE_APPROVED' })}
                              className="flex w-full items-center gap-2 rounded-xl border bg-green-50 px-4 py-2 text-sm font-semibold hover:bg-green-100 dark:bg-green-950/30"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve Release
                            </button>
                            <button
                              onClick={() => handleTransition(m.id, 'RESOLVED', { type: 'INSPECTOR', name: 'Inspector' }, 'Inspection complete - hold', { resolution: 'HOLD' })}
                              className="flex w-full items-center gap-2 rounded-xl border bg-red-50 px-4 py-2 text-sm font-semibold hover:bg-red-100 dark:bg-red-950/30"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Hold Funds
                            </button>
                          </div>
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
                  <div className="font-semibold">Low Risk (Score 0-24)</div>
                  <div className="mt-1 text-xs text-muted-foreground">No evidence required</div>
                </div>
                <Pill tone="good">Simple</Pill>
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Medium Risk (Score 25-59)</div>
                  <div className="mt-1 text-xs text-muted-foreground">2 photos required</div>
                </div>
                <Pill tone="warn">Standard</Pill>
              </div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">High Risk (Score 60+)</div>
                  <div className="mt-1 text-xs text-muted-foreground">5 photos + checklist required</div>
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
      <Card title="Risk Scoring Model" subtitle="Automated risk calculation (v1 engine)">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">Job value ≥ $15k</div>
            <div className="mt-1 text-lg font-bold">+30</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">New client</div>
            <div className="mt-1 text-lg font-bold">+15</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">New provider</div>
            <div className="mt-1 text-lg font-bold">+15</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">Dispute history (per)</div>
            <div className="mt-1 text-lg font-bold">+10</div>
          </div>
          <div className="rounded-2xl border bg-muted/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">High-risk category</div>
            <div className="mt-1 text-lg font-bold">+20</div>
          </div>
        </div>
      </Card>
    </PageWrap>
  );
}
