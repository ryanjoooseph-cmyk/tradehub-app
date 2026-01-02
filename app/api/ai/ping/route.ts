// app/api/ai-test/route.ts
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json(
      { ok: false, error: 'Missing OPENAI_API_KEY env on the server.' },
      { status: 500 }
    );
  }

  // Minimal call to prove billing/usage end-to-end
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 5,
    }),
  });

  const json = await resp.json().catch(() => ({}));
  return Response.json({ ok: resp.ok, id: json.id, usage: json.usage ?? null, error: json.error ?? null }, { status: resp.ok ? 200 : 500 });
}
