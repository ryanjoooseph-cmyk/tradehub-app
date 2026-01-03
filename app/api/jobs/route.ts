export const dynamic = "force-dynamic";

export async function GET() {
  const rows: any[] = [];
  return new Response(JSON.stringify(rows), {
    headers: { "content-type": "application/json" }
  });
}
