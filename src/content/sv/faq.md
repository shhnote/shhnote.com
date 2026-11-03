---
title: "Frågor och svar"
description: "Vanliga frågor om shhnote – konton, länkar, lösenfraser, giltighetstid och de tekniska detaljerna för den säkerhetsintresserade."
eyebrow: "Vanliga frågor"
intro: "De korta svaren först, de tekniska sedan. Om din fråga inte finns här går sidorna om hur det fungerar och om säkerhet djupare, och du kan alltid fråga oss."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Behöver jag ett konto?</summary>
    <p>Nej. Det finns inget att registrera sig för och inget att installera. Öppna shhnote, skriv din hemlighet och dela länken. Det är allt.</p>
  </details>
  <details>
    <summary>Vad händer om fel person ser länken?</summary>
    <p>En engångshemlighet kan bara läsas av den första som öppnar den – sedan förstörs den, och du märker att något har läst den eftersom den tänkta mottagaren inte hittar något. För extra säkerhet kan du lägga till en lösenfras och dela den separat, så att länken ensam inte räcker. Och om du ångrar dig kan du själv förstöra hemligheten med din privata raderingslänk.</p>
  </details>
  <details>
    <summary>Kan shhnote läsa min hemlighet?</summary>
    <p>Nej. Nyckeln som låser upp den når aldrig oss – den ligger gömd i din länk, hos dig. Vi har bara en krypterad version som vi inte har någon möjlighet att öppna.</p>
  </details>
  <details>
    <summary>Vad händer om ingen öppnar den?</summary>
    <p>Du väljer en giltighetstid – allt från 15 minuter till 14 dagar. När tiden har gått ut raderas hemligheten automatiskt, oavsett om den har öppnats eller inte.</p>
  </details>
  <details>
    <summary>Vad är skillnaden mellan en engångshemlighet och en tidsbegränsad?</summary>
    <p>En engångshemlighet förstörs i samma stund som den öppnas. En tidsbegränsad hemlighet kan öppnas igen tills den upphör – men sidan visar aldrig hur lång tid som är kvar, så behandla varje hemlighet som något du ska spara redan första gången du läser den.</p>
  </details>
  <details>
    <summary>Vad är raderingslänken?</summary>
    <p>En andra, privat länk som du får när du skapar en hemlighet. När du öppnar den visas en bekräftelse; bekräftar du förstörs hemligheten direkt, innan någon hinner läsa den. Behåll den för dig själv.</p>
  </details>
  <details>
    <summary>Kan jag skicka filer?</summary>
    <p>Ja. Filer krypteras i din webbläsare precis som text och färdas i samma förseglade klump data. Allt fylls ut till standardstorlekar, så inte ens vi kan skilja en kort anteckning från en liten fil.</p>
  </details>
  <details>
    <summary>Fungerar det i Tor Browser eller utan JavaScript?</summary>
    <p>För att skapa och visa en hemlighet behövs JavaScript, eftersom krypteringen sker i din webbläsare. Det fungerar i Tor Browser på nivån ”Säkrare”; på ”Säkrast” är WebAssembly avstängt, så hemligheter som skyddas med lösenfras går inte att öppna, och sidan säger det. Alla andra sidor fungerar utan JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Finns det ett API?</summary>
    <p>Ja – samma som den här webbplatsen använder. <a href="/en/docs/">Dokumentationen</a> beskriver det, och klientpaketet med öppen källkod implementerar protokollet för dina egna verktyg.</p>
  </details>
</div>

<p class="prose-note">Undrar du fortfarande något? Läs <a href="/sv/how-it-works/">hur det fungerar</a>, <a href="/sv/security/">säkerhetsdetaljerna</a> eller <a href="/sv/contact/">fråga oss</a>.</p>
</div>
</section>
