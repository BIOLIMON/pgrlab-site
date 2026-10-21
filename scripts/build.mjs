#!/usr/bin/env node
// Construye el sitio del PGR Lab en dist/ a partir de los archivos de contenido.
//
//   npm run build
//
// Lee:     sitio/plantilla.html, sitio/contenido/*,
//          sistema-de-diseno/{tokens.json, components/bundle.css, components/bundle.js}
// Copia:   public/  → dist/  (imágenes, favicon, robots, sitemap, página oculta /genes/)
// Escribe: dist/index.html, dist/404.html, dist/assets/pgr.<hash>.js
//
// El contenido no se teclea en la plantilla: publicaciones, equipo, noticias, divulgación,
// cifras y herramientas salen de sitio/contenido/. Si un dato cambia, cambia el archivo.
// Sin dependencias: solo Node ≥ 18.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = path.join(RAIZ, 'sitio');
const C = path.join(SITIO, 'contenido');
const SD = path.join(RAIZ, 'sistema-de-diseno');
const PUBLIC = path.join(RAIZ, 'public');
const DIST = path.join(RAIZ, 'dist');

const LINEAS = { redes: 'redes', sequia: 'sequía', nitrogeno: 'nitrógeno', omica: 'multi-ómica' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const ESPECIES = ['Arabidopsis thaliana', 'Solanum pennellii', 'Arabidopsis'];

const leer = (p) => fs.readFileSync(p, 'utf8');
const leerJson = (n) => JSON.parse(leer(path.join(C, n)));

function e(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

// CSV sencillo con comillas dobles (RFC 4180), suficiente para los archivos de contenido
function leerCsv(n) {
  const txt = leer(path.join(C, n)).replace(/\r\n?/g, '\n');
  const filas = [];
  let fila = [], campo = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (q) {
      if (ch === '"' && txt[i + 1] === '"') { campo += '"'; i++; }
      else if (ch === '"') q = false;
      else campo += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { fila.push(campo); campo = ''; }
    else if (ch === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += ch;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const [cab, ...resto] = filas.filter((f) => f.some((x) => x !== ''));
  return resto.map((f) => Object.fromEntries(cab.map((k, i) => [k, f[i] ?? ''])));
}

function fecha(iso) {
  const [a, m, d] = iso.split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pone en cursiva los nombres de especie sin alterar el texto (el título sigue siendo el de Crossref)
function cursivas(titulo) {
  let t = e(titulo);
  for (const sp of ESPECIES) {
    t = t.replace(new RegExp(`(?<!<em>)\\b${escRe(sp)}\\b(?!</em>| thaliana)`, 'g'), `<em>${sp}</em>`);
  }
  return t;
}

function tokensCss() {
  const t = JSON.parse(leer(path.join(SD, 'tokens.json')));
  const val = (v) => (typeof v === 'string' ? v : v.light).replace(/^\{(.+)\}$/, 'var(--$1)');
  const col = t.color.tokens.map((k) => `--${k.name}: ${val(k.value)}; `).join('');
  const dims = ['spacing', 'radius', 'layout'].flatMap((f) => t[f].tokens.map((k) => `--${k.name}: ${k.value}; `)).join('');
  const fams = Object.entries(t.type.families).map(([k, v]) => `--font-${k}: ${v}; `).join('');
  const out = [`:root { ${col}${dims}${fams}color-scheme: light; }`, 'body { background: var(--paper); color: var(--ink); }'];
  for (const g of t.type.groups) {
    for (const s of g.styles) {
      const fam = s.family || g.family;
      out.push(
        `.${s.name} { font-family: var(--font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};` +
          ('letterSpacing' in s ? ` letter-spacing: ${s.letterSpacing};` : '') +
          ('fontStyle' in s ? ` font-style: ${s.fontStyle};` : '') +
          ('opticalSize' in s ? ` font-variation-settings: 'opsz' ${s.opticalSize};` : '') +
          ' }',
      );
    }
  }
  return out.join('\n');
}

function publicaciones(sitio, equipo) {
  const d = leerJson('publicaciones.json');
  const pubs = d.publicaciones.filter((p) => p.en_sitio_actual).sort((a, b) => b['año'] - a['año'] || b.citas_openalex - a.citas_openalex);
  // Miembros del laboratorio en negrita: coinciden nombre de pila y último apellido (evita homónimos)
  const miembros = equipo.grupos.flatMap((g) => g.personas.map((x) => [x.nombre.split(' ')[0], x.nombre.split(' ').at(-1)]));
  const esLab = (autor) => {
    const t = autor.replaceAll('.', ' ').split(/\s+/).filter(Boolean);
    if (!t.length) return false;
    if ((t.at(-1) === 'Álvarez' || t.at(-1) === 'Alvarez') && t[0][0] === 'J') return true; // la PI
    return miembros.some(([n, ap]) => t[0] === n && t.at(-1) === ap);
  };
  const filas = [], ld = [];
  pubs.forEach((p, i) => {
    const lineas = p['líneas_propuestas'].filter((l) => l in LINEAS);
    const autores = p.autores;
    let corto = autores;
    if (autores.length > 8) { // abrevia, pero nunca esconde a un miembro del laboratorio
      corto = [];
      let prev = -1;
      autores.forEach((a, k) => {
        if (k < 5 || k === autores.length - 1 || esLab(a)) {
          if (k !== prev + 1) corto.push('…');
          corto.push(a); prev = k;
        }
      });
    }
    const aut = corto.map((a) => (a === '…' ? '…' : esLab(a) ? `<strong>${e(a)}</strong>` : e(a))).join(', ');
    const cita = `${autores.join(', ')} (${p['año']}). ${p['título']}. ${p.revista}. https://doi.org/${p.doi}`;
    const tags = lineas.map((l) => `<span class="pgr-tag pgr-tag--line" data-line="${l}">${LINEAS[l]}</span>`).join('');
    filas.push(`<article class="pgr-pub" data-lines="${lineas.join(' ')}" id="pub-${p.id}">
  <span class="pgr-pub__year${i < 2 ? ' pgr-pub__year--featured' : ''}">${p['año']}</span>
  <div>
    <h3 class="subheading"><a href="https://doi.org/${e(p.doi)}">${cursivas(p['título'])}</a></h3>
    <p class="small pgr-pub__authors">${aut}</p>
    <div class="pgr-pub__meta"><span class="small pgr-pub__journal">${e(p.revista)}</span><a class="pgr-link pgr-link--mono" href="https://doi.org/${e(p.doi)}">${e(p.doi)} ↗</a>${tags}</div>
    <details class="pgr-more"><summary>cómo citar</summary><div class="pgr-more__body"><pre class="cite">${e(cita)}</pre><div class="cite-row"><button class="linkbtn cite-copy js-only" type="button">copiar</button></div></div></details>
  </div>
</article>`);
    ld.push({
      '@type': 'ScholarlyArticle', headline: p['título'], datePublished: String(p['año']),
      identifier: `https://doi.org/${p.doi}`, url: `https://doi.org/${p.doi}`,
      isPartOf: { '@type': 'Periodical', name: p.revista },
      author: autores.map((a) => ({ '@type': 'Person', name: a })),
    });
  });
  const cnt = Object.fromEntries(Object.keys(LINEAS).map((k) => [k, pubs.filter((p) => p['líneas_propuestas'].includes(k)).length]));
  const filtros =
    `<li><button type="button" data-filter="todas" aria-pressed="true"><span class="pgr-tag">todas</span><small>${pubs.length}</small></button></li>` +
    Object.entries(LINEAS).filter(([k]) => cnt[k])
      .map(([k, v]) => `<li><button type="button" data-filter="${k}" aria-pressed="false"><span class="pgr-tag pgr-tag--line" data-line="${k}">${v}</span><small>${cnt[k]}</small></button></li>`)
      .join('');
  const c42 = sitio.cifras.revisados_por_pares;
  const nota = `Se muestran ${pubs.length} de los ${c42.valor} trabajos revisados por pares de la PI (${e(c42.criterio)}). ` +
    `<a class="pgr-link" href="${e(c42.fuente)}">Lista completa en ORCID ↗</a>`;
  return { pubs: filas.join('\n'), filtros, nota, ld, n: pubs.length };
}

function equipoHtml(eq, img) {
  const pi = eq.pi;
  const piHtml = `<article class="pi">
          <div class="pgr-person__portrait"><img src="${img(pi.imagen)}" alt="Retrato de ${e(pi.nombre)}" width="160" height="200" loading="lazy"></div>
          <div>
            <span class="label">${e(pi.rol)}</span>
            <h3 class="heading">${e(pi.nombre)}</h3>
            <p class="body">${e(pi.bio)}</p>
            <a class="pi-cred pgr-link" href="${e(pi.credencial_fuente)}">${e(pi.credencial)} ↗</a>
            <div class="pi-links"><a class="pgr-link pgr-link--mono" href="https://orcid.org/${e(pi.orcid)}">orcid ${e(pi.orcid)} ↗</a></div>
          </div>
        </article>`;
  const roster = eq.grupos.map((g) =>
    `<div><h4 class="label">${e(g.grupo)}</h4><ul>` +
    g.personas.map((x) => {
      // enlace opcional a un perfil (ORCID, LinkedIn…): { "texto": "linkedin", "url": "https://…" }
      const enlace = x.enlace ? ` <a class="pgr-link pgr-link--mono" href="${e(x.enlace.url)}">${e(x.enlace.texto)} ↗</a>` : '';
      return `<li><details><summary>${e(x.nombre)}</summary><p>${e(x.bio)}${enlace}</p></details></li>`;
    }).join('') +
    '</ul></div>').join('');
  const n = 1 + eq.grupos.reduce((t, g) => t + g.personas.length, 0);
  return { piHtml, roster, n };
}

function copiar(desde, hacia) {
  fs.mkdirSync(hacia, { recursive: true });
  for (const ent of fs.readdirSync(desde, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const a = path.join(desde, ent.name), b = path.join(hacia, ent.name);
    if (ent.isDirectory()) copiar(a, b);
    else fs.copyFileSync(a, b);
  }
}

function main() {
  const sitio = leerJson('sitio.json');
  const eq = leerJson('equipo.json');
  const img = (n) => {
    if (!fs.existsSync(path.join(PUBLIC, 'img', n))) throw new Error(`Falta la imagen public/img/${n}`);
    return `/img/${n}`;
  };

  fs.rmSync(DIST, { recursive: true, force: true });
  copiar(PUBLIC, DIST);

  // JavaScript del sistema de diseño como archivo con hash (caché larga, sin quedar obsoleto)
  const js = leer(path.join(SD, 'components', 'bundle.js'));
  const hash = crypto.createHash('sha256').update(js).digest('hex').slice(0, 10);
  fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
  const jsUrl = `/assets/pgr.${hash}.js`;
  fs.writeFileSync(path.join(DIST, jsUrl), js);

  const P = publicaciones(sitio, eq);
  const E = equipoHtml(eq, img);

  const tools = sitio.herramientas.map((t) => `
        <article class="pgr-tool">
          <span class="pgr-tool__prompt">&gt;_ ${e(t.tipo)}</span>
          <div>
            <h3 data-scramble>${e(t.nombre)}</h3>
            <p class="body">${e(t.descripcion)}</p>
            <a class="pgr-link pgr-link--mono" href="${e(t.url)}">${e(t.url.replace(/^https?:\/\//, ''))} ↗</a>
          </div>
        </article>`).join('');

  const c42 = sitio.cifras.revisados_por_pares;
  const readout = `<ul class="pgr-readout">
              <li><span class="pgr-readout__k">universidades del Núcleo</span><span class="pgr-readout__dots" aria-hidden="true"></span><span class="pgr-readout__v">${sitio.universidades.length}</span></li>
              <li><span class="pgr-readout__k"><a class="pgr-link" href="${e(c42.fuente)}">trabajos revisados por pares (ORCID)</a></span><span class="pgr-readout__dots" aria-hidden="true"></span><span class="pgr-readout__v">${c42.valor}</span></li>
              <li><span class="pgr-readout__k"><a class="pgr-link" href="#equipo">personas en el laboratorio</a></span><span class="pgr-readout__dots" aria-hidden="true"></span><span class="pgr-readout__v">${E.n}</span></li>
              <li><span class="pgr-readout__k">inicio del Núcleo</span><span class="pgr-readout__dots" aria-hidden="true"></span><span class="pgr-readout__v">2025</span></li>
            </ul>`;
  const unis = '<h3 class="label unis-head">Universidades del Núcleo</h3><ul class="unis">' +
    sitio.universidades.map((u) => `<li><a href="${e(u.url)}">${e(u.nombre)} ↗</a></li>`).join('') + '</ul>';
  const div = '<ul class="outreach" aria-label="Divulgación y formación">' +
    leerCsv('divulgacion.csv').sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((r) => `<li><a class="body" href="${e(r.url)}">${e(r.actividad)} ↗</a><span class="small">${e(r.tipo)} · <time datetime="${r.fecha}">${fecha(r.fecha)}</time></span></li>`)
      .join('') + '</ul>';
  const news = leerCsv('noticias.csv').sort((a, b) => b.fecha.localeCompare(a.fecha));
  const noticias = '<ul class="pgr-news">' +
    news.slice(0, 8).map((r) => `<li><a href="${e(r.url)}"><time datetime="${r.fecha}">${fecha(r.fecha)}</time><span class="subheading">${e(r.titular)}</span><span class="pgr-news__src">${e(r.fuente)} ↗</span></a></li>`).join('') +
    '</ul><p class="more"><a class="pgr-link pgr-link--mono" href="https://phytolearning.cl/noticias/">todas las noticias en phytolearning.cl ↗</a></p>';

  const correo = sitio.correo;
  const mailto = `mailto:${correo}?subject=${encodeURIComponent('Quiero unirme al PGR Lab')}`;
  const desc = 'Laboratorio de la Universidad Andrés Bello y sede del Núcleo Milenio PhytoLearning. Estudiamos las redes génicas ' +
    'con las que tomate y Arabidopsis responden a la sequía y al nitrógeno.';
  const org = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ResearchOrganization', '@id': `${sitio.dominio}#org`, name: sitio.nombre_largo, alternateName: sitio.nombre,
        url: sitio.dominio, email: correo, description: desc,
        address: { '@type': 'PostalAddress', streetAddress: 'Av. República 330, 3er piso', addressLocality: 'Santiago', addressCountry: 'CL' },
        parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Universidad Andrés Bello', url: 'https://www.unab.cl/' },
        sameAs: [sitio.instagram], member: { '@id': `${sitio.dominio}#pi` },
      },
      {
        '@type': 'Person', '@id': `${sitio.dominio}#pi`, name: eq.pi.nombre, jobTitle: eq.pi.rol,
        affiliation: { '@id': `${sitio.dominio}#org` }, sameAs: [`https://orcid.org/${eq.pi.orcid}`],
      },
      ...P.ld,
    ],
  };
  const ldJson = JSON.stringify(org).replaceAll('</', '<\\/');
  const meta = `<meta name="description" content="${e(desc)}">
<link rel="canonical" href="${e(sitio.dominio)}">
<link rel="icon" href="/favicon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${e(sitio.nombre)}">
<meta property="og:title" content="${e(sitio.nombre)} · ${e(sitio.nombre_largo)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(sitio.dominio)}">
<meta property="og:locale" content="es_CL">
<meta property="og:image" content="${e(sitio.dominio)}logo-full.png">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${ldJson}</script>`;

  const bcss = leer(path.join(SD, 'components', 'bundle.css')).replace(/^@import[^\n]*\n/, '');
  let h = leer(path.join(SITIO, 'plantilla.html'));
  const rep = {
    META: meta, TOKENS: tokensCss(), BUNDLECSS: bcss, BUNDLEJS_URL: jsUrl,
    PUBS: P.pubs, FILTERS: P.filtros, PUBS_NOTA: P.nota, HERRAMIENTAS: tools, PI: E.piHtml, ROSTER: E.roster,
    READOUT: readout, UNIVERSIDADES: unis, DIVULGACION: div, NOTICIAS: noticias,
    MAILTO_UNETE: e(mailto), CORREO: e(correo),
  };
  for (const [k, v] of Object.entries(rep)) h = h.replaceAll(`{{${k}}}`, () => v);
  h = h.replace(/\{\{IMG:([^}]+)\}\}/g, (_, n) => img(n));
  const falta = h.match(/\{\{[A-Za-z_:.]+\}\}/g);
  if (falta) throw new Error('Marcadores sin reemplazar: ' + [...new Set(falta)].join(', '));

  // La plantilla es el contenido de la página; aquí se envuelve en un documento HTML completo.
  const corte = '<script>document.documentElement.classList.add("js");</script>';
  const i = h.indexOf(corte);
  if (i < 0) throw new Error('No encontré el inicio del cuerpo en la plantilla');
  const doc = (head, body) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head.trim()}
</head>
<body>
${body.trim()}
</body>
</html>
`;
  fs.writeFileSync(path.join(DIST, 'index.html'), doc(h.slice(0, i), h.slice(i)));

  // 404: misma identidad, mínima, con camino de vuelta
  const styleEnd = h.indexOf('</style>');
  const head404 = h.slice(0, styleEnd + 8)
    .replace(/<title>[^<]*<\/title>/, '<title>Página no encontrada · PGR Lab</title>')
    .replace(/<link rel="canonical"[^>]*>\n?/, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/, '') + '\n<meta name="robots" content="noindex">';
  fs.writeFileSync(path.join(DIST, '404.html'), doc(head404, `<main class="wrap" style="padding-block: var(--space-8)">
  <span class="label">§ 404</span>
  <h1 class="display" style="max-width: 12ch; margin: var(--space-4) 0">Esta página no existe.</h1>
  <p class="lede" style="color: var(--ink-muted); max-width: 40ch">Puede que la dirección haya cambiado con el nuevo sitio.</p>
  <p style="margin-top: var(--space-6)"><a class="pgr-btn pgr-btn--primary" href="/">Ir a la portada <span class="pgr-btn__glyph">→</span></a></p>
</main>`));

  const kb = (f) => (fs.statSync(path.join(DIST, f)).size / 1024).toFixed(0);
  console.log(`dist/index.html ${kb('index.html')} KB · ${jsUrl.slice(1)} ${kb(jsUrl)} KB · ${P.n} publicaciones · ${E.n} personas · última noticia ${news[0].fecha}`);
}

main();
