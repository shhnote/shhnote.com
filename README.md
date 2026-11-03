# shhnote.com

The public website of the hosted [shhnote](https://github.com/shhnote/shhnote)
instance at https://shhnote.com: a static site built with Astro, in 18 languages.
The pages are this site's own; the secret-sharing behaviour (encryption in the
browser, the create, reveal, burn and report flows) comes from the
`@shhnote/client` package, and the API it talks to is the shhnote server running
behind the same origin at `/api/v1`.

The site makes no request to any origin but its own: fonts, styles, scripts and
the Argon2 module are served from here, there is no analytics, and no inline
script or style (the CSP forbids them). Every page works without JavaScript
except the secret flows, which say so. `scripts/check-external.sh` fails if an
external URL slips into the build; the only exception is the citation links on
the `compare/` pages.

## Local development

You need Node.js 22 or later and a local shhnote instance in `api` mode
(`SHH_WEB=api`, setup gate cleared) on `http://localhost:3000`.

```
npm ci
npm run dev                 # http://localhost:4321/en/
npm run build && scripts/check-external.sh
npm run preview             # serves dist/
```

- `npm run dev` proxies `/api` to `http://localhost:3000`, so the site and the
  API share an origin as they do in production. Set `SHH_DEV_PROXY` to proxy
  somewhere else, e.g. `SHH_DEV_PROXY=http://localhost:8080 npm run dev`.
- `PUBLIC_SHH_API_BASE` points the pages at an API on another origin instead of
  `/api/v1` (that instance must list this origin in its allowed origins).
  `PUBLIC_SHH_MAX_BLOB_BYTES` sets the largest body a reveal accepts before the
  server's `/config` answers. Both are read at build time; see `.env.example`.
- The `docs` page renders the main repository's API documentation at the tag in
  `.shhnote-ref` (`SHHNOTE_REF` overrides it). `scripts/fetch-upstream.sh` runs
  before `dev` and `build`; it reads a checkout at `../shhnote` (`SHHNOTE_DIR`
  overrides) or, without one, downloads the file from GitHub at that tag.

Layout: pages in `src/pages/[locale]/`, Markdown content in
`src/content/<locale>/`, UI strings in `src/strings/<locale>.json` (`en` is the
source), styles in `src/styles/`.

## Releases

A `v*` tag builds the site, runs the external-URL check and publishes a GitHub
release with `shhnote.com-<tag>.tar.gz` (the contents of `dist/`), `SHA256SUMS`
and a build provenance attestation (`.github/workflows/release.yml`). Nothing
here deploys; the server pulls a release. Response headers for the server are
in `docs/headers.md`.

## Conformance

This site is a frontend for shhnote and follows the main repository's frontend
conformance checklist (`docs/frontend-conformance.md` there): a static reveal
page, no request before a trusted click, the link fragment scrubbed after use,
bounded bodies, no expiry information shown, and the rest. How each item is met
and how it was checked is recorded in [docs/conformance.md](docs/conformance.md).

## Translations

English is the source. The other 17 languages are machine translations awaiting
review by native speakers; [docs/translations.md](docs/translations.md) records
the source and status of each, and [CONTRIBUTING.md](CONTRIBUTING.md) says how to
send corrections.

## Licence

Code: AGPL-3.0-only (LICENSE). Content, design and brand: all rights
reserved (LICENSE-CONTENT). The shhnote name and logo may not be used for
another instance.
