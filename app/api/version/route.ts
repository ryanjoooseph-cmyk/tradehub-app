export const dynamic = 'force-dynamic';

// Render usually exposes these; we fall back gracefully.
const SHA = process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || null;
const BRANCH = process.env.RENDER_GIT_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || null;

export async function GET() {
  return Response.json({
    ok: true,
    ts: new Date().toISOString(),
    sha: SHA,
    branch: BRANCH,
  });
}
