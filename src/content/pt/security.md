---
title: "O ciclo de vida criptográfico completo"
description: "O que acontece com os seus dados em cada etapa no shhnote — primitivas, parâmetros e fronteiras de confiança explicados, com as ressalvas honestas."
eyebrow: "Segurança · Em detalhe"
intro: "Um passo a passo preciso do que acontece com os seus dados em cada etapa — com as primitivas, os parâmetros e as fronteiras de confiança explicados. Cada etapa começa com um resumo em linguagem simples, para que você leia no nível de detalhe que preferir."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Etapa 01 · Criptografia</p>
      <h3>O seu segredo é selado no seu dispositivo</h3>
      <p class="plain"><b>Em termos simples:</b> o embaralhamento acontece no seu navegador, antes de qualquer envio. O que recebemos já é ilegível.</p>
    </div>
    <div class="explainer__detail">
      <p>Quando você aperta <b>Criptografar</b>, o navegador obtém uma nova chave de conteúdo de 256 bits do WebCrypto CSPRNG e criptografa os seus dados com <b>AES-256-GCM</b>. O GCM é autenticado: cada bloco leva uma etiqueta de 128 bits, então qualquer adulteração posterior é detectada em vez de ser descriptografada silenciosamente.</p>
      <p>Textos e arquivos são tratados da mesma forma — ambos viram um único bloco binário opaco, preenchido até um tamanho padrão para que uma senha curta e um arquivo pequeno pareçam iguais. O texto legível nunca passa pela rede e nunca sai da memória da aba.</p>
      <div class="spec-list">
        <div><span class="k">Cifra</span><span class="v">AES-256-GCM, blocos de 64 KiB</span></div>
        <div><span class="k">Chave de conteúdo</span><span class="v">256 bits, nova a cada segredo</span></div>
        <div><span class="k">Nonce</span><span class="v">prefixo aleatório de 7 bytes + contador</span></div>
        <div><span class="k">Etiqueta de autenticação</span><span class="v">128 bits por bloco</span></div>
        <div><span class="k">Preenchimento</span><span class="v">Padmé, mínimo de 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Etapa 02 · Guarda da chave</p>
      <h3>A chave fica escondida no link, não nos nossos servidores</h3>
      <p class="plain"><b>Em termos simples:</b> a parte do link depois do <span class="color-accent">#</span> contém a chave — e os navegadores nunca enviam essa parte a nenhum servidor.</p>
    </div>
    <div class="explainer__detail">
      <p>O seu link carrega uma <b>semente</b> aleatória de 256 bits no <b>fragmento</b> da URL — tudo o que vem depois do <span class="color-accent">#</span>. Pela especificação de URL, o navegador remove o fragmento e <b>nunca o inclui na requisição</b> enviada aos nossos servidores. A partir dessa semente, o navegador deriva, com HKDF, um valor de busca para encontrar o segredo e a chave que desembrulha a chave de conteúdo. O servidor só vê um hash do valor de busca.</p>
      <p>O navegador do destinatário lê a semente do fragmento e faz a mesma derivação localmente. É isso que “conhecimento zero” significa aqui: ter o texto cifrado, por si só, não serve para nada sem o link.</p>
      <div class="spec-list">
        <div><span class="k">Local da chave</span><span class="v">Fragmento da URL #</span></div>
        <div><span class="k">Enviada ao servidor?</span><span class="v">nunca</span></div>
        <div><span class="k">Semente</span><span class="v">32 bytes aleatórios, base64url</span></div>
        <div><span class="k">Derivação</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">O servidor guarda</span><span class="v">apenas SHA-256(busca)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Etapa 03 · Senha opcional</p>
      <h3>Uma segunda trava que só pessoas têm</h3>
      <p class="plain"><b>Em termos simples:</b> adicione uma senha e nem quem tem o link completo consegue abrir o segredo sem ela.</p>
    </div>
    <div class="explainer__detail">
      <p>Se você define uma senha, ela é reforçada com o <b>Argon2id</b> — uma função de derivação de chave que exige muita memória — e combinada com a semente para formar a chave que embrulha a chave de conteúdo. A senha em si nunca é transmitida nem armazenada; só você e o destinatário a conhecem. As tentativas erradas são repetidas no navegador do destinatário, com dados que ele já tem, então o servidor não consegue contá-las.</p>
      <p>A exigência de memória torna caros os ataques de adivinhação offline em grande escala, mesmo com GPUs e ASICs. Envie a senha por um <b>canal diferente</b> do link, e os dois fatores nunca se encontram num mesmo lugar. O módulo Argon2 é baixado em toda criação e revelação, então a rede não consegue saber quais segredos usam senha.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">128 bits aleatórios</span></div>
        <div><span class="k">Embrulho</span><span class="v">AES-256-GCM, IV de 96 bits</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Etapa 04 · Trânsito &amp; armazenamento</p>
      <h3>Só texto cifrado sai do seu dispositivo</h3>
      <p class="plain"><b>Em termos simples:</b> guardamos uma caixa trancada e um horário de expiração. Nada mais — nenhum texto legível, nenhuma chave, nenhum registro sobre você.</p>
    </div>
    <div class="explainer__detail">
      <p>O bloco é enviado por <b>TLS</b> e armazenado em repouso como texto cifrado, junto com credenciais em hash, o seu tempo de vida e um horário de expiração arredondado. De propósito, <b>não</b> guardamos identidade do remetente, destinatário, log de IPs, horário de criação nem histórico de acessos. Não existe sistema de contas para ligar um segredo a uma pessoa. O limite de requisições funciona sobre um HMAC do endereço, com um salt que é trocado periodicamente, então nada de antes de uma troca pode ser ligado a nada de depois.</p>
      <p>Como o objeto armazenado não tem sentido sem a semente no fragmento, uma invasão do servidor ou uma ordem judicial só rende bytes opacos e hashes que não podem ser revertidos em nada.</p>
      <div class="spec-list">
        <div><span class="k">Em trânsito</span><span class="v">TLS</span></div>
        <div><span class="k">Em repouso</span><span class="v">texto cifrado + chaves em hash + expiração</span></div>
        <div><span class="k">Logs</span><span class="v">nenhum por segredo</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Etapa 05 · Recuperação &amp; destruição</p>
      <h3>A primeira leitura vence — depois tudo é apagado</h3>
      <p class="plain"><b>Em termos simples:</b> abrir um link de uso único entrega a caixa uma vez e apaga a cópia do servidor. Ou destrua você mesmo, quando quiser.</p>
    </div>
    <div class="explainer__detail">
      <p>Nada é buscado quando a página de revelação carrega: a requisição só sai com um clique ou tecla de verdade, então verificadores de links e pré-visualizações de chat não conseguem consumir um segredo. Num segredo de uso único, o servidor <b>reivindica</b> a linha numa única atualização condicional — exatamente uma requisição vence — e o segredo conta como consumido a partir desse momento. O mesmo navegador pode baixar de novo durante 15 minutos se a conexão cair; ninguém mais pode, e uma reivindicação não confirmada é destruída, nunca desfeita. Segredos com prazo são uma leitura simples até expirarem.</p>
      <p>Todo segredo tem também um <b>link de destruição</b> privado. Abri-lo não destrói nada por si só; confirmar apaga o texto cifrado imediatamente — antes que qualquer destinatário possa lê-lo.</p>
      <div class="spec-list">
        <div><span class="k">Uso único</span><span class="v">reivindicação atômica, depois destruído</span></div>
        <div><span class="k">Janela para baixar de novo</span><span class="v">15 min, só o mesmo cliente</span></div>
        <div><span class="k">Expiração</span><span class="v">15 min – 14 dias</span></div>
        <div><span class="k">Controle do criador</span><span class="v">link de destruição</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Modelo de ameaças</p>
  <h2 class="section__heading">O que o shhnote vê e o que não vê</h2>
  <p class="section__intro">A versão honesta. Veja exatamente onde fica a fronteira de confiança.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Nunca sai do seu dispositivo</p>
    <h3>O que não conseguimos ver</h3>
    <p>O seu texto legível · a chave de conteúdo e a semente · a sua senha · se uma senha foi definida · quem criou ou abriu um segredo · quando ele foi criado · logs de acesso por IP. Nada disso é transmitido ou guardado.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Armazenado nos nossos servidores</p>
    <h3>O que de fato guardamos</h3>
    <p>Um bloco criptografado que não conseguimos abrir · a sua faixa de tamanho após o preenchimento · hashes de sentido único dos valores que o seu navegador usa para encontrá-lo ou destruí-lo · se é de uso único ou com prazo · um horário de expiração arredondado. Tudo isso é inútil sem a semente no seu link.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Bom saber</p>
    <h3>As ressalvas honestas</h3>
    <p>Qualquer pessoa com o link completo (e a senha, se houver) pode ler um segredo de uso único — trate o link como o próprio segredo. Depois que um segredo é exibido, a página sobrescreve o que puder quando você sai, mas o JavaScript não consegue garantir isso; feche a aba quando terminar. Um navegador controlado por automação que injeta interações reais pode abrir um segredo de uso único como uma pessoa faria — o destinatário então não encontra nada, que é o resultado honesto. Apagar um segredo remove o registro; restos criptografados podem permanecer em journals, no espaço livre do disco ou em backups até serem sobrescritos, como texto cifrado sem chave. Segredos grandes guardados fora do banco de dados carregam o horário em que o arquivo foi gravado. E, como em qualquer aplicativo web, você confia no código entregue ao seu navegador — é por isso que o shhnote é de código aberto e pode ser hospedado por conta própria.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Especificação criptográfica</p>
  <h2 class="section__heading">Todas as primitivas, num só lugar</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Criptografia</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Criptografia simétrica autenticada em blocos de 64 KiB. Uma chave de 256 bits mais uma etiqueta de integridade por bloco, de modo que qualquer adulteração ou truncamento é detectado — e não apenas fica ilegível.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Derivação de chave</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Chaves e identificadores vêm da semente por meio de HKDF-SHA-256. As senhas opcionais são reforçadas com uma KDF que exige muita memória, o que torna a força bruta offline lenta e cara, mesmo com hardware dedicado.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Aleatoriedade</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Sementes, chaves, salts e nonces vêm do gerador criptograficamente seguro do navegador. Nunca <span class="color-faint">Math.random()</span>, nunca previsíveis.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Guarda da chave</p>
    <div class="spec__val">Fragmento da URL&nbsp;#</div>
    <p>A semente vai depois do # no seu link. Os navegadores nunca transmitem o fragmento, então ela nunca chega aos nossos servidores.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Em trânsito</p>
    <div class="spec__val">TLS</div>
    <p>Só texto cifrado sai do seu dispositivo, transportado por TLS moderno. O que recebemos é um bloco opaco que não conseguimos abrir.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Em repouso</p>
    <div class="spec__val">Texto cifrado + hashes</div>
    <p>Guardamos um bloco criptografado, hashes de sentido único das suas credenciais e uma expiração arredondada — nenhum texto legível, nenhuma chave, nenhum metadado de remetente ou destinatário.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Perguntas técnicas</p>
  <h2 class="section__heading">Para quem se preocupa com segurança</h2>
