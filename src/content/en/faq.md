---
title: "Questions, answered"
description: "Frequently asked questions about shhnote — accounts, links, passphrases, expiry, and the technical details for the security-minded."
eyebrow: "FAQ"
intro: "The short answers first, the technical ones after. If yours isn't here, the how-it-works and security pages go deeper, and you can always ask us."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Do I need an account?</summary>
    <p>No. There's nothing to sign up for and nothing to install. Open shhnote, write your secret, share the link. That's it.</p>
  </details>
  <details>
    <summary>What if the link is seen by the wrong person?</summary>
    <p>A one-time secret can only be read by the first person to open it — after that it's destroyed, and you'll know something read it because the intended recipient finds nothing. For extra safety you can add a passphrase and share it separately, so the link alone isn't enough. And if you change your mind, you can destroy the secret yourself with your private burn link.</p>
  </details>
  <details>
    <summary>Can shhnote read my secret?</summary>
    <p>No. The key that unlocks it never reaches us — it stays tucked inside your link, on your side. We only hold a scrambled version we have no way to open.</p>
  </details>
  <details>
    <summary>What happens if nobody opens it?</summary>
    <p>You pick an expiry — anywhere from 15 minutes to 14 days. When the timer runs out, the secret is deleted automatically, whether it was opened or not.</p>
  </details>
  <details>
    <summary>What's the difference between a one-time secret and a timed one?</summary>
    <p>A one-time secret is destroyed the moment it's opened. A timed secret can be opened again until it expires — but the page never says how long is left, so treat every secret as something to save on the first read.</p>
  </details>
  <details>
    <summary>What is the burn link?</summary>
    <p>A second, private link you get when you create a secret. Opening it shows a confirmation; confirming destroys the secret immediately, before anyone can read it. Keep it to yourself.</p>
  </details>
  <details>
    <summary>Can I send files?</summary>
    <p>Yes. Files are encrypted in your browser exactly like text and travel inside the same sealed blob. Everything is padded to standard sizes, so even we can't tell a short note from a small file.</p>
  </details>
  <details>
    <summary>Does it work in Tor Browser or with JavaScript off?</summary>
    <p>Creating and revealing a secret needs JavaScript, because the encryption happens in your browser. It works in Tor Browser at the "Safer" level; at "Safest", WebAssembly is off, so passphrase-protected secrets can't be opened and the page says so. Every other page works without JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Is there an API?</summary>
    <p>Yes — the same one this site uses. The <a href="/en/docs/">documentation</a> describes it, and the open-source client package implements the protocol for your own tools.</p>
  </details>
</div>

<p class="prose-note">Still wondering? Read <a href="/en/how-it-works/">how it works</a>, the <a href="/en/security/">security details</a>, or <a href="/en/contact/">ask us</a>.</p>
</div>
</section>
