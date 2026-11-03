---
title: "Ciclul de viață criptografic complet"
description: "Ce se întâmplă cu datele tale la fiecare pas în shhnote — primitivele, parametrii și granițele de încredere, explicate, cu limitele spuse cinstit."
eyebrow: "Securitate · În detaliu"
intro: "O trecere precisă prin ce se întâmplă cu datele tale la fiecare pas — cu primitivele, parametrii și granițele de încredere explicate. Fiecare pas începe cu un rezumat pe înțelesul tuturor, ca să poți citi la nivelul de detaliu pe care îl vrei."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Pasul 01 · Criptare</p>
      <h3>Secretul tău e sigilat pe dispozitivul tău</h3>
      <p class="plain"><b>Pe scurt:</b> amestecarea are loc în browserul tău, înainte ca ceva să fie încărcat. Ce primim noi e deja ilizibil.</p>
    </div>
    <div class="explainer__detail">
      <p>Când apeși <b>Criptează</b>, browserul generează o cheie de conținut nouă, de 256 de biți, din WebCrypto CSPRNG și îți criptează datele cu <b>AES-256-GCM</b>. GCM este autentificat: fiecare bucată are o etichetă de 128 de biți, așa că orice modificare ulterioară este detectată, în loc să fie decriptată pe tăcute.</p>
      <p>Textul și fișierele sunt tratate identic — ambele devin un singur blob binar opac, completat până la o mărime standard, astfel încât o parolă scurtă și un fișier mic arată la fel. Textul în clar nu atinge niciodată rețeaua și nu părăsește niciodată memoria filei.</p>
      <div class="spec-list">
        <div><span class="k">Cifru</span><span class="v">AES-256-GCM, bucăți de 64 KiB</span></div>
        <div><span class="k">Cheie de conținut</span><span class="v">256 de biți, nouă pentru fiecare secret</span></div>
        <div><span class="k">Nonce</span><span class="v">prefix aleatoriu de 7 octeți + contor</span></div>
        <div><span class="k">Etichetă de autentificare</span><span class="v">128 de biți pe bucată</span></div>
        <div><span class="k">Completare</span><span class="v">Padmé, minimum 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Pasul 02 · Păstrarea cheii</p>
      <h3>Cheia stă ascunsă în link, nu pe serverele noastre</h3>
      <p class="plain"><b>Pe scurt:</b> partea linkului de după <span class="color-accent">#</span> conține cheia — iar browserele nu trimit niciodată acea parte vreunui server.</p>
    </div>
    <div class="explainer__detail">
      <p>Linkul tău conține un <b>seed</b> aleatoriu de 256 de biți în <b>fragmentul</b> URL — tot ce urmează după <span class="color-accent">#</span>. Conform specificației URL, browserul elimină fragmentul și <b>nu îl include niciodată în cererea</b> trimisă serverelor noastre. Din acest seed, browserul derivă cu HKDF o valoare de căutare, prin care găsește secretul, și cheia care despachetează cheia de conținut. Serverul vede doar un hash al valorii de căutare.</p>
      <p>Browserul destinatarului citește seedul din fragment și face aceeași derivare local. Asta înseamnă aici „zero-knowledge”: simpla deținere a textului cifrat nu folosește la nimic fără link.</p>
      <div class="spec-list">
        <div><span class="k">Locul cheii</span><span class="v">fragment URL #</span></div>
        <div><span class="k">Trimisă serverului?</span><span class="v">niciodată</span></div>
        <div><span class="k">Seed</span><span class="v">32 de octeți aleatorii, base64url</span></div>
        <div><span class="k">Derivare</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Serverul stochează</span><span class="v">doar SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Pasul 03 · Frază de acces opțională</p>
      <h3>Un al doilea lacăt, pe care îl dețin doar oamenii</h3>
      <p class="plain"><b>Pe scurt:</b> adaugă o frază de acces și nici măcar cineva care are linkul complet nu poate deschide secretul fără ea.</p>
    </div>
    <div class="explainer__detail">
      <p>Dacă setezi o frază de acces, aceasta este întărită cu <b>Argon2id</b> — o funcție de derivare a cheii memory-hard — și combinată cu seedul în cheia care împachetează cheia de conținut. Fraza de acces în sine nu este niciodată transmisă sau stocată; o știți doar tu și destinatarul. Încercările greșite sunt reluate în browserul destinatarului, pe date pe care acesta le are deja, așa că serverul nu le poate număra.</p>
      <p>Caracterul memory-hard face ca ghicirea offline la scară mare să fie costisitoare chiar și pe GPU-uri și ASIC-uri. Trimite fraza de acces pe un <b>alt canal</b> decât linkul, iar cei doi factori nu se întâlnesc niciodată în același loc. Modulul Argon2 este descărcat la fiecare creare și afișare, așa că rețeaua nu poate ști care secrete folosesc o frază de acces.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">aleatoriu, 128 de biți</span></div>
        <div><span class="k">Împachetare</span><span class="v">AES-256-GCM, IV de 96 de biți</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Pasul 04 · Tranzit și stocare</p>
      <h3>De pe dispozitivul tău pleacă doar text cifrat</h3>
      <p class="plain"><b>Pe scurt:</b> stocăm o cutie încuiată și un moment de expirare. Nimic altceva — niciun text în clar, nicio cheie, nicio evidență despre tine.</p>
    </div>
    <div class="explainer__detail">
      <p>Blobul este încărcat prin <b>TLS</b> și stocat în repaus ca text cifrat, alături de credențiale hash-uite, durata lui de viață și un moment de expirare rotunjit. În mod deliberat <b>nu</b> păstrăm identitatea expeditorului, destinatarul, jurnale de IP, momentul creării sau istoricul accesărilor. Nu există un sistem de conturi care să lege un secret de o persoană. Limitarea ratei funcționează pe un HMAC al adresei, cu un salt care se rotește, așa că nimic de dinaintea unei rotații nu poate fi legat de ceva de după ea.</p>
      <p>Pentru că obiectul stocat nu are niciun sens fără seedul din fragment, o compromitere a serverului sau o citație judiciară scoate la iveală doar octeți opaci și hash-uri din care nu se poate obține nimic.</p>
      <div class="spec-list">
        <div><span class="k">În tranzit</span><span class="v">TLS</span></div>
        <div><span class="k">În repaus</span><span class="v">text cifrat + chei hash-uite + expirare</span></div>
        <div><span class="k">Jurnale</span><span class="v">niciunul per secret</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Pasul 05 · Preluare și distrugere</p>
      <h3>Prima citire câștigă — apoi totul e șters</h3>
      <p class="plain"><b>Pe scurt:</b> deschiderea unui link de unică folosință predă cutia o singură dată și șterge copia de pe server. Sau o distrugi tu, oricând.</p>
    </div>
    <div class="explainer__detail">
      <p>Nu se descarcă nimic la încărcarea paginii de afișare: cererea pleacă doar la un clic sau o apăsare de tastă reală, așa că scannerele de linkuri și previzualizările din chat nu pot consuma un secret. Pentru un secret de unică folosință, serverul <b>revendică</b> rândul printr-o singură actualizare condiționată — exact o cerere câștigă — iar secretul este considerat consumat din acel moment. Același browser poate descărca din nou timp de 15 minute dacă se întrerupe conexiunea; nimeni altcineva nu poate, iar o revendicare neconfirmată este distrusă, niciodată anulată. Secretele cu termen sunt o simplă citire până expiră.</p>
      <p>Fiecare secret are și un <b>link de distrugere</b> privat. Deschiderea lui nu distruge nimic în sine; confirmarea șterge imediat textul cifrat — înainte ca vreun destinatar să-l poată citi.</p>
      <div class="spec-list">
        <div><span class="k">Unică folosință</span><span class="v">revendicare atomică, apoi distrugere</span></div>
        <div><span class="k">Interval de redescărcare</span><span class="v">15 min, doar același client</span></div>
        <div><span class="k">Expirare</span><span class="v">15 min – 14 zile</span></div>
        <div><span class="k">Controlul proprietarului</span><span class="v">link de distrugere</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Modelul de amenințări</p>
  <h2 class="section__heading">Ce poate și ce nu poate vedea shhnote</h2>
  <p class="section__intro">Versiunea sinceră. Iată exact unde se află granița de încredere.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Nu părăsește niciodată dispozitivul tău</p>
    <h3>Ce nu putem vedea</h3>
    <p>Textul tău în clar · cheia de conținut și seedul · fraza ta de acces · dacă a fost setată o frază de acces · cine a creat sau a deschis un secret · când a fost creat · jurnale de acces la nivel de IP. Nimic din toate acestea nu este transmis sau păstrat.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Stocat pe serverele noastre</p>
    <h3>Ce deținem</h3>
    <p>Un blob criptat pe care nu îl putem deschide · categoria lui de mărime după completare · hash-uri unidirecționale ale valorilor pe care browserul tău le folosește ca să-l găsească sau să-l distrugă · dacă este de unică folosință sau cu termen · un moment de expirare rotunjit. Toate inutile fără seedul din linkul tău.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Bine de știut</p>
    <h3>Limitele, spuse cinstit</h3>
    <p>Oricine are linkul complet (și fraza de acces, dacă a fost setată) poate citi un secret de unică folosință — tratează linkul ca pe secretul însuși. După ce un secret este afișat, pagina suprascrie ce poate când pleci de pe ea, dar JavaScript nu poate garanta asta; închide fila când ai terminat. Un browser controlat automat, care injectează intrări reale, poate deschide un secret de unică folosință la fel cum ar face-o un om — destinatarul nu mai găsește apoi nimic, ceea ce este rezultatul onest. Ștergerea unui secret elimină înregistrarea; resturi criptate pot persista în jurnale, în spațiul liber de pe disc sau în backupuri până la suprascriere, ca text cifrat fără cheie. Secretele mari stocate în afara bazei de date poartă momentul în care a fost scris fișierul. Și, ca la orice aplicație web, ai încredere în codul servit browserului tău — de aceea shhnote este open source și poate fi găzduit de oricine.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Specificația criptografică</p>
  <h2 class="section__heading">Toate primitivele, într-un singur loc</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Criptare</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Criptare simetrică autentificată, în bucăți de 64 KiB. O cheie de 256 de biți plus o etichetă de integritate pentru fiecare bucată, așa că orice modificare sau trunchiere este detectată — nu doar lăsată ilizibilă.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Derivarea cheii</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Cheile și identificatorii provin din seed prin HKDF-SHA-256. Frazele de acces opționale sunt întărite cu un KDF memory-hard, care face forța brută offline lentă și costisitoare chiar și pe hardware dedicat.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Aleatoriu</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seedurile, cheile, salturile și nonce-urile provin din generatorul criptografic sigur al browserului. Niciodată <span class="color-faint">Math.random()</span>, niciodată previzibile.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Păstrarea cheii</p>
    <div class="spec__val">Fragment URL&nbsp;#</div>
    <p>Seedul stă după # în linkul tău. Browserele nu transmit niciodată fragmentul, așa că acesta nu ajunge niciodată pe serverele noastre.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">În tranzit</p>
    <div class="spec__val">TLS</div>
    <p>De pe dispozitivul tău pleacă doar text cifrat, transportat prin TLS modern. Ce primim noi e un blob opac pe care nu îl putem deschide.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">În repaus</p>
    <div class="spec__val">Text cifrat + hash-uri</div>
    <p>Păstrăm un blob criptat, hash-uri unidirecționale ale credențialelor lui și un moment de expirare rotunjit — fără text în clar, fără chei, fără metadate despre expeditor sau destinatar.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Întrebări tehnice</p>
  <h2 class="section__heading">Pentru cei atenți la securitate</h2>
