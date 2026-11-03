---
title: "Share credentials and keys, not chat history"
description: "How developers and operators use shhnote.com to hand over API keys, database passwords and SSH keys without leaving them in chat or tickets."
eyebrow: "DevOps & Engineering"
intro: "API keys, database passwords and private keys end up in chat threads and tickets, where they stay searchable for years. A one-time link keeps them out."
updated: "2026-11-03"
---

## The problem

A credential pasted into a chat channel or a ticket is copied into every client, every backup and every search index that system has. Rotating it later doesn't remove the old value from the history.

## How shhnote.com helps

- **Encrypted before it leaves your machine.** The secret is encrypted in your browser with AES-256-GCM; the key stays in the link after the #, so this site's server only ever holds ciphertext.
- **Gone after one read.** Choose a one-time view and the secret is deleted as soon as the recipient opens it. If someone else opened it first, the recipient finds nothing, and you know to rotate.
- **Files too.** Send a key file, a `.env` or a kubeconfig the same way as text.
- **A passphrase for the second channel.** Add one and send it another way, so the link alone isn't enough.
- **Scriptable.** The same [API](/en/docs/) this site uses is documented, and the open-source client package implements the protocol for your own tools and pipelines.

## Good habits

- Pick the shortest expiry that works; 15 minutes is often enough for a hand-over in a call.
- Keep the burn link. If you sent the link to the wrong place, destroy the secret before anyone opens it.
- Treat a secret that arrives already opened as compromised.

More [use cases](/en/use-cases/).
