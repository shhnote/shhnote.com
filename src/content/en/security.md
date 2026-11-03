---
title: "The complete cryptographic lifecycle"
description: "What happens to your data at every step on shhnote — the primitives, parameters and trust boundaries spelled out, with the honest caveats."
eyebrow: "Security · In Depth"
intro: "A precise walkthrough of what happens to your data at every step — with the primitives, parameters and trust boundaries spelled out. Each step opens with a plain-English summary, so you can read at whatever depth you like."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Step 01 · Encrypt</p>
      <h3>Your secret is sealed on your device</h3>
      <p class="plain"><b>In plain terms:</b> the scrambling happens in your browser, before anything is uploaded. What we receive is already unreadable.</p>
    </div>
    <div class="explainer__detail">
      <p>When you press <b>Encrypt</b>, the browser draws a fresh 256-bit content key from the WebCrypto CSPRNG and encrypts your payload with <b>AES-256-GCM</b>. GCM is authenticated: every chunk carries a 128-bit tag, so any later tampering is detected rather than silently decrypted.</p>
      <p>Text and files are handled identically — both become one opaque binary blob, padded to a standard size so a short password and a small file look alike. The plaintext never touches the network and never leaves the tab's memory.</p>
      <div class="spec-list">
        <div><span class="k">Cipher</span><span class="v">AES-256-GCM, 64 KiB chunks</span></div>
        <div><span class="k">Content key</span><span class="v">256-bit, fresh per secret</span></div>
        <div><span class="k">Nonce</span><span class="v">7-byte random prefix + counter</span></div>
        <div><span class="k">Auth tag</span><span class="v">128-bit per chunk</span></div>
        <div><span class="k">Padding</span><span class="v">Padmé, 64 KiB minimum</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Step 02 · Key custody</p>
      <h3>The key hides in the link, not on our servers</h3>
      <p class="plain"><b>In plain terms:</b> the part of the link after the <span class="color-accent">#</span> holds the key — and browsers never send that part to any server.</p>
    </div>
    <div class="explainer__detail">
      <p>Your link carries a random 256-bit <b>seed</b> in the URL <b>fragment</b> — everything after the <span class="color-accent">#</span>. By the URL specification the fragment is stripped by the browser and <b>never included in the request</b> sent to our servers. From that seed the browser derives, with HKDF, a lookup value to find the secret and the key that unwraps the content key. The server only ever sees a hash of the lookup value.</p>
      <p>The recipient's browser reads the seed from the fragment and does the same derivation locally. This is what "zero-knowledge" means here: possession of the ciphertext alone is useless without the link.</p>
      <div class="spec-list">
        <div><span class="k">Key location</span><span class="v">URL fragment #</span></div>
        <div><span class="k">Sent to server?</span><span class="v">never</span></div>
        <div><span class="k">Seed</span><span class="v">32 random bytes, base64url</span></div>
        <div><span class="k">Derivation</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Server stores</span><span class="v">SHA-256(lookup) only</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Step 03 · Optional passphrase</p>
      <h3>A second lock only humans hold</h3>
      <p class="plain"><b>In plain terms:</b> add a passphrase and even someone with the full link can't open the secret without it.</p>
    </div>
    <div class="explainer__detail">
      <p>If you set a passphrase, it's stretched with <b>Argon2id</b> — a memory-hard key-derivation function — and combined with the seed into the key that wraps the content key. The passphrase itself is never transmitted or stored; only you and the recipient know it. Wrong guesses are retried in the recipient's browser against data it already holds, so the server can't count them.</p>
      <p>Memory-hardness makes large-scale offline guessing expensive even on GPUs and ASICs. Share the passphrase over a <b>different channel</b> than the link and the two factors never meet in one place. The Argon2 module is fetched on every create and reveal, so the network can't tell which secrets use one.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">128-bit random</span></div>
        <div><span class="k">Wrapping</span><span class="v">AES-256-GCM, 96-bit IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Step 04 · Transit &amp; storage</p>
      <h3>Only ciphertext leaves your device</h3>
      <p class="plain"><b>In plain terms:</b> we store a locked box and an expiry time. Nothing else — no plaintext, no key, no record of you.</p>
    </div>
    <div class="explainer__detail">
      <p>The blob is uploaded over <b>TLS</b> and stored at rest as ciphertext beside hashed credentials, its lifetime and a rounded expiry time. We deliberately keep <b>no</b> sender identity, recipient, IP log, creation time or access history. There is no account system to tie a secret to a person. Rate limiting works on an HMAC of the address under a salt that rotates, so nothing before a rotation can be linked to anything after.</p>
      <p>Because the stored object is meaningless without the seed in the fragment, a server compromise or a subpoena yields opaque bytes and hashes that can't be turned back into anything.</p>
      <div class="spec-list">
        <div><span class="k">In transit</span><span class="v">TLS</span></div>
        <div><span class="k">At rest</span><span class="v">ciphertext + hashed keys + expiry</span></div>
        <div><span class="k">Logs</span><span class="v">none per secret</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Step 05 · Retrieval &amp; destruction</p>
      <h3>First read wins — then it's erased</h3>
      <p class="plain"><b>In plain terms:</b> opening a one-time link hands over the box once and deletes the server's copy. Or destroy it yourself, anytime.</p>
    </div>
    <div class="explainer__detail">
      <p>Nothing is fetched when the reveal page loads: the request goes out only on a real click or key press, so link scanners and chat previews can't consume a secret. For a one-time secret the server <b>claims</b> the row in a single conditional update — exactly one request wins — and the secret counts as consumed from that moment. The same browser can re-download for 15 minutes if the connection drops; nobody else can, and an unconfirmed claim is destroyed, never reverted. Timed secrets are a plain read until they expire.</p>
      <p>Every secret also has a private <b>burn link</b>. Opening it destroys nothing by itself; confirming erases the ciphertext immediately — before any recipient can read it.</p>
      <div class="spec-list">
        <div><span class="k">One-time</span><span class="v">atomic claim, then destroyed</span></div>
        <div><span class="k">Re-download window</span><span class="v">15 min, same client only</span></div>
        <div><span class="k">Expiry</span><span class="v">15 min – 14 days</span></div>
        <div><span class="k">Owner control</span><span class="v">burn link</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Threat model</p>
  <h2 class="section__heading">What shhnote can and cannot see</h2>
  <p class="section__intro">The honest version. Here's exactly where the trust boundary sits.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Never leaves your device</p>
    <h3>What we can't see</h3>
    <p>Your plaintext · the content key and the seed · your passphrase · whether a passphrase was set · who created or opened a secret · when it was created · IP-level access logs. None of it is transmitted or retained.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Stored on our servers</p>
    <h3>What we do hold</h3>
    <p>An encrypted blob we can't open · its padded size class · one-way hashes of the values your browser uses to find or burn it · whether it is one-time or timed · a rounded expiry time. All of it useless without the seed in your link.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Worth knowing</p>
    <h3>The honest caveats</h3>
    <p>Anyone with the full link (and passphrase, if set) can read a one-time secret — treat the link as the secret. After a secret is shown, the page overwrites what it can when you leave, but JavaScript can't guarantee it; close the tab when you're done. A browser driven by automation that injects real input can open a one-time secret the way a person would — the recipient then finds nothing, which is the honest outcome. Deleting a secret removes the record; encrypted leftovers may linger in journals, free disk space or backups until overwritten, as ciphertext without a key. Large secrets stored outside the database carry the time the file was written. And as with any web app, you trust the code served to your browser — that's why shhnote is open source and self-hostable.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Cryptographic specification</p>
  <h2 class="section__heading">Every primitive, in one place</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Encryption</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Authenticated symmetric encryption in 64 KiB chunks. A 256-bit key plus an integrity tag per chunk, so tampering or truncation is detected — not just left unreadable.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Key derivation</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Keys and identifiers come from the seed through HKDF-SHA-256. Optional passphrases are stretched with a memory-hard KDF, making offline brute-force slow and costly even on dedicated hardware.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Randomness</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seeds, keys, salts and nonces come from the browser's cryptographically secure generator. Never <span class="color-faint">Math.random()</span>, never predictable.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Key custody</p>
    <div class="spec__val">URL fragment&nbsp;#</div>
    <p>The seed rides after the # in your link. Browsers never transmit the fragment, so it never reaches our servers.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">In transit</p>
    <div class="spec__val">TLS</div>
    <p>Only ciphertext ever leaves your device, carried over modern TLS. What we receive is an opaque blob we can't open.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">At rest</p>
    <div class="spec__val">Ciphertext + hashes</div>
    <p>We persist an encrypted blob, one-way hashes of its credentials and a rounded expiry — no plaintext, no keys, no sender or recipient metadata.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Technical FAQ</p>
  <h2 class="section__heading">For the security-minded</h2>
