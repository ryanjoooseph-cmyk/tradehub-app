// app/api/jobs/route.ts
export async function GET() {
  const rows: Array<{ id: string; title: string; created_at: string }> = [];
  return Response.json(rows);
}
