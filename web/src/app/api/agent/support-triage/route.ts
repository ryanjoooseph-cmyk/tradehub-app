import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';

type SupportTriageInput = {
  issueUrl: string;
  issueNumber: number;
  title: string;
  body?: string;
  labels?: string[];
  commenter?: string;
  commentBody?: string;
};

type Priority = 'P0' | 'P1' | 'P2' | 'P3';
type Category = 'BUG' | 'UX' | 'BILLING' | 'ESCROW' | 'MARKETPLACE' | 'PERFORMANCE' | 'OTHER';

type SupportTriageOutput = {
  ok: boolean;
  priority: Priority;
  category: Category;
  summary: string;
  nextActions: string[];
  suggestedReply: string;
};

// Keywords for category detection
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  BUG: ['bug', 'error', 'crash', 'broken', 'not working', 'fails', 'exception', 'traceback', 'stack trace'],
  UX: ['ux', 'ui', 'design', 'confusing', 'usability', 'interface', 'layout', 'hard to use', 'difficult to'],
  BILLING: ['billing', 'invoice', 'payment', 'charge', 'subscription', 'refund', 'price', 'cost'],
  ESCROW: ['escrow', 'milestone', 'release', 'funds', 'hold', 'dispute', 'evidence'],
  MARKETPLACE: ['marketplace', 'job posting', 'quote', 'provider', 'contractor', 'bid'],
  PERFORMANCE: ['slow', 'performance', 'lag', 'timeout', 'takes too long', 'loading', 'speed'],
  OTHER: [],
};

// Priority indicators
const PRIORITY_INDICATORS = {
  P0: ['down', 'critical', 'production down', 'can\'t access', 'lost data', 'security'],
  P1: ['urgent', 'blocking', 'major', 'affecting many', 'revenue impact'],
  P2: ['minor', 'moderate', 'some users', 'workaround exists'],
  P3: ['enhancement', 'feature request', 'nice to have', 'low priority'],
};

function detectCategory(text: string): Category {
  const lowerText = text.toLowerCase();
  
  // Check each category for keyword matches
  const categoryScores: Partial<Record<Category, number>> = {};
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'OTHER') continue;
    
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > 0) {
      categoryScores[category as Category] = score;
    }
  }
  
  // Return category with highest score, or OTHER if no matches
  if (Object.keys(categoryScores).length === 0) {
    return 'OTHER';
  }
  
  const sortedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  return sortedCategories[0][0] as Category;
}

function detectPriority(text: string): Priority {
  const lowerText = text.toLowerCase();
  
  // Check for priority indicators in order (P0 highest to P3 lowest)
  for (const [priority, indicators] of Object.entries(PRIORITY_INDICATORS)) {
    if (indicators.some(indicator => lowerText.includes(indicator))) {
      return priority as Priority;
    }
  }
  
  // Default to P2 (moderate priority)
  return 'P2';
}

function generateSummary(title: string, category: Category, priority: Priority): string {
  return `${priority} ${category}: ${title.slice(0, 100)}${title.length > 100 ? '...' : ''}`;
}

function generateNextActions(category: Category, priority: Priority): string[] {
  const actions: string[] = [];
  
  // Priority-based actions
  if (priority === 'P0') {
    actions.push('🚨 Escalate immediately to on-call engineer');
    actions.push('Create incident channel and start incident response');
  } else if (priority === 'P1') {
    actions.push('Assign to engineering team within 2 hours');
    actions.push('Notify relevant stakeholders');
  }
  
  // Category-based actions
  switch (category) {
    case 'BUG':
      actions.push('Attempt to reproduce the issue');
      actions.push('Check recent deployments and error logs');
      actions.push('Document steps to reproduce');
      break;
    case 'UX':
      actions.push('Review with design team');
      actions.push('Gather user feedback and pain points');
      actions.push('Consider usability testing');
      break;
    case 'BILLING':
      actions.push('Verify account status and payment history');
      actions.push('Check Stripe/payment processor logs');
      actions.push('Escalate to billing team if needed');
      break;
    case 'ESCROW':
      actions.push('Review escrow transaction history');
      actions.push('Check milestone status and evidence');
      actions.push('Verify compliance with escrow policies');
      break;
    case 'MARKETPLACE':
      actions.push('Review job posting and provider details');
      actions.push('Check quote/bid history');
      actions.push('Verify marketplace rules compliance');
      break;
    case 'PERFORMANCE':
      actions.push('Check application performance metrics');
      actions.push('Review database query performance');
      actions.push('Analyze network latency and response times');
      break;
    case 'OTHER':
      actions.push('Review issue details carefully');
      actions.push('Determine appropriate team for assignment');
      actions.push('Request additional information if needed');
      break;
  }
  
  // Common actions for all
  if (priority !== 'P0' && priority !== 'P1') {
    actions.push('Add to team backlog for triage');
  }
  actions.push('Follow up with reporter within 24 hours');
  
  return actions;
}

