type AuditLog = {
  timestamp: string;
  agentName: string;
  inputHash: string;
  outputSummary: string;
  status: 'success' | 'failure';
  error?: string;
  durationMs?: number;
};

export function logAuditEvent(log: Omit<AuditLog, 'timestamp'>): void {
  const entry: AuditLog = {
    timestamp: new Date().toISOString(),
    ...log,
  };

  // Write structured JSON log line
  console.log(JSON.stringify({ type: 'AGENT_AUDIT', ...entry }));
}

export function hashInput(input: unknown): string {
  // Simple hash for audit trail (not cryptographic)
  const str = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
