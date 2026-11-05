---
title: "暗号処理のライフサイクル全体"
description: "shhnote であなたのデータが各段階でどう扱われるか。使用する暗号プリミティブ、パラメーター、信頼の境界を、正直な注意点とともに詳しく説明します。"
eyebrow: "セキュリティ · 詳細"
intro: "あなたのデータが各段階でどう扱われるかを、暗号プリミティブ、パラメーター、信頼の境界まで含めて正確に説明します。各ステップの冒頭にはわかりやすい要約があるので、お好きな深さで読み進められます。"
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">ステップ 01 · 暗号化</p>
      <h3>シークレットはあなたの端末上で封印されます</h3>
      <p class="plain"><b>かんたんに言うと：</b>暗号化は、何かがアップロードされる前にブラウザ内で行われます。私たちが受け取る時点で、すでに読めない状態になっています。</p>
    </div>
    <div class="explainer__detail">
      <p><b>シークレットを暗号化</b>を押すと、ブラウザは WebCrypto CSPRNG から新しい 256 ビットのコンテンツ鍵を生成し、データを <b>AES-256-GCM</b> で暗号化します。GCM は認証付き暗号です。各チャンクに 128 ビットのタグが付くため、後から改ざんされても、黙って復号されることはなく検出されます。</p>
      <p>テキストとファイルはまったく同じように扱われます。どちらも中身の見えない1つのバイナリデータになり、標準的なサイズにパディングされるため、短いパスワードと小さなファイルは見分けがつきません。平文がネットワークに触れることはなく、タブのメモリの外に出ることもありません。</p>
      <div class="spec-list">
        <div><span class="k">暗号方式</span><span class="v">AES-256-GCM、64 KiB チャンク</span></div>
        <div><span class="k">コンテンツ鍵</span><span class="v">256 ビット、シークレットごとに新規生成</span></div>
        <div><span class="k">ノンス</span><span class="v">7 バイトのランダムなプレフィックス + カウンター</span></div>
        <div><span class="k">認証タグ</span><span class="v">チャンクごとに 128 ビット</span></div>
        <div><span class="k">パディング</span><span class="v">Padmé、最小 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">ステップ 02 · 鍵の保管</p>
      <h3>鍵はサーバーではなく、リンクの中に隠れています</h3>
      <p class="plain"><b>かんたんに言うと：</b>リンクの <span class="color-accent">#</span> より後ろの部分に鍵が入っています。そしてブラウザは、この部分をどのサーバーにも送信しません。</p>
    </div>
    <div class="explainer__detail">
      <p>リンクには、ランダムな 256 ビットの<b>シード</b>が URL の<b>フラグメント</b>、つまり <span class="color-accent">#</span> より後ろの部分に入っています。URL の仕様により、フラグメントはブラウザによって取り除かれ、私たちのサーバーに送られる<b>リクエストには決して含まれません</b>。ブラウザはこのシードから HKDF を使って、シークレットを検索するための値と、コンテンツ鍵を取り出すための鍵を導出します。サーバーが目にするのは、検索用の値のハッシュだけです。</p>
      <p>受信者のブラウザもフラグメントからシードを読み取り、同じ導出をその場で行います。これがここでいう「ゼロ知識」の意味です。暗号文を持っていても、リンクがなければ役に立ちません。</p>
      <div class="spec-list">
        <div><span class="k">鍵の場所</span><span class="v">URL フラグメント #</span></div>
        <div><span class="k">サーバーへの送信</span><span class="v">なし</span></div>
        <div><span class="k">シード</span><span class="v">ランダムな 32 バイト、base64url</span></div>
        <div><span class="k">導出</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">サーバーの保存内容</span><span class="v">SHA-256(lookup) のみ</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">ステップ 03 · 任意のパスフレーズ</p>
      <h3>人だけが持つ2つ目の鍵</h3>
      <p class="plain"><b>かんたんに言うと：</b>パスフレーズを追加すれば、完全なリンクを持っている人でも、パスフレーズなしではシークレットを開けません。</p>
    </div>
    <div class="explainer__detail">
      <p>パスフレーズを設定すると、メモリハードな鍵導出関数である <b>Argon2id</b> で引き伸ばされ、シードと組み合わされて、コンテンツ鍵を包む鍵になります。パスフレーズそのものが送信・保存されることはなく、知っているのはあなたと受信者だけです。間違った推測の再試行は、受信者のブラウザがすでに持っているデータに対して行われるため、サーバーがその回数を数えることはできません。</p>
      <p>メモリハード性により、GPU や ASIC を使っても大規模なオフライン推測は高コストになります。パスフレーズをリンクとは<b>別の手段</b>で伝えれば、2つの要素が1か所にそろうことはありません。Argon2 モジュールは作成時と表示時に毎回取得されるため、どのシークレットがパスフレーズを使っているかをネットワークから見分けることはできません。</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">ソルト</span><span class="v">128 ビットのランダム値</span></div>
        <div><span class="k">鍵の包装</span><span class="v">AES-256-GCM、96 ビット IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">ステップ 04 · 通信と保存</p>
      <h3>端末から出ていくのは暗号文だけ</h3>
      <p class="plain"><b>かんたんに言うと：</b>私たちが保存するのは、鍵のかかった箱と有効期限だけです。平文も鍵も、あなたに関する記録も、それ以外は何もありません。</p>
    </div>
    <div class="explainer__detail">
      <p>データは <b>TLS</b> でアップロードされ、ハッシュ化された認証情報、有効期間、丸められた有効期限とともに、暗号文のまま保存されます。送信者の身元、受信者、IP ログ、作成日時、アクセス履歴は、意図的に<b>一切</b>保持しません。シークレットを個人と結びつけるアカウントの仕組みもありません。レート制限は、定期的に入れ替わるソルトを用いたアドレスの HMAC で行うため、入れ替わる前の情報と後の情報を結びつけることはできません。</p>
      <p>保存されたデータはフラグメント内のシードがなければ意味をなさないため、サーバーが侵害されたり、開示命令を受けたりしても、得られるのは中身の見えないバイト列と、元に戻せないハッシュだけです。</p>
      <div class="spec-list">
        <div><span class="k">通信中</span><span class="v">TLS</span></div>
        <div><span class="k">保存時</span><span class="v">暗号文 + ハッシュ化された鍵 + 有効期限</span></div>
        <div><span class="k">ログ</span><span class="v">シークレット単位ではなし</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">ステップ 05 · 受け取りと破棄</p>
      <h3>最初に読んだ人だけ。その後は消去</h3>
      <p class="plain"><b>かんたんに言うと：</b>1回限りのリンクを開くと、箱が1回だけ手渡され、サーバー上のコピーは削除されます。いつでも自分で破棄することもできます。</p>
    </div>
    <div class="explainer__detail">
      <p>表示ページを読み込んだだけでは何も取得されません。リクエストは実際のクリックまたはキー操作があったときにのみ送られるため、リンクスキャナーやチャットのプレビューがシークレットを消費することはありません。1回限りのシークレットの場合、サーバーは単一の条件付き更新でその行を <b>claim</b> します。成功するリクエストはちょうど1つだけで、その瞬間からシークレットは消費済みとみなされます。接続が切れた場合、同じブラウザは 15 分間再ダウンロードできますが、他の誰にもできません。確認されなかった claim は破棄され、取り消されることはありません。期限付きのシークレットは、有効期限が来るまで普通に読み出せます。</p>
      <p>すべてのシークレットには、自分専用の<b>破棄リンク</b>もあります。開いただけでは何も破棄されません。確定すると、受信者が読む前に暗号文がすぐに消去されます。</p>
      <div class="spec-list">
        <div><span class="k">1回限り</span><span class="v">アトミックな claim の後に破棄</span></div>
        <div><span class="k">再ダウンロードの猶予</span><span class="v">15 分、同じクライアントのみ</span></div>
        <div><span class="k">有効期限</span><span class="v">15 分～14 日</span></div>
        <div><span class="k">作成者による操作</span><span class="v">破棄リンク</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">脅威モデル</p>
  <h2 class="section__heading">shhnote に見えるもの、見えないもの</h2>
  <p class="section__intro">正直にお伝えします。信頼の境界がどこにあるのかを正確に説明します。</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">あなたの端末から出ないもの</p>
    <h3>私たちに見えないもの</h3>
    <p>平文 · コンテンツ鍵とシード · パスフレーズ · パスフレーズが設定されているかどうか · シークレットを作成した人や開いた人 · 作成日時 · IP レベルのアクセスログ。これらはいずれも送信も保持もされません。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">サーバーに保存されるもの</p>
    <h3>私たちが保持するもの</h3>
    <p>私たちには開けない暗号化されたデータ · パディング後のサイズ区分 · ブラウザがシークレットを検索・破棄するのに使う値の一方向ハッシュ · 1回限りか期限付きか · 丸められた有効期限。いずれも、リンク内のシードがなければ役に立ちません。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">知っておいてほしいこと</p>
    <h3>正直な注意点</h3>
    <p>完全なリンク（設定されていればパスフレーズも）を持っている人なら誰でも、1回限りのシークレットを読めます。リンクそのものをシークレットとして扱ってください。シークレットが表示された後、ページを離れるときにはできる限りの内容を上書きしますが、JavaScript ではそれを保証できません。読み終えたらタブを閉じてください。実際の入力を送り込む自動化ツールで操作されたブラウザは、人と同じように1回限りのシークレットを開けてしまいます。その場合、受信者には何も見つからず、それが正直な結果です。シークレットを削除するとレコードは消えますが、暗号化された残骸がジャーナル、ディスクの空き領域、バックアップに、上書きされるまで鍵のない暗号文として残る場合があります。データベースの外に保存される大きなシークレットには、ファイルが書き込まれた日時が付きます。そして、どのウェブアプリでも同じように、ブラウザに配信されるコードは信頼していただく必要があります。だからこそ shhnote はオープンソースで、セルフホストもできるのです。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">暗号仕様</p>
  <h2 class="section__heading">すべての暗号プリミティブを一覧で</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">暗号化</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>64 KiB のチャンク単位で行う認証付きの共通鍵暗号です。256 ビットの鍵とチャンクごとの完全性タグにより、改ざんや切り詰めは読めなくなるだけでなく、確実に検出されます。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">鍵導出</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>鍵と識別子は、HKDF-SHA-256 によってシードから導出されます。任意のパスフレーズはメモリハードな KDF で引き伸ばされ、専用ハードウェアを使っても、オフラインの総当たり攻撃は遅く、高コストになります。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">乱数</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>シード、鍵、ソルト、ノンスは、ブラウザの暗号論的に安全な乱数生成器から取得します。<span class="color-faint">Math.random()</span> は決して使わず、予測もできません。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">鍵の保管</p>
    <div class="spec__val">URL フラグメント&nbsp;#</div>
    <p>シードはリンクの # より後ろに入っています。ブラウザはフラグメントを送信しないため、私たちのサーバーに届くことはありません。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">通信中</p>
    <div class="spec__val">TLS</div>
    <p>端末から送られるのは暗号文だけで、最新の TLS で運ばれます。私たちが受け取るのは、開くことのできない中身の見えないデータです。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">保存時</p>
    <div class="spec__val">暗号文 + ハッシュ</div>
    <p>保存するのは、暗号化されたデータ、その認証情報の一方向ハッシュ、丸められた有効期限だけです。平文も鍵も、送信者や受信者のメタデータもありません。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">技術的な FAQ</p>
  <h2 class="section__heading">セキュリティを重視する方へ</h2>
