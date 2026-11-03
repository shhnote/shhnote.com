import { defineConfig } from 'astro/config';
import { defaultLocale, locales } from './src/lib/i18n';

// https://astro.build/config
export default defineConfig({
  site: 'https://shhnote.com',
  output: 'static',
  build: {
    // The CSP has no 'unsafe-inline': every stylesheet and script is a file.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline small scripts or assets into the HTML.
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    // Highlighting emits inline style attributes, which the CSP (style-src 'self') blocks.
    syntaxHighlight: false,
  },
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
