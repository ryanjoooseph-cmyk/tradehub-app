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
  checks?: Array<{ name: string; status: string }> | Record<string, boolean>;
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

  // Auth check
  const authError = requireAuth(req);
  if (authError) return authError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    const input: ReleaseManagerInput = await req.json();
    const inputHash = hashInput(input);

    // Validate input
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

    // Normalize checks into array format - STRICT
    let checks: Array<{ name: string; status: string }> = [];
    let checksUnknown = false;
    
    if (!input.checks) {
      // No checks provided at all - treat as UNKNOWN
      checksUnknown = true;
    } else if (typeof input.checks === 'string') {
      // String input - do not parse, treat as UNKNOWN
      checksUnknown = true;
    } else if (Array.isArray(input.checks)) {
      // Array format: use items as {name, status} after string coercion
      checks = input.checks.map(c => ({
        name: String(c.name || ''),
        status: String(c.status || ''),
      }));
    } else if (typeof input.checks === 'object') {
      // Object format: convert { lint: true, build: false } to array
      checks = Object.entries(input.checks).map(([name, passed]) => ({
        name,
        status: passed ? 'success' : 'failure',
      }));
    } else {
      // Unknown format - treat as UNKNOWN
      checksUnknown = true;
    }

    // Analyze checks STRICTLY
    const hasChecks = !checksUnknown && checks.length > 0;
    const allChecksPassed = hasChecks && checks.every(c => c.status === 'success');
    
    // Find web-build check specifically (case-insensitive)
    const webBuildCheck = hasChecks 
      ? checks.find(c => c.name.toLowerCase().includes('web-build'))
      : null;
    const webBuildPassed = webBuildCheck?.status === 'success';
    const webBuildExists = !!webBuildCheck;

    // Analyze changed files for risk
    const changedFiles = input.changedFiles || [];
    const hasRiskyChanges = changedFiles.some(file =>
      RISKY_FILES.some(risky => file.includes(risky))
    );

    // Determine risk level
    let risk: 'LOW' | 'MED' | 'HIGH' = 'LOW';
    if (hasRiskyChanges) {
      risk = 'HIGH';
    } else if (changedFiles.length > 5) {
      risk = 'MED';
    }

    // Build checklist - STRICT
    const checklist = {
      passed: [] as string[],
      missing: [] as string[],
    };

    // Check status
    if (checksUnknown || !hasChecks) {
      checklist.missing.push('CI checks unknown (no completed checks found)');
    } else if (!allChecksPassed) {
      checklist.missing.push('CI checks failing');
    } else {
      checklist.passed.push('All CI checks passed');
    }

    // web-build specific check
    if (!webBuildExists) {
      checklist.missing.push('web-build check missing');
    } else if (!webBuildPassed) {
      checklist.missing.push('web-build failing');
    } else {
      checklist.passed.push('web-build passed');
    }

    if (input.body && input.body.includes('- [x]')) {
      checklist.passed.push('Checklist items marked complete');
    } else if (input.body && input.body.includes('- [ ]')) {
      checklist.missing.push('Checklist items incomplete');
    }

    if (changedFiles.length > 0) {
      checklist.passed.push(`${changedFiles.length} file(s) changed`);
    }

    // Generate changelog from body or files
    const changelog: string[] = [];
    if (input.body) {
      const lines = input.body.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          const cleaned = line.trim().replace(/^[-*]\s*/, '').replace(/\[x\]\s*/i, '').replace(/\[\s\]\s*/, '');
          if (cleaned && cleaned.length > 10) {
            changelog.push(cleaned);
          }
        }
      }
    }
    
    if (changelog.length === 0 && changedFiles.length > 0) {
      changedFiles.slice(0, 5).forEach(file => {
        changelog.push(`Modified: ${file}`);
      });
      if (changedFiles.length > 5) {
        changelog.push(`... and ${changedFiles.length - 5} more file(s)`);
      }
    }

    // Call LLM for analysis
    const llmSystem = 'You are a PR review assistant. Analyze the PR and provide a brief risk assessment and recommendations.';
    const llmUser = `PR: ${input.title || 'Untitled'}\nFiles changed: ${changedFiles.length}\nRisky files: ${hasRiskyChanges ? 'YES' : 'NO'}\nChecks: ${allChecksPassed ? 'PASSED' : 'FAILED'}\nweb-build: ${webBuildPassed ? 'PASSED' : 'FAILED/MISSING'}`;
    
    const llmNotes = await callLLM({ system: llmSystem, user: llmUser });

    // Determine recommendation - STRICT
    // Only APPROVE if:
    // (a) checks array exists AND every check has status === "success"
    // (b) there is a check whose name includes "web-build" AND its status === "success"
    // (c) risk !== "HIGH"
    const recommendation: 'APPROVE' | 'BLOCK' = 
      hasChecks && allChecksPassed && webBuildExists && webBuildPassed && risk !== 'HIGH'
        ? 'APPROVE'
        : 'BLOCK';

    const output: ReleaseManagerOutput = {
      ok: true,
      recommendation,
      risk,
      checklist,
      notes: llmNotes,
      changelog: changelog.slice(0, 10),
    };

    // Log success
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

    return NextResponse.json(
      { ok: false, error: errorMessage, code: 'AGENT_ERROR' },
      { status: 500 }
    );
  }
}
