import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const models = await openai.models.list();
    return Response.json({ ok: true, models: models.data.length });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
