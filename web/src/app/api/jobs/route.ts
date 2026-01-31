export const runtime = "nodejs";

type Job = {
  id: string;
  title?: string | null;
  address?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  const env = getSupabaseEnv();
  if (!env) return { ok: false, status: 500, text: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" };

  const r = await fetch(`${env.url}${path}`, {
    ...init,
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      ...(init?.headers ?? {}),
    },
  });

  const text = await r.text();
  return { ok: r.ok, status: r.status, text };
}

export async function GET() {
  const r = await supabaseFetch(
    "/rest/v1/jobs?select=*&order=created_at.desc&limit=200",
    { method: "GET" }
  );

  if (!r.ok) return json({ error: "Supabase REST error", details: r.text }, 500);

  let rows: Job[] = [];
  try {
    rows = JSON.parse(r.text) as Job[];
  } catch {
    return json({ error: "Invalid JSON from Supabase", details: r.text }, 500);
  }

  return json({ jobs: rows }, 200);
}

export async function PATCH(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!raw || typeof raw !== "object") return json({ error: "Invalid body" }, 400);

  const body = raw as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";

  const start_at =
    body.start_at === null || typeof body.start_at === "string"
      ? (body.start_at as string | null)
      : undefined;

  const end_at =
    body.end_at === null || typeof body.end_at === "string"
      ? (body.end_at as string | null)
      : undefined;

  if (!id) return json({ error: "Missing id" }, 400);

  const payload: Record<string, string | null> = {};
  if (start_at !== undefined) payload.start_at = start_at;
  if (end_at !== undefined) payload.end_at = end_at;

  const r = await supabaseFetch(
    `/rest/v1/jobs?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!r.ok) return json({ error: "Supabase REST error", details: r.text }, 500);

  let updated: Job[] = [];
  try {
    updated = JSON.parse(r.text) as Job[];
  } catch {
    return json({ error: "Invalid JSON from Supabase", details: r.text }, 500);
  }

  return json({ updated }, 200);
}
