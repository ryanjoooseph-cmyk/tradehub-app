// Escrow Engine v1 - Core Types

export type MilestoneState =
  | 'DRAFT'
  | 'FUNDED'
  | 'WORK_SUBMITTED'
  | 'EVIDENCE_REVIEW'
  | 'RELEASED'
  | 'DISPUTED'
  | 'INSPECTOR_ASSIGNED'
  | 'RESOLVED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Actor = {
  type: 'BUYER' | 'PROVIDER' | 'OPS' | 'INSPECTOR';
  name: string;
};

export type EvidencePolicy = {
  required: boolean;
  needed: number;
};

export type Milestone = {
  id: string;
  jobId: string;
  title: string;
  amount: number;
  dueDate?: string;
  state: MilestoneState;
  evidence: {
    required: boolean;
    count: number;
    needed: number;
  };
  risk: {
    score: number;
    level: RiskLevel;
  };
};

export type AuditEvent = {
  id: string;
  ts: string;
  jobId: string;
  milestoneId: string;
  from: MilestoneState;
  to: MilestoneState;
  actor: Actor;
  note?: string;
  payload?: Record<string, unknown>;
};
