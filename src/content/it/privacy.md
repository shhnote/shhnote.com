---
title: "Informativa sulla privacy"
description: "Cosa conserva shhnote.com, per quanto tempo e cosa non fa mai. Non possiamo leggere i tuoi segreti e conserviamo il meno possibile."
eyebrow: "Note legali"
updated: "5 novembre 2026"
---

> **Bozza.** Questa informativa è un punto di partenza e non è stata esaminata da un avvocato.

## In breve

shhnote.com («questo sito») non può leggere i tuoi segreti. Vengono cifrati sul tuo dispositivo e la chiave non ci raggiunge mai. Di tutto il resto conserviamo il meno possibile e lo eliminiamo appena possibile.

## Cosa conserviamo

Quando crei un segreto, conserviamo:

- **Il segreto cifrato.** Senza la chiave contenuta nel tuo link è illeggibile, anche per noi.
- **Le sue impostazioni:** quando scade e se viene eliminato dopo una sola visualizzazione.
- **Credenziali sottoposte a hash:** hash unidirezionali dei valori che il tuo browser usa per trovarlo o distruggerlo, da cui non si può risalire a nulla di utile.

Non conserviamo la tua passphrase, la chiave del tuo link, il momento in cui il segreto è stato creato né se è stata impostata una passphrase. L'orario di scadenza viene arrotondato, quindi non permette di risalire al momento della creazione. I dati cifrati vengono riempiti con padding, quindi ne conosciamo solo la classe di dimensione approssimativa.

I segreti di grandi dimensioni possono essere conservati fuori dal database, su disco o in un object storage. Questo storage registra quando ogni file è stato scritto, ed è l'unico posto in cui esiste un orario di creazione. È associato a un file cifrato che non possiamo aprire e scompare insieme al file.

Se qualcuno segnala un link, contiamo la segnalazione per quel giorno. Non registriamo quale segreto sia stato segnalato.

## Quando lo eliminiamo

Un segreto viene eliminato quando scade, oppure subito dopo essere stato aperto se è un segreto monouso. I segreti eliminati non possono essere recuperati.

L'eliminazione rimuove il record. Come su qualsiasi computer, residui cifrati possono restare nei journal del database, nello spazio libero su disco o nei backup finché non vengono sovrascritti. Sono testo cifrato senza chiave, e trattiamo i backup di conseguenza.

## Cosa non facciamo

- Non usiamo cookie né tracciamento e non mostriamo pubblicità.
- Non carichiamo nulla da altri siti: niente font, script o immagini esterni, quindi nessuna terza parte vede la tua visita.
- Non ti chiediamo di creare un account.
- Non vendiamo né condividiamo i tuoi dati.

La tua scelta del tema e, se ne scegli una nel menu delle lingue, la tua lingua vengono memorizzate nel local storage del tuo browser e non vengono mai inviate altrove.

## Log del server

Questo sito non conserva log delle richieste: il server web che lo precede non registra le richieste, e il server shhnote non tiene un log di accesso per segreto né una cronologia degli IP (il rate limiting usa un hash con chiave dell'indirizzo sotto un salt che ruota). Cloudflare termina il TLS per questo sito e vede gli indirizzi IP secondo la propria informativa sulla privacy; non vede mai il frammento di un link né alcuna chiave, perché i browser non inviano la parte del link che contiene la chiave.

## I tuoi diritti

A seconda di dove vivi, potresti avere il diritto di chiedere quali dati conserviamo su di te e di farli correggere o cancellare. Poiché non conserviamo quasi nulla che ti identifichi, di solito c'è poco da comunicare. Scrivici a [contact@shhnote.com](mailto:contact@shhnote.com).

## Contatti

Domande su questa informativa: [contact@shhnote.com](mailto:contact@shhnote.com).
