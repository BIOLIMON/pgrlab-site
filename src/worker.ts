// Worker del sitio pgrlab.cl. Sirve los archivos estáticos de dist/ (binding ASSETS) y además:
// - redirige (301) las rutas del sitio anterior a las secciones de la portada nueva,
// - responde 404 con una página propia (antes toda ruta desconocida devolvía la portada),
// - marca las respuestas con x-pgrlab-worker para confirmar que el tráfico pasa por aquí.

type Env = { ASSETS: { fetch: (req: Request) => Promise<Response> } };

// Rutas del sitio anterior (React) → sección equivalente en la portada nueva.
const REDIRECCIONES: Record<string, string> = {
  '/about': '/#nucleo',
  '/research': '/#investigacion',
  '/publications': '/#publicaciones',
  '/team': '/#equipo',
  '/resources': '/#herramientas',
  '/contact': '/#contacto',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const tag = (r: Response) => {
      const h = new Headers(r.headers);
      h.set('x-pgrlab-worker', 'pgrlab-site');
      h.set('x-pgrlab-path', url.pathname);
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
    };

    if (url.pathname === '/__worker_ping') {
      return tag(new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } }));
    }

    // Rutas antiguas: con y sin barra final.
    const limpio = url.pathname.replace(/\/+$/, '') || '/';
    const destino = REDIRECCIONES[limpio];
    if (destino) return tag(Response.redirect(new URL(destino, url.origin).toString(), 301));

    const res = await env.ASSETS.fetch(request);

    if (res.status === 404) {
      // Con el manejo de HTML por defecto de Cloudflare, /404.html redirige a /404: se pide /404 directamente.
      const pagina = await env.ASSETS.fetch(new Request(new URL('/404', url.origin).toString(), { headers: { accept: 'text/html' } }));
      if (pagina.ok) {
        return tag(new Response(pagina.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } }));
      }
      return tag(res);
    }

    // Los archivos que existen en dist/ normalmente los sirve Cloudflare sin pasar por aquí;
    // sus cabeceras (caché larga de /assets/, noindex de /genes/) están en public/_headers.
    return tag(res);
  },
};
