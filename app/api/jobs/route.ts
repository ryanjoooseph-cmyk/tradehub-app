// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Job = { id: number; title: string; created_at: string };

function getClient():
  | { client: SupabaseClient; error: null }
  | { client: null; error: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    return { client: null, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE' };
  }
  return { client: createClient(url, key), error: null };
}

// Optional, avoids any static caching surprises on /api
export const dynamic = 'force-dynamic';

export async function GET() {
  const { client, error } = getClient();
  if (!client) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  const { data, error: qerr } = await client
    .from<Job>('jobs')
    .select('id,title,created_at')
    .order('created_at', { ascending: false });

  if (qerr) return NextResponse.json({ ok: false, error: qerr.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const { client, error } = getClient();
  if (!client) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const title = (body?.title ?? '').toString().trim();
  if (!title) return NextResponse.json({ ok: false, error: 'title required' }, { status: 400 });

  const { data, error: ierr } = await client
    .from<Job>('jobs')
    .insert({ title })
    .select()
    .limit(1);

  if (ierr) return NextResponse.json({ ok: false, error: ierr.message }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null, { status: 201 });
}
