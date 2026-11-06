# Frontend conformance record

The checklist is `docs/frontend-conformance.md` in the main repository at the tag in
`.shhnote-ref` (`v0.5.0`). This records how each item is met by this site and how it was
checked. "By construction" means the `@shhnote/client/ui` controller does it and the
site adds no handler that bypasses it. Checks were first run on 2026-11-03 against
shhnote 0.3.0 and re-run on 2026-11-05 against a local instance (`SHH_WEB=api`, shhnote
0.4.1) with `@shhnote/client` 0.4.1, driving a real Chrome over the DevTools Protocol so
clicks and key presses are trusted input. On 2026-11-06 the flows were run again against
shhnote 0.5.0 with `@shhnote/client` 0.5.0 (the release changed server configuration
only): one `/config` request on home, one `POST /secrets` per create, no request on `/s`
or `/burn` before the click, the fragment scrubbed after reveal, a second open and an
open after burn both "not found".

| # | Item | Status | How it is met / checked |
|---|------|--------|-------------------------|
| 1 | Reveal interstitial is static | **Verified** | `/en/s/` is a prerendered file. Fetched with two different fragments from `curl`; the bodies are byte-identical. |
| 2 | Nothing fetched before a trusted activation | **Verified** (by construction) | `wireReveal`. Opening `/en/s/#…`: no API request. `document.querySelector('[data-shh-form=reveal] button').click()` and `form.requestSubmit()` from the console: still no request. A real click: `GET /config`, `POST /secrets/reveal`, then `POST /secrets/confirm`. The `/burn` page likewise sends nothing until its button is pressed, and `/report` nothing until submit. |
| 3 | Fragment scrubbed after use | **Verified** (by construction) | After a reveal, after a reveal of a link that was already used ("not found") and after a burn the URL is `/s` resp. `/burn` with no `#…`; `history.length` is unchanged (replaceState). |
| 4 | Download names sanitised | **Verified** (by construction) | A file named `invoice‮fdp.exe` declared `text/html` is shown as `invoicefdp.exe` inside `<bdi>`, the download name is the cleaned one, and the blob URL serves `application/octet-stream`. |
| 5 | Wrong passphrase costs no round trip; claim survives failure | **Verified** (by construction) | Two wrong passphrases then a reload: the first press made one `GET /config` and one `POST /secrets/reveal`, the retries made none. During the claim window `sessionStorage` holds one entry (the claim token under `SHA-256(lookup)`); after the reload the next press sends `claim_token` in its reveal request, the right passphrase decrypts the secret, and after the confirm `sessionStorage` is empty again. |
| 6 | Bodies capped | **By construction** | The reveal controller reads `max_blob_bytes` (a padded-size bucket) from `/config` after the press and caps the body at `blobLen` of it, announced and received; the page passes no cap of its own. |
| 7 | Decrypted material wiped on leave | **By construction** | `wireReveal` registers the `pagehide` wipe; the pages add no copies of the payload elsewhere. |
| 8 | No expiry information shown | **Verified** | A TTL secret reveals with the lifetime badge hidden and no mention of hours, days or expiry on the page; a single-view one says "Revealed" until the confirm succeeds, then "Destroyed · this was the only view and the server has deleted it". The interstitial carries no expiry chip (the design's "Expires in 23 hours" chip was dropped). |
| 9 | WebAssembly unavailable is a clear failure | **By construction, manual check pending** | `loadArgon2` rejects with `argon2_unavailable`; the strings `reveal-error-wasm` / `create-error-wasm` are wired. Headless Chromium here could not be started without WebAssembly, so the on-screen message is to be confirmed in Tor Browser at "Safer" (below). |
| 10 | `argon2.wasm` fetched on every create and reveal page | **Verified** | Loading `/en/` and `/s#<valid>` each requests `/argon2.wasm?v=0.5.0` (a `<link rel=prefetch>` plus the controller's `prefetchArgon2`; same URL, served from the prefetch cache the second time). A bare `/en/s/` shows "not found", fetches the module once through the page's prefetch tag only, and makes no API request. The module is served from this origin at `/argon2.wasm`, the URL passed to the controllers as `argon2Url`. |
| 11 | Empty passphrase is not a passphrase | **By construction** | The controllers skip a blank field. |
| 12 | Content Security Policy | **Build verified, headers at deploy** | `dist/` contains no inline script, no `<style>`, no `style=` attribute and no `on*=` handler (checked on every build); the only inline `<script>` is a `type="application/json"` data block, which the CSP does not execute. The header itself (`docs/headers.md`) is Caddy's; confirm after deploy with `curl -sI`. |
| 13 | No external origins | **Verified** | `scripts/check-external.sh` fails the build on any URL outside the allow-list (only XML namespace identifiers and `github.com/shhnote` links pass). Every request recorded while driving the pages went to the site origin. Fonts, styles, scripts and the wasm module are local. |
| 14 | `argon2.wasm` served as `application/wasm` | **Dev verified, prod at deploy** | The dev server answers `Content-Type: application/wasm`; Caddy's default MIME table does the same (`docs/headers.md`). |
| 15 | API origin in `allowed_origins` | **N/A in production** | The site and the API share the origin (`/api/v1` behind Caddy). For a cross-origin dev setup the instance would need the dev origin in `allowed_origins`; the dev server proxies `/api` instead. |
| 16 | Security headers on every response | **At deploy** | `docs/headers.md` lists HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, Permissions-Policy, COOP/CORP. The pages also carry `<meta name="referrer" content="no-referrer">`. |
| 17 | No caching of anything per-secret | **Verified** | Static site, no service worker; nothing per-secret is ever in a page. API responses are the server's (`no-store`). |
| 18 | Copy | **Verified** | Pages say "this site"; no view counts, exact sizes or remaining time anywhere in `dist/` (grep; the files hint shows the instance's `max_blob_bytes` bucket from `/config`, not a secret's size). Contact addresses are the site's own: `contact@shhnote.com` is a catch-all, so `security@`, `abuse@` and `legal@shhnote.com` are delivered too (confirmed by the operator, 2026-11-05). |

## Manual checks still to run

- **The first tag** (`scripts/bump-version.sh 0.1.0-rc.1`) and a look at the release:
  the archive, `SHA256SUMS` and the provenance attestation. `actionlint` passed on
  `.github/workflows/release.yml` with no findings (2026-11-05).
- **Tor Browser, "Safer":** full create and reveal of a text, a file and a passphrase
  secret; passphrase reveal must work (WebAssembly is allowed at Safer).
- **Tor Browser, "Safest":** every page renders; the create page shows the JavaScript
  notice; a passphrase reveal must show the WebAssembly message (item 9), not "corrupt".
- **After deploy:** `curl -sI https://shhnote.com/en/` shows the CSP and the headers of
  item 16; `curl -sI https://shhnote.com/argon2.wasm` says `application/wasm`;
  adding a `<style>` in devtools is blocked by the CSP.

## Upstream

Both findings from the first pass are fixed in `@shhnote/client` 0.4.0: the claim token is
kept in `sessionStorage` for the claim window (item 5), and `InstanceConfig` carries
`server_version`.
