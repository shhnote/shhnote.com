---
title: "Hela den kryptografiska livscykeln"
description: "Vad som händer med dina data i varje steg hos shhnote – primitiver, parametrar och förtroendegränser i klartext, med de ärliga förbehållen."
eyebrow: "Säkerhet · På djupet"
intro: "En noggrann genomgång av vad som händer med dina data i varje steg – med primitiver, parametrar och förtroendegränser utskrivna. Varje steg börjar med en enkel sammanfattning, så du kan läsa på den nivå du vill."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Steg 01 · Kryptering</p>
      <h3>Din hemlighet förseglas på din enhet</h3>
      <p class="plain"><b>Enkelt uttryckt:</b> krypteringen sker i din webbläsare, innan något laddas upp. Det vi tar emot är redan oläsligt.</p>
    </div>
    <div class="explainer__detail">
      <p>När du trycker på <b>Kryptera</b> hämtar webbläsaren en ny 256-bitars innehållsnyckel från WebCrypto CSPRNG och krypterar ditt innehåll med <b>AES-256-GCM</b>. GCM är autentiserad: varje block har en 128-bitars tagg, så all senare manipulation upptäcks i stället för att tyst dekrypteras.</p>
      <p>Text och filer hanteras på exakt samma sätt – båda blir en enda ogenomskinlig binär klump, utfylld till en standardstorlek så att ett kort lösenord och en liten fil ser likadana ut. Klartexten rör aldrig nätverket och lämnar aldrig flikens minne.</p>
      <div class="spec-list">
        <div><span class="k">Chiffer</span><span class="v">AES-256-GCM, block om 64 KiB</span></div>
        <div><span class="k">Innehållsnyckel</span><span class="v">256 bitar, ny för varje hemlighet</span></div>
        <div><span class="k">Nonce</span><span class="v">7 byte slumpmässigt prefix + räknare</span></div>
        <div><span class="k">Autentiseringstagg</span><span class="v">128 bitar per block</span></div>
        <div><span class="k">Utfyllnad</span><span class="v">Padmé, minst 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Steg 02 · Nyckelförvaring</p>
      <h3>Nyckeln gömmer sig i länken, inte på våra servrar</h3>
      <p class="plain"><b>Enkelt uttryckt:</b> delen av länken efter <span class="color-accent">#</span> innehåller nyckeln – och webbläsare skickar aldrig den delen till någon server.</p>
    </div>
    <div class="explainer__detail">
      <p>Din länk bär ett slumpmässigt 256-bitars <b>frö</b> i URL:ens <b>fragment</b> – allt efter <span class="color-accent">#</span>. Enligt URL-specifikationen tar webbläsaren bort fragmentet, och det <b>ingår aldrig i förfrågan</b> som skickas till våra servrar. Från fröet härleder webbläsaren, med HKDF, ett uppslagsvärde för att hitta hemligheten och nyckeln som packar upp innehållsnyckeln. Servern ser bara en hash av uppslagsvärdet.</p>
      <p>Mottagarens webbläsare läser fröet från fragmentet och gör samma härledning lokalt. Det är vad ”nollkunskap” betyder här: att ha chiffertexten är meningslöst utan länken.</p>
      <div class="spec-list">
        <div><span class="k">Nyckelns plats</span><span class="v">URL-fragment #</span></div>
        <div><span class="k">Skickas till servern?</span><span class="v">aldrig</span></div>
        <div><span class="k">Frö</span><span class="v">32 slumpmässiga byte, base64url</span></div>
        <div><span class="k">Härledning</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Servern lagrar</span><span class="v">endast SHA-256(uppslag)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Steg 03 · Valfri lösenfras</p>
      <h3>Ett andra lås som bara människor har</h3>
      <p class="plain"><b>Enkelt uttryckt:</b> lägg till en lösenfras, så kan inte ens den som har hela länken öppna hemligheten utan den.</p>
    </div>
    <div class="explainer__detail">
      <p>Om du anger en lösenfras sträcks den med <b>Argon2id</b> – en minneskrävande funktion för nyckelhärledning – och kombineras med fröet till nyckeln som packar in innehållsnyckeln. Själva lösenfrasen skickas eller lagras aldrig; bara du och mottagaren känner till den. Felaktiga gissningar provas om i mottagarens webbläsare mot data den redan har, så servern kan inte räkna dem.</p>
      <p>Minneskravet gör storskaliga gissningar offline dyra, även med GPU:er och ASIC:ar. Dela lösenfrasen via en <b>annan kanal</b> än länken, så möts de två faktorerna aldrig på samma ställe. Argon2-modulen hämtas vid varje skapande och visning, så nätverket kan inte se vilka hemligheter som använder en lösenfras.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">128 bitar, slumpmässigt</span></div>
        <div><span class="k">Inpackning</span><span class="v">AES-256-GCM, 96-bitars IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Steg 04 · Överföring &amp; lagring</p>
      <h3>Bara chiffertext lämnar din enhet</h3>
      <p class="plain"><b>Enkelt uttryckt:</b> vi lagrar en låst låda och en tidpunkt då den upphör. Inget annat – ingen klartext, ingen nyckel, inga uppgifter om dig.</p>
    </div>
    <div class="explainer__detail">
      <p>Klumpen laddas upp över <b>TLS</b> och lagras som chiffertext tillsammans med hashade inloggningsvärden, dess livslängd och en avrundad tidpunkt då den upphör. Vi sparar medvetet <b>ingen</b> avsändaridentitet, mottagare, IP-logg, tidpunkt för skapandet eller åtkomsthistorik. Det finns inget kontosystem som kan knyta en hemlighet till en person. Hastighetsbegränsningen bygger på en HMAC av adressen med ett salt som byts ut regelbundet, så inget från före ett byte kan kopplas till något efter.</p>
      <p>Eftersom det lagrade objektet är meningslöst utan fröet i fragmentet ger ett serverintrång eller ett myndighetsföreläggande bara ogenomskinliga byte och hashar som inte kan omvandlas tillbaka till något.</p>
      <div class="spec-list">
        <div><span class="k">Under överföring</span><span class="v">TLS</span></div>
        <div><span class="k">I lagring</span><span class="v">chiffertext + hashade nycklar + giltighetstid</span></div>
        <div><span class="k">Loggar</span><span class="v">inga per hemlighet</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Steg 05 · Hämtning &amp; förstöring</p>
      <h3>Första läsningen vinner – sedan raderas den</h3>
      <p class="plain"><b>Enkelt uttryckt:</b> när en engångslänk öppnas lämnas lådan ut en gång och serverns kopia raderas. Eller så förstör du den själv, när som helst.</p>
    </div>
    <div class="explainer__detail">
      <p>Ingenting hämtas när visningssidan läses in: förfrågan skickas först vid ett riktigt klick eller tangenttryck, så länkskannrar och förhandsvisningar i chattar kan inte förbruka en hemlighet. För en engångshemlighet <b>gör servern anspråk på</b> raden i en enda villkorad uppdatering – exakt en förfrågan vinner – och hemligheten räknas som förbrukad från det ögonblicket. Samma webbläsare kan ladda ner igen i 15 minuter om anslutningen bryts; ingen annan kan det, och ett obekräftat anspråk förstörs, det återkallas aldrig. Tidsbegränsade hemligheter läses helt enkelt tills de upphör.</p>
      <p>Varje hemlighet har också en privat <b>raderingslänk</b>. Att öppna den förstör ingenting i sig; först när du bekräftar raderas chiffertexten direkt – innan någon mottagare hinner läsa den.</p>
      <div class="spec-list">
        <div><span class="k">Engångs</span><span class="v">atomärt anspråk, sedan förstörd</span></div>
        <div><span class="k">Fönster för ny nedladdning</span><span class="v">15 min, endast samma klient</span></div>
        <div><span class="k">Giltighetstid</span><span class="v">15 min – 14 dagar</span></div>
        <div><span class="k">Ägarens kontroll</span><span class="v">raderingslänk</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Hotmodell</p>
  <h2 class="section__heading">Vad shhnote kan och inte kan se</h2>
  <p class="section__intro">Den ärliga versionen. Här är exakt var förtroendegränsen går.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Lämnar aldrig din enhet</p>
    <h3>Det vi inte kan se</h3>
    <p>Din klartext · innehållsnyckeln och fröet · din lösenfras · om en lösenfras har angetts · vem som skapade eller öppnade en hemlighet · när den skapades · åtkomstloggar med IP-adresser. Inget av det skickas eller sparas.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Lagras på våra servrar</p>
    <h3>Det vi faktiskt har</h3>
    <p>En krypterad klump som vi inte kan öppna · dess utfyllda storleksklass · envägshashar av de värden din webbläsare använder för att hitta eller radera den · om den är en engångshemlighet eller tidsbegränsad · en avrundad tidpunkt då den upphör. Allt är oanvändbart utan fröet i din länk.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Bra att veta</p>
    <h3>De ärliga förbehållen</h3>
    <p>Den som har hela länken (och lösenfrasen, om en sådan finns) kan läsa en engångshemlighet – behandla länken som själva hemligheten. När en hemlighet har visats skriver sidan över det den kan när du lämnar den, men JavaScript kan inte garantera det; stäng fliken när du är klar. En automatiserad webbläsare som skickar äkta inmatning kan öppna en engångshemlighet på samma sätt som en människa – mottagaren hittar då ingenting, vilket är det ärliga utfallet. När en hemlighet raderas tas posten bort; krypterade rester kan finnas kvar i journaler, ledigt diskutrymme eller säkerhetskopior tills de skrivs över, som chiffertext utan nyckel. Stora hemligheter som lagras utanför databasen bär med sig tidpunkten då filen skrevs. Och som med alla webbappar litar du på koden som skickas till din webbläsare – därför är shhnote öppen källkod och går att driva själv.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Kryptografisk specifikation</p>
  <h2 class="section__heading">Alla primitiver på ett ställe</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Kryptering</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Autentiserad symmetrisk kryptering i block om 64 KiB. En 256-bitarsnyckel plus en integritetstagg per block, så manipulation eller avkortning upptäcks – den blir inte bara oläslig.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Nyckelhärledning</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Nycklar och identifierare härleds från fröet med HKDF-SHA-256. Valfria lösenfraser sträcks med en minneskrävande KDF, vilket gör offline-attacker med råstyrka långsamma och dyra, även på specialiserad hårdvara.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Slumptal</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Frön, nycklar, salter och nonce-värden kommer från webbläsarens kryptografiskt säkra slumptalsgenerator. Aldrig <span class="color-faint">Math.random()</span>, aldrig förutsägbart.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Nyckelförvaring</p>
    <div class="spec__val">URL-fragment&nbsp;#</div>
    <p>Fröet följer med efter # i din länk. Webbläsare skickar aldrig fragmentet, så det når aldrig våra servrar.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Under överföring</p>
    <div class="spec__val">TLS</div>
    <p>Bara chiffertext lämnar någonsin din enhet, och den överförs med modern TLS. Det vi tar emot är en ogenomskinlig klump som vi inte kan öppna.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">I lagring</p>
    <div class="spec__val">Chiffertext + hashar</div>
    <p>Vi sparar en krypterad klump, envägshashar av dess inloggningsvärden och en avrundad tidpunkt då den upphör – ingen klartext, inga nycklar, inga metadata om avsändare eller mottagare.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Teknisk FAQ</p>
  <h2 class="section__heading">För den säkerhetsintresserade</h2>