</header>

<div class="faq">
  <details open>
    <summary>Como a garantia de uso único é mantida contra condições de corrida?</summary>
    <p>A revelação executa uma única atualização condicional que muda a linha de “ativa” para “reivindicada”. Duas requisições simultâneas não podem ter sucesso ao mesmo tempo; a segunda encontra um registro já reivindicado e recebe a mesma resposta “nenhum segredo encontrado” que qualquer outra pessoa. A reivindicação nunca é desfeita: se o download se perder, quem tem o token da reivindicação baixa de novo dentro da janela; caso contrário, o segredo é destruído sem ser lido.</p>
  </details>
  <details>
    <summary>Por que o fragmento da URL e não um parâmetro de consulta?</summary>
    <p>Os parâmetros de consulta são enviados ao servidor e acabam em logs de acesso, proxies e ferramentas de análise. O fragmento (depois do <span class="color-accent">#</span>) é definido pela especificação de URL para ficar no lado do cliente — o navegador nunca o coloca na requisição HTTP. Essa propriedade é a base de todo o design de conhecimento zero. Depois de uma revelação, a página também remove o fragmento da barra de endereço e do histórico.</p>
  </details>
  <details>
    <summary>O que impede os verificadores de links de destruírem segredos de uso único antes da hora?</summary>
    <p>A página de visualização é o mesmo documento estático para todos os segredos e não busca nada ao carregar. A requisição só é enviada com um clique ou tecla confiável — um <code>click()</code> por script ou um envio de formulário não contam. Os verificadores automáticos (segurança de e-mail, pré-visualizações de chat, antivírus) só carregam essa estrutura estática.</p>
  </details>
  <details>
    <summary>Posso verificar ou hospedar isto eu mesmo?</summary>
    <p>Sim. Todo o código-fonte é público sob a licença AGPLv3, o protocolo está descrito numa especificação com vetores de conformidade que qualquer implementação pode usar para se testar, e há um guia de hospedagem própria. Você pode auditar a criptografia no lado do cliente e rodar a sua própria instância, para que a fronteira de confiança seja inteiramente sua.</p>
  </details>
  <details>
    <summary>Algo é registrado para prevenir abusos?</summary>
    <p>Não guardamos logs de acesso por segredo nem histórico de IPs. O limite de requisições usa um hash com chave do endereço, com um salt que é trocado periodicamente e, a cada troca, zera todos os contadores. As denúncias de abuso são contadas por dia; não há registro de qual segredo foi denunciado.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Dicas para compartilhar com segurança

- Envie a senha por um meio diferente do link, por exemplo o link por e-mail e a senha por telefone.
- Escolha a expiração mais curta que funcione para você.
- Use um segredo de uso único para senhas e outras informações que devem ser lidas exatamente uma vez.

<h2 id="reporting-a-vulnerability">Relatar uma vulnerabilidade</h2>

Se você acha que encontrou um problema de segurança neste site, escreva para [security@shhnote.com](mailto:security@shhnote.com) e conte-nos de forma privada antes de contar a qualquer outra pessoa. Inclua o que você encontrou e como reproduzir.

Nós vamos:

- responder em até [number] dias úteis;
- manter você informado enquanto corrigimos;
- dar o crédito a você quando publicarmos a correção, se quiser.

Durante os testes, não acesse dados de outras pessoas, não perturbe o serviço e não rode varreduras automatizadas que o sobrecarreguem.

Vulnerabilidades no próprio software shhnote: veja a [política de segurança do projeto](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/pt/#create" class="btn btn--primary"><span>Criar um segredo</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Ver o código no GitHub</span></a></p>

</div>
</div>
</section>
