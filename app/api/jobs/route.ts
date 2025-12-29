// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-only keys. Make sure these are set on the *web app* service:
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Avoid caching this route
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('jobs')
    .select('id,title,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = String((body as any)?.title ?? '').trim();
  if (!title) {
    return NextResponse.json({ error: 'title required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({ title })
    .select('id,title,created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
