export default {
  async fetch(
    request: Request,
    env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }
  ): Promise<Response> {
    const url = new URL(request.url);

    // Helper to tag responses so we can confirm the Worker is serving traffic.
    const tag = (r: Response) => {
      const h = new Headers(r.headers);
      h.set('x-pgrlab-worker', 'pgrlab-site');
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
    };

    // First try to serve the requested asset/path.
    const res = await env.ASSETS.fetch(request);

    // If it exists (or it's not a 404), return it.
    if (res.status !== 404) return tag(res);

    // SPA fallback:
    // - For client-side routes like /team, return index.html so React Router can render.
    // - Don't do this for real files (anything with a dot) or known machine endpoints.
    const pathname = url.pathname;
    const isFileLike = pathname.includes('.');
    const isMachinePath = pathname === '/robots.txt' || pathname === '/sitemap.xml';
    const method = request.method.toUpperCase();

    if (isFileLike || isMachinePath) return tag(res);

    // Only for safe navigation methods.
    if (method !== 'GET' && method !== 'HEAD') return tag(res);

    const indexUrl = new URL('/index.html', url.origin);
    const idx = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    return tag(idx);
  },
};
