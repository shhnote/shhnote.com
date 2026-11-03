---
title: "De volledige cryptografische levenscyclus"
description: "Wat er bij shhnote bij elke stap met je gegevens gebeurt: de primitieven, parameters en vertrouwensgrenzen uitgeschreven, inclusief de eerlijke kanttekeningen."
eyebrow: "Beveiliging · Diepgaand"
intro: "Een nauwkeurige rondleiding langs wat er bij elke stap met je gegevens gebeurt, met de primitieven, parameters en vertrouwensgrenzen uitgeschreven. Elke stap begint met een samenvatting in gewone taal, zodat je zo diep kunt lezen als je wilt."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Stap 01 · Versleutelen</p>
      <h3>Je geheim wordt op je apparaat verzegeld</h3>
      <p class="plain"><b>Simpel gezegd:</b> het versleutelen gebeurt in je browser, voordat er iets wordt geüpload. Wat wij ontvangen is al onleesbaar.</p>
    </div>
    <div class="explainer__detail">
      <p>Als je op <b>Versleutelen</b> drukt, haalt de browser een nieuwe 256-bit inhoudssleutel uit de WebCrypto CSPRNG en versleutelt je gegevens met <b>AES-256-GCM</b>. GCM is geauthenticeerd: elk blok heeft een 128-bit tag, zodat later knoeien wordt gedetecteerd in plaats van stilletjes te worden ontsleuteld.</p>
      <p>Tekst en bestanden worden precies hetzelfde behandeld: beide worden één ondoorzichtige binaire blob, opgevuld tot een standaardgrootte, zodat een kort wachtwoord en een klein bestand er hetzelfde uitzien. De leesbare tekst komt nooit op het netwerk en verlaat nooit het geheugen van het tabblad.</p>
      <div class="spec-list">
        <div><span class="k">Cipher</span><span class="v">AES-256-GCM, blokken van 64 KiB</span></div>
        <div><span class="k">Inhoudssleutel</span><span class="v">256-bit, nieuw per geheim</span></div>
        <div><span class="k">Nonce</span><span class="v">willekeurig prefix van 7 bytes + teller</span></div>
        <div><span class="k">Authenticatietag</span><span class="v">128-bit per blok</span></div>
        <div><span class="k">Opvulling</span><span class="v">Padmé, minimaal 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Stap 02 · Sleutelbeheer</p>
      <h3>De sleutel zit in de link, niet op onze servers</h3>
      <p class="plain"><b>Simpel gezegd:</b> het deel van de link na de <span class="color-accent">#</span> bevat de sleutel, en browsers sturen dat deel nooit naar een server.</p>
    </div>
    <div class="explainer__detail">
      <p>Je link bevat een willekeurige 256-bit <b>seed</b> in het <b>fragment</b> van de URL: alles na de <span class="color-accent">#</span>. Volgens de URL-specificatie haalt de browser het fragment eraf en wordt het <b>nooit meegestuurd in het verzoek</b> aan onze servers. Uit die seed leidt de browser met HKDF een opzoekwaarde af om het geheim te vinden, plus de sleutel die de inhoudssleutel ontsluit. De server ziet alleen ooit een hash van de opzoekwaarde.</p>
      <p>De browser van de ontvanger leest de seed uit het fragment en doet dezelfde afleiding lokaal. Dat is wat „zero-knowledge” hier betekent: wie alleen de versleutelde data heeft, kan er zonder de link niets mee.</p>
      <div class="spec-list">
        <div><span class="k">Locatie sleutel</span><span class="v">URL-fragment #</span></div>
        <div><span class="k">Naar de server?</span><span class="v">nooit</span></div>
        <div><span class="k">Seed</span><span class="v">32 willekeurige bytes, base64url</span></div>
        <div><span class="k">Afleiding</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Server bewaart</span><span class="v">alleen SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Stap 03 · Optionele wachtwoordzin</p>
      <h3>Een tweede slot dat alleen mensen hebben</h3>
      <p class="plain"><b>Simpel gezegd:</b> voeg een wachtwoordzin toe en zelfs iemand met de volledige link kan het geheim zonder die niet openen.</p>
    </div>
    <div class="explainer__detail">
      <p>Stel je een wachtwoordzin in, dan wordt die opgerekt met <b>Argon2id</b>, een geheugenintensieve functie voor sleutelafleiding, en samen met de seed gecombineerd tot de sleutel die de inhoudssleutel inpakt. De wachtwoordzin zelf wordt nooit verstuurd of opgeslagen; alleen jij en de ontvanger kennen hem. Verkeerde pogingen worden in de browser van de ontvanger opnieuw geprobeerd op gegevens die die al heeft, dus de server kan ze niet tellen.</p>
      <p>Door de geheugenintensiviteit wordt grootschalig offline raden duur, zelfs met GPU's en ASIC's. Deel de wachtwoordzin via een <b>ander kanaal</b> dan de link, dan komen de twee factoren nooit op één plek samen. De Argon2-module wordt bij elk aanmaken en tonen opgehaald, zodat het netwerk niet kan zien welke geheimen er een gebruiken.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">128-bit willekeurig</span></div>
        <div><span class="k">Inpakken</span><span class="v">AES-256-GCM, 96-bit IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Stap 04 · Transport &amp; opslag</p>
      <h3>Alleen versleutelde data verlaat je apparaat</h3>
      <p class="plain"><b>Simpel gezegd:</b> we bewaren een afgesloten doos en een vervaltijd. Verder niets: geen leesbare tekst, geen sleutel, geen gegevens over jou.</p>
    </div>
    <div class="explainer__detail">
      <p>De blob wordt geüpload via <b>TLS</b> en opgeslagen als versleutelde data, naast gehashte toegangsgegevens, de levensduur en een afgeronde vervaltijd. We bewaren bewust <b>geen</b> identiteit van de afzender, ontvanger, IP-log, aanmaaktijd of toegangsgeschiedenis. Er is geen accountsysteem om een geheim aan een persoon te koppelen. Snelheidsbeperking werkt met een HMAC van het adres met een salt die regelmatig wisselt, zodat niets van vóór een wissel te koppelen is aan iets daarna.</p>
      <p>Omdat het opgeslagen object zonder de seed uit het fragment betekenisloos is, levert een gehackte server of een gerechtelijk bevel alleen ondoorzichtige bytes en hashes op die niet terug te rekenen zijn naar iets bruikbaars.</p>
      <div class="spec-list">
        <div><span class="k">Onderweg</span><span class="v">TLS</span></div>
        <div><span class="k">Opgeslagen</span><span class="v">versleutelde data + gehashte sleutels + vervaltijd</span></div>
        <div><span class="k">Logs</span><span class="v">geen per geheim</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Stap 05 · Ophalen &amp; vernietigen</p>
      <h3>Wie het eerst leest, krijgt het, daarna wordt het gewist</h3>
      <p class="plain"><b>Simpel gezegd:</b> een eenmalige link openen levert de doos één keer af en verwijdert de kopie op de server. Of vernietig het zelf, wanneer je maar wilt.</p>
    </div>
    <div class="explainer__detail">
      <p>Er wordt niets opgehaald als de pagina om het geheim te tonen laadt: het verzoek gaat pas de deur uit bij een echte klik of toetsaanslag, zodat linkscanners en chatvoorbeelden een geheim niet kunnen opgebruiken. Bij een eenmalig geheim <b>claimt</b> de server de rij in één voorwaardelijke update (precies één verzoek wint) en vanaf dat moment geldt het geheim als gebruikt. Dezelfde browser kan 15 minuten lang opnieuw downloaden als de verbinding wegvalt; niemand anders kan dat, en een onbevestigde claim wordt vernietigd, nooit teruggedraaid. Geheimen met een tijdslimiet zijn gewoon leesbaar tot ze verlopen.</p>
      <p>Elk geheim heeft ook een privé-<b>vernietigingslink</b>. Die openen vernietigt op zich nog niets; pas na bevestiging wordt de versleutelde data direct gewist, voordat een ontvanger het kan lezen.</p>
      <div class="spec-list">
        <div><span class="k">Eenmalig</span><span class="v">atomaire claim, daarna vernietigd</span></div>
        <div><span class="k">Venster voor opnieuw downloaden</span><span class="v">15 min, alleen dezelfde client</span></div>
        <div><span class="k">Vervaltijd</span><span class="v">15 min – 14 dagen</span></div>
        <div><span class="k">Controle eigenaar</span><span class="v">vernietigingslink</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Dreigingsmodel</p>
  <h2 class="section__heading">Wat shhnote wel en niet kan zien</h2>
  <p class="section__intro">De eerlijke versie. Hier ligt precies de vertrouwensgrens.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Verlaat je apparaat nooit</p>
    <h3>Wat wij niet kunnen zien</h3>
    <p>Je leesbare tekst · de inhoudssleutel en de seed · je wachtwoordzin · of er een wachtwoordzin is ingesteld · wie een geheim heeft aangemaakt of geopend · wanneer het is aangemaakt · toegangslogs op IP-niveau. Niets daarvan wordt verstuurd of bewaard.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Opgeslagen op onze servers</p>
    <h3>Wat we wel hebben</h3>
    <p>Een versleutelde blob die we niet kunnen openen · de opgevulde grootteklasse · eenrichtingshashes van de waarden die je browser gebruikt om het te vinden of te vernietigen · of het eenmalig is of een tijdslimiet heeft · een afgeronde vervaltijd. Allemaal nutteloos zonder de seed in je link.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Goed om te weten</p>
    <h3>De eerlijke kanttekeningen</h3>
    <p>Iedereen met de volledige link (en de wachtwoordzin, als die is ingesteld) kan een eenmalig geheim lezen: behandel de link als het geheim zelf. Nadat een geheim is getoond, overschrijft de pagina wat ze kan als je weggaat, maar JavaScript kan dat niet garanderen; sluit het tabblad als je klaar bent. Een geautomatiseerd aangestuurde browser die echte invoer simuleert, kan een eenmalig geheim openen zoals een mens dat zou doen; de ontvanger vindt dan niets, en dat is de eerlijke uitkomst. Een geheim verwijderen haalt het record weg; versleutelde restanten kunnen achterblijven in journals, vrije schijfruimte of back-ups tot ze worden overschreven, als versleutelde data zonder sleutel. Grote geheimen die buiten de database worden opgeslagen, dragen het tijdstip waarop het bestand is geschreven. En zoals bij elke webapp vertrouw je de code die naar je browser wordt gestuurd: daarom is shhnote open source en zelf te hosten.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Cryptografische specificatie</p>
  <h2 class="section__heading">Elke primitief op één plek</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Versleuteling</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Geauthenticeerde symmetrische versleuteling in blokken van 64 KiB. Een 256-bit sleutel plus een integriteitstag per blok, zodat knoeien of inkorten wordt gedetecteerd en niet alleen onleesbaar blijft.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Sleutelafleiding</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Sleutels en identificatoren worden met HKDF-SHA-256 uit de seed afgeleid. Optionele wachtwoordzinnen worden opgerekt met een geheugenintensieve KDF, waardoor offline brute-force traag en duur wordt, zelfs op speciale hardware.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Willekeur</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seeds, sleutels, salts en nonces komen uit de cryptografisch veilige generator van de browser. Nooit <span class="color-faint">Math.random()</span>, nooit voorspelbaar.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Sleutelbeheer</p>
    <div class="spec__val">URL-fragment&nbsp;#</div>
    <p>De seed staat na de # in je link. Browsers versturen het fragment nooit, dus het bereikt onze servers nooit.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Onderweg</p>
    <div class="spec__val">TLS</div>
    <p>Alleen versleutelde data verlaat je apparaat, via moderne TLS. Wat wij ontvangen is een ondoorzichtige blob die we niet kunnen openen.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Opgeslagen</p>
    <div class="spec__val">Versleutelde data + hashes</div>
    <p>We bewaren een versleutelde blob, eenrichtingshashes van de toegangsgegevens en een afgeronde vervaltijd: geen leesbare tekst, geen sleutels, geen metadata over afzender of ontvanger.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Technische vragen</p>
  <h2 class="section__heading">Voor de beveiligingsbewuste lezer</h2>
