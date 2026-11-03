# Comparison sources

The services the `compare/` pages describe, and the public pages each claim is
taken from. Every statement about another service on those pages must be backed
by one of these pages, as the service itself publishes it; if a page does not say
something, the comparison says "not stated" instead of guessing. Sources were
last checked on 2026-11-03; re-check them and update the date on the page when a
page changes.

These URLs are the only external links the build allows, and only on the
`compare/` pages (see `scripts/check-external.sh`).

| page | service | sources |
|---|---|---|
| `compare/onetimesecret/` | Onetime Secret | https://github.com/onetimesecret/onetimesecret (README) |
| `compare/privatebin/` | PrivateBin | https://privatebin.info/, https://github.com/PrivateBin/PrivateBin |
| `compare/yopass/` | Yopass | https://github.com/jhaals/yopass (README) |
| `compare/password-pusher/` | Password Pusher | https://github.com/pglombardo/PasswordPusher (README), https://eu.pwpush.com/ |
| `compare/bitwarden-send/` | Bitwarden Send | https://bitwarden.com/products/send/, https://bitwarden.com/help/about-send/ |
| `compare/1password/` | 1Password item sharing | https://support.1password.com/share-items/ |
| `compare/snappass/` | SnapPass | https://github.com/pinterest/snappass (README) |

Notes from the 2026-11-03 check:

- onetimesecret.com itself answered with HTTP 401 to an automated fetch, so the
  Onetime Secret page only uses the GitHub README. The README does not describe
  where or how secrets are encrypted; the page says so rather than filling it in.
- Bitwarden's product page says a Send lives "anywhere from 1 hour to 30 days";
  the help centre says "max. 31 days". The page cites both.
- 1Password's support page does not state end-to-end encryption, a maximum link
  lifetime or a one-view limit for shared items; the page says "not stated".
