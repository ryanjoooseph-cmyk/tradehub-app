export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const owner = process.env.NEXT_PUBLIC_GH_OWNER || 'ryanjoooseph-cmyk';
    const repo  = process.env.NEXT_PUBLIC_GH_REPO  || 'tradehub-app';
    const token = process.env.GITHUB_TOKEN; // enables higher limits & private repos

    const headers: Record<string, string> = {
      'User-Agent': 'tradehub-dashboard',
      'Accept': 'application/vnd.github+json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=20`,
      { headers, cache: 'no-store' }
    );

    if (!res.ok) {
      const txt = await res.text();
      const msg = res.status === 403 && !token
        ? 'Add GITHUB_TOKEN in Render to remove API rate limits.'
        : txt;
      return Response.json({ ok: false, error: `GitHub ${res.status}: ${msg}` }, { status: 200 });
    }

    const data = await res.json();
    const prs = Array.isArray(data) ? data.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      labels: (pr.labels || []).map((l: any) => l?.name).filter(Boolean),
      url: pr.html_url,
      draft: !!pr.draft,
    })) : [];

    return Response.json({ ok: true, prs });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 200 });
  }
}