</header>

<div class="faq">
  <details open>
    <summary>Hoe wordt de eenmaligheid afgedwongen bij gelijktijdige verzoeken?</summary>
    <p>Het tonen voert één voorwaardelijke update uit die de rij van „actief” naar „geclaimd” zet. Twee gelijktijdige verzoeken kunnen niet allebei slagen; het tweede ziet een record dat al geclaimd is en krijgt hetzelfde antwoord „geen geheim gevonden” als iedereen. De claim wordt nooit teruggedraaid: gaat de download verloren, dan downloadt de houder van het claimtoken opnieuw binnen het tijdvenster, en anders wordt het geheim ongelezen vernietigd.</p>
  </details>
  <details>
    <summary>Waarom het URL-fragment en niet een queryparameter?</summary>
    <p>Queryparameters worden naar de server gestuurd en komen terecht in toegangslogs, proxy's en analysetools. Het fragment (na de <span class="color-accent">#</span>) blijft volgens de URL-specificatie aan de kant van de client: de browser zet het nooit in het HTTP-verzoek. Op die eigenschap rust het hele zero-knowledge-ontwerp. Na het tonen haalt de pagina het fragment bovendien uit de adresbalk en de geschiedenis.</p>
  </details>
  <details>
    <summary>Wat houdt linkscanners tegen om eenmalige geheimen voortijdig op te branden?</summary>
    <p>De weergavepagina is voor elk geheim hetzelfde statische document en haalt bij het laden niets op. Het verzoek wordt pas verstuurd bij een echte klik of toetsaanslag; een gescripte <code>click()</code> of formulierverzending telt niet. Geautomatiseerde scanners (e-mailbeveiliging, linkvoorbeelden in chats, virusscanners) laden alleen die statische schil.</p>
  </details>
  <details>
    <summary>Kan ik dit controleren of zelf hosten?</summary>
    <p>Ja. De volledige broncode is openbaar onder AGPLv3, het protocol is vastgelegd in een specificatie met conformiteitsvectoren waar elke implementatie zichzelf tegen kan toetsen, en er is een handleiding om zelf te hosten. Je kunt de cryptografie aan de clientkant controleren en je eigen instantie draaien, zodat de vertrouwensgrens helemaal bij jou ligt.</p>
  </details>
  <details>
    <summary>Wordt er iets gelogd om misbruik te voorkomen?</summary>
    <p>We houden geen toegangslogs per geheim en geen IP-geschiedenis bij. Snelheidsbeperking gebruikt een gesleutelde hash van het adres met een salt die regelmatig wisselt en daarbij alle tellers wist. Misbruikmeldingen worden per dag geteld; er wordt niet bijgehouden welk geheim is gemeld.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Tips om veilig te delen

