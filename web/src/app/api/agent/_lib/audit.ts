import { promises as fs } from 'fs';
import path from 'path';

export type AuditLog = {
  id: string;
  timestamp: string;
  agentName: string;
  inputHash: string;
  outputSummary: string;
  status: 'success' | 'failure';
  error?: string;
  durationMs?: number;
};

// In-memory storage for audit events (primary store)
const auditStore: AuditLog[] = [];
const MAX_MEMORY_EVENTS = 1000;

// JSONL file path for persistence (fallback/backup)
const AUDIT_LOG_PATH = process.env.AUDIT_LOG_PATH || '/tmp/tradehub-agent-audit.jsonl';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function logAuditEvent(log: Omit<AuditLog, 'timestamp' | 'id'>): void {
  const entry: AuditLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...log,
  };

  // Store in memory (newest first for easy retrieval)
  auditStore.unshift(entry);

  // Trim memory store if it exceeds max size
  if (auditStore.length > MAX_MEMORY_EVENTS) {
    auditStore.pop();
  }

  // Write structured JSON log line to stdout
  console.log(JSON.stringify({ type: 'AGENT_AUDIT', ...entry }));

  // Async append to JSONL file (fire and forget, don't block)
  appendToFile(entry).catch((err) => {
    console.error('[AuditLog] Failed to write to file:', err.message);
  });
}

async function appendToFile(entry: AuditLog): Promise<void> {
  try {
    const line = JSON.stringify(entry) + '\n';
    await fs.appendFile(AUDIT_LOG_PATH, line, 'utf-8');
  } catch (err) {
    // If directory doesn't exist, try to create it
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      const dir = path.dirname(AUDIT_LOG_PATH);
      await fs.mkdir(dir, { recursive: true });
      const line = JSON.stringify(entry) + '\n';
      await fs.appendFile(AUDIT_LOG_PATH, line, 'utf-8');
    } else {
      throw err;
    }
  }
}

export type AuditQueryOptions = {
  agentName?: string;
  status?: 'success' | 'failure';
  since?: Date;
  limit?: number;
};

export function getAuditEvents(options: AuditQueryOptions = {}): AuditLog[] {
  const { agentName, status, since, limit = 100 } = options;

  let filtered = auditStore;

  if (agentName) {
    filtered = filtered.filter((e) => e.agentName === agentName);
  }

  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  if (since) {
    const sinceTime = since.getTime();
    filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= sinceTime);
  }

  return filtered.slice(0, limit);
}

export async function loadAuditEventsFromFile(): Promise<void> {
  try {
    const content = await fs.readFile(AUDIT_LOG_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    // Parse and load into memory (most recent last in file, so reverse)
    const events: AuditLog[] = [];
    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as AuditLog;
        events.push(entry);
      } catch {
        // Skip malformed lines
      }
    }

    // Sort by timestamp descending and take most recent
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Load into memory store (up to max)
    for (const event of events.slice(0, MAX_MEMORY_EVENTS)) {
      if (!auditStore.find((e) => e.id === event.id)) {
        auditStore.push(event);
      }
    }

    // Re-sort memory store
    auditStore.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log(`[AuditLog] Loaded ${events.length} events from file`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[AuditLog] Failed to load from file:', (err as Error).message);
    }
    // ENOENT is fine - file doesn't exist yet
  }
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

// Initialize by attempting to load from file
loadAuditEventsFromFile().catch(() => {
  // Silently ignore - memory store will work regardless
});