</header>

<div class="faq">
  <details open>
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
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Sfaturi pentru o partajare sigură

- Trimite fraza de acces pe altă cale decât linkul, de exemplu linkul prin e-mail și fraza de acces la telefon.
- Alege cea mai scurtă perioadă de expirare care ți se potrivește.
- Folosește un secret de unică folosință pentru parole și alte informații care ar trebui citite o singură dată.

<h2 id="reporting-a-vulnerability">Raportarea unei vulnerabilități</h2>

Dacă crezi că ai găsit o problemă de securitate pe acest site, te rugăm să ne scrii la [security@shhnote.com](mailto:security@shhnote.com) și să ne spui în privat, înainte de a spune altcuiva. Include ce ai găsit și cum se poate reproduce.

Ne angajăm să:

- răspundem în [number] zile lucrătoare;
- te ținem la curent cât timp remediem problema;
- îți recunoaștem contribuția când publicăm remedierea, dacă dorești.

Te rugăm ca, în timpul testării, să nu accesezi datele altor persoane, să nu perturbi serviciul și să nu rulezi scanări automate care îl încarcă puternic.

Pentru vulnerabilități în software-ul shhnote propriu-zis, vezi [politica de securitate a proiectului](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/ro/#create" class="btn btn--primary"><span>Creează un secret</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Vezi sursa pe GitHub</span></a></p>

</div>
</div>
</section>
