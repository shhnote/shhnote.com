---
title: "shhnote vs Yopass"
description: "How shhnote.com compares with Yopass, the open-source secret-sharing service, from the Yopass README."
eyebrow: "Compare"
intro: "Yopass is an open-source, self-hosted service for sharing passwords, files and other sensitive information, with a public demo instance."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | Yopass |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | In the browser, with OpenPGP |
| Where the key lives | In the link after the #, never sent to the server | "never stored with the secret" |
| One-time view | Yes, or open until it expires | Yes: "removed after its first retrieval" |
| Lifetime | 15 minutes to 14 days | Automatic expiration with "optional custom durations"; maximum not stated |
| Files | Yes | Yes; uploads over 1 MB are listed under the business licence |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | not stated |
| Account | None, to create or to open | not stated |
| Licence | AGPL-3.0 | Apache-2.0 (open-source edition) |
| Self-hosting | Yes | Yes; the README recommends self-hosting for sensitive information |

## Where they differ

- Both encrypt in the browser before anything reaches the server.
- Yopass encrypts with OpenPGP; shhnote uses AES-256-GCM with keys derived by HKDF from a seed in the link, and Argon2id for an optional passphrase.
- Yopass describes its public instance as a demo "useful for testing" and recommends running your own. shhnote.com is a hosted instance meant for real use; you can also run your own.
- Yopass lists files over 1 MB under its business licence. shhnote.com handles files in the same flow as text, within the size limit the site shows.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [Yopass on GitHub (README)](https://github.com/jhaals/yopass), checked 2026-11-03
