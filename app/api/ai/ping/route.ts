// app/api/ai-test/route.ts
import OpenAI from "openai";

// Lightweight runtime check; will succeed even if OPENAI_API_KEY is missing
export async function GET() {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return Response.json({
        ok: true,
        note: "OPENAI_API_KEY not set (skipping model call)."
      });
    }
    const client = new OpenAI({ apiKey: key });
    const models = await client.models.list({ limit: 1 });
    return Response.json({ ok: true, models: models.data?.length ?? 0 });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
