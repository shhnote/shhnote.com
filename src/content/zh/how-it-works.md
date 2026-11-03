---
title: "发一条只能打开一次、随后消失的密信"
description: "用通俗的话讲 shhnote 的工作原理：密信在你的浏览器中封存，密钥随链接传递，被读取或到期后密信即被删除。"
eyebrow: "工作原理"
intro: "无需账号，无需应用，没有术语。下面用通俗的话讲清整个思路——不到一分钟你就能明白。"
wide: true
depth: simple
---

<section class="section">
<div class="container">
<div class="flow">
  <div class="flow__step">
    <div class="flow__num">1</div>
    <div class="flow__body">
      <h3>你写下密信</h3>
      <p>输入一段消息或附加文件——一个密码、一条私密笔记、一份文档。在它离开你的设备之前，你的浏览器就会把它锁进一个只有专属钥匙才能打开的密封盒子。</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">2</div>
    <div class="flow__body">
      <h3>你得到一个可分享的链接</h3>
      <p>shhnote 给你一个链接，并把钥匙藏在链接<span class="color-faint">里面</span>，就在 # 之后。用你喜欢的任何方式发送这个链接——短信、邮件、聊天都行。钥匙随链接一起传递，从不经过本站的服务器，所以这里没有人能偷看盒子里的东西。</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">3</div>
    <div class="flow__body">
      <h3>对方打开——然后它就消失了</h3>
      <p>收件人按下按钮，浏览器打开盒子，密信随即从本站服务器上删除：阅后即焚密信会立即删除，否则在你选定的时间到期时删除。再次打开阅后即焚链接，那里就什么都没有了。没有副本，没有记录，不留痕迹。</p>
    </div>
  </div>
</div>

<div class="callout callout--lg">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>
  <span><b>把它想象成一张读过一次就会烧掉的纸条。</b>你把它封好、交出去，一旦被读过，它就没了。即使是我们——运营本站的人——也永远无法读取其中的内容，或把它找回来。</span>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">为什么安全</p>
  <h2 class="section__heading">三个承诺，各用一句话说清</h2>
</header>

<div class="fenced-cells">
  <div class="cell">
    <p class="eyebrow">私密</p>
    <h3>我们读不到</h3>
    <p>你的密信在你的设备上被打乱。我们只保存那个密封的盒子——从不保存钥匙。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">短暂</p>
    <h3>它不会久留</h3>
    <p>查看一次，或你选定的时间。无论哪个先到，密信都会被永久删除。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">可问责</p>
    <h3>任何人都能检查我们的工作</h3>
    <p>shhnote 是开源的。安全专家可以——也确实会——仔细查看它的具体工作方式。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">常见问题</p>
  <h2 class="section__heading">简短的回答</h2>
</header>

<div class="faq">
  <details open>
    <summary>需要注册账号吗？</summary>
    <p>不需要。无需注册，也无需安装任何东西。打开 shhnote，写下你的密信，分享链接。就这么简单。</p>
  </details>
  <details>
    <summary>如果链接被不该看的人看到了怎么办？</summary>
    <p>阅后即焚密信只能被第一个打开它的人读取——之后它就被销毁了。如果真正的收件人打开时什么也没有，你就知道已经有东西读过它了。为了更安全，你可以加一个访问密码并单独分享，这样光有链接是不够的。如果你改变主意，还可以用你的私密销毁链接亲手销毁密信。</p>
  </details>
  <details>
    <summary>shhnote 能读取我的密信吗？</summary>
    <p>不能。解锁它的密钥永远不会到达我们这里——它一直藏在你的链接里，留在你这一边。我们只保存一份打乱后的版本，根本无法打开。</p>
  </details>
  <details>
    <summary>如果没人打开会怎样？</summary>
    <p>你可以选择有效期——从 15 分钟到 14 天不等。时间一到，无论是否被打开过，密信都会被自动删除。</p>
  </details>
</div>

<p class="prose-note">想了解这些承诺背后真正的密码学原理？<a href="/zh/security/">阅读详细版本 →</a> 或者查看<a href="/zh/faq/">所有问题</a>。</p>
</div>
</section>

