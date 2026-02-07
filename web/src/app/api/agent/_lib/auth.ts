import { NextRequest, NextResponse } from 'next/server';

export function requireAuth(req: NextRequest): NextResponse | null {
  const secret = req.headers.get('x-agent-secret');
  const expectedSecret = process.env.AGENT_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'AGENT_SECRET not configured', code: 'CONFIG_ERROR' },
      { status: 500 }
    );
  }

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized - invalid or missing x-agent-secret', code: 'AUTH_ERROR' },
      { status: 401 }
    );
  }

  return null; // Auth passed
}

