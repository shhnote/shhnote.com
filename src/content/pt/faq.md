---
title: "Perguntas, respondidas"
description: "Perguntas frequentes sobre o shhnote — contas, links, senhas, expiração e os detalhes técnicos para quem se preocupa com segurança."
eyebrow: "Perguntas frequentes"
intro: "Primeiro as respostas curtas, depois as técnicas. Se a sua pergunta não estiver aqui, as páginas Como funciona e Segurança vão mais a fundo, e você sempre pode nos perguntar."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Preciso de uma conta?</summary>
    <p>Não. Não há cadastro nem nada para instalar. Abra o shhnote, escreva o seu segredo, compartilhe o link. Só isso.</p>
  </details>
  <details>
    <summary>E se o link for visto pela pessoa errada?</summary>
    <p>Um segredo de uso único só pode ser lido pela primeira pessoa que o abrir — depois disso ele é destruído, e você vai saber que alguém o leu porque o destinatário certo não encontra nada. Para mais segurança, você pode adicionar uma senha e enviá-la separadamente, para que só o link não baste. E se mudar de ideia, você mesmo pode destruir o segredo com o seu link de destruição privado.</p>
  </details>
  <details>
    <summary>O shhnote consegue ler o meu segredo?</summary>
    <p>Não. A chave que o desbloqueia nunca chega até nós — ela fica guardada dentro do seu link, do seu lado. Nós só temos uma versão embaralhada que não temos como abrir.</p>
  </details>
  <details>
    <summary>O que acontece se ninguém abrir?</summary>
    <p>Você escolhe a expiração — de 15 minutos a 14 dias. Quando o prazo acaba, o segredo é apagado automaticamente, tenha sido aberto ou não.</p>
  </details>
  <details>
    <summary>Qual é a diferença entre um segredo de uso único e um com prazo?</summary>
    <p>Um segredo de uso único é destruído no momento em que é aberto. Um segredo com prazo pode ser aberto de novo até expirar — mas a página nunca diz quanto tempo resta, então trate todo segredo como algo a guardar já na primeira leitura.</p>
  </details>
  <details>
    <summary>O que é o link de destruição?</summary>
    <p>Um segundo link, privado, que você recebe ao criar um segredo. Ao abri-lo aparece uma confirmação; confirmar destrói o segredo imediatamente, antes que alguém possa lê-lo. Guarde-o só para você.</p>
  </details>
  <details>
    <summary>Posso enviar arquivos?</summary>
    <p>Sim. Os arquivos são criptografados no seu navegador exatamente como o texto e viajam dentro do mesmo bloco selado. Tudo recebe preenchimento até tamanhos padrão, então nem nós conseguimos distinguir uma nota curta de um arquivo pequeno.</p>
  </details>
  <details>
    <summary>Funciona no Tor Browser ou com o JavaScript desativado?</summary>
    <p>Criar e revelar um segredo exige JavaScript, porque a criptografia acontece no seu navegador. Funciona no Tor Browser no nível “Mais seguro”; no nível “O mais seguro”, o WebAssembly fica desativado, então segredos protegidos por senha não podem ser abertos, e a página avisa isso. Todas as outras páginas funcionam sem JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Existe uma API?</summary>
    <p>Sim — a mesma que este site usa. A <a href="/en/docs/">documentação</a> a descreve, e o pacote cliente de código aberto implementa o protocolo para as suas próprias ferramentas.</p>
  </details>
</div>

<p class="prose-note">Ainda com dúvidas? Leia <a href="/pt/how-it-works/">como funciona</a>, os <a href="/pt/security/">detalhes de segurança</a> ou <a href="/pt/contact/">fale conosco</a>.</p>
</div>
</section>
