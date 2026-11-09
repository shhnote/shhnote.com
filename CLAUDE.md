# shhnote.com

The public frontend for the hosted shhnote instance at https://shhnote.com.
An Astro static site; the secret-sharing behaviour comes from the
`@shhnote/client` package published from https://github.com/shhnote/shhnote.
In production the server runs in `SHH_WEB=api` mode with domain routing, so this
site owns every public page and the API lives at `https://api.shhnote.com/v1`; the
release build gets that from the Actions variable `PUBLIC_SHH_API_BASE`.

## What this repository is not

- Not a place for cryptography, requests to the API, or reveal/claim logic.
  All of that is `@shhnote/client`. If a flow needs behaviour the package
  lacks, the fix is a PR to the main repository, not code here.
- Not the reference frontend. The main repository ships a minimal one; this
  site is one operator's design and content for one instance.
- Not where the protocol or the API is documented. `docs` renders the main
  repository's `docs.md` at the tag in `.shhnote-ref`.

## Non-negotiables (the instance's own claims)

- No request to any origin but this site and the instance's API host. No
  analytics, no external fonts, images, scripts or embeds.
  `scripts/check-external.sh` fails the build on any `http(s)://` URL in `dist/`
  outside its allow-list (the origin of `PUBLIC_SHH_API_BASE` is the only
  exception).
- No inline executable scripts or styles; the one inline element per page is
  a `<script type="application/json" data-shh-i18n>` data block the controllers
  read their strings from. The CSP is
  `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self';
  img-src 'self'; font-src 'self'; connect-src 'self' https://api.shhnote.com;
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
  `src/pages/{s,burn,report}.astro` serve the English pages at the root, for
  the locale-less links the client builds; `index.astro` redirects to `/en/`.
  `[locale]/404.astro` and `[locale]/error.astro` are the error pages (layout
  `src/layouts/Error.astro`), `404.astro` the English one at `/404.html`; Caddy
  picks one per failed URL (`docs/headers.md`, Error pages).
- `src/content/<locale>/` — Markdown content collections.
- `src/strings/<locale>.json` — UI strings; `en` is the source of truth.
- `src/lib/i18n.ts` — the locale list, names, direction and `og:locale` tags.
- `src/lib/strings.ts` — loads a locale's strings with `en` fallback
  (`getStrings`) and the controller strings for the page's data block
  (`uiStrings`); the controllers' `t` is the package's own `createT`.
- `src/lib/instance.ts` — API base (`PUBLIC_SHH_API_BASE`, empty or unset means
  `/api/v1`) and `argon2Url`, from the package version.
- `src/scripts/chrome.ts` — theme, menus, password toggles (from `/ui`),
  footer server version, `theme-color` sync. `src/scripts/locale.ts` — the
  stored language choice and its redirect.
- `src/integrations/argon2.ts` — copies the package's `argon2.wasm` into the
  build and serves it in dev.
- `src/styles/tokens.css` — colour, type and spacing tokens; four themes.
- `scripts/` — `check-external.sh`, `fetch-upstream.sh` (reads `.shhnote-ref`).
- `src/lib/build.ts` — the commit the build was made from, for the footer.
- `docs/` — headers reference, conformance record, translations record.

## Conventions

- Locales: 18 codes in `src/lib/i18n.ts`, imported by `astro.config`;
  `prefixDefaultLocale` on, so `/en/` exists. `he` is RTL. Missing strings fall
  back to `en`.
- Controllers bind by `data-shh-*` attributes. Markup contains every state a
  controller toggles (hidden with the `hidden` attribute), so pages render
  fully without JavaScript. Forms and buttons that only work with a controller
  ship `hidden` and are shown by it; a `<noscript>` notice stands in.
- Strings for the controllers come from the locale files, never from text in
  components.
- `.shhnote-ref` pins the main repository tag that `docs` is rendered from.
  Bump it deliberately, in its own commit.
- Versions: the footer shows the commit the site was built from (there are no
  frontend version numbers, and `package.json`'s version is not used); the backend
  version comes from the API's `GET /config` at runtime, through the package's
  shared `getConfig`, so a page makes that request once.
- Type check: `npm run check` (`astro check`) must stay at zero errors.
- No deploy logic here. A push to the `production` branch (a commit already on
  `main`) publishes a release tagged `prod-<date>-<commit>`: a tarball on GitHub
  that the server pulls. Nobody tags or bumps versions by hand.
- Do not make commits yourself, show the commit message at the end of a task: `<area>: <what changed>`, under 70 characters.

## Local development

```
npm ci
# a local shhnote instance in api mode on http://localhost:3000, setup gate cleared
npm run dev                  # proxies /api there (SHH_DEV_PROXY to change)
npm run build && scripts/check-external.sh && npm run check
```

The dev server does not see file changes on a Windows mount under WSL; restart
it after edits. `PUBLIC_SHH_API_BASE` is only for an API on another origin,
which must allow this one (CORS), so it is not the local setup; the release
build sets it, and `check-external.sh` needs the same value in its environment.