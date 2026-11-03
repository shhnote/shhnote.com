---
title: "Privacy policy"
description: "What shhnote.com stores, for how long, and what it never does. We can't read your secrets, and we keep as little else as we can."
eyebrow: "Legal"
updated: "[date]"
---

> **Draft.** This policy is a starting point and has not been reviewed by a lawyer.

## The short version

shhnote.com ("this site") can't read your secrets. They are encrypted on your device, and the key never reaches us. We keep as little else as we can, and delete it as soon as we can.

## What we store

When you create a secret, we store:

- **The encrypted secret.** Without the key in your link, it is unreadable, including to us.
- **Its settings:** when it expires and whether it is deleted after one view.
- **Hashed credentials:** one-way hashes of the values your browser uses to find or burn it, which can't be turned back into anything useful.

We don't store your passphrase, the key from your link, when the secret was created, or whether a passphrase was set. The expiry time is rounded, so it can't be turned back into the creation time. The encrypted data is padded, so we only know its rough size class.

Large secrets may be kept outside the database, on disk or in object storage. That storage records when each file was written, which is the one place a creation time exists. It is attached to an encrypted file we can't open, and it goes when the file goes.

If someone reports a link, we count the report for that day. We keep no record of which secret was reported.

## When we delete it

A secret is deleted when it expires, or straight after it has been opened if it is a one-time secret. Deleted secrets can't be recovered.

Deletion removes the record. As on any computer, encrypted leftovers may linger in database journals, free disk space or backups until they are overwritten. They are ciphertext without a key, and we treat backups accordingly.

## What we don't do

- We don't use cookies or tracking, and we don't show ads.
- We don't load anything from other sites: no fonts, scripts or images from elsewhere, so no third party sees your visit.
- We don't ask you to create an account.
- We don't sell or share your data.

Your theme choice (light or dark) is remembered in your browser's local storage and never sent anywhere.

## Server logs

Like most websites, our server may briefly record technical details of each request, such as your IP address and the time, to keep the service secure and working. [Describe how long logs are kept, or state that they are not kept.] Logs never contain secret keys, because browsers don't send the part of the link that holds the key.

## Your rights

Depending on where you live, you may have the right to ask what data we hold about you, and to have it corrected or deleted. Since we hold almost nothing that identifies you, there is usually little to share. Contact us at [contact@shhnote.com](mailto:contact@shhnote.com).

## Contact

Questions about this policy: [contact@shhnote.com](mailto:contact@shhnote.com).