function generateSuggestedReply(category: Category, priority: Priority): string {
  let reply = `Thank you for reporting this issue. `;
  
  if (priority === 'P0') {
    reply += `This appears to be a critical issue and we're treating it with highest priority. Our team is investigating immediately.\n\n`;
  } else if (priority === 'P1') {
    reply += `We've identified this as a high-priority issue and will investigate promptly.\n\n`;
  } else {
    reply += `We've received your report and our team will review it.\n\n`;
  }
  
  // Category-specific guidance
  switch (category) {
    case 'BUG':
      reply += `To help us resolve this bug faster, please provide:\n`;
      reply += `- Steps to reproduce the issue\n`;
      reply += `- Expected vs actual behavior\n`;
      reply += `- Browser/device information\n`;
      reply += `- Any error messages or screenshots\n`;
      break;
    case 'UX':
      reply += `We appreciate your feedback on the user experience. Your input helps us improve the platform.\n`;
      break;
    case 'BILLING':
      reply += `For billing inquiries, please ensure you've included:\n`;
      reply += `- Invoice number or transaction ID\n`;
      reply += `- Date of the transaction\n`;
      reply += `- Account email address\n`;
      break;
    case 'ESCROW':
      reply += `For escrow-related issues, please provide:\n`;
      reply += `- Job ID and milestone details\n`;
      reply += `- Timeline of events\n`;
      reply += `- Any relevant documentation or evidence\n`;
      break;
    case 'MARKETPLACE':
      reply += `For marketplace issues, please include:\n`;
      reply += `- Job posting ID or provider details\n`;
      reply += `- Description of the issue\n`;
      reply += `- Expected outcome\n`;
      break;
    case 'PERFORMANCE':
      reply += `To help diagnose performance issues, please provide:\n`;
      reply += `- When the issue occurs (time of day, specific actions)\n`;
      reply += `- Your network connection type\n`;
      reply += `- Browser console logs if available\n`;
      break;
    case 'OTHER':
      reply += `We'll review your issue and get back to you shortly. If you have any additional details, please feel free to add them.\n`;
      break;
  }
  
  reply += `\nWe'll keep you updated on progress.`;
  
  return reply;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'support-triage';

  // Auth check
  const authError = requireAuth(req);
  if (authError) return authError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, agentName);
  if (rateLimitError) return rateLimitError;

  try {
    const input: SupportTriageInput = await req.json();
    const inputHash = hashInput(input);

    // Validate required fields
    if (!input.issueUrl || !input.issueNumber || !input.title) {
      logAuditEvent({
        agentName,
        inputHash,
        outputSummary: 'Missing required fields',
        status: 'failure',
        error: 'VALIDATION_ERROR',
      });
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: issueUrl, issueNumber, title', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Combine title, body, and comment for analysis
    const analysisText = [
      input.title,
      input.body || '',
      input.commentBody || '',
    ].join(' ');

    // Detect category and priority
    const category = detectCategory(analysisText);
    const priority = detectPriority(analysisText);
    
    // Generate outputs
    const summary = generateSummary(input.title, category, priority);
    const nextActions = generateNextActions(category, priority);
    const suggestedReply = generateSuggestedReply(category, priority);

    const output: SupportTriageOutput = {
      ok: true,
      priority,
      category,
      summary,
      nextActions,
      suggestedReply,
    };

    // Log success
    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Priority: ${priority}, Category: ${category}`,
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
