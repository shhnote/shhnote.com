---
title: "shhnote vs Onetime Secret"
description: "How shhnote.com compares with Onetime Secret, from what the Onetime Secret project publishes about itself."
eyebrow: "Compare"
intro: "Onetime Secret is an open-source service for single-use links, also run as a hosted service at onetimesecret.com."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | Onetime Secret |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | not stated in the README |
| Where the key lives | In the link after the #, never sent to the server | not stated |
| One-time view | Yes, or open until it expires | Yes: "Onetime links self-destruct after viewing" |
| Lifetime | 15 minutes to 14 days | not stated |
| Files | Yes | not stated |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | not stated |
| Account | None, to create or to open | not stated |
| Licence | AGPL-3.0 | MIT |
| Self-hosting | Yes | Yes, with a self-hosting guide and a Docker quick start |

## Where they differ

- Onetime Secret's README describes single-use links and self-hosting, but not where or how a secret is encrypted. It does warn that losing the server's `SECRET` key "makes existing secrets unreadable". Read the project's own documentation for its encryption model before relying on it.
- shhnote encrypts in your browser and keeps the key in the link fragment, so the server holds only ciphertext it cannot open.
- Onetime Secret is MIT-licensed; shhnote is AGPL-3.0, so anyone who runs a modified shhnote for others must publish their changes.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [Onetime Secret on GitHub (README)](https://github.com/onetimesecret/onetimesecret), checked 2026-11-03
