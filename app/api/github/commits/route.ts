export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const owner = process.env.NEXT_PUBLIC_GH_OWNER || 'ryanjoooseph-cmyk';
    const repo  = process.env.NEXT_PUBLIC_GH_REPO  || 'tradehub-app';
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      'User-Agent': 'tradehub-dashboard',
      'Accept': 'application/vnd.github+json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=12`,
      { headers, cache: 'no-store' }
    );
    if (!res.ok) {
      return Response.json({ commits: [] }, { status: 200 });
    }
    const data = await res.json();
    const commits = (Array.isArray(data) ? data : []).map((c: any) => ({
      sha: c.sha,
      message: (c.commit?.message || '').split('\n')[0],
      author: c.commit?.author?.name || c.author?.login || 'unknown',
      date: c.commit?.author?.date || '',
      url: c.html_url,
    }));
    return Response.json({ commits });
  } catch {
    return Response.json({ commits: [] }, { status: 200 });
  }
}
