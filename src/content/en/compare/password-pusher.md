---
title: "shhnote vs Password Pusher"
description: "How shhnote.com compares with Password Pusher (pwpush), from its README and its hosted site."
eyebrow: "Compare"
intro: "Password Pusher shares a password, note, file or URL that expires after a number of views, a time limit, or both. It is open source and also a hosted service with free and paid plans."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | Password Pusher |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | "AES-256 encrypted" and "stored encrypted"; whether in the browser or on the server is not stated |
| Where the key lives | In the link after the #, never sent to the server | not stated |
| One-time view | Yes, or open until it expires | Limit by number of views and/or time |
| Lifetime | 15 minutes to 14 days | maximum not stated |
| Files | Yes | Yes |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | not stated |
| Account | None, to create or to open | Not needed to push; accounts add dashboards, audit logs and 2FA |
| Licence | AGPL-3.0 | Apache-2.0 |
| Self-hosting | Yes | Yes (Docker, Kubernetes, Helm) |

## Where they differ

- Password Pusher's pages say data is stored encrypted, but not whether it is encrypted in your browser or on the server. shhnote encrypts in your browser and the key never reaches the server.
- Password Pusher offers accounts with audit logs that show "when links were created, viewed, and by whom". shhnote keeps no record of who created or opened a secret, by design, so it has no audit log to offer.
- Password Pusher can expire a push after a chosen number of views. shhnote offers either one view or repeat views until the secret expires.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [Password Pusher on GitHub (README)](https://github.com/pglombardo/PasswordPusher), checked 2026-11-03
- [Password Pusher hosted service](https://eu.pwpush.com/), checked 2026-11-03
