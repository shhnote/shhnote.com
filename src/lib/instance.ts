import pkg from '@shhnote/client/package.json';

// Facts the pages hand to the `@shhnote/client/ui` controllers as options. Browser-safe:
// the page scripts import this module too.

// The API base. In production the API is on this origin (`/api/v1` behind Caddy); in
// development `npm run dev` proxies `/api` there, so the default holds as well.
export const apiBase: string = import.meta.env.PUBLIC_SHH_API_BASE ?? '/api/v1';

/** The version of `@shhnote/client` this site is built with. */
export const clientVersion: string = pkg.version;

/**
 * The Argon2id module, served from this origin by the `argon2` integration (the package
 * refuses any other origin). The package version in the query makes an upgrade bypass a
 * cached copy; both the `<link rel="prefetch">` and the controllers use this exact URL.
 */
export const argon2Url = `/argon2.wasm?v=${clientVersion}`;