</header>

<div class="faq">
  <details open>
    <summary>Hur skyddas engångsgarantin mot kapplöpningar?</summary>
    <p>Visningen kör en enda villkorad uppdatering som flyttar raden från ”aktiv” till ”gjort anspråk på”. Två samtidiga förfrågningar kan inte båda lyckas; den andra ser en post som redan är tagen och får samma svar, ”ingen hemlighet hittades”, som alla andra. Anspråket återkallas aldrig: om nedladdningen går förlorad laddar den som har anspråkstoken ner igen inom tidsfönstret, och annars förstörs hemligheten oläst.</p>
  </details>
  <details>
    <summary>Varför URL-fragmentet i stället för en frågeparameter?</summary>
    <p>Frågeparametrar skickas till servern och hamnar i åtkomstloggar, proxyservrar och analysverktyg. Fragmentet (efter <span class="color-accent">#</span>) är enligt URL-specifikationen definierat att stanna på klientsidan – webbläsaren lägger aldrig in det i HTTP-förfrågan. Den egenskapen är hela grunden för nollkunskapsdesignen. Efter en visning tar sidan också bort fragmentet från adressfältet och historiken.</p>
  </details>
  <details>
    <summary>Vad hindrar länkskannrar från att förbruka engångshemligheter i förtid?</summary>
    <p>Visningssidan är samma statiska dokument för varje hemlighet och hämtar ingenting när den läses in. Förfrågan skickas bara vid ett äkta klick eller tangenttryck – ett skriptat <code>click()</code> eller ett formulär som skickas automatiskt räknas inte. Automatiska skannrar (e-postskydd, förhandsvisningar i chattar, antivirusprogram) läser bara in det statiska skalet.</p>
  </details>
  <details>
    <summary>Kan jag granska det här eller driva det själv?</summary>
    <p>Ja. Hela källkoden är offentlig under AGPLv3, protokollet är nedskrivet i en specifikation med testvektorer som varje implementation kan kontrollera sig mot, och det finns en guide för egen drift. Du kan granska kryptografin på klientsidan och köra en egen instans, så att förtroendegränsen helt och hållet är din.</p>
  </details>
  <details>
    <summary>Loggas något för att förhindra missbruk?</summary>
    <p>Vi sparar inga åtkomstloggar per hemlighet och ingen IP-historik. Hastighetsbegränsningen använder en nyckelad hash av adressen med ett salt som byts ut regelbundet och nollställer alla räknare när det byts. Anmälningar om missbruk räknas per dag; det finns inga uppgifter om vilken hemlighet som anmäldes.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Tips för att dela säkert

- Skicka lösenfrasen på ett annat sätt än länken, till exempel länken via e-post och lösenfrasen via telefon.
- Välj den kortaste giltighetstid som fungerar för dig.
- Använd en engångshemlighet för lösenord och annan information som ska läsas exakt en gång.

<h2 id="reporting-a-vulnerability">Rapportera en sårbarhet</h2>

Om du tror att du har hittat ett säkerhetsproblem på den här webbplatsen kan du mejla [security@shhnote.com](mailto:security@shhnote.com) och berätta det för oss i förtroende innan du berättar för någon annan. Beskriv vad du har hittat och hur det kan återskapas.

Vi kommer att:

- svara inom 5 arbetsdagar;
- hålla dig uppdaterad medan vi åtgärdar problemet;
- nämna dig när vi publicerar åtgärden, om du vill.

Kom inte åt andras data, stör inte tjänsten och kör inte automatiska skanningar som belastar den hårt när du testar.

Sårbarheter i själva programvaran shhnote: se [projektets säkerhetspolicy](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/sv/#create" class="btn btn--primary"><span>Skapa en hemlighet</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Visa källkoden på GitHub</span></a></p>

</div>
</div>
</section>
