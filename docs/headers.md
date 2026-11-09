# Response headers and routing for shhnote.com

The site is static files in `dist/`, served by Caddy. The shhnote server runs in
`SHH_WEB=api` mode with `SHH_API_ROUTING=domain`, so the API has its own host,
`https://api.shhnote.com/v1`, and the site host does not proxy `/api` at all. The
release build points the pages there through the repository's Actions variable
`PUBLIC_SHH_API_BASE`. This is the reference for the Caddy configuration of the site
host; the repository carries no deploy logic.

## Headers on every response

```caddyfile
header {
    Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self' https://api.shhnote.com; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
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
  no `style=` attributes). `'wasm-unsafe-eval'` is for `argon2.wasm`. No `data:`
  URL is used anywhere (the select chevron is drawn with CSS), so `img-src` is
  `'self'` alone. Should a build ever introduce one (the grep under "Checking"
  finds it), prefer removing it to widening the policy.
- **connect-src** names the API host and nothing else: it must be the origin of
  the `PUBLIC_SHH_API_BASE` the release was built with (the server does the same
  for its own pages in domain mode, `'self' {api_url}`). For a build left at the
  default `/api/v1` it is `'self'` alone.
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

Everything else is the static site:

```caddyfile
handle {
    root * /srv/shhnote.com/dist
    file_server
}
```

`api.shhnote.com` is a site block of its own that proxies to the shhnote server, as
the main repository's deploy documentation describes for domain routing. The server
answers CORS for its `SHH_URL` origin, so `SHH_URL` must be the origin this site is
served from. The server sets `Cache-Control: no-store` on API responses itself; do
not add a cache layer in front of the API.

A build left at the default `/api/v1` (the Actions variable unset) expects the API on
this origin instead: the site block then needs `handle /api/* { reverse_proxy
127.0.0.1:3000 }` before the catch-all, the server path routing, and `connect-src
'self'`.

## Error pages

The build has two error pages per locale: `/<locale>/404/` (the page does not exist)
and `/<locale>/error/` (anything else), plus `/404.html`, the English not-found page
that static hosts and Astro's dev server look for by name. They work without
JavaScript and claim no URL of their own (no canonical, no hreflang alternates,
`noindex`), because the server answers with them at the URL that failed, keeping its
status code. The language comes from that URL's prefix; anything without one gets
English.

At the site block's level, next to the `handle` blocks:

```caddyfile
handle_errors {
    # The failed path's locale prefix if the site has it, otherwise English.
    map {path} {shh_err_locale} {
        ~^/(en|de|es|fr|nl|hi|ja|pl|zh|el|id|ko|pt|sv|he|it|ro|tr)/  ${1}
        default  en
    }
    map {err.status_code} {shh_err_page} {
        404      404
        default  error
    }
    root * /srv/shhnote.com/dist
    rewrite * /{shh_err_locale}/{shh_err_page}/
    # An error is never cached, whatever the path rule above would say.
    header Cache-Control "no-store"
    file_server
}
```

The regex lists `src/lib/i18n.ts` `availableLocales`, like the language `map`; keep
them in step. A prefix the site does not build would rewrite to a page that does not
exist, and Caddy would fall back to its own empty error. `file_server` inside
`handle_errors` answers with the error's status, not `200`. The `header` block above
has already run when `file_server` fails, so the error response carries the same
security headers; check both under "Checking", since this configuration was written
without a Caddy to run it against. With another static host, point its not-found page
at `/404.html` (most do that by default).

Only errors Caddy itself raises reach these pages. When the origin cannot be reached
at all, Cloudflare answers with its own error page (5xx); replacing that is a
Cloudflare setting, not part of this build. The API host answers its own errors as
JSON.

## Content types and caching

- `argon2.wasm` must be served as `application/wasm`
  (`WebAssembly.compileStreaming` refuses anything else). Caddy's default MIME
  table does this; keep it.
- `/_astro/*` files carry a content hash: `Cache-Control: public, max-age=31536000,
  immutable`.
- `/fonts/*` and `/argon2.wasm` do not: the font files keep their plain names and
  the module is versioned by a query string, which a cache may ignore. They get a
  week without `immutable`, so a replaced file is picked up within that.
- HTML pages, `sitemap.xml` and `robots.txt`: `Cache-Control: public, max-age=600`
  or shorter. The secret interstitials are static and may be cached like any
  page; nothing per-secret is ever in a response from the site.

```caddyfile
@hashed path /_astro/*
header @hashed Cache-Control "public, max-age=31536000, immutable"
@plain path /fonts/* /argon2.wasm
header @plain Cache-Control "public, max-age=604800"
```

## Logging

The hosted Caddyfile keeps access logging off for this site: no `log` directive in
the site block (Caddy logs no requests unless asked), and the API's own logging is
the shhnote server's business. A share link's secret never reaches the server in
any case (it is a fragment), but the path `/s/` plus a timestamp and an address is
still metadata the privacy policy says is not kept. If a log is ever needed for
debugging, enable it briefly and remove it again rather than leaving it on.

## Behind Cloudflare

The hosted instance sits behind Cloudflare's proxy, which terminates TLS (the
privacy policy says so). Several Cloudflare features rewrite the HTML on its way
through, adding inline script or script from Cloudflare's hosts. The CSP above blocks
all of it, so each one shows up as a console error on every page. Without the CSP, it
would run third-party script on a site that says it loads none. Turn them off for the
zone:

- **Bot Fight Mode** (Security → Bots) injects an inline script that loads
  `/cdn-cgi/challenge-platform/…`. It applies to the whole zone, so it can also answer
  a request to `api.shhnote.com` with a challenge page instead of JSON, which no API
  client can get past.
- **Web Analytics**, automatic setup (Analytics & Logs → Web Analytics), injects
  `static.cloudflareinsights.com/beacon.min.js`.
- **Email Address Obfuscation** (Scrape Shield) replaces every `mailto:` address
  with `[email protected]` and a decoder script under `/cdn-cgi/scripts/`. The
  contact, privacy and acceptable-use pages carry `mailto:` links in every locale; with
  the decoder blocked, the addresses are gone for every visitor, with or without
  JavaScript.
- **Rocket Loader** (Speed → Optimization) rewrites the page's module scripts and
  loads its own from `/cdn-cgi/scripts/`.
- **Zaraz** and any other feature that adds script to pages (`/cdn-cgi/zaraz/…`).

Cloudflare also adds `Report-To` and `NEL` headers to responses (Network Error
Logging), so Chromium-based browsers report failed connections to
`a.nel.cloudflare.com`, a request to another origin that no page makes. The CSP does
not cover it. If the zone offers no way to switch it off, the privacy policy has to
say so.

Dashboard locations move; search the dashboard for the feature name. If one of these
has to stay on, keep the CSP as it is and let the injection fail: do not add
`'unsafe-inline'`, a hash or a Cloudflare host to the policy.

Cloudflare's cache does not key on `Accept-Language`, so no cache rule ("Cache
Everything" or similar) may cover the four redirecting paths under "Routes and
redirects"; without one, Cloudflare does not cache HTML or a `307`.

`scripts/check-external.sh` checks `dist/`, not what the edge serves, so none of this
shows up in the build; the last check under "Checking" catches it.

## Checking

After a deploy, from outside: `curl -sI https://shhnote.com/en/` shows every
header above (and `grep -rlE "[(\"']data:" dist/` on the build finds nothing); `curl -sI -H 'Accept-Language: de' https://shhnote.com/s` is a `307`
to `/de/s` with `Vary: Accept-Language`, and without the header a `307` to `/en/s`;
`curl -sI https://shhnote.com/argon2.wasm` says `application/wasm`;
`curl -s -D - -o /dev/null https://shhnote.com/de/nope` is a `404` with the
`Content-Security-Policy` header and `Cache-Control: no-store`, and its body (drop
`-o /dev/null`) is the German not-found page (`<html lang="de"`);
`curl -sI https://shhnote.com/nope` is a `404` too, in English;
`curl -sI -H 'Origin: https://shhnote.com' https://api.shhnote.com/v1/config`
answers `Access-Control-Allow-Origin: https://shhnote.com`.

Nothing is injected at the edge: this finds nothing (no output, exit status 1):

```sh
for p in en/ en/contact/; do
  curl -s "https://shhnote.com/$p"
done | grep -E 'cdn-cgi|cloudflareinsights|email-protection'
```

and `curl -sI https://shhnote.com/en/ | grep -iE '^(nel|report-to):'` shows whether
Network Error Logging is still on.
