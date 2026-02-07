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
  checks?: Array<{ name: string; status: string }>;
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

    // Analyze checks
    const checks = input.checks || [];
    const allChecksPassed = checks.length === 0 || checks.every(c => c.status === 'success' || c.status === 'completed');

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

    // Build checklist
    const checklist = {
      passed: [] as string[],
      missing: [] as string[],
    };

    if (allChecksPassed) {
      checklist.passed.push('All CI checks passed');
    } else {
      checklist.missing.push('CI checks failing');
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
    const llmUser = `PR: ${input.title || 'Untitled'}\nFiles changed: ${changedFiles.length}\nRisky files: ${hasRiskyChanges ? 'YES' : 'NO'}\nChecks: ${allChecksPassed ? 'PASSED' : 'FAILED'}`;
    
    const llmNotes = await callLLM({ system: llmSystem, user: llmUser });

    // Determine recommendation
    const recommendation: 'APPROVE' | 'BLOCK' = allChecksPassed && risk !== 'HIGH' ? 'APPROVE' : 'BLOCK';

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
