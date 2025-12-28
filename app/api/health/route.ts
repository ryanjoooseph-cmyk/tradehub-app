// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true }, { status: 200 });
}
export async function POST() {
  return Response.json({ ok: true }, { status: 200 });
}
