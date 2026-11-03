# Response headers and routing for shhnote.com

The site is static files in `dist/`, served by Caddy on the same origin as the
shhnote server (`SHH_WEB=api` mode), which answers under `/api/v1`. This is the
reference for the Caddy configuration; the repository carries no deploy logic.

## Headers on every response

```caddyfile
header {
    Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Referrer-Policy "no-referrer"
    Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()"
    Cross-Origin-Opener-Policy "same-origin"
    Cross-Origin-Resource-Policy "same-origin"
    -Server
}
```

What each one relies on in this repository:

- **CSP.** No inline scripts or styles exist in `dist/` (`build.inlineStylesheets:
  'never'`, `vite.build.assetsInlineLimit: 0`, Markdown syntax highlighting off,
  no `style=` attributes). `'wasm-unsafe-eval'` is for `argon2.wasm`. `img-src
  data:` covers the select chevron; nothing else is inlined.
- **Referrer-Policy.** The pages also carry `<meta name="referrer"
  content="no-referrer">`, so a share link's path never leaks even if the header
  is missing.
- **X-Frame-Options** duplicates `frame-ancestors 'none'` for old browsers.

## Routes and redirects

The share, burn and report links are built without a locale (`/s#…`, `/burn#…`,
`/report`). The site builds those three pages at the root as well (English), so the
links work on any static host with no redirect: `/s` → `301` → `/s/` is the file
server's own slash redirect, and browsers carry the URL fragment across it.

Optionally send visitors to their language instead; use a real 3xx (never a meta
refresh, which drops the fragment), and `302` so a later change in language
negotiation is not cached:

```caddyfile
redir / /en/ 301
# optional, e.g. after Accept-Language negotiation:
# redir /s /de/s/ 302
```

Astro also writes a static `/index.html` that meta-refreshes to `/en/`; the `redir`
above takes precedence and should stay.

The API is proxied to the shhnote server; everything else is the static site:

```caddyfile
handle /api/* {
    reverse_proxy 127.0.0.1:3000
}
handle {
    root * /srv/shhnote.com/dist
    file_server
}
```

The server sets `Cache-Control: no-store` on API responses itself; do not add a
cache layer in front of `/api/*`.

## Content types and caching

- `argon2.wasm` must be served as `application/wasm`
  (`WebAssembly.compileStreaming` refuses anything else). Caddy's default MIME
  table does this; keep it.
- `/_astro/*` files carry a content hash: `Cache-Control: public, max-age=31536000,
  immutable`.
- HTML pages, `sitemap.xml` and `robots.txt`: `Cache-Control: public, max-age=600`
  or shorter. The secret interstitials are static and may be cached like any
  page; nothing per-secret is ever in a response from the site.

```caddyfile
@assets path /_astro/* /fonts/*
header @assets Cache-Control "public, max-age=31536000, immutable"
```

## Checking

After a deploy, from outside: `curl -sI https://shhnote.com/en/` shows every
header above; `curl -sI https://shhnote.com/s` is a `302` to `/en/s/`;
`curl -sI https://shhnote.com/argon2.wasm` says `application/wasm`.
