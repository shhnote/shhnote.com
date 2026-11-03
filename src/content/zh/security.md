---
title: "完整的加密生命周期"
description: "在 shhnote 上，你的数据每一步经历了什么——密码学原语、参数和信任边界逐一说明，并坦诚列出注意事项。"
eyebrow: "安全 · 深入"
intro: "精确讲解你的数据在每一步经历了什么——密码学原语、参数和信任边界逐一说明。每一步都先给出通俗的概括，你可以按自己想要的深度阅读。"
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">第 01 步 · 加密</p>
      <h3>你的密信在你的设备上封存</h3>
      <p class="plain"><b>通俗地说：</b>打乱内容这一步在你的浏览器里完成，早于任何上传。我们收到的东西本来就无法读取。</p>
    </div>
    <div class="explainer__detail">
      <p>当你按下<b>加密</b>时，浏览器会从 WebCrypto CSPRNG 中取出一个全新的 256 位内容密钥，并用 <b>AES-256-GCM</b> 加密你的数据。GCM 带认证：每个分块都附有 128 位标签，因此之后的任何篡改都会被发现，而不会被悄无声息地解密。</p>
      <p>文字和文件的处理方式完全相同——两者都会变成一个不透明的二进制数据块，并填充到标准大小，让一个短密码和一个小文件看起来没有区别。明文从不接触网络，也从不离开标签页的内存。</p>
      <div class="spec-list">
        <div><span class="k">加密算法</span><span class="v">AES-256-GCM，64 KiB 分块</span></div>
        <div><span class="k">内容密钥</span><span class="v">256 位，每条密信全新生成</span></div>
        <div><span class="k">Nonce</span><span class="v">7 字节随机前缀 + 计数器</span></div>
        <div><span class="k">认证标签</span><span class="v">每个分块 128 位</span></div>
        <div><span class="k">填充</span><span class="v">Padmé，最小 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">第 02 步 · 密钥保管</p>
      <h3>密钥藏在链接里，而不在我们的服务器上</h3>
      <p class="plain"><b>通俗地说：</b>链接中 <span class="color-accent">#</span> 之后的部分存放着密钥——而浏览器从不会把这部分发送给任何服务器。</p>
    </div>
    <div class="explainer__detail">
      <p>你的链接携带一个随机的 256 位<b>种子</b>，放在 URL <b>片段</b>中——也就是 <span class="color-accent">#</span> 之后的全部内容。按照 URL 规范，浏览器会剥离片段，它<b>永远不会出现在发往我们服务器的请求中</b>。浏览器用 HKDF 从这个种子派生出两样东西：用于查找密信的查找值，以及用于解开内容密钥的密钥。服务器只能看到查找值的哈希。</p>
      <p>收件人的浏览器从片段中读取种子，在本地进行同样的派生。这就是这里所说的“零知识”：没有链接，光拿到密文毫无用处。</p>
      <div class="spec-list">
        <div><span class="k">密钥位置</span><span class="v">URL 片段 #</span></div>
        <div><span class="k">是否发送到服务器？</span><span class="v">从不</span></div>
        <div><span class="k">种子</span><span class="v">32 个随机字节，base64url</span></div>
        <div><span class="k">派生</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">服务器存储</span><span class="v">仅 SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">第 03 步 · 可选的访问密码</p>
      <h3>第二道锁，只掌握在人手中</h3>
      <p class="plain"><b>通俗地说：</b>加上访问密码后，即使有人拿到完整链接，没有密码也打不开密信。</p>
    </div>
    <div class="explainer__detail">
      <p>如果你设置了访问密码，它会经过 <b>Argon2id</b>（一种内存困难型密钥派生函数）拉伸，再与种子结合，生成用于包装内容密钥的密钥。访问密码本身从不传输或存储；只有你和收件人知道。猜错后的重试在收件人的浏览器中进行，针对的是浏览器已经持有的数据，因此服务器无法统计次数。</p>
      <p>内存困难性让大规模离线猜测即使在 GPU 和 ASIC 上也代价高昂。通过与链接<b>不同的渠道</b>分享访问密码，两个因素就永远不会出现在同一个地方。每次创建和查看时都会获取 Argon2 模块，因此网络无法分辨哪些密信用了访问密码。</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">盐值</span><span class="v">128 位随机</span></div>
        <div><span class="k">密钥包装</span><span class="v">AES-256-GCM，96 位 IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">第 04 步 · 传输与存储</p>
      <h3>离开你设备的只有密文</h3>
      <p class="plain"><b>通俗地说：</b>我们存储的是一个上了锁的盒子和一个过期时间。别无其他——没有明文，没有密钥，没有关于你的记录。</p>
    </div>
    <div class="explainer__detail">
      <p>数据块通过 <b>TLS</b> 上传，并以密文形式存储，旁边是经过哈希的凭据、它的生命周期类型和取整后的过期时间。我们刻意<b>不</b>保留发件人身份、收件人、IP 日志、创建时间或访问历史。没有账号系统可以把密信和某个人关联起来。速率限制基于地址在轮换盐值下的 HMAC，因此轮换之前的任何数据都无法与之后的数据关联。</p>
      <p>由于存储的对象在没有片段中种子的情况下毫无意义，即使服务器被攻破或收到传票，能得到的也只是无法还原的不透明字节和哈希。</p>
      <div class="spec-list">
        <div><span class="k">传输中</span><span class="v">TLS</span></div>
        <div><span class="k">存储时</span><span class="v">密文 + 哈希后的密钥 + 过期时间</span></div>
        <div><span class="k">日志</span><span class="v">无单条密信日志</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">第 05 步 · 读取与销毁</p>
      <h3>先读者得——随后即被抹除</h3>
      <p class="plain"><b>通俗地说：</b>打开阅后即焚链接会把盒子交出一次，并删除服务器上的副本。你也可以随时亲手销毁它。</p>
    </div>
    <div class="explainer__detail">
      <p>查看页面加载时不获取任何内容：只有在真实的点击或按键时才发出请求，因此链接扫描程序和聊天预览无法消耗掉密信。对于阅后即焚密信，服务器通过一次条件更新<b>认领</b>该记录——只有一个请求能成功——从那一刻起，密信即视为已被消耗。如果连接中断，同一浏览器可以在 15 分钟内重新下载；其他人都不行，未确认的认领会被销毁，永远不会撤销。定时密信在过期前就是普通的读取。</p>
      <p>每条密信还有一个私密的<b>销毁链接</b>。仅仅打开它不会销毁任何东西；确认后，密文会被立即抹除——赶在任何收件人读取之前。</p>
      <div class="spec-list">
        <div><span class="k">阅后即焚</span><span class="v">原子认领，随后销毁</span></div>
        <div><span class="k">重新下载窗口</span><span class="v">15 分钟，仅限同一客户端</span></div>
        <div><span class="k">有效期</span><span class="v">15 分钟 – 14 天</span></div>
        <div><span class="k">所有者控制</span><span class="v">销毁链接</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">威胁模型</p>
  <h2 class="section__heading">shhnote 能看到什么，不能看到什么</h2>
  <p class="section__intro">坦诚版本。信任边界究竟在哪里，这里说得清清楚楚。</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">从不离开你的设备</p>
    <h3>我们看不到的</h3>
    <p>你的明文 · 内容密钥和种子 · 你的访问密码 · 是否设置了访问密码 · 谁创建或打开了密信 · 密信的创建时间 · IP 级别的访问日志。这些都不会被传输或保留。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">存储在我们的服务器上</p>
    <h3>我们确实持有的</h3>
    <p>一个我们无法打开的加密数据块 · 它填充后的大小档位 · 你的浏览器用来查找或销毁它的那些值的单向哈希 · 它是阅后即焚还是定时 · 取整后的过期时间。没有你链接中的种子，这些全都毫无用处。</p>
  </div>
  <div class="cell">
    <p class="eyebrow">值得了解</p>
    <h3>坦诚的注意事项</h3>
    <p>任何拿到完整链接（以及访问密码，如果设置了的话）的人都能读取阅后即焚密信——请把链接本身当作秘密对待。密信显示之后，页面会在你离开时尽可能覆盖相关内容，但 JavaScript 无法保证做到；用完请关闭标签页。由自动化程序驱动、能注入真实输入的浏览器，可以像人一样打开阅后即焚密信——此时收件人会发现什么都没有，这是如实的结果。删除密信会移除记录；加密的残留数据可能会留在日志、磁盘空闲空间或备份中，直到被覆盖，但它们是没有密钥的密文。存放在数据库之外的较大密信会带有文件的写入时间。另外，和任何 Web 应用一样，你需要信任发送到浏览器的代码——这正是 shhnote 开源且可自托管的原因。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">密码学规范</p>
  <h2 class="section__heading">所有原语，尽在一处</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">加密</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>以 64 KiB 分块进行的带认证对称加密。256 位密钥加上每个分块的完整性标签，篡改或截断都会被发现——而不只是变得无法读取。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">密钥派生</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>密钥和标识符通过 HKDF-SHA-256 从种子派生。可选的访问密码会经过内存困难型 KDF 拉伸，即使使用专用硬件，离线暴力破解也既慢又昂贵。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">随机性</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>种子、密钥、盐值和 nonce 都取自浏览器的密码学安全随机数生成器。绝不用 <span class="color-faint">Math.random()</span>，绝不可预测。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">密钥保管</p>
    <div class="spec__val">URL 片段&nbsp;#</div>
    <p>种子跟在链接的 # 之后。浏览器从不传输 URL 片段，因此它永远不会到达我们的服务器。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">传输中</p>
    <div class="spec__val">TLS</div>
    <p>离开你设备的只有密文，经由现代 TLS 传输。我们收到的是一团无法打开的不透明数据。</p>
  </div>
  <div class="spec">
    <p class="eyebrow">存储时</p>
    <div class="spec__val">密文 + 哈希</div>
    <p>我们保存一份加密数据块、其凭据的单向哈希以及取整后的过期时间——没有明文，没有密钥，没有发件人或收件人元数据。</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">技术问答</p>
  <h2 class="section__heading">写给注重安全的人</h2>
