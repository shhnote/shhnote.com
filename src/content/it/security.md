---
title: "Il ciclo di vita crittografico completo"
description: "Cosa succede ai tuoi dati in ogni fase su shhnote: primitive, parametri e confini di fiducia nel dettaglio, con le avvertenze oneste."
eyebrow: "Sicurezza · Approfondimento"
intro: "Una descrizione precisa di cosa succede ai tuoi dati in ogni fase, con primitive, parametri e confini di fiducia nel dettaglio. Ogni fase si apre con un riassunto in parole semplici, così puoi leggere al livello di dettaglio che preferisci."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Fase 01 · Cifratura</p>
      <h3>Il tuo segreto viene sigillato sul tuo dispositivo</h3>
      <p class="plain"><b>In parole semplici:</b> la cifratura avviene nel tuo browser, prima che venga caricato qualsiasi dato. Quello che riceviamo è già illeggibile.</p>
    </div>
    <div class="explainer__detail">
      <p>Quando premi <b>Cifra</b>, il browser genera una nuova chiave di contenuto a 256 bit dal WebCrypto CSPRNG e cifra il contenuto con <b>AES-256-GCM</b>. GCM è autenticato: ogni blocco porta un tag a 128 bit, quindi qualsiasi manomissione successiva viene rilevata invece di essere decifrata senza avvisi.</p>
      <p>Testo e file vengono trattati allo stesso modo: entrambi diventano un unico blob binario opaco, portato con il padding a una dimensione standard, così una password breve e un file piccolo sembrano uguali. Il testo in chiaro non tocca mai la rete e non lascia mai la memoria della scheda.</p>
      <div class="spec-list">
        <div><span class="k">Cifrario</span><span class="v">AES-256-GCM, blocchi da 64 KiB</span></div>
        <div><span class="k">Chiave di contenuto</span><span class="v">256 bit, nuova per ogni segreto</span></div>
        <div><span class="k">Nonce</span><span class="v">prefisso casuale di 7 byte + contatore</span></div>
        <div><span class="k">Tag di autenticazione</span><span class="v">128 bit per blocco</span></div>
        <div><span class="k">Padding</span><span class="v">Padmé, minimo 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Fase 02 · Custodia della chiave</p>
      <h3>La chiave è nascosta nel link, non sui nostri server</h3>
      <p class="plain"><b>In parole semplici:</b> la parte del link dopo il <span class="color-accent">#</span> contiene la chiave, e i browser non inviano mai quella parte a nessun server.</p>
    </div>
    <div class="explainer__detail">
      <p>Il tuo link contiene un <b>seed</b> casuale a 256 bit nel <b>frammento</b> dell'URL, cioè tutto ciò che segue il <span class="color-accent">#</span>. Secondo la specifica degli URL, il browser rimuove il frammento e <b>non lo include mai nella richiesta</b> inviata ai nostri server. Da quel seed il browser ricava, con HKDF, un valore di ricerca per trovare il segreto e la chiave che sblocca la chiave di contenuto. Il server vede sempre e solo un hash del valore di ricerca.</p>
      <p>Il browser del destinatario legge il seed dal frammento ed esegue la stessa derivazione in locale. Ecco cosa significa qui «zero-knowledge»: possedere solo il testo cifrato è inutile senza il link.</p>
      <div class="spec-list">
        <div><span class="k">Posizione della chiave</span><span class="v">frammento dell'URL #</span></div>
        <div><span class="k">Inviata al server?</span><span class="v">mai</span></div>
        <div><span class="k">Seed</span><span class="v">32 byte casuali, base64url</span></div>
        <div><span class="k">Derivazione</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Il server conserva</span><span class="v">solo SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Fase 03 · Passphrase facoltativa</p>
      <h3>Un secondo lucchetto che solo le persone conoscono</h3>
      <p class="plain"><b>In parole semplici:</b> aggiungi una passphrase e nemmeno chi ha il link completo potrà aprire il segreto senza di essa.</p>
    </div>
    <div class="explainer__detail">
      <p>Se imposti una passphrase, viene rafforzata con <b>Argon2id</b>, una funzione di derivazione della chiave memory-hard, e combinata con il seed nella chiave che protegge la chiave di contenuto. La passphrase in sé non viene mai trasmessa né conservata: la conoscete solo tu e il destinatario. I tentativi errati vengono ripetuti nel browser del destinatario sui dati che ha già, quindi il server non può contarli.</p>
      <p>L'uso intensivo di memoria rende costosi i tentativi offline su larga scala, anche con GPU e ASIC. Condividi la passphrase su un <b>canale diverso</b> da quello del link, così i due fattori non si trovano mai nello stesso posto. Il modulo Argon2 viene scaricato a ogni creazione e apertura, così la rete non può capire quali segreti ne usano una.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">casuale a 128 bit</span></div>
        <div><span class="k">Wrapping</span><span class="v">AES-256-GCM, IV a 96 bit</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Fase 04 · Trasferimento &amp; archiviazione</p>
      <h3>Dal tuo dispositivo esce solo testo cifrato</h3>
      <p class="plain"><b>In parole semplici:</b> conserviamo una scatola chiusa e un orario di scadenza. Nient'altro: niente testo in chiaro, niente chiave, nessuna traccia di te.</p>
    </div>
    <div class="explainer__detail">
      <p>Il blob viene caricato tramite <b>TLS</b> e conservato a riposo come testo cifrato, insieme a credenziali sottoposte a hash, alla sua durata e a un orario di scadenza arrotondato. Di proposito <b>non</b> conserviamo l'identità del mittente, il destinatario, log degli IP, l'orario di creazione o lo storico degli accessi. Non esiste un sistema di account che colleghi un segreto a una persona. Il rate limiting lavora su un HMAC dell'indirizzo con un salt che ruota, quindi nulla di ciò che precede una rotazione può essere collegato a ciò che la segue.</p>
      <p>Poiché l'oggetto conservato non ha senso senza il seed nel frammento, la compromissione del server o un ordine giudiziario producono solo byte opachi e hash da cui non si può risalire a nulla.</p>
      <div class="spec-list">
        <div><span class="k">In transito</span><span class="v">TLS</span></div>
        <div><span class="k">A riposo</span><span class="v">testo cifrato + chiavi sottoposte a hash + scadenza</span></div>
        <div><span class="k">Log</span><span class="v">nessuno per singolo segreto</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Fase 05 · Recupero &amp; distruzione</p>
      <h3>Vince la prima lettura, poi viene cancellato</h3>
      <p class="plain"><b>In parole semplici:</b> aprire un link monouso consegna la scatola una sola volta ed elimina la copia sul server. Oppure distruggilo tu, quando vuoi.</p>
    </div>
    <div class="explainer__detail">
      <p>Al caricamento della pagina di apertura non viene recuperato nulla: la richiesta parte solo dopo un vero clic o la pressione di un tasto, quindi gli scanner di link e le anteprime delle chat non possono consumare un segreto. Per un segreto monouso il server <b>rivendica</b> la riga con un unico aggiornamento condizionale (vince esattamente una richiesta) e da quel momento il segreto è considerato consumato. Lo stesso browser può riscaricarlo per 15 minuti se la connessione cade; nessun altro può farlo, e una rivendicazione non confermata viene distrutta, mai annullata. I segreti a tempo sono una semplice lettura fino alla scadenza.</p>
      <p>Ogni segreto ha anche un <b>link di distruzione</b> privato. Aprirlo di per sé non distrugge nulla; confermando, il testo cifrato viene cancellato subito, prima che qualsiasi destinatario possa leggerlo.</p>
      <div class="spec-list">
        <div><span class="k">Monouso</span><span class="v">rivendicazione atomica, poi distruzione</span></div>
        <div><span class="k">Finestra di riscaricamento</span><span class="v">15 min, solo lo stesso client</span></div>
        <div><span class="k">Scadenza</span><span class="v">da 15 min a 14 giorni</span></div>
        <div><span class="k">Controllo del proprietario</span><span class="v">link di distruzione</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Modello di minaccia</p>
  <h2 class="section__heading">Cosa shhnote può e non può vedere</h2>
  <p class="section__intro">La versione onesta. Ecco esattamente dove si trova il confine di fiducia.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Non lascia mai il tuo dispositivo</p>
    <h3>Cosa non possiamo vedere</h3>
    <p>Il tuo testo in chiaro · la chiave di contenuto e il seed · la tua passphrase · se è stata impostata una passphrase · chi ha creato o aperto un segreto · quando è stato creato · log di accesso a livello di IP. Nulla di tutto questo viene trasmesso o conservato.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Conservato sui nostri server</p>
    <h3>Cosa conserviamo</h3>
    <p>Un blob cifrato che non possiamo aprire · la sua classe di dimensione dopo il padding · hash unidirezionali dei valori che il tuo browser usa per trovarlo o distruggerlo · se è monouso o a tempo · un orario di scadenza arrotondato. Tutto inutile senza il seed contenuto nel tuo link.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Da sapere</p>
    <h3>Le avvertenze oneste</h3>
    <p>Chiunque abbia il link completo (e la passphrase, se impostata) può leggere un segreto monouso: tratta il link come il segreto stesso. Dopo che un segreto è stato mostrato, la pagina sovrascrive ciò che può quando la lasci, ma JavaScript non può garantirlo; chiudi la scheda quando hai finito. Un browser controllato da automazioni che simulano input reali può aprire un segreto monouso come farebbe una persona: il destinatario allora non trova nulla, ed è l'esito onesto. Eliminare un segreto rimuove il record; residui cifrati possono restare nei journal, nello spazio libero su disco o nei backup finché non vengono sovrascritti, come testo cifrato senza chiave. I segreti di grandi dimensioni conservati fuori dal database portano con sé l'orario in cui il file è stato scritto. E come per qualsiasi web app, ti fidi del codice inviato al tuo browser: per questo shhnote è open source e si può ospitare in proprio.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Specifica crittografica</p>
  <h2 class="section__heading">Tutte le primitive, in un unico posto</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Cifratura</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Cifratura simmetrica autenticata in blocchi da 64 KiB. Una chiave a 256 bit più un tag di integrità per blocco, quindi manomissioni o troncamenti vengono rilevati, non solo resi illeggibili.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Derivazione della chiave</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Chiavi e identificatori derivano dal seed tramite HKDF-SHA-256. Le passphrase facoltative vengono rafforzate con una KDF memory-hard, che rende il brute force offline lento e costoso anche su hardware dedicato.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Casualità</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seed, chiavi, salt e nonce provengono dal generatore crittograficamente sicuro del browser. Mai <span class="color-faint">Math.random()</span>, mai prevedibili.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Custodia della chiave</p>
    <div class="spec__val">Frammento dell'URL&nbsp;#</div>
    <p>Il seed viaggia dopo il # nel tuo link. I browser non trasmettono mai il frammento, quindi non raggiunge mai i nostri server.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">In transito</p>
    <div class="spec__val">TLS</div>
    <p>Dal tuo dispositivo esce solo testo cifrato, trasportato su TLS moderno. Quello che riceviamo è un blob opaco che non possiamo aprire.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">A riposo</p>
    <div class="spec__val">Testo cifrato + hash</div>
    <p>Conserviamo un blob cifrato, hash unidirezionali delle sue credenziali e una scadenza arrotondata: niente testo in chiaro, niente chiavi, nessun metadato su mittente o destinatario.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">FAQ tecniche</p>
  <h2 class="section__heading">Per chi tiene alla sicurezza</h2>
</header>

<div class="faq">
  <details open>
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
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Consigli per condividere in sicurezza

- Invia la passphrase in modo diverso dal link, per esempio il link via email e la passphrase per telefono.
- Scegli la scadenza più breve che vada bene per te.
- Usa un segreto monouso per password e altre informazioni che devono essere lette una sola volta.

<h2 id="reporting-a-vulnerability">Segnalare una vulnerabilità</h2>

Se pensi di aver trovato un problema di sicurezza in questo sito, scrivi a [security@shhnote.com](mailto:security@shhnote.com) e comunicacelo in privato prima di dirlo a chiunque altro. Indica cosa hai trovato e come riprodurlo.

Ci impegniamo a:

- risponderti entro [number] giorni lavorativi;
- tenerti aggiornato mentre lo correggiamo;
- citarti quando pubblichiamo la correzione, se lo desideri.

Durante i test, non accedere ai dati di altre persone, non disturbare il servizio e non eseguire scansioni automatiche che lo sovraccarichino.

Vulnerabilità nel software shhnote stesso: consulta la [policy di sicurezza del progetto](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/it/#create" class="btn btn--primary"><span>Crea un segreto</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Vedi il codice su GitHub</span></a></p>

</div>
</div>
</section>
