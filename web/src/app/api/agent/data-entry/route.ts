import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { checkRateLimit } from '../_lib/rateLimit';
import { logAuditEvent, hashInput } from '../_lib/audit';
import { callLLM } from '../_lib/openai';

type Attachment = {
  filename: string;
  contentType: string;
  url: string;
};

type DataEntryInput = {
  source: 'email' | 'manual';
  subject: string;
  from: string;
  bodyText: string;
  attachments: Attachment[];
};

type LineItem = {
  desc: string;
  qty: number | null;
  unitPrice: number | null;
  total: number | null;
};

type DataEntryOutput = {
  ok: true;
  draft: {
    jobId: string | null;
    milestoneId: string | null;
    vendor: string | null;
    amount: number | null;
    date: string | null;
    lineItems: LineItem[];
    note: string;
  };
  requiresHumanReview: true;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  missingFields: string[];
};

function validateInput(input: unknown): input is DataEntryInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;

  if (obj.source !== 'email' && obj.source !== 'manual') return false;
  if (typeof obj.subject !== 'string') return false;
  if (typeof obj.from !== 'string') return false;
  if (typeof obj.bodyText !== 'string') return false;
  if (!Array.isArray(obj.attachments)) return false;

  return true;
}

function extractJobId(text: string): string | null {
  // Match patterns like J-1234, J-12345, JOB-1234
  const match = text.match(/\b(J|JOB)-(\d{3,6})\b/i);
  return match ? match[0].toUpperCase() : null;
}

function extractMilestoneId(text: string): string | null {
  // Match patterns like M-123, M-1234, MS-123
  const match = text.match(/\b(M|MS)-(\d{2,5})\b/i);
  return match ? match[0].toUpperCase() : null;
}

function extractAmount(text: string): number | null {
  // Match patterns like $1,234.56, $1234, 1234.56 USD
  const match = text.match(/\$[\d,]+\.?\d*|\d[\d,]*\.?\d*\s*(?:USD|usd)/);
  if (match) {
    const cleaned = match[0].replace(/[$,\s]|USD|usd/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}

function extractDate(text: string): string | null {
  // Match patterns like 2024-01-15, 01/15/2024, Jan 15, 2024
  const isoMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoMatch) return isoMatch[1];

  const usMatch = text.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (usMatch) {
    const [, month, day, year] = usMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null;
}

function extractVendor(from: string, bodyText: string): string | null {
  // Try to extract from email domain
  const emailMatch = from.match(/@([^.]+)\./);
  if (emailMatch && emailMatch[1].toLowerCase() !== 'gmail' && emailMatch[1].toLowerCase() !== 'outlook') {
    return emailMatch[1].charAt(0).toUpperCase() + emailMatch[1].slice(1);
  }

  // Try to find company name in body
  const companyMatch = bodyText.match(/(?:from|company|vendor|supplier)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\n|,|\.)/i);
  if (companyMatch) return companyMatch[1].trim();

  return null;
}

function hasInvoiceAttachment(attachments: Attachment[]): boolean {
  const invoiceTypes = ['pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const invoiceNames = ['invoice', 'receipt', 'bill', 'statement'];

  return attachments.some(att => {
    const nameMatch = invoiceNames.some(n => att.filename.toLowerCase().includes(n));
    const typeMatch = invoiceTypes.some(t => att.contentType.toLowerCase().includes(t));
    return nameMatch || (typeMatch && att.filename.match(/\.(pdf|png|jpg|jpeg)$/i));
  });
}

function extractLineItems(bodyText: string): LineItem[] {
  const items: LineItem[] = [];

  // Simple pattern: description followed by quantity and price
  const linePattern = /^(.+?)\s+(\d+)\s*x?\s*\$?([\d,.]+)\s*=?\s*\$?([\d,.]+)?$/gm;
  let match;

  while ((match = linePattern.exec(bodyText)) !== null) {
    items.push({
      desc: match[1].trim(),
      qty: parseInt(match[2], 10),
      unitPrice: parseFloat(match[3].replace(/,/g, '')),
      total: match[4] ? parseFloat(match[4].replace(/,/g, '')) : null,
    });
  }

  return items;
}

function calculateConfidence(draft: DataEntryOutput['draft'], missingFields: string[]): 'LOW' | 'MEDIUM' | 'HIGH' {
  const hasJob = draft.jobId !== null;
  const hasAmount = draft.amount !== null;
  const hasVendor = draft.vendor !== null;
  const hasDate = draft.date !== null;
  const hasMissing = missingFields.length > 0;

  if (hasJob && hasAmount && hasVendor && hasDate && !hasMissing) return 'HIGH';
  if ((hasJob || hasAmount) && !hasMissing) return 'MEDIUM';
  return 'LOW';
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const agentName = 'data-entry';

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
          error: 'Invalid input schema. Required: source (email|manual), subject, from, bodyText, attachments[]',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const combinedText = `${input.subject}\n${input.bodyText}`;

    // Extract fields using heuristics
    const jobId = extractJobId(combinedText);
    const milestoneId = extractMilestoneId(combinedText);
    const amount = extractAmount(combinedText);
    const date = extractDate(combinedText);
    const vendor = extractVendor(input.from, input.bodyText);
    const lineItems = extractLineItems(input.bodyText);

    // Check for missing fields
    const missingFields: string[] = [];
    if (!jobId) missingFields.push('Job ID not detected');
    if (!amount) missingFields.push('Amount not detected');
    if (!vendor) missingFields.push('Vendor not detected');
    if (!date) missingFields.push('Date not detected');

    // Check for invoice attachments that need OCR
    if (hasInvoiceAttachment(input.attachments)) {
      missingFields.push('OCR pending - invoice/receipt attachments detected but OCR not yet implemented');
    }

    // Try LLM enhancement if available
    let note = `Extracted from ${input.source}: ${input.subject}`;

    const llmSystem = `You are a data entry assistant. Extract structured data from email content. Be concise and factual. If information is unclear, say so.`;
    const llmUser = `Source: ${input.source}
From: ${input.from}
Subject: ${input.subject}
Body: ${input.bodyText.slice(0, 500)}

Summarize the key information in 1-2 sentences. What is this about? What action might be needed?`;

    const llmResponse = await callLLM({ system: llmSystem, user: llmUser });

    if (llmResponse && !llmResponse.includes('Manual review recommended')) {
      note = llmResponse.slice(0, 200);
    }

    // Build draft
    const draft: DataEntryOutput['draft'] = {
      jobId,
      milestoneId,
      vendor,
      amount,
      date,
      lineItems,
      note,
    };

    const confidence = calculateConfidence(draft, missingFields);

    const output: DataEntryOutput = {
      ok: true,
      draft,
      requiresHumanReview: true,
      confidence,
      missingFields,
    };

    // Log success
    logAuditEvent({
      agentName,
      inputHash,
      outputSummary: `Source: ${input.source}, Confidence: ${confidence}, Missing: ${missingFields.length}`,
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
