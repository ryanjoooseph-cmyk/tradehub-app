import { NextResponse } from 'next/server';

export async function GET() {
  const owner = process.env.NEXT_PUBLIC_GH_OWNER!;
  const repo  = process.env.NEXT_PUBLIC_GH_REPO!;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_GH_OWNER/REPO' }, { status: 500 });
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=30`;
  const headers: Record<string,string> = { 'Accept': 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const r = await fetch(url, { headers, cache: 'no-store' });
  const rate = {
    remaining: r.headers.get('x-ratelimit-remaining'),
    limit: r.headers.get('x-ratelimit-limit'),
  };

  if (!r.ok) {
    const text = await r.text().catch(()=>'');
    return NextResponse.json({ error: `GitHub ${r.status}`, detail: text, rate }, { status: r.status });
  }

  const data = await r.json();
  // Slim the payload
  const prs = data.map((p: any) => ({
    number: p.number,
    title: p.title,
    state: p.state,
    html_url: p.html_url,
    labels: p.labels?.map((l: any) => l.name) ?? [],
    user: p.user?.login ?? 'unknown',
    updated_at: p.updated_at,
    head: p.head?.ref,
    base: p.base?.ref,
  }));
  return NextResponse.json({ prs, rate });
}
