// app/api/ai/ping/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "OPENAI_API_KEY missing" }, { status: 400 });

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 4
    })
  });

  if (!r.ok) {
    const t = await r.text();
    return NextResponse.json({ ok: false, status: r.status, body: t }, { status: 500 });
  }
  const json = await r.json();
  return NextResponse.json({ ok: true, id: json.id ?? "n/a" });
}
