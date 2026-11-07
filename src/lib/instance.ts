import pkg from '@shhnote/client/package.json';

// Facts the pages hand to the `@shhnote/client/ui` controllers as options. Browser-safe:
// the page scripts import this module too.

// The API base. The hosted instance routes the API by domain, so the release build sets
// `PUBLIC_SHH_API_BASE` (`https://api.shhnote.com/v1`, from the repository's Actions
// variable). Unset or empty means this origin's `/api/v1`, which is also what `npm run dev`
// proxies. `||`, not `??`: an unset Actions variable arrives as an empty string.
export const apiBase: string = import.meta.env.PUBLIC_SHH_API_BASE || '/api/v1';

/** The version of `@shhnote/client` this site is built with. */
export const clientVersion: string = pkg.version;

/**
 * The Argon2id module, served from this origin by the `argon2` integration (the package
 * refuses any other origin). The package version in the query makes an upgrade bypass a
 * cached copy; both the `<link rel="prefetch">` and the controllers use this exact URL.
 */
export const argon2Url = `/argon2.wasm?v=${clientVersion}`;
