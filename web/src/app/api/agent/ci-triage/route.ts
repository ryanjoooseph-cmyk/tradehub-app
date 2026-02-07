import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';
import { callLLM } from '../_lib/openai';

type FailedCheck = {
  name: string;
  conclusion: string;
  detailsUrl?: string;
};

type CITriageInput = {
  prUrl: string;
  sha: string;
  repo: string;
  runUrl: string;
  failedChecks: FailedCheck[];
  summary?: string;
};

type Classification = 'LINT' | 'TYPECHECK' | 'BUILD' | 'TEST' | 'DEPLOY' | 'UNKNOWN';

type CITriageOutput = {
  ok: boolean;
  headline: string;
  classification: Classification;
  likelyCause: string;
  commands: string[];
  nextActions: string[];
  notes: string;
};

function classifyCheck(checkName: string): Classification {
  const lower = checkName.toLowerCase();
  
  if (lower.includes('lint') || lower.includes('eslint')) {
    return 'LINT';
  }
  if (lower.includes('typecheck') || lower.includes('tsc') || lower.includes('type-check')) {
    return 'TYPECHECK';
  }
  if (lower.includes('build') || lower.includes('next build')) {
    return 'BUILD';
  }
  if (lower.includes('test') || lower.includes('jest') || lower.includes('playwright') || lower.includes('vitest')) {
    return 'TEST';
  }
  if (lower.includes('deploy') || lower.includes('render') || lower.includes('vercel')) {
    return 'DEPLOY';
  }
  
  return 'UNKNOWN';
}

function getCommands(classification: Classification): string[] {
  const baseCommands = ['pnpm lint', 'pnpm typecheck', 'pnpm build'];
  
  const specificCommands: Record<Classification, string[]> = {
    LINT: ['pnpm lint -- --fix'],
    TYPECHECK: ['pnpm typecheck'],
    BUILD: ['pnpm build'],
    TEST: ['pnpm test'],
    DEPLOY: [],
    UNKNOWN: [],
  };
  
  const specific = specificCommands[classification] || [];
  return [...new Set([...baseCommands, ...specific])];
}

function getNextActions(classification: Classification): string[] {
  const actions: Record<Classification, string[]> = {
    LINT: [
      'Run `pnpm lint -- --fix` locally to auto-fix issues',
      'Review linter errors in the CI logs',
      'Check for unused imports or variables',
    ],
    TYPECHECK: [
      'Run `pnpm typecheck` locally to see type errors',
      'Review type mismatches in the CI logs',
      'Check for missing type definitions',
    ],
    BUILD: [
      'Run `pnpm build` locally to reproduce the error',
      'Check for syntax errors or import issues',
      'Review build logs for specific error messages',
    ],
    TEST: [
      'Run `pnpm test` locally to reproduce failures',
      'Check test logs for assertion failures',
      'Review recent changes that might affect tests',
    ],
    DEPLOY: [
      'Check deployment logs for errors',
      'Verify environment variables are configured',
      'Review deployment configuration',
    ],
    UNKNOWN: [
      'Review CI logs for error messages',
      'Check recent changes for potential issues',
      'Verify all checks are configured correctly',
    ],
  };
  
  return actions[classification] || actions.UNKNOWN;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'ci-triage';

  // Auth check
  const authError = requireAuth(req);
  if (authError) return authError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    let input: CITriageInput;
    
    try {
      input = await req.json();
    } catch {
      logAuditEvent({
        agentName,
        inputHash: 'parse-error',
        outputSummary: 'Invalid JSON input',
        status: 'failure',
        error: 'JSON_PARSE_ERROR',
      });
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON input', code: 'JSON_PARSE_ERROR' },
        { status: 400 }
      );
    }

    const inputHash = hashInput(input);

    // Validate required fields
    if (!input.prUrl || !input.sha || !input.repo || !input.runUrl) {
      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'Missing required fields',
        status: 'failure',
        error: 'VALIDATION_ERROR',
      });
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: prUrl, sha, repo, runUrl', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Handle case with no failing checks
    if (!input.failedChecks || input.failedChecks.length === 0) {
      const output: CITriageOutput = {
        ok: true,
        headline: 'No failing checks detected',
        classification: 'UNKNOWN',
        likelyCause: 'All checks passed successfully',
        commands: ['pnpm lint', 'pnpm typecheck', 'pnpm build'],
        nextActions: ['No action required - all checks passing'],
        notes: 'CI is healthy. All checks are passing.',
      };

      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'No failing checks',
        status: 'success',
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(output);
    }

    // Classify the first failing check (primary issue)
    const primaryCheck = input.failedChecks[0];
    const classification = classifyCheck(primaryCheck.name);

    // Generate headline
    const headline = `${classification} failure detected: ${primaryCheck.name}`;

    // Get deterministic commands and next actions
    const commands = getCommands(classification);
    const nextActions = getNextActions(classification);

    // Use LLM for analysis
    const checkSummary = input.failedChecks
      .map(c => `- ${c.name} (${c.conclusion})`)
      .join('\n');
    
    const llmSystem = 'You are a CI/CD triage assistant. Analyze failing checks and provide a concise likely cause and helpful notes. Keep responses brief (2-3 sentences max).';
    const llmUser = `Classification: ${classification}\nFailing checks:\n${checkSummary}\n${input.summary ? `\nSummary: ${input.summary}` : ''}\n\nProvide likely cause and brief troubleshooting notes.`;
    
    const llmResponse = await callLLM({ system: llmSystem, user: llmUser });

    // Parse LLM response for likelyCause and notes
    // Simple heuristic: first sentence is likely cause, rest is notes
    const sentences = llmResponse.split(/\.\s+/);
    const likelyCause = sentences[0] + (sentences[0].endsWith('.') ? '' : '.');
    const notes = sentences.slice(1).join('. ') || llmResponse;

    const output: CITriageOutput = {
      ok: true,
      headline,
      classification,
      likelyCause,
      commands,
      nextActions,
      notes,
    };

    // Log success
    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Classification: ${classification}, Checks: ${input.failedChecks.length}`,
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
