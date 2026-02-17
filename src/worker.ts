export default {
  async fetch(request: Request, env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }): Promise<Response> {
    const url = new URL(request.url);

    // First try to serve the requested asset/path.
    const res = await env.ASSETS.fetch(request);

    // If it exists (or it's not a 404), return it.
    if (res.status !== 404) return res;

    // SPA fallback: for navigations / HTML requests, return index.html
    const accept = request.headers.get('accept') || '';
    const isHtml = accept.includes('text/html');

    if (!isHtml) return res;

    const indexUrl = new URL('/index.html', url.origin);
    return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
  },
};
