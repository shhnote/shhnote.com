---
title: "Vragen en antwoorden"
description: "Veelgestelde vragen over shhnote: accounts, links, wachtwoordzinnen, vervaltijden en de technische details voor wie het naadje van de kous wil weten."
eyebrow: "Veelgestelde vragen"
intro: "Eerst de korte antwoorden, daarna de technische. Staat jouw vraag er niet bij? De pagina's over hoe het werkt en over beveiliging gaan dieper, en je kunt het ons altijd vragen."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Heb ik een account nodig?</summary>
    <p>Nee. Je hoeft je nergens voor aan te melden en niets te installeren. Open shhnote, schrijf je geheim en deel de link. Meer is het niet.</p>
  </details>
  <details>
    <summary>Wat als de verkeerde persoon de link ziet?</summary>
    <p>Een eenmalig geheim kan alleen worden gelezen door de eerste die het opent. Daarna wordt het vernietigd, en je merkt dat iets het heeft gelezen doordat de bedoelde ontvanger niets vindt. Voor extra zekerheid kun je een wachtwoordzin toevoegen en die apart delen, zodat de link alleen niet genoeg is. En bedenk je je, dan kun je het geheim zelf vernietigen met je privé-vernietigingslink.</p>
  </details>
  <details>
    <summary>Kan shhnote mijn geheim lezen?</summary>
    <p>Nee. De sleutel die het opent bereikt ons nooit: die zit veilig in je link, aan jouw kant. Wij hebben alleen een versleutelde versie die we op geen enkele manier kunnen openen.</p>
  </details>
  <details>
    <summary>Wat gebeurt er als niemand het opent?</summary>
    <p>Je kiest zelf een vervaltijd, ergens tussen 15 minuten en 14 dagen. Als de tijd om is, wordt het geheim automatisch verwijderd, of het nu is geopend of niet.</p>
  </details>
  <details>
    <summary>Wat is het verschil tussen een eenmalig geheim en een geheim met een tijdslimiet?</summary>
    <p>Een eenmalig geheim wordt vernietigd zodra het wordt geopend. Een geheim met een tijdslimiet kan opnieuw worden geopend totdat het verloopt, maar de pagina zegt nooit hoeveel tijd er nog over is. Behandel elk geheim dus als iets dat je bij de eerste keer lezen bewaart.</p>
  </details>
  <details>
    <summary>Wat is de vernietigingslink?</summary>
    <p>Een tweede, privélink die je krijgt als je een geheim aanmaakt. Als je hem opent, wordt eerst om bevestiging gevraagd; bevestig je, dan wordt het geheim direct vernietigd, voordat iemand het kan lezen. Houd hem voor jezelf.</p>
  </details>
  <details>
    <summary>Kan ik bestanden versturen?</summary>
    <p>Ja. Bestanden worden in je browser op precies dezelfde manier versleuteld als tekst en reizen mee in dezelfde verzegelde blob. Alles wordt opgevuld tot standaardgroottes, dus zelfs wij kunnen een korte notitie niet onderscheiden van een klein bestand.</p>
  </details>
  <details>
    <summary>Werkt het in Tor Browser of met JavaScript uit?</summary>
    <p>Voor het aanmaken en tonen van een geheim is JavaScript nodig, omdat de versleuteling in je browser gebeurt. Het werkt in Tor Browser op het niveau „Veiliger”; op „Veiligst” staat WebAssembly uit, waardoor geheimen met een wachtwoordzin niet te openen zijn, en dat meldt de pagina dan ook. Alle andere pagina's werken zonder JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Is er een API?</summary>
    <p>Ja, dezelfde die deze site gebruikt. De <a href="/en/docs/">documentatie</a> beschrijft hem, en het opensource-clientpakket implementeert het protocol voor je eigen tools.</p>
  </details>
</div>

<p class="prose-note">Nog vragen? Lees <a href="/nl/how-it-works/">hoe het werkt</a>, de <a href="/nl/security/">details over beveiliging</a>, of <a href="/nl/contact/">vraag het ons</a>.</p>
</div>
</section>
