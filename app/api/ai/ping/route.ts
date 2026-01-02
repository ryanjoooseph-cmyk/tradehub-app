// app/api/ai-test/route.ts
import OpenAI from 'openai';

export async function GET() {
  try {
    const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // a lightweight call that doesn’t spend tokens
    const list = await ai.models.list();
    return Response.json({ ok: true, models: list.data.length });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
