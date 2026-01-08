import { NextResponse } from 'next/server';

export async function GET() {
  const owner = process.env.NEXT_PUBLIC_GH_OWNER!;
  const repo  = process.env.NEXT_PUBLIC_GH_REPO!;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_GH_OWNER/REPO' }, { status: 500 });
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=main&per_page=15`;
  const headers: Record<string,string> = { 'Accept': 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const r = await fetch(url, { headers, cache: 'no-store' });
  if (!r.ok) {
    const text = await r.text().catch(()=> '');
    return NextResponse.json({ error: `GitHub ${r.status}`, detail: text }, { status: r.status });
  }

  const data = await r.json();
  const commits = data.map((c: any) => ({
    sha: c.sha,
    short: c.sha?.slice(0,7),
    message: c.commit?.message?.split('\n')[0] ?? '',
    author: c.commit?.author?.name ?? '',
    date: c.commit?.author?.date ?? '',
    url: c.html_url,
  }));
  return NextResponse.json({ commits });
}
