import getAdminClient from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function POST(request: Request) {
  const supabase = getAdminClient();
  const body = await request.json().catch(() => ({} as any));
  const payload = {
    title: String(body.title ?? '').trim(),
    amount: Number(body.amount ?? 0),
    status: String(body.status ?? 'draft'),
    client_id: body.client_id ?? null,
  };

  if (!payload.title) return Response.json({ error: 'title required' }, { status: 400 });

  const { data, error } = await supabase.from('quotes').insert(payload).select('*').single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data }, { status: 201 });
}
