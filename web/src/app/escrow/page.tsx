'use client';

import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, X, FileText, Image, ChevronRight, Shield } from 'lucide-react';

type MilestoneStatus = 'pending' | 'funded' | 'in_progress' | 'submitted' | 'approved' | 'released' | 'disputed';

type Milestone = {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  evidenceRequired: number;
  evidenceUploaded: number;
  description: string;
};

type Evidence = {
  id: string;
  milestoneId: string;
  type: 'image' | 'document';
  name: string;
  uploadedAt: string;
  url: string;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  milestone: string;
  action: string;
  actor: string;
  details: string;
};

type Payment = {
  id: string;
  date: string;
  milestone: string;
  amount: number;
  status: 'pending' | 'completed' | 'held';
};

// Seeded data
const seededMilestones: Milestone[] = [
  {
    id: 'MS-001',
    title: 'Initial Deposit',
    amount: 2535,
    status: 'released',
    dueDate: '2026-01-15',
    evidenceRequired: 0,
    evidenceUploaded: 0,
    description: 'Materials procurement and site setup',
  },
  {
    id: 'MS-002',
    title: 'Surface Preparation',
    amount: 2535,
    status: 'submitted',
    dueDate: '2026-01-30',
    evidenceRequired: 3,
    evidenceUploaded: 3,
    description: 'Facade repair and surface prep complete',
  },
  {
    id: 'MS-003',
    title: 'Final Completion',
    amount: 3380,
    status: 'in_progress',
    dueDate: '2026-02-15',
    evidenceRequired: 5,
    evidenceUploaded: 2,
    description: 'Painting complete, QA inspection passed',
  },
];

const seededEvidence: Evidence[] = [
  { id: 'E-001', milestoneId: 'MS-002', type: 'image', name: 'Surface prep - North wall.jpg', uploadedAt: '2026-01-28 14:30', url: '#' },
  { id: 'E-002', milestoneId: 'MS-002', type: 'image', name: 'Surface prep - East wall.jpg', uploadedAt: '2026-01-28 14:35', url: '#' },
  { id: 'E-003', milestoneId: 'MS-002', type: 'document', name: 'Inspection checklist.pdf', uploadedAt: '2026-01-28 15:00', url: '#' },
  { id: 'E-004', milestoneId: 'MS-003', type: 'image', name: 'Progress photo 1.jpg', uploadedAt: '2026-02-05 10:15', url: '#' },
  { id: 'E-005', milestoneId: 'MS-003', type: 'image', name: 'Progress photo 2.jpg', uploadedAt: '2026-02-05 10:20', url: '#' },
];

const seededAuditEvents: AuditEvent[] = [
  { id: 'A-001', timestamp: '2026-01-10 09:00', milestone: 'MS-001', action: 'Escrow funded', actor: 'Client', details: 'Initial deposit funded via credit card' },
  { id: 'A-002', timestamp: '2026-01-12 14:30', milestone: 'MS-001', action: 'Milestone released', actor: 'Client', details: 'Materials delivered, work commenced' },
  { id: 'A-003', timestamp: '2026-01-28 15:30', milestone: 'MS-002', action: 'Work submitted', actor: 'Provider', details: 'Surface prep complete, evidence uploaded' },
  { id: 'A-004', timestamp: '2026-02-05 10:30', milestone: 'MS-003', action: 'Evidence uploaded', actor: 'Provider', details: '2 photos added for final completion' },
];

const seededPayments: Payment[] = [
  { id: 'P-001', date: '2026-01-10', milestone: 'MS-001', amount: 2535, status: 'completed' },
  { id: 'P-002', date: '2026-01-28', milestone: 'MS-002', amount: 2535, status: 'held' },
  { id: 'P-003', date: '2026-02-15', milestone: 'MS-003', amount: 3380, status: 'pending' },
];

