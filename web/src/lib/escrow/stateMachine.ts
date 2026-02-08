// Escrow Engine v1 - State Machine

import type { MilestoneState, Milestone, Actor, AuditEvent } from './types';
import { createAuditEvent } from './audit';

/**
 * Check if a state transition is allowed
 */
export function canTransition(from: MilestoneState, to: MilestoneState): boolean {
  const validTransitions: Record<MilestoneState, MilestoneState[]> = {
    DRAFT: ['FUNDED'],
    FUNDED: ['WORK_SUBMITTED', 'DISPUTED'],
    WORK_SUBMITTED: ['EVIDENCE_REVIEW', 'DISPUTED'],
    EVIDENCE_REVIEW: ['RELEASED', 'DISPUTED'],
    RELEASED: [],
    DISPUTED: ['INSPECTOR_ASSIGNED'],
    INSPECTOR_ASSIGNED: ['RESOLVED'],
    RESOLVED: ['RELEASED'],
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}

/**
 * Execute a state transition with validation and audit trail
 */
export function transition(args: {
  milestone: Milestone;
  to: MilestoneState;
  actor: Actor;
  note?: string;
  payload?: Record<string, unknown>;
}): { milestone: Milestone; event: AuditEvent } {
  const { milestone, to, actor, note, payload } = args;
  const from = milestone.state;
  
  // Validate transition is allowed
  if (!canTransition(from, to)) {
    throw new Error(`Invalid transition: ${from} -> ${to}`);
  }
  
  // Evidence gating check for EVIDENCE_REVIEW -> RELEASED
  if (from === 'EVIDENCE_REVIEW' && to === 'RELEASED') {
    if (milestone.evidence.required && milestone.evidence.count < milestone.evidence.needed) {
      throw new Error('Evidence required before release');
    }
  }
  
  // Special check for RESOLVED -> RELEASED (must have approval in payload)
  if (from === 'RESOLVED' && to === 'RELEASED') {
    if (payload?.resolution !== 'RELEASE_APPROVED') {
      throw new Error('Invalid transition: ${from} -> ${to}');
    }
  }
  
  // Create updated milestone
  const updatedMilestone: Milestone = {
    ...milestone,
    state: to,
  };
  
  // Create audit event
  const event = createAuditEvent({
    jobId: milestone.jobId,
    milestoneId: milestone.id,
    from,
    to,
    actor,
    note,
    payload,
  });
  
  return { milestone: updatedMilestone, event };
}
