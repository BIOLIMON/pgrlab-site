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
      h.set('x-pgrlab-path', url.pathname);
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
    };

    // Hard ping endpoint to confirm routing hits the Worker.
    if (url.pathname === '/__worker_ping') {
      return tag(new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } }));
    }

    // First try to serve the requested asset/path.
    const res = await env.ASSETS.fetch(request);

    // SPA fallback conditions. Some assets handlers return 307 -> / for unknown paths.
    const isRedirect = res.status === 301 || res.status === 302 || res.status === 303 || res.status === 307 || res.status === 308;

    // If it exists (and isn't a redirect/404), return it.
    if (res.status !== 404 && !isRedirect) return tag(res);

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

    // Note: on this deployment, /index.html redirects to /. Use / as the SPA shell.
    const shellUrl = new URL('/', url.origin);
    const shell = await env.ASSETS.fetch(new Request(shellUrl.toString(), request));
    return tag(shell);
  },
};
