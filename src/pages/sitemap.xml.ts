import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { availableLocales, defaultLocale, isLocale } from '../lib/i18n';
import { site } from '../lib/site';

// Every indexable page: the home page and the content pages per built locale (the
// compare and use-case pages exist in English only), and the API docs (English only). The secret interstitials (/s, /burn, /report) are deliberately left out.
export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');
  const urls = new Set<string>();
  for (const locale of availableLocales) urls.add(`${site.url}/${locale}/`);
  urls.add(`${site.url}/${defaultLocale}/docs/`);
  for (const entry of pages) {
    // `<locale>/<slug>`, or `<locale>/<section>/<page>` with `index` as the section overview.
    const [locale, ...path] = entry.id.split('/');
    if (locale && path.length && isLocale(locale) && availableLocales.includes(locale)) {
      const rest = path.filter((part) => part !== 'index').join('/');
      urls.add(`${site.url}/${locale}/${rest}/`);
    }
  }
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...urls]
      .sort()
      .map((loc) => `  <url><loc>${loc}</loc></url>`)
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
