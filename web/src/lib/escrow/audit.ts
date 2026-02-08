// Escrow Engine v1 - Audit Event Management

import type { AuditEvent } from './types';

/**
 * Generate a deterministic short hash from a string input
 * (no crypto libs - simple string hash)
 */
export function stableId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to base36 and take first 8 chars
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}

/**
 * Get current ISO timestamp
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Create an audit event with deterministic ID
 */
export function createAuditEvent(
  args: Omit<AuditEvent, 'id' | 'ts'> & { payload?: Record<string, unknown> }
): AuditEvent {
  const ts = nowIso();
  
  // Build deterministic ID from all key fields
  const idInput = [
    args.jobId,
    args.milestoneId,
    args.from,
    args.to,
    args.actor.type,
    args.actor.name,
    args.note || '',
    args.payload ? JSON.stringify(args.payload) : '',
    ts,
  ].join('|');
  
  const id = stableId(idInput);
  
  return {
    id,
    ts,
    jobId: args.jobId,
    milestoneId: args.milestoneId,
    from: args.from,
    to: args.to,
    actor: args.actor,
    note: args.note,
    payload: args.payload,
  };
}