</header>

<div class="faq">
  <details open>
    <summary>1回限りの保証は、競合状態に対してどのように担保されていますか？</summary>
    <p>表示の際には、行を「active」から「claimed」に移す単一の条件付き更新が実行されます。同時に2つのリクエストが来ても、両方が成功することはありません。2つ目のリクエストはすでに claimed になったレコードを見て、他の誰とも同じ「シークレットが見つかりません」という応答を受け取ります。claim が取り消されることはありません。ダウンロードが失敗した場合は、claim トークンの保持者が猶予時間内に再ダウンロードでき、そうでなければシークレットは読まれないまま破棄されます。</p>
  </details>
  <details>
    <summary>なぜクエリパラメーターではなく URL フラグメントなのですか？</summary>
    <p>クエリパラメーターはサーバーに送信され、アクセスログやプロキシ、アクセス解析に残ります。フラグメント（<span class="color-accent">#</span> より後ろ）は、URL の仕様でクライアント側にとどまるよう定められており、ブラウザが HTTP リクエストに含めることはありません。この性質こそが、ゼロ知識設計の土台です。表示後には、ページがアドレスバーと履歴からもフラグメントを削除します。</p>
  </details>
  <details>
    <summary>リンクスキャナーが1回限りのシークレットを先に消費してしまうのを、どう防いでいますか？</summary>
    <p>閲覧ページはどのシークレットでも同じ静的なドキュメントで、読み込み時には何も取得しません。リクエストは、信頼できるクリックまたはキー操作があったときにのみ送信されます。スクリプトによる <code>click()</code> やフォーム送信は対象外です。自動スキャナー（メールのセキュリティ機能、チャットのリンク展開、ウイルス対策ソフト）が読み込むのは、その静的な外枠だけです。</p>
  </details>
  <details>
    <summary>検証したり、セルフホストしたりできますか？</summary>
    <p>はい。ソースコードはすべて AGPLv3 のもとで公開されています。プロトコルは仕様書にまとめられており、どの実装でも自己検証できる適合性テストベクターが用意されています。セルフホスティングガイドもあります。クライアント側の暗号処理を監査し、自分のインスタンスを運用すれば、信頼の境界を完全に自分の手元に置けます。</p>
  </details>
  <details>
    <summary>不正利用の防止のために何か記録していますか？</summary>
    <p>シークレットごとのアクセスログや IP の履歴は残していません。レート制限には、定期的に入れ替わるソルトを用いたアドレスの鍵付きハッシュを使っており、ソルトが入れ替わるとすべてのカウンターも消去されます。不正利用の通報は1日ごとの件数として数えるだけで、どのシークレットが通報されたかの記録はありません。</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## 安全に共有するためのヒント