export default function BuyerEscrowPage() {
  const [milestones] = useState<Milestone[]>(seededMilestones);
  const [evidence] = useState<Evidence[]>(seededEvidence);
  const [auditEvents] = useState<AuditEvent[]>(seededAuditEvents);
  const [payments] = useState<Payment[]>(seededPayments);
  
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedAmount = milestones.filter(m => m.status === 'released').reduce((sum, m) => sum + m.amount, 0);
  const heldAmount = milestones.filter(m => m.status !== 'released' && m.status !== 'pending').reduce((sum, m) => sum + m.amount, 0);

  const getStatusColor = (status: MilestoneStatus) => {
    switch (status) {
      case 'released': return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/30 dark:text-green-400';
      case 'submitted': return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/30 dark:text-blue-400';
      case 'in_progress': return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400';
      case 'disputed': return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: MilestoneStatus) => {
    switch (status) {
      case 'released': return 'Released';
      case 'submitted': return 'Awaiting Approval';
      case 'in_progress': return 'In Progress';
      case 'disputed': return 'Disputed';
      default: return 'Pending';
    }
  };

  const handleApproveMilestone = (milestone: Milestone) => {
    alert(`Milestone ${milestone.id} approved! In production, this would release $${milestone.amount.toLocaleString()} to the provider.`);
  };

  const handleDisputeMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = () => {
    if (!disputeReason.trim()) {
      alert('Please provide a reason for the dispute.');
      return;
    }
    alert(`Dispute submitted for ${selectedMilestone?.id}. An inspector will be assigned within 24 hours.`);
    setShowDisputeModal(false);
    setDisputeReason('');
    setSelectedMilestone(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Escrow Portal</h1>
              <p className="mt-2 text-muted-foreground">
                Track milestones, approve work, and manage payments securely
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-green-50 px-4 py-2 dark:bg-green-950/30">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-400">Protected</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-background p-4">
              <div className="text-sm text-muted-foreground">Total Escrow</div>
              <div className="mt-1 text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">{milestones.length} milestones</div>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="text-sm text-muted-foreground">Released</div>
              <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">${releasedAmount.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">Paid to provider</div>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="text-sm text-muted-foreground">Held Securely</div>
              <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">${heldAmount.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">Pending work completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Milestones */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Milestones</h2>
              <p className="text-sm text-muted-foreground">Review work and approve payments</p>
            </div>

            {milestones.map((milestone) => {
              const milestoneEvidence = evidence.filter(e => e.milestoneId === milestone.id);
              const canApprove = milestone.status === 'submitted' && milestone.evidenceUploaded >= milestone.evidenceRequired;

              return (
                <div key={milestone.id} className="rounded-2xl border bg-card p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold">{milestone.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusColor(milestone.status)}`}>
                          {getStatusLabel(milestone.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due {milestone.dueDate}
                        </div>
                        <div className="font-mono">{milestone.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${milestone.amount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Evidence Progress */}
                  {milestone.evidenceRequired > 0 && (
                    <div className="mt-4 rounded-xl bg-muted/50 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">Evidence Required</span>
                        <span className={milestone.evidenceUploaded >= milestone.evidenceRequired ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                          {milestone.evidenceUploaded} / {milestone.evidenceRequired}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className={`h-full transition-all ${milestone.evidenceUploaded >= milestone.evidenceRequired ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, (milestone.evidenceUploaded / milestone.evidenceRequired) * 100)}%` }}
                        />
                      </div>

                      {/* Evidence Gallery */}
                      {milestoneEvidence.length > 0 && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          {milestoneEvidence.map((ev) => (
                            <div key={ev.id} className="flex items-center gap-2 rounded-lg border bg-background p-2 text-xs">
                              {ev.type === 'image' ? (
                                <Image className="h-4 w-4 text-muted-foreground" aria-label="Image file" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">{ev.name}</div>
                                <div className="text-muted-foreground">{ev.uploadedAt}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {canApprove && (
                      <button
                        onClick={() => handleApproveMilestone(milestone)}
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve & Release ${milestone.amount.toLocaleString()}
                      </button>
                    )}
                    {(milestone.status === 'submitted' || milestone.status === 'in_progress') && (
                      <button
                        onClick={() => handleDisputeMilestone(milestone)}
                        className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Dispute
                      </button>
                    )}
                    {milestone.status === 'released' && (
                      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Payment Released
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Payment History */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold">Payment History</h3>
              <div className="mt-4 space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <div className="text-sm font-semibold">{payment.milestone}</div>
                      <div className="text-xs text-muted-foreground">{payment.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${payment.amount.toLocaleString()}</div>
                      <span className={`text-xs ${
                        payment.status === 'completed' ? 'text-green-600' :
                        payment.status === 'held' ? 'text-blue-600' :
                        'text-muted-foreground'
                      }`}>
                        {payment.status === 'completed' ? 'Released' : payment.status === 'held' ? 'Held' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold">Activity Timeline</h3>
              <div className="mt-4 space-y-4">
                {auditEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < auditEvents.length - 1 && (
                      <div className="absolute left-2 top-6 h-full w-px bg-border" />
                    )}
                    <div className="flex gap-3">
                      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{event.action}</div>
                        <div className="text-xs text-muted-foreground">{event.details}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.milestone}</span>
                          <span>•</span>
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <h3 className="font-bold">Escrow Protection</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Funds held securely until work approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Review evidence before releasing payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Dispute resolution with inspector support</span>
                </li>
              </ul>
              <button className="mt-4 flex w-full items-center justify-between rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
                <span>Contact Support</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Raise Dispute</h3>
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason('');
                  setSelectedMilestone(null);
                }}
                className="rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-muted/50 p-4">
              <div className="text-sm font-semibold">Milestone: {selectedMilestone.title}</div>
              <div className="text-sm text-muted-foreground">Amount: ${selectedMilestone.amount.toLocaleString()}</div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold">Reason for Dispute</label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Please describe the issue with the work completed..."
                className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                rows={4}
              />
            </div>

            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
              <div className="font-semibold text-amber-900 dark:text-amber-100">What happens next?</div>
              <ul className="mt-2 space-y-1 text-amber-800 dark:text-amber-200">
                <li>• Funds will be held until resolution</li>
                <li>• An inspector will be assigned within 24 hours</li>
                <li>• You&apos;ll receive updates via email and in-app</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason('');
                  setSelectedMilestone(null);
                }}
                className="flex-1 rounded-xl border bg-background px-4 py-2 font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDispute}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
