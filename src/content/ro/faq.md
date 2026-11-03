---
title: "Întrebări și răspunsuri"
description: "Întrebări frecvente despre shhnote — cont, linkuri, fraze de acces, expirare și detaliile tehnice pentru cei atenți la securitate."
eyebrow: "Întrebări frecvente"
intro: "Mai întâi răspunsurile scurte, apoi cele tehnice. Dacă întrebarea ta nu e aici, paginile despre funcționare și securitate intră în mai multe detalii și ne poți scrie oricând."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Am nevoie de un cont?</summary>
    <p>Nu. Nu trebuie să te înregistrezi și nu trebuie să instalezi nimic. Deschide shhnote, scrie secretul, trimite linkul. Atât.</p>
  </details>
  <details>
    <summary>Ce se întâmplă dacă linkul e văzut de persoana greșită?</summary>
    <p>Un secret de unică folosință poate fi citit doar de prima persoană care îl deschide — apoi este distrus, iar tu vei ști că l-a citit altcineva, pentru că destinatarul nu mai găsește nimic. Pentru mai multă siguranță poți adăuga o frază de acces pe care o trimiți separat, astfel încât linkul singur să nu fie suficient. Iar dacă te răzgândești, poți distruge singur secretul cu linkul tău privat de distrugere.</p>
  </details>
  <details>
    <summary>Poate shhnote să-mi citească secretul?</summary>
    <p>Nu. Cheia care îl deblochează nu ajunge niciodată la noi — rămâne ascunsă în linkul tău, de partea ta. Noi deținem doar o versiune amestecată pe care nu avem cum s-o deschidem.</p>
  </details>
  <details>
    <summary>Ce se întâmplă dacă nu-l deschide nimeni?</summary>
    <p>Alegi o perioadă de expirare — oriunde între 15 minute și 14 zile. Când timpul se scurge, secretul este șters automat, indiferent dacă a fost deschis sau nu.</p>
  </details>
  <details>
    <summary>Care e diferența dintre un secret de unică folosință și unul cu termen?</summary>
    <p>Un secret de unică folosință este distrus în clipa în care este deschis. Un secret cu termen poate fi deschis din nou până expiră — dar pagina nu spune niciodată cât timp a mai rămas, așa că tratează orice secret ca pe ceva de salvat de la prima citire.</p>
  </details>
  <details>
    <summary>Ce este linkul de distrugere?</summary>
    <p>Un al doilea link, privat, pe care îl primești când creezi un secret. Când îl deschizi, ți se cere o confirmare; dacă confirmi, secretul este distrus imediat, înainte ca cineva să-l poată citi. Păstrează-l pentru tine.</p>
  </details>
  <details>
    <summary>Pot trimite fișiere?</summary>
    <p>Da. Fișierele sunt criptate în browserul tău exact ca textul și călătoresc în același blob sigilat. Totul este completat până la mărimi standard, așa că nici măcar noi nu putem deosebi o notiță scurtă de un fișier mic.</p>
  </details>
  <details>
    <summary>Funcționează în Tor Browser sau cu JavaScript dezactivat?</summary>
    <p>Crearea și afișarea unui secret necesită JavaScript, pentru că criptarea are loc în browserul tău. Funcționează în Tor Browser la nivelul „Mai sigur”; la „Cel mai sigur”, WebAssembly este dezactivat, așa că secretele protejate cu frază de acces nu pot fi deschise, iar pagina îți spune acest lucru. Toate celelalte pagini funcționează fără JavaScript.</p>
  </details>
  <details>
    <summary>Cum este garantată vizualizarea unică în cazul cererilor simultane?</summary>
    <p>Afișarea execută o singură actualizare condiționată, care mută rândul din „activ” în „revendicat”. Două cereri simultane nu pot reuși amândouă; a doua găsește o înregistrare deja revendicată și primește același răspuns „niciun secret găsit” ca oricine altcineva. Revendicarea nu este anulată niciodată: dacă descărcarea se pierde, deținătorul tokenului de revendicare descarcă din nou în intervalul permis, altfel secretul este distrus necitit.</p>
  </details>
  <details>
    <summary>De ce fragmentul URL și nu un parametru de interogare?</summary>
    <p>Parametrii de interogare sunt trimiși serverului și ajung în jurnalele de acces, în proxy-uri și în instrumentele de analiză. Fragmentul (de după <span class="color-accent">#</span>) este definit de specificația URL ca să rămână pe partea clientului — browserul nu îl pune niciodată în cererea HTTP. Această proprietate este întreaga bază a designului zero-knowledge. După afișare, pagina elimină și fragmentul din bara de adrese și din istoric.</p>
  </details>
  <details>
    <summary>Ce împiedică scannerele de linkuri să consume prematur secretele de unică folosință?</summary>
    <p>Pagina de vizualizare este același document static pentru toate secretele și nu descarcă nimic la încărcare. Cererea este trimisă doar la un clic sau o apăsare de tastă reală — un <code>click()</code> prin script sau o trimitere de formular nu contează. Scannerele automate (securitate e-mail, previzualizări din chat, antivirus) încarcă doar acel cadru static.</p>
  </details>
  <details>
    <summary>Pot verifica sau găzdui singur serviciul?</summary>
    <p>Da. Tot codul sursă este public sub licența AGPLv3, protocolul este descris într-o specificație cu vectori de conformitate față de care orice implementare se poate verifica, și există un ghid de găzduire proprie. Poți audita criptografia din client și îți poți rula propria instanță, astfel încât granița de încredere să fie în întregime a ta.</p>
  </details>
  <details>
    <summary>Se înregistrează ceva pentru prevenirea abuzurilor?</summary>
    <p>Nu păstrăm jurnale de acces per secret și nici istoric de IP-uri. Limitarea ratei folosește un hash cu cheie al adresei, cu un salt care se rotește și care șterge odată cu el toate contoarele. Raportările de abuz sunt numărate pe zi; nu există nicio evidență a secretului raportat.</p>
  </details>
  <details>
    <summary>Există un API?</summary>
    <p>Da — același pe care îl folosește acest site. <a href="/en/docs/">Documentația</a> îl descrie, iar pachetul client open source implementează protocolul pentru propriile tale instrumente.</p>
  </details>
</div>

<p class="prose-note">Mai ai întrebări? Citește <a href="/ro/how-it-works/">cum funcționează</a>, <a href="/ro/security/">detaliile de securitate</a> sau <a href="/ro/contact/">scrie-ne</a>.</p>
</div>
</section>
