import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { availableLocales, isLocale } from '../lib/i18n';
import { site } from '../lib/site';

// Every indexable page: the home page, the content pages and the API docs, per built
// locale. The secret interstitials (/s, /burn, /report) are deliberately left out.
export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');
  const urls = new Set<string>();
  for (const locale of availableLocales) {
    urls.add(`${site.url}/${locale}/`);
    urls.add(`${site.url}/${locale}/docs/`);
  }
  for (const entry of pages) {
    const [locale, slug] = entry.id.split('/');
    if (locale && slug && isLocale(locale) && availableLocales.includes(locale)) {
      urls.add(`${site.url}/${locale}/${slug}/`);
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