- パスフレーズはリンクとは別の方法で伝えましょう。たとえば、リンクはメールで、パスフレーズは電話で。
- 支障のない範囲で、できるだけ短い有効期限を選びましょう。
- パスワードなど、ちょうど1回だけ読まれるべき情報には、1回限りのシークレットを使いましょう。

<h2 id="reporting-a-vulnerability">脆弱性の報告</h2>

このサイトでセキュリティ上の問題を見つけたと思われる場合は、他の人に知らせる前に、[security@shhnote.com](mailto:security@shhnote.com) までメールで非公開にお知らせください。見つけた内容と再現手順を含めてください。

私たちは次のように対応します。

- 5 営業日以内に返信します
- 修正の進捗をお知らせします
- ご希望があれば、修正を公開する際にお名前を記載します

テスト中は、他の人のデータにアクセスしたり、サービスを妨害したり、大きな負荷をかける自動スキャンを実行したりしないでください。

shhnote ソフトウェア自体の脆弱性については、[プロジェクトのセキュリティポリシー](https://github.com/shhnote/shhnote/security)をご覧ください。

<p class="btn-row btn-row--center"><a href="/ja/#create" class="btn btn--primary"><span>シークレットを作成</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>GitHub でソースを見る</span></a></p>

</div>
</div>
</section>
