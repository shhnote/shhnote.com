---
title: "shhnote vs SnapPass"
description: "How shhnote.com compares with SnapPass, the open-source password-sharing app from Pinterest, from its README."
eyebrow: "Compare"
intro: "SnapPass is a small open-source web app for sharing passwords through links that stop working once they have been read or have expired."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | SnapPass |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | Fernet symmetric encryption; whether in the browser or on the server is not stated |
| Where the key lives | In the link after the #, never sent to the server | "never stored; it is rather sent as part of the password link" |
| One-time view | Yes, or open until it expires | A password can be read only if it "has not been read" and "is not expired" |
| Lifetime | 15 minutes to 14 days | 2 weeks by default, which is also the maximum through the API |
| Files | Yes | not stated |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | not stated |
| Account | None, to create or to open | not stated |
| Licence | AGPL-3.0 | MIT |
| Self-hosting | Yes | Yes (pip or Docker; needs Redis) |

## Where they differ

- Both put the key in the link rather than in storage. In shhnote the key sits in the fragment after the #, which browsers never send to a server, and encryption and decryption happen in the browser.
- Both make secrets disappear once they are read, and both cap the lifetime at two weeks.
- SnapPass is something you run yourself (Python and Redis). shhnote.com is a hosted instance, and shhnote can be self-hosted too.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [SnapPass on GitHub (README)](https://github.com/pinterest/snappass), checked 2026-11-03
