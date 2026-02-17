import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`Missing ${indexPath}. Run 'vite build' first.`);
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');

const routes = [
  {
    route: '/',
    title: 'Plant Genome Regulation Lab (JMA Lab) | UNAB Santiago, Chile',
    description:
      'Plant Genome Regulation Lab (JMA Lab) studies plant genome regulation, gene regulatory networks, and stress adaptation (drought, nitrogen) using multi-omics and systems biology at UNAB, Santiago, Chile.',
  },
  {
    route: '/research',
    title: 'Research | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Research themes: transcriptional logic, drought adaptation, nitrogen use efficiency, epigenetic memory, and multi-omics systems biology in plants.',
  },
  {
    route: '/publications',
    title: 'Publications | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Peer-reviewed publications on gene regulatory networks, transcriptomics, chromatin accessibility, drought stress and nitrogen signaling in Arabidopsis and tomato.',
  },
  {
    route: '/team',
    title: 'Team | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Meet the JMA Lab team at UNAB: researchers and students working on plant genome regulation, systems biology and multi-omics for climate-resilient crops.',
  },
  {
    route: '/resources',
    title: 'Resources | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Open tools, datasets and platforms from the JMA Lab: network inference resources, omics visualization tools, and computational biology pipelines.',
  },
  {
    route: '/contact',
    title: 'Contact | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Contact the Plant Genome Regulation Lab (JMA Lab) at UNAB, Santiago, Chile for collaborations, positions and research inquiries.',
  },
];

const SITE_ORIGIN = 'https://pgrlab.cl';

function escapeAttr(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function upsertTag(html, re, replacement) {
  if (re.test(html)) return html.replace(re, replacement);
  // If tag not found, inject right before </head>
  return html.replace(/\s*<\/head>/i, `\n${replacement}\n</head>`);
}

function prerenderHtml(routeDef) {
  const route = routeDef.route;
  const url = route === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;

  let html = baseHtml;

  // Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(routeDef.title)}</title>`);

  // Description
  html = upsertTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>(\s*)/i,
    `<meta name="description" content="${escapeAttr(routeDef.description)}" />`
  );

  // Canonical
  html = upsertTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>(\s*)/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`
  );

  // OG url/title/desc
  html = upsertTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>(\s*)/i, `<meta property="og:url" content="${escapeAttr(url)}" />`);
  html = upsertTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>(\s*)/i, `<meta property="og:title" content="${escapeAttr(routeDef.title)}" />`);
  html = upsertTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>(\s*)/i, `<meta property="og:description" content="${escapeAttr(routeDef.description)}" />`);

  // Twitter title/desc
  html = upsertTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>(\s*)/i, `<meta name="twitter:title" content="${escapeAttr(routeDef.title)}" />`);
  html = upsertTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>(\s*)/i, `<meta name="twitter:description" content="${escapeAttr(routeDef.description)}" />`);

  return html;
}

for (const r of routes) {
  if (r.route === '/') continue; // keep dist/index.html as-is

  const outDir = path.join(distDir, r.route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'index.html');

  fs.writeFileSync(outPath, prerenderHtml(r), 'utf8');
  console.log(`prerender: ${r.route} -> ${path.relative(process.cwd(), outPath)}`);
}

console.log('prerender: done');
