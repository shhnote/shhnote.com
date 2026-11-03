---
title: "Send a secret that opens once, then vanishes"
description: "How shhnote works, in plain language: your secret is sealed in your browser, the key travels inside the link, and the secret is deleted when it's read or when the timer runs out."
eyebrow: "How It Works"
intro: "No accounts, no apps, no jargon. Here's the whole idea in plain language — you'll get it in under a minute."
wide: true
depth: simple
---

<section class="section">
<div class="container">
<div class="flow">
  <div class="flow__step">
    <div class="flow__num">1</div>
    <div class="flow__body">
      <h3>You write your secret</h3>
      <p>Type a message or attach files — a password, a private note, a document. Before it ever leaves your device, your browser locks it in a sealed box that only a special key can open.</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">2</div>
    <div class="flow__body">
      <h3>You get one link to share</h3>
      <p>shhnote hands you a single link and hides the key <span class="color-faint">inside</span> it, after the #. Send that link however you like — text, email, chat. The key travels with the link, never through this site's server, so nobody here can peek inside the box.</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">3</div>
    <div class="flow__body">
      <h3>They open it — then it's gone</h3>
      <p>The recipient presses a button, their browser unlocks the box, and the secret is deleted from this site's server: right away for a one-time secret, or when the timer you chose runs out. Open a one-time link again and there's simply nothing there. No copies, no history, no trace.</p>
    </div>
  </div>
</div>

<div class="callout callout--lg">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>
  <span><b>Think of it like a note that burns after one reader.</b> You seal it, hand it off, and once it's been read, it's gone. Even we — the people who run this site — can never read what's inside or bring it back.</span>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Why it's safe</p>
  <h2 class="section__heading">Three promises, in one line each</h2>
</header>

<div class="fenced-cells">
  <div class="cell">
    <p class="eyebrow">Private</p>
    <h3>We can't read it</h3>
    <p>Your secret is scrambled on your device. We only ever store the sealed box — never the key.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Temporary</p>
    <h3>It doesn't stick around</h3>
    <p>One view, or a timer you choose. Whichever comes first, the secret is deleted for good.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Accountable</p>
    <h3>Anyone can check our work</h3>
    <p>shhnote is open source. Security experts can — and do — read exactly how it works.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Common questions</p>
  <h2 class="section__heading">The short answers</h2>
</header>

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
</div>

<p class="prose-note">Want the real cryptography behind these promises? <a href="/en/security/">Read the detailed version →</a> Or see <a href="/en/faq/">all questions</a>.</p>
</div>
</section>

