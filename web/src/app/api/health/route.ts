export async function GET() {
  return Response.json(
    {
      ok: true,
      time: new Date().toISOString(),
      env: process.env.NODE_ENV ?? null,
      sha: process.env.RENDER_GIT_COMMIT ?? null,
      service: process.env.RENDER_SERVICE_NAME ?? null,
      instance: process.env.RENDER_INSTANCE_ID ?? null,
    },
    { status: 200 }
  );
}
