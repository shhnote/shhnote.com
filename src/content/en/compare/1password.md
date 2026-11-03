---
title: "shhnote vs 1Password item sharing"
description: "How shhnote.com compares with sharing items by link from 1Password, from 1Password's support page."
eyebrow: "Compare"
intro: "1Password can share a saved item through a unique link, from its apps, 1Password.com or the browser extension."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | 1Password item sharing |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | not stated on the cited page |
| Where the key lives | In the link after the #, never sent to the server | not stated |
| One-time view | Yes, or open until it expires | not stated; recipients can view the item "until the link expires" |
| Lifetime | 15 minutes to 14 days | "Choose when the link expires"; maximum not stated |
| Files | Yes | Yes, except individual files over 250 MB |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | not stated |
| Account | None, to create or to open | Shared from 1Password; recipients need none |
| Licence | AGPL-3.0 | not stated |
| Self-hosting | Yes | not stated |

## Where they differ

- Sharing from 1Password suits items already stored in a 1Password vault. shhnote is for one-off secrets from anyone, with no account and no app.
- Both let recipients open the link without an account.
- shhnote is open source and can be self-hosted; the cited 1Password page says nothing about either.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [1Password support: Share items](https://support.1password.com/share-items/), checked 2026-11-03
