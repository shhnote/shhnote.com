---
title: "Domande e risposte"
description: "Domande frequenti su shhnote: account, link, passphrase, scadenza e i dettagli tecnici per chi tiene alla sicurezza."
eyebrow: "FAQ"
intro: "Prima le risposte brevi, poi quelle tecniche. Se la tua domanda non c'è, le pagine su come funziona e sulla sicurezza vanno più a fondo, e puoi sempre chiedere a noi."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Mi serve un account?</summary>
    <p>No. Non c'è niente a cui iscriversi e niente da installare. Apri shhnote, scrivi il tuo segreto, condividi il link. Tutto qui.</p>
  </details>
  <details>
    <summary>E se il link lo vede la persona sbagliata?</summary>
    <p>Un segreto monouso può essere letto solo dalla prima persona che lo apre: dopo viene distrutto, e capirai che qualcosa l'ha letto perché il destinatario previsto non troverà nulla. Per maggiore sicurezza puoi aggiungere una passphrase e comunicarla a parte, così il solo link non basta. E se cambi idea, puoi distruggere tu stesso il segreto con il tuo link di distruzione privato.</p>
  </details>
  <details>
    <summary>shhnote può leggere il mio segreto?</summary>
    <p>No. La chiave che lo sblocca non ci raggiunge mai: resta custodita nel tuo link, dalla tua parte. Noi conserviamo solo una versione cifrata che non abbiamo modo di aprire.</p>
  </details>
  <details>
    <summary>Cosa succede se nessuno lo apre?</summary>
    <p>Scegli tu la scadenza, da 15 minuti a 14 giorni. Allo scadere del tempo, il segreto viene eliminato automaticamente, che sia stato aperto o no.</p>
  </details>
  <details>
    <summary>Che differenza c'è tra un segreto monouso e uno a tempo?</summary>
    <p>Un segreto monouso viene distrutto nel momento in cui viene aperto. Un segreto a tempo può essere riaperto fino alla scadenza, ma la pagina non dice mai quanto tempo resta, quindi tratta ogni segreto come qualcosa da salvare alla prima lettura.</p>
  </details>
  <details>
    <summary>Cos'è il link di distruzione?</summary>
    <p>Un secondo link privato che ricevi quando crei un segreto. Aprendolo compare una richiesta di conferma; confermando, il segreto viene distrutto subito, prima che chiunque possa leggerlo. Tienilo per te.</p>
  </details>
  <details>
    <summary>Posso inviare file?</summary>
    <p>Sì. I file vengono cifrati nel tuo browser esattamente come il testo e viaggiano nello stesso blob sigillato. Tutto viene portato a dimensioni standard con il padding, così nemmeno noi possiamo distinguere una nota breve da un file piccolo.</p>
  </details>
  <details>
    <summary>Funziona in Tor Browser o con JavaScript disattivato?</summary>
    <p>Per creare e mostrare un segreto serve JavaScript, perché la cifratura avviene nel tuo browser. Funziona in Tor Browser al livello «Più sicuro»; al livello «Il più sicuro» WebAssembly è disattivato, quindi i segreti protetti da passphrase non si possono aprire e la pagina lo segnala. Tutte le altre pagine funzionano senza JavaScript.</p>
  </details>
  <details>
    <summary>Come viene garantito l'uso singolo contro le richieste concorrenti?</summary>
    <p>L'apertura esegue un unico aggiornamento condizionale che porta la riga da «active» a «claimed». Due richieste simultanee non possono andare entrambe a buon fine: la seconda trova un record già rivendicato e riceve la stessa risposta «nessun segreto trovato» di chiunque altro. La rivendicazione non viene mai annullata: se il download va perso, chi possiede il token di rivendicazione lo riscarica entro la finestra prevista, altrimenti il segreto viene distrutto senza essere letto.</p>
  </details>
  <details>
    <summary>Perché il frammento dell'URL e non un parametro di query?</summary>
    <p>I parametri di query vengono inviati al server e finiscono nei log di accesso, nei proxy e negli strumenti di analisi. Il frammento (dopo il <span class="color-accent">#</span>) è definito dalla specifica degli URL come lato client: il browser non lo inserisce mai nella richiesta HTTP. Questa proprietà è l'intera base del modello zero-knowledge. Dopo l'apertura, la pagina rimuove anche il frammento dalla barra degli indirizzi e dalla cronologia.</p>
  </details>
  <details>
    <summary>Cosa impedisce agli scanner di link di consumare in anticipo i segreti monouso?</summary>
    <p>La pagina di visualizzazione è lo stesso documento statico per ogni segreto e non recupera nulla al caricamento. La richiesta parte solo dopo un clic o la pressione di un tasto attendibili: un <code>click()</code> eseguito da script o l'invio di un modulo non contano. Gli scanner automatici (sicurezza email, anteprime delle chat, antivirus) caricano sempre e solo quell'involucro statico.</p>
  </details>
  <details>
    <summary>Posso verificarlo o ospitarlo da me?</summary>
    <p>Sì. Tutto il codice sorgente è pubblico con licenza AGPLv3, il protocollo è descritto in una specifica con vettori di conformità con cui qualsiasi implementazione può verificarsi, e c'è una guida al self-hosting. Puoi esaminare la crittografia lato client e gestire una tua istanza, così il confine di fiducia è interamente tuo.</p>
  </details>
  <details>
    <summary>Viene registrato qualcosa per prevenire gli abusi?</summary>
    <p>Non conserviamo log di accesso per singolo segreto né storico degli IP. Il rate limiting usa un hash con chiave dell'indirizzo, con un salt che ruota e azzera ogni contatore a ogni rotazione. Le segnalazioni di abuso vengono contate per giorno; non resta traccia di quale segreto sia stato segnalato.</p>
  </details>
  <details>
    <summary>Esiste un'API?</summary>
    <p>Sì, la stessa che usa questo sito. La <a href="/en/docs/">documentazione</a> la descrive, e il pacchetto client open source implementa il protocollo per i tuoi strumenti.</p>
  </details>
</div>

<p class="prose-note">Hai ancora dubbi? Leggi <a href="/it/how-it-works/">come funziona</a>, i <a href="/it/security/">dettagli sulla sicurezza</a> oppure <a href="/it/contact/">chiedi a noi</a>.</p>
</div>
</section>
