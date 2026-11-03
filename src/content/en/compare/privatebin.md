---
title: "shhnote vs PrivateBin"
description: "How shhnote.com compares with PrivateBin, the open-source zero-knowledge pastebin, from PrivateBin's own pages."
eyebrow: "Compare"
intro: "PrivateBin is a minimalist, open-source online pastebin that people and organisations run as their own instances."
updated: "2026-11-03"
---

shhnote.com runs shhnote, so we are not a neutral party. Everything said here about another service is taken from that service's own public pages, listed under Sources and checked on 2026-11-03; where those pages don't say something, we write "not stated" rather than guess. Spotted something wrong or out of date? Tell us at [contact@shhnote.com](mailto:contact@shhnote.com).

## At a glance

| | shhnote.com | PrivateBin |
|---|---|---|
| Where the secret is encrypted | In your browser, before upload (AES-256-GCM) | In the browser ("256bit AES in Galois Counter mode") |
| Where the key lives | In the link after the #, never sent to the server | not stated |
| One-time view | Yes, or open until it expires | Optional "burn after reading", if the instance enables it |
| Lifetime | 15 minutes to 14 days | Set per instance; can include "forever" |
| Files | Yes | Optional, "disabled by default", size limit set per instance |
| Passphrase | Optional (Argon2id, checked in the recipient's browser) | Optional password "required to read the paste" |
| Account | None, to create or to open | not stated |
| Licence | AGPL-3.0 | Open source (licence in the repository's LICENSE.md) |
| Self-hosting | Yes | Yes, with installation and configuration guides |

## Where they differ

- Both encrypt in the browser with AES-256-GCM, so in both the server cannot read what it stores.
- PrivateBin is a pastebin first: it also offers discussions, previews of images, media and PDFs, and a "forever" expiry, each switched on or off by the instance operator. shhnote does one thing: secrets that are deleted after one view or after at most 14 days.
- With PrivateBin, what you get depends on the instance you use. shhnote.com is one instance with fixed settings, described on its security page.

The shhnote column describes this site; the [security page](/en/security/) has the details, and the [other comparisons](/en/compare/) are on the overview.

## Sources

- [privatebin.info](https://privatebin.info/), checked 2026-11-03
- [PrivateBin on GitHub](https://github.com/PrivateBin/PrivateBin), checked 2026-11-03
