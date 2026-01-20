import { NextRequest } from 'next/server';

export function requireApiKey(req: NextRequest) {
  const required = process.env.DISPUTES_API_KEY || '';
  if (!required) {
    throw new Error('Missing DISPUTES_API_KEY env. Set it in .env.local (and in prod secrets).');
  }
  const got = req.headers.get('x-api-key') || '';
  if (got !== required) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return null;
}
