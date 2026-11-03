---
title: "1回開いたら消えるシークレットを送る"
description: "shhnote の仕組みをわかりやすく解説。シークレットはブラウザ内で封印され、鍵はリンクの中に入って届き、読まれたときか期限が来たときに削除されます。"
eyebrow: "仕組み"
intro: "アカウントもアプリも専門用語も不要です。考え方のすべてをわかりやすく説明します。1分もかからずに理解できます。"
wide: true
depth: simple
---

<section class="section">
<div class="container">
<div class="flow">
  <div class="flow__step">
    <div class="flow__num">1</div>
    <div class="flow__body">
      <h3>シークレットを書く</h3>
      <p>メッセージを入力するか、ファイルを添付します。パスワード、個人的なメモ、書類など、何でも構いません。端末の外に出る前に、ブラウザがそれを特別な鍵でしか開けない封印された箱に閉じ込めます。</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">2</div>
    <div class="flow__body">
      <h3>共有するリンクを1つ受け取る</h3>
      <p>shhnote はリンクを1つ発行し、その<span class="color-faint">中</span>の # より後ろに鍵を隠します。リンクはお好きな方法で送ってください。SMS、メール、チャット、何でも構いません。鍵はリンクと一緒に届き、このサイトのサーバーを経由することはないため、ここにいる誰も箱の中をのぞくことはできません。</p>
    </div>
  </div>
  <div class="flow__step">
    <div class="flow__num">3</div>
    <div class="flow__body">
      <h3>相手が開くと、消える</h3>
      <p>受信者がボタンを押すとブラウザが箱を開け、シークレットはこのサイトのサーバーから削除されます。1回限りのシークレットならすぐに、そうでなければ選んだ期限が来たときに削除されます。1回限りのリンクをもう一度開いても、そこにはもう何もありません。コピーも履歴も痕跡も残りません。</p>
    </div>
  </div>
</div>

<div class="callout callout--lg">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>
  <span><b>1人が読んだら燃えてなくなる手紙のようなものです。</b>封をして手渡し、読まれたら消えてしまいます。このサイトを運営している私たちでさえ、中身を読むことも元に戻すこともできません。</span>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">安全な理由</p>
  <h2 class="section__heading">3つの約束を、それぞれ一言で</h2>
</header>

<div class="fenced-cells">
  <div class="cell">
    <p class="eyebrow">プライベート</p>
    <h3>私たちには読めません</h3>
    <p>シークレットはあなたの端末上で暗号化されます。私たちが保存するのは封印された箱だけで、鍵は決して保存しません。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">一時的</p>
    <h3>いつまでも残りません</h3>
    <p>1回の閲覧か、選んだ期限か。どちらか早いほうで、シークレットは完全に削除されます。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">透明性</p>
    <h3>誰でも検証できます</h3>
    <p>shhnote はオープンソースです。セキュリティの専門家は、その仕組みを正確に読むことができ、実際に読んでいます。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">よくある質問</p>
  <h2 class="section__heading">簡単な回答</h2>
</header>

<div class="faq">
  <details open>
    <summary>アカウントは必要ですか？</summary>
    <p>いいえ。登録もインストールも不要です。shhnote を開いて、シークレットを書き、リンクを共有する。それだけです。</p>
  </details>
  <details>
    <summary>意図しない人にリンクを見られたら？</summary>
    <p>1回限りのシークレットを読めるのは、最初に開いた1人だけです。その後は破棄されるため、本来の受信者が開いたときに何も見つからなければ、誰かが先に読んだと分かります。さらに安全にしたい場合は、パスフレーズを追加して別の手段で伝えれば、リンクだけでは開けなくなります。気が変わったときは、自分専用の破棄リンクでシークレットを自分で破棄することもできます。</p>
  </details>
  <details>
    <summary>shhnote は私のシークレットを読めますか？</summary>
    <p>いいえ。シークレットを開く鍵は私たちに届きません。鍵はあなたの手元にあるリンクの中に収まっています。私たちが保持しているのは、開く手段のない暗号化されたデータだけです。</p>
  </details>
  <details>
    <summary>誰も開かなかった場合はどうなりますか？</summary>
    <p>有効期限は15分から14日の間で選べます。期限が来ると、開かれたかどうかにかかわらず、シークレットは自動的に削除されます。</p>
  </details>
</div>

<p class="prose-note">これらの約束を支える暗号技術を知りたい方は、<a href="/ja/security/">詳しい説明を読む →</a> または<a href="/ja/faq/">すべての質問</a>をご覧ください。</p>
</div>
</section>
