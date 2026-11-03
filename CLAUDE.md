# shhnote.com

The public frontend for the hosted shhnote instance at https://shhnote.com.
An Astro static site; the secret-sharing behaviour comes from the
`@shhnote/client` package published from https://github.com/shhnote/shhnote.
In production the server runs in `SHH_WEB=api` mode behind Caddy on the same
origin, so this site owns every public page and the API lives at `/api/v1`.

## What this repository is not

- Not a place for cryptography, requests to the API, or reveal/claim logic.
  All of that is `@shhnote/client`. If a flow needs behaviour the package
  lacks, the fix is a PR to the main repository, not code here.
- Not the reference frontend. The main repository ships a minimal one; this
  site is one operator's design and content for one instance.
- Not where the protocol or the API is documented. `docs` renders the main
  repository's `docs.md` at the tag in `.shhnote-ref`.

## Non-negotiables (the instance's own claims)

- No request to any origin but this site. No analytics, no external fonts,
  images, scripts or embeds. `scripts/check-external.sh` fails the build on
  any `http(s)://` URL in `dist/` outside its allow-list (citation links on
  `compare/` pages are the only exception).
- No inline scripts or styles. The CSP is
  `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self';
  img-src 'self' data:; font-src 'self'; connect-src 'self';
  frame-ancestors 'none'; base-uri 'none'; form-action 'self'`.
- `/s`, `/burn` and `/report` request nothing until a trusted user
  activation. The `@shhnote/client/ui` controllers enforce this; never add a
  handler that bypasses them.
- Every page works without JavaScript except the secret flows, which say so.
- Works in Tor Browser at the Safer level.
- `argon2.wasm` is served from this origin and prefetched on home and `/s`.
- The share-link fragment never reaches the server and is scrubbed from
  history after reveal; the controller does this, so leave `history` alone.

## Layout

- `src/pages/[locale]/…` — one route per page per locale, prerendered.
- `src/content/<locale>/` — Markdown content collections.
- `src/strings/<locale>.json` — UI strings; `en` is the source of truth.
- `src/lib/strings.ts` — builds the `t` function passed to the controllers.
- `src/styles/tokens.css` — colour, type and spacing tokens; four themes.
- `scripts/` — `check-external.sh`, `fetch-upstream.sh` (reads `.shhnote-ref`).
- `docs/` — headers reference, conformance record, translations record.

## Conventions

- Locales: 18 codes in `astro.config` `i18n.locales`; `prefixDefaultLocale`
  on, so `/en/` exists. `he` is RTL. Missing strings fall back to `en`.
- Controllers bind by `data-shh-*` attributes. Markup contains every state a
  controller toggles (hidden with the `hidden` attribute), so pages render
  fully without JavaScript.
- Strings for the controllers come from the locale files, never from text in
  components.
- `.shhnote-ref` pins the main repository tag that `docs` is rendered from.
  Bump it deliberately, in its own commit.
- Versions: `package.json` is the frontend version in the footer; the backend
  version comes from `GET /api/v1/config` at runtime.
- No deploy logic here. Releases are tarballs on GitHub; the server pulls.
- Do not make commits yourself, show the commit message at the end of a task: `<area>: <what changed>`, under 70 characters.

## Local development

```
npm ci
# a local shhnote instance in api mode on http://localhost:3000, setup gate cleared
PUBLIC_SHH_API_BASE=http://localhost:3000/api/v1 npm run dev
npm run build && scripts/check-external.sh
```