</header>

<div class="faq">
  <details open>
    <summary>How is the one-time guarantee enforced against races?</summary>
    <p>The reveal runs a single conditional update that moves the row from "active" to "claimed". Two simultaneous requests can't both succeed; the second observes an already-claimed record and gets the same "no secret found" response as anyone else. The claim is never reverted: if the download is lost, the holder of the claim token re-downloads within the window, and otherwise the secret is destroyed unread.</p>
  </details>
  <details>
    <summary>Why the URL fragment instead of a query parameter?</summary>
    <p>Query parameters are sent to the server and land in access logs, proxies and analytics. The fragment (after <span class="color-accent">#</span>) is defined by the URL spec to stay client-side — the browser never puts it in the HTTP request. That property is the whole basis of the zero-knowledge design. After a reveal, the page also removes the fragment from the address bar and history.</p>
  </details>
  <details>
    <summary>What stops link scanners from burning one-time secrets early?</summary>
    <p>The view page is the same static document for every secret and fetches nothing on load. The request is sent only on a trusted click or key press — a scripted <code>click()</code> or form submission doesn't count. Automated scanners (email security, chat unfurlers, antivirus) only ever load that static shell.</p>
  </details>
  <details>
    <summary>Can I verify or self-host this?</summary>
    <p>Yes. The full source is public under AGPLv3, the protocol is written down in a specification with conformance vectors that any implementation can check itself against, and there's a self-hosting guide. You can audit the client-side crypto and run your own instance so the trust boundary is entirely yours.</p>
  </details>
  <details>
    <summary>Is anything logged for abuse prevention?</summary>
    <p>We keep no per-secret access logs or IP history. Rate limiting uses a keyed hash of the address under a salt that rotates and clears every counter with it. Abuse reports are counted per day; there is no record of which secret was reported.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Tips for sharing safely

- Send the passphrase a different way from the link, for example the link by email and the passphrase by phone.
- Pick the shortest expiry that works for you.
- Use a one-time secret for passwords and other information that should be read exactly once.

## Reporting a vulnerability

If you think you've found a security problem with this site, please email [security@shhnote.com](mailto:security@shhnote.com) and tell us privately before telling anyone else. Include what you found and how to reproduce it.

We will:

- reply within [number] working days;
- keep you updated while we fix it;
- credit you when we publish the fix, if you'd like.

Please don't access other people's data, disrupt the service, or run automated scans that put heavy load on it while testing.

Vulnerabilities in the shhnote software itself: see the [project's security policy](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/en/#create" class="btn btn--primary"><span>Create a secret</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>View source on GitHub</span></a></p>

</div>
</div>
</section>
