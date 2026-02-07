import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';
import { callLLM } from '../_lib/openai';

type ReleaseManagerInput = {
  prUrl: string;
  title?: string;
  body?: string;
  changedFiles?: string[];
  checks?: Array<{ name: string; status: string }> | Record<string, boolean> | unknown;
};

type ReleaseManagerOutput = {
  ok: boolean;
  recommendation: 'APPROVE' | 'BLOCK';
  risk: 'LOW' | 'MED' | 'HIGH';
  checklist: {
    passed: string[];
    missing: string[];
  };
  notes: string;
  changelog: string[];
};

const RISKY_FILES = [
  'app/layout.tsx',
  'web/src/app/layout.tsx',
  'AppShell.tsx',
  'auth',
  'payment',
  'escrow',
  'supabase',
  'middleware',
];

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'release-manager';

  const authError = requireAuth(req);
  if (authError) return authError;

  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    const input: ReleaseManagerInput = await req.json();
    const inputHash = hashInput(input);

    if (!input.prUrl) {
      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'Invalid input - missing prUrl',
        status: 'failure',
        error: 'VALIDATION_ERROR',
      });
      return NextResponse.json(
        { ok: false, error: 'Missing required field: prUrl', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // STRICT normalize checks (NEVER treat missing as passed)
    let checks: Array<{ name: string; status: string }> = [];
    const raw = input.checks;

    const toStr = (v: unknown): string => {
      if (typeof v === 'string') return v;
      if (v === null || v === undefined) return '';
      return String(v);
    };

    if (Array.isArray(raw)) {
      checks = raw
        .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === 'object')
        .map((c) => ({
          name: toStr(c.name),
          status: toStr(c.status),
        }))
        .filter((c) => c.name.length > 0);
    } else if (raw && typeof raw === 'object') {
      // { lint: true, build: false } format
      checks = Object.entries(raw as Record<string, unknown>).map(([name, passed]) => ({
        name,
        status: passed === true ? 'success' : 'failure',
      }));
    } else {
      // string / null / undefined => unknown
      checks = [];
    }

    const hasChecks = checks.length > 0;
    const allChecksPassed = hasChecks && checks.every((c) => c.status === 'success');

    const webBuild = checks.find((c) => c.name.toLowerCase().includes('web-build'));
    const hasWebBuild = Boolean(webBuild);
    const webBuildPassed = webBuild?.status === 'success';

    const changedFiles = input.changedFiles || [];
    const hasRiskyChanges = changedFiles.some((file) => RISKY_FILES.some((r) => file.includes(r)));

    let risk: 'LOW' | 'MED' | 'HIGH' = 'LOW';
    if (hasRiskyChanges) risk = 'HIGH';
    else if (changedFiles.length > 5) risk = 'MED';

    const checklist = { passed: [] as string[], missing: [] as string[] };

    if (!hasChecks) checklist.missing.push('CI checks unknown (no completed checks found)');
    else if (!allChecksPassed) checklist.missing.push('CI checks failing');
    else checklist.passed.push('All CI checks passed');

    if (!hasWebBuild) checklist.missing.push('web-build check missing');
    else if (!webBuildPassed) checklist.missing.push('web-build failing');
    else checklist.passed.push('web-build passed');

    if (input.body && input.body.includes('- [x]')) checklist.passed.push('Checklist items marked complete');
    else if (input.body && input.body.includes('- [ ]')) checklist.missing.push('Checklist items incomplete');

    if (changedFiles.length > 0) checklist.passed.push(`${changedFiles.length} file(s) changed`);

    const changelog: string[] = [];
    if (input.body) {
      for (const line of input.body.split('\n')) {
        const t = line.trim();
        if (t.startsWith('-') || t.startsWith('*')) {
          const cleaned = t.replace(/^[-*]\s*/, '').replace(/\[x\]\s*/i, '').replace(/\[\s\]\s*/, '');
          if (cleaned && cleaned.length > 10) changelog.push(cleaned);
        }
      }
    }
    if (changelog.length === 0 && changedFiles.length > 0) {
      changedFiles.slice(0, 5).forEach((f) => changelog.push(`Modified: ${f}`));
      if (changedFiles.length > 5) changelog.push(`... and ${changedFiles.length - 5} more file(s)`);
    }

    const llmSystem = 'You are a PR review assistant. Be brief. If CI is unknown or failing, say so.';
    const llmUser =
      `PR: ${input.title || 'Untitled'}\n` +
      `Files changed: ${changedFiles.length}\n` +
      `Risky files: ${hasRiskyChanges ? 'YES' : 'NO'}\n` +
      `Checks present: ${hasChecks ? 'YES' : 'NO'}\n` +
      `All checks passed: ${allChecksPassed ? 'YES' : 'NO'}\n` +
      `web-build present: ${hasWebBuild ? 'YES' : 'NO'}\n` +
      `web-build passed: ${webBuildPassed ? 'YES' : 'NO'}`;

    const llmNotes = await callLLM({ system: llmSystem, user: llmUser });

    const recommendation: 'APPROVE' | 'BLOCK' =
      allChecksPassed && webBuildPassed && risk !== 'HIGH' ? 'APPROVE' : 'BLOCK';

    const output: ReleaseManagerOutput = {
      ok: true,
      recommendation,
      risk,
      checklist,
      notes: llmNotes,
      changelog: changelog.slice(0, 10),
    };

    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Recommendation: ${recommendation}, Risk: ${risk}`,
      status: 'success',
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(output);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logAuditEvent({
      agentName,
      inputHash: 'error',
      outputSummary: 'Agent execution failed',
      status: 'failure',
      error: errorMessage,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ ok: false, error: errorMessage, code: 'AGENT_ERROR' }, { status: 500 });
  }
}
