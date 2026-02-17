import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoParams = {
  title: string;
  description: string;
  path: string; // e.g. "/research"
  image?: string; // absolute preferred
};

const SITE_ORIGIN = 'https://pgrlab.cl';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/logo-full.png`;

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
    return;
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertLinkCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo({ title, description, path, image }: SeoParams) {
  const location = useLocation();

  useEffect(() => {
    const url = `${SITE_ORIGIN}${path === '/' ? '' : path}`;
    const img = image || DEFAULT_IMAGE;

    document.title = title;
    upsertLinkCanonical(url);

    // Basic
    upsertMeta('meta[name="description"]', { name: 'description', content: description });

    // Open Graph
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: img });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: img });
  }, [location.pathname, title, description, path, image]);
}
