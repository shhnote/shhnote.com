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
`/report#…`). The site builds those three pages at the root as well, in English, so
the links work on any static host with no redirect at all; `/` is an Astro redirect
page to `/en/`. Both are fallbacks: the hosted instance sends the four unprefixed
paths to the visitor's language with a real 3xx, as the main repository's
`docs/deploy/own-frontend.md` describes for a frontend with language prefixes.
Browsers carry the `#fragment` of a share or burn link across a redirect, so the
secret survives it; a `<meta http-equiv="refresh">` would drop it, which is why the
redirect has to come from the server.

Inside the site block, before the catch-all `handle`:

```caddyfile
# The browser's first listed language if the site has it, otherwise English.
map {header.Accept-Language} {shh_locale} {
    ~^\s*de\b  de
    ~^\s*es\b  es
    ~^\s*fr\b  fr
    ~^\s*nl\b  nl
    ~^\s*hi\b  hi
    ~^\s*ja\b  ja
    ~^\s*pl\b  pl
    ~^\s*zh\b  zh
    ~^\s*el\b  el
    ~^\s*id\b  id
    ~^\s*ko\b  ko
    ~^\s*pt\b  pt
    ~^\s*sv\b  sv
    ~^\s*he\b  he
    ~^\s*it\b  it
    ~^\s*ro\b  ro
    ~^\s*tr\b  tr
    default    en
}
@unprefixed path / /s /burn /report
handle @unprefixed {
    # The target depends on the request's language: caches must key on it.
    header Vary Accept-Language
    # `*` first: a target starting with `/` would otherwise be read as a matcher.
    redir * /{shh_locale}{uri} 307
}
```

One `map` line per locale in `src/lib/i18n.ts` `availableLocales`; keep them in
step. The map looks only at the first language the browser lists, not at the `q=`
weights. A `307` is not cached unless told to and keeps the method; a CDN in
front must honour `Vary: Accept-Language` or bypass its cache for these four paths.

A visitor who has picked a language in the site's switcher is then moved once more,
in the browser, to that language (`src/scripts/locale.ts`, from the page's
`hreflang` alternates, fragment kept), so the server-side guess only decides the
first visit.

With another server or a static host, do the same: answer those four paths with a
`307` (or `302`) to the same path under the chosen prefix, keep the query string,
add no fragment of your own, and send `Vary: Accept-Language`. Without any
redirect the root pages simply serve English.

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
header above; `curl -sI -H 'Accept-Language: de' https://shhnote.com/s` is a `307`
to `/de/s` with `Vary: Accept-Language`, and without the header a `307` to `/en/s`;
`curl -sI https://shhnote.com/argon2.wasm` says `application/wasm`.
