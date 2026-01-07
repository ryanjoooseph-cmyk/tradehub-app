import getAdminClient from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const updates = await request.json().catch(() => ({} as any));
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = getAdminClient();

  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
