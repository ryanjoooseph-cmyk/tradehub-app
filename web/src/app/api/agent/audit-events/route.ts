import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../_lib/auth';
import { getAuditEvents, type AuditLog } from '../_lib/audit';

type AuditEventsResponse = {
  ok: true;
  events: AuditLog[];
  total: number;
  filters: {
    agentName?: string;
    status?: string;
    timeRange?: string;
  };
};

export async function GET(req: NextRequest) {
  // Auth check - reuse the same x-agent-secret for admin access
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const agentName = searchParams.get('agent') || undefined;
    const status = searchParams.get('status') as 'success' | 'failure' | undefined;
    const timeRange = searchParams.get('range') || '24h';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Calculate since date based on time range
    let since: Date | undefined;
    const now = new Date();

    switch (timeRange) {
      case '1h':
        since = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        since = undefined;
        break;
      default:
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Validate status if provided
    if (status && status !== 'success' && status !== 'failure') {
      return NextResponse.json(
        { ok: false, error: 'Invalid status. Must be "success" or "failure"', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Get filtered events
    const events = getAuditEvents({
      agentName,
      status,
      since,
      limit: Math.min(limit, 500), // Cap at 500 events
    });

    const response: AuditEventsResponse = {
      ok: true,
      events,
      total: events.length,
      filters: {
        agentName,
        status,
        timeRange,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { ok: false, error: errorMessage, code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
