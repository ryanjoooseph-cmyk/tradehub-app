import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create the client only when handling a request (avoids build-time env checks)
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE; // server-only
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const client = getClient();
    if (!client) {
      return NextResponse.json(
        { ok: false, error: 'Supabase env not set' },
        { status: 500 },
      );
    }

    const { data, error } = await client
      .from('jobs')
      .select('id,title,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unexpected error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = getClient();
    if (!client) {
      return NextResponse.json(
        { ok: false, error: 'Supabase env not set' },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const title = typeof body?.title === 'string' ? body.title.trim() : '';

    if (!title || title.length > 140) {
      return NextResponse.json(
        { ok: false, error: 'Invalid title' },
        { status: 400 },
      );
    }

    const { data, error } = await client
      .from('jobs')
      .insert({ title })
      .select('id,title,created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, item: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unexpected error' },
      { status: 500 },
    );
  }
}