- Stuur de wachtwoordzin op een andere manier dan de link, bijvoorbeeld de link per e-mail en de wachtwoordzin via de telefoon.
- Kies de kortste vervaltijd die voor jou werkt.
- Gebruik een eenmalig geheim voor wachtwoorden en andere informatie die precies één keer gelezen moet worden.

<h2 id="reporting-a-vulnerability">Een kwetsbaarheid melden</h2>

Denk je een beveiligingsprobleem met deze site te hebben gevonden? Mail dan naar [security@shhnote.com](mailto:security@shhnote.com) en laat het ons vertrouwelijk weten voordat je het aan iemand anders vertelt. Beschrijf wat je hebt gevonden en hoe het te reproduceren is.

Wij zullen:

- binnen [number] werkdagen reageren;
- je op de hoogte houden terwijl we het oplossen;
- je vermelden wanneer we de oplossing publiceren, als je dat wilt.

Ga tijdens het testen niet aan de gegevens van anderen, verstoor de dienst niet en voer geen geautomatiseerde scans uit die hem zwaar belasten.

Kwetsbaarheden in de shhnote-software zelf: zie het [beveiligingsbeleid van het project](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/nl/#create" class="btn btn--primary"><span>Geheim aanmaken</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Broncode bekijken op GitHub</span></a></p>

</div>
</div>
</section>
