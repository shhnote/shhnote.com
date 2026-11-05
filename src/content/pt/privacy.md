---
title: "Política de privacidade"
description: "O que o shhnote.com armazena, por quanto tempo e o que nunca faz. Não conseguimos ler os seus segredos e guardamos o mínimo possível de todo o resto."
eyebrow: "Jurídico"
updated: "5 de novembro de 2026"
---

> **Rascunho.** Esta política é um ponto de partida e não foi revisada por um advogado.

## A versão curta

O shhnote.com (“este site”) não consegue ler os seus segredos. Eles são criptografados no seu dispositivo, e a chave nunca chega até nós. Guardamos o mínimo possível de todo o resto e o apagamos assim que possível.

## O que armazenamos

Quando você cria um segredo, armazenamos:

- **O segredo criptografado.** Sem a chave que está no seu link, ele é ilegível, inclusive para nós.
- **As configurações dele:** quando expira e se é apagado após uma visualização.
- **Credenciais em hash:** hashes de sentido único dos valores que o seu navegador usa para encontrá-lo ou destruí-lo, que não podem ser revertidos em nada útil.

Não armazenamos a sua senha, a chave do seu link, o momento em que o segredo foi criado nem se uma senha foi definida. O horário de expiração é arredondado, para que não possa ser convertido de volta no horário de criação. Os dados criptografados recebem preenchimento, então só sabemos a faixa aproximada de tamanho.

Segredos grandes podem ser guardados fora do banco de dados, em disco ou em armazenamento de objetos. Esse armazenamento registra quando cada arquivo foi gravado, e esse é o único lugar onde existe um horário de criação. Ele fica associado a um arquivo criptografado que não conseguimos abrir e desaparece junto com o arquivo.

Se alguém denuncia um link, contamos a denúncia naquele dia. Não guardamos registro de qual segredo foi denunciado.

## Quando apagamos

Um segredo é apagado quando expira, ou logo depois de ser aberto, se for um segredo de uso único. Segredos apagados não podem ser recuperados.

A exclusão remove o registro. Como em qualquer computador, restos criptografados podem permanecer em journals do banco de dados, no espaço livre do disco ou em backups até serem sobrescritos. São texto cifrado sem chave, e tratamos os backups de acordo.

## O que não fazemos

- Não usamos cookies nem rastreamento, e não exibimos anúncios.
- Não carregamos nada de outros sites: nenhuma fonte, script ou imagem de fora, então nenhum terceiro fica sabendo da sua visita.
- Não pedimos que você crie uma conta.
- Não vendemos nem compartilhamos os seus dados.

A sua escolha de tema e, se você escolher um no menu de idiomas, o seu idioma ficam guardados no armazenamento local do seu navegador e nunca são enviados a lugar nenhum.

## Registros do servidor

Este site não mantém registros de requisições: o servidor web à frente dele não registra requisições, e o servidor shhnote não mantém registro de acesso por segredo nem histórico de IP (a limitação de taxa usa um hash com chave do endereço sob um salt que é trocado periodicamente). A Cloudflare termina o TLS deste site e vê endereços IP sob a sua própria política de privacidade; ela nunca vê o fragmento de um link nem chave alguma, porque os navegadores não enviam a parte do link que contém a chave.

## Os seus direitos

Dependendo de onde você vive, você pode ter o direito de saber quais dados temos sobre você e de pedir que sejam corrigidos ou apagados. Como não guardamos quase nada que identifique você, normalmente há pouco a informar. Entre em contato pelo [contact@shhnote.com](mailto:contact@shhnote.com).

## Contato

Dúvidas sobre esta política: [contact@shhnote.com](mailto:contact@shhnote.com).
