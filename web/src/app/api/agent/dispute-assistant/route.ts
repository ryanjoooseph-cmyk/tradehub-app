import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';
import { callLLM } from '../_lib/openai';

type Evidence = {
  type: string;
  url: string;
  notes: string;
};

type DisputeContext = {
  jobSummary: string;
  milestoneSummary: string;
  amount: number;
};

type DisputeAssistantInput = {
  disputeId: string;
  jobId: string;
  milestoneId: string;
  clientEvidence: Evidence[];
  providerEvidence: Evidence[];
  context: DisputeContext;
};

type RecommendationOption = 'FULL_RELEASE' | 'FULL_REFUND' | 'PARTIAL_RELEASE';

type Recommendation = {
  option: RecommendationOption;
  suggestedAmount: number | null;
  rationale: string;
};

type DisputeAssistantOutput = {
  ok: true;
  summary: {
    clientCase: string;
    providerCase: string;
    missingEvidence: string[];
  };
  recommendations: Recommendation[];
  warnings: string[];
};

function validateInput(input: unknown): input is DisputeAssistantInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;

  if (typeof obj.disputeId !== 'string' || !obj.disputeId) return false;
  if (typeof obj.jobId !== 'string' || !obj.jobId) return false;
  if (typeof obj.milestoneId !== 'string' || !obj.milestoneId) return false;

  if (!Array.isArray(obj.clientEvidence)) return false;
  if (!Array.isArray(obj.providerEvidence)) return false;

  if (!obj.context || typeof obj.context !== 'object') return false;
  const ctx = obj.context as Record<string, unknown>;
  if (typeof ctx.jobSummary !== 'string') return false;
  if (typeof ctx.milestoneSummary !== 'string') return false;
  if (typeof ctx.amount !== 'number') return false;

  return true;
}

function analyzeEvidence(evidence: Evidence[]): { summary: string; missing: string[] } {
  if (evidence.length === 0) {
    return { summary: 'No evidence provided', missing: ['No documentation submitted'] };
  }

  const types = evidence.map(e => e.type);
  const hasScreenshots = types.some(t => t.toLowerCase().includes('screenshot'));
  const hasMessages = types.some(t => t.toLowerCase().includes('message') || t.toLowerCase().includes('chat'));
  const hasDeliverables = types.some(t => t.toLowerCase().includes('deliverable') || t.toLowerCase().includes('file'));

  const missing: string[] = [];
  if (!hasScreenshots) missing.push('Screenshots of issue');
  if (!hasMessages) missing.push('Communication history');
  if (!hasDeliverables) missing.push('Deliverable files or samples');

  const summary = evidence.map(e => `${e.type}: ${e.notes || 'No notes'}`).join('; ');
  return { summary: summary || 'Evidence provided but no details', missing };
}

function generateDeterministicRecommendations(
  clientEvidence: Evidence[],
  providerEvidence: Evidence[],
  amount: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // If provider has more evidence, lean toward release
  if (providerEvidence.length > clientEvidence.length) {
    recommendations.push({
      option: 'FULL_RELEASE',
      suggestedAmount: amount,
      rationale: 'Provider has submitted more documentation supporting work completion.',
    });
    recommendations.push({
      option: 'PARTIAL_RELEASE',
      suggestedAmount: Math.round(amount * 0.75),
      rationale: 'Partial release may be appropriate if some concerns remain.',
    });
  }
  // If client has more evidence, lean toward refund
  else if (clientEvidence.length > providerEvidence.length) {
    recommendations.push({
      option: 'FULL_REFUND',
      suggestedAmount: amount,
      rationale: 'Client has submitted more documentation supporting their concerns.',
    });
    recommendations.push({
      option: 'PARTIAL_RELEASE',
      suggestedAmount: Math.round(amount * 0.25),
      rationale: 'Partial release may compensate provider for work completed.',
    });
  }
  // Balanced evidence
  else {
    recommendations.push({
      option: 'PARTIAL_RELEASE',
      suggestedAmount: Math.round(amount * 0.5),
      rationale: 'Both parties have submitted comparable evidence; 50/50 split may be fair.',
    });
    recommendations.push({
      option: 'FULL_RELEASE',
      suggestedAmount: amount,
      rationale: 'Consider if deliverables meet original requirements.',
    });
    recommendations.push({
      option: 'FULL_REFUND',
      suggestedAmount: amount,
      rationale: 'Consider if work substantially fails to meet requirements.',
    });
  }

  return recommendations;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'dispute-assistant';

  // Auth check
  const authError = requireAuth(req);
  if (authError) return authError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    let input: unknown;

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

    // Validate input schema
    if (!validateInput(input)) {
      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'Invalid input schema',
        status: 'failure',
        error: 'VALIDATION_ERROR',
      });
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid input schema. Required: disputeId, jobId, milestoneId, clientEvidence[], providerEvidence[], context{jobSummary, milestoneSummary, amount}',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Analyze evidence from both parties
    const clientAnalysis = analyzeEvidence(input.clientEvidence);
    const providerAnalysis = analyzeEvidence(input.providerEvidence);

    // Combine missing evidence
    const allMissing = [
      ...clientAnalysis.missing.map(m => `Client: ${m}`),
      ...providerAnalysis.missing.map(m => `Provider: ${m}`),
    ];

    // Try to get LLM-enhanced analysis
    let clientCase = clientAnalysis.summary;
    let providerCase = providerAnalysis.summary;

    const llmSystem = `You are a dispute resolution assistant. Analyze evidence summaries and provide brief, neutral case summaries. Be objective and factual. Keep each summary to 1-2 sentences.`;
    const llmUser = `Dispute for job ${input.jobId}, milestone ${input.milestoneId}.
Amount: $${input.context.amount}
Job: ${input.context.jobSummary}
Milestone: ${input.context.milestoneSummary}

Client evidence (${input.clientEvidence.length} items): ${clientAnalysis.summary}
Provider evidence (${input.providerEvidence.length} items): ${providerAnalysis.summary}

Provide a brief neutral summary of each party's case.`;

    const llmResponse = await callLLM({ system: llmSystem, user: llmUser });

    // Parse LLM response if available
    if (llmResponse && !llmResponse.includes('Manual review recommended')) {
      const lines = llmResponse.split('\n').filter(l => l.trim());
      if (lines.length >= 2) {
        clientCase = lines[0].replace(/^client[:\s]*/i, '').trim() || clientCase;
        providerCase = lines[1].replace(/^provider[:\s]*/i, '').trim() || providerCase;
      }
    }

    // Generate recommendations
    const recommendations = generateDeterministicRecommendations(
      input.clientEvidence,
      input.providerEvidence,
      input.context.amount
    );

    // Build output with mandatory human decision warning
    const output: DisputeAssistantOutput = {
      ok: true,
      summary: {
        clientCase,
        providerCase,
        missingEvidence: allMissing.length > 0 ? allMissing : ['None - both parties provided documentation'],
      },
      recommendations,
      warnings: [
        'Human decision required - this is advisory analysis only.',
        'Review all evidence before making a final determination.',
        'Consider requesting additional documentation if evidence is incomplete.',
      ],
    };

    // Log success
    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Dispute ${input.disputeId}: ${recommendations.length} recommendations, ${allMissing.length} missing items`,
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