</header>

<div class="faq">
  <details open>
    <summary>如何在并发竞争下保证“只能查看一次”？</summary>
    <p>查看操作会执行一次条件更新，把记录从“有效”改为“已认领”。两个同时到达的请求不可能都成功；第二个请求会看到一条已被认领的记录，并得到和其他人一样的“未找到密信”响应。认领永远不会撤销：如果下载中断，持有认领令牌的一方可以在时间窗口内重新下载，否则密信会在未被读取的情况下销毁。</p>
  </details>
  <details>
    <summary>为什么用 URL 片段而不是查询参数？</summary>
    <p>查询参数会发送到服务器，并出现在访问日志、代理和统计分析中。而片段（<span class="color-accent">#</span> 之后的部分）按 URL 规范只保留在客户端——浏览器从不把它放进 HTTP 请求。这一特性正是零知识设计的全部基础。查看完成后，页面还会把片段从地址栏和历史记录中移除。</p>
  </details>
  <details>
    <summary>如何防止链接扫描程序提前“焚毁”阅后即焚密信？</summary>
    <p>查看页面对每条密信都是同一个静态文档，加载时不获取任何内容。只有在真实可信的点击或按键时才会发出请求——脚本触发的 <code>click()</code> 或表单提交都不算。自动扫描程序（邮件安全网关、聊天链接预览、杀毒软件）只会加载那个静态外壳。</p>
  </details>
  <details>
    <summary>我能验证或自托管吗？</summary>
    <p>可以。完整源码基于 AGPLv3 公开，协议写成了规范文档，并附有任何实现都能自行对照检查的一致性测试向量，另外还有自托管指南。你可以审计客户端的加密代码，并运行自己的实例，让信任边界完全由你掌控。</p>
  </details>
  <details>
    <summary>为防止滥用，会记录什么吗？</summary>
    <p>我们不保留任何针对单条密信的访问日志或 IP 历史。速率限制使用地址在一个盐值下的带密钥哈希，盐值会定期轮换，并随之清空所有计数器。滥用举报按天计数；不会记录被举报的是哪条密信。</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## 安全分享小贴士

- 用与链接不同的方式发送访问密码，例如链接通过邮件发送，访问密码通过电话告知。
- 选择能满足需要的最短有效期。
- 密码以及其他只应被读取一次的信息，请使用阅后即焚密信。

<h2 id="reporting-a-vulnerability">报告漏洞</h2>

如果你认为自己发现了本站的安全问题，请发邮件至 [security@shhnote.com](mailto:security@shhnote.com)，在告诉其他任何人之前先私下告诉我们。请说明你发现了什么，以及如何复现。

我们会：

- 在 [number] 个工作日内回复；
- 在修复过程中随时告知你进展；
- 如果你愿意，在发布修复时向你致谢。

测试时请不要访问他人的数据、干扰服务，或运行会给服务带来沉重负载的自动化扫描。

shhnote 软件本身的漏洞：请参阅[项目的安全政策](https://github.com/shhnote/shhnote/security)。

<p class="btn-row btn-row--center"><a href="/zh/#create" class="btn btn--primary"><span>创建密信</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>在 GitHub 上查看源码</span></a></p>

</div>
</div>
</section>
