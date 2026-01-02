// app/api/ai/ping/route.ts
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ ok: false, error: 'OPENAI_API_KEY not set' }, { status: 500 });

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'pong' }],
      max_tokens: 5,
    }),
  });

  const json = await r.json();
  return Response.json({ ok: r.ok, id: json.id ?? null });
}
