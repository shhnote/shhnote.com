---
title: "shhnote vs Bitwarden Send"
description: "How shhnote.com compares with Bitwarden Send, from Bitwarden's product page and help centre."
eyebrow: "Compare"
intro: "Bitwarden Send is part of the Bitwarden password manager: you create a text or file Send from your Bitwarden account and share its link with anyone."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | Bitwarden Send |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | End to end: "encrypted on creation and only decrypted when a recipient opens the link" |
| Where the key lives | In the link after the #, never sent to the server | not stated |
| One-time view | Yes, or open until it expires | "Limit the maximum access count" |
| Lifetime | 15 minutes to 14 days | "1 hour to 30 days" (product page); "max. 31 days" (help centre) |
| Files | Yes | Yes, "up to 500 MB (or 100 MB on mobile)"; the help centre points to Premium for file Sends |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | Optional password |
| Account | None, to create or to open | Created from a Bitwarden account; recipients need none |
| Licence | AGPL-3.0 | not stated |
| Self-hosting | Yes | not stated |

## Where they differ

- Both encrypt end to end, and both let recipients open a link without an account.
- A Send is created from a Bitwarden account, which suits people who already use Bitwarden. shhnote has no accounts at all: there is nothing to sign up for and nothing that ties a secret to a person.
- Bitwarden Send allows longer lifetimes (about a month) and large files. shhnote caps a secret at 14 days.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [Bitwarden Send product page](https://bitwarden.com/products/send/), checked 2026-11-03
- [Bitwarden help: About Send](https://bitwarden.com/help/about-send/), checked 2026-11-03
