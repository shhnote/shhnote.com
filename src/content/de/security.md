---
title: "Der kryptografische Lebenszyklus"
description: "Was bei shhnote in jedem Schritt mit deinen Daten passiert: Primitive, Parameter und Vertrauensgrenzen ausbuchstabiert, mit den ehrlichen Einschränkungen."
eyebrow: "Sicherheit · Im Detail"
intro: "Ein genauer Rundgang durch alles, was in jedem Schritt mit deinen Daten passiert, mit Primitiven, Parametern und Vertrauensgrenzen. Jeder Schritt beginnt mit einer Zusammenfassung in einfachen Worten, sodass du so tief lesen kannst, wie du möchtest."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Schritt 01 · Verschlüsseln</p>
      <h3>Dein Geheimnis wird auf deinem Gerät versiegelt</h3>
      <p class="plain"><b>Einfach gesagt:</b> Die Verschlüsselung passiert in deinem Browser, bevor irgendetwas hochgeladen wird. Was bei uns ankommt, ist schon unlesbar.</p>
    </div>
    <div class="explainer__detail">
      <p>Wenn du auf <b>Verschlüsseln</b> drückst, zieht der Browser einen frischen 256-Bit-Inhaltsschlüssel aus dem WebCrypto CSPRNG und verschlüsselt deine Daten mit <b>AES-256-GCM</b>. GCM ist authentifiziert: Jeder Block trägt ein 128-Bit-Tag, sodass jede spätere Manipulation erkannt wird, statt stillschweigend entschlüsselt zu werden.</p>
      <p>Text und Dateien werden gleich behandelt: Beides wird zu einem undurchsichtigen Binär-Blob, aufgefüllt auf eine Standardgröße, sodass ein kurzes Passwort und eine kleine Datei gleich aussehen. Der Klartext berührt nie das Netzwerk und verlässt nie den Speicher des Tabs.</p>
      <div class="spec-list">
        <div><span class="k">Chiffre</span><span class="v">AES-256-GCM, Blöcke à 64 KiB</span></div>
        <div><span class="k">Inhaltsschlüssel</span><span class="v">256 Bit, neu für jedes Geheimnis</span></div>
        <div><span class="k">Nonce</span><span class="v">7 Byte zufälliges Präfix + Zähler</span></div>
        <div><span class="k">Auth-Tag</span><span class="v">128 Bit pro Block</span></div>
        <div><span class="k">Auffüllung</span><span class="v">Padmé, mindestens 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Schritt 02 · Schlüsselverwahrung</p>
      <h3>Der Schlüssel steckt im Link, nicht auf unseren Servern</h3>
      <p class="plain"><b>Einfach gesagt:</b> Der Teil des Links nach dem <span class="color-accent">#</span> enthält den Schlüssel, und Browser senden diesen Teil nie an einen Server.</p>
    </div>
    <div class="explainer__detail">
      <p>Dein Link trägt einen zufälligen 256-Bit-<b>Seed</b> im URL-<b>Fragment</b>, also in allem nach dem <span class="color-accent">#</span>. Laut URL-Spezifikation entfernt der Browser das Fragment, und es ist <b>nie Teil der Anfrage</b> an unsere Server. Aus diesem Seed leitet der Browser mit HKDF einen Suchwert ab, mit dem das Geheimnis gefunden wird, sowie den Schlüssel, der den Inhaltsschlüssel entpackt. Der Server sieht immer nur einen Hash des Suchwerts.</p>
      <p>Der Browser der empfangenden Person liest den Seed aus dem Fragment und führt dieselbe Ableitung lokal durch. Das ist hier mit „Zero-Knowledge“ gemeint: Wer nur den Chiffretext besitzt, kann ohne den Link nichts damit anfangen.</p>
      <div class="spec-list">
        <div><span class="k">Ort des Schlüssels</span><span class="v">URL-Fragment #</span></div>
        <div><span class="k">An den Server gesendet?</span><span class="v">nie</span></div>
        <div><span class="k">Seed</span><span class="v">32 zufällige Bytes, base64url</span></div>
        <div><span class="k">Ableitung</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Server speichert</span><span class="v">nur SHA-256(Suchwert)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Schritt 03 · Optionale Passphrase</p>
      <h3>Ein zweites Schloss, das nur Menschen öffnen</h3>
      <p class="plain"><b>Einfach gesagt:</b> Mit einer Passphrase kann selbst jemand mit dem vollständigen Link das Geheimnis ohne sie nicht öffnen.</p>
    </div>
    <div class="explainer__detail">
      <p>Wenn du eine Passphrase festlegst, wird sie mit <b>Argon2id</b> gestreckt, einer speicherintensiven Schlüsselableitungsfunktion, und mit dem Seed zu dem Schlüssel kombiniert, der den Inhaltsschlüssel einpackt. Die Passphrase selbst wird nie übertragen oder gespeichert; nur du und die empfangende Person kennen sie. Falsche Versuche werden im Browser der empfangenden Person gegen Daten wiederholt, die er bereits hat, sodass der Server sie nicht zählen kann.</p>
      <p>Die Speicherintensität macht massenhaftes Offline-Raten selbst auf GPUs und ASICs teuer. Teile die Passphrase über einen <b>anderen Kanal</b> als den Link, dann treffen die beiden Faktoren nie an einem Ort zusammen. Das Argon2-Modul wird bei jedem Erstellen und Anzeigen geladen, sodass im Netzwerk nicht erkennbar ist, welche Geheimnisse eine Passphrase nutzen.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Salt</span><span class="v">128 Bit, zufällig</span></div>
        <div><span class="k">Einpacken</span><span class="v">AES-256-GCM, 96-Bit-IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Schritt 04 · Übertragung &amp; Speicherung</p>
      <h3>Nur Chiffretext verlässt dein Gerät</h3>
      <p class="plain"><b>Einfach gesagt:</b> Wir speichern eine verschlossene Kiste und einen Ablaufzeitpunkt. Sonst nichts: kein Klartext, kein Schlüssel, keine Spur von dir.</p>
    </div>
    <div class="explainer__detail">
      <p>Der Blob wird über <b>TLS</b> hochgeladen und als Chiffretext gespeichert, zusammen mit gehashten Zugangsdaten, seiner Lebensdauer und einem gerundeten Ablaufzeitpunkt. Wir speichern bewusst <b>keine</b> Identität der sendenden Person, keine Empfänger, kein IP-Protokoll, keinen Erstellungszeitpunkt und keinen Zugriffsverlauf. Es gibt kein Kontosystem, das ein Geheimnis mit einer Person verknüpfen könnte. Das Ratenlimit arbeitet mit einem HMAC der Adresse unter einem wechselnden Salt, sodass sich nichts von vor einem Wechsel mit etwas danach verknüpfen lässt.</p>
      <p>Weil das gespeicherte Objekt ohne den Seed im Fragment bedeutungslos ist, bringen ein kompromittierter Server oder eine behördliche Anordnung nur undurchsichtige Bytes und Hashes zutage, aus denen sich nichts zurückgewinnen lässt.</p>
      <div class="spec-list">
        <div><span class="k">Bei der Übertragung</span><span class="v">TLS</span></div>
        <div><span class="k">Im Ruhezustand</span><span class="v">Chiffretext + gehashte Schlüssel + Ablaufzeit</span></div>
        <div><span class="k">Protokolle</span><span class="v">keine pro Geheimnis</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Schritt 05 · Abruf &amp; Zerstörung</p>
      <h3>Wer zuerst liest, gewinnt – dann wird gelöscht</h3>
      <p class="plain"><b>Einfach gesagt:</b> Ein Einmal-Link gibt die Kiste einmal heraus und löscht die Kopie auf dem Server. Oder du zerstörst sie selbst, jederzeit.</p>
    </div>
    <div class="explainer__detail">
      <p>Beim Laden der Anzeigeseite wird nichts abgerufen: Die Anfrage geht erst bei einem echten Klick oder Tastendruck hinaus, sodass Link-Scanner und Chat-Vorschauen kein Geheimnis verbrauchen können. Bei einem Einmal-Geheimnis <b>beansprucht</b> der Server die Zeile in einem einzigen bedingten Update – genau eine Anfrage gewinnt –, und ab diesem Moment gilt das Geheimnis als verbraucht. Derselbe Browser kann 15 Minuten lang erneut herunterladen, falls die Verbindung abbricht; niemand sonst kann das, und eine unbestätigte Beanspruchung wird zerstört, nie rückgängig gemacht. Befristete Geheimnisse werden bis zum Ablauf einfach gelesen.</p>
      <p>Jedes Geheimnis hat außerdem einen privaten <b>Brenn-Link</b>. Ihn zu öffnen zerstört für sich noch nichts; erst die Bestätigung löscht den Chiffretext sofort, bevor eine empfangende Person ihn lesen kann.</p>
      <div class="spec-list">
        <div><span class="k">Einmalige Ansicht</span><span class="v">atomare Beanspruchung, dann zerstört</span></div>
        <div><span class="k">Zeitfenster für erneuten Download</span><span class="v">15 Min., nur derselbe Client</span></div>
        <div><span class="k">Ablaufzeit</span><span class="v">15 Min. – 14 Tage</span></div>
        <div><span class="k">Kontrolle für dich</span><span class="v">Brenn-Link</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Bedrohungsmodell</p>
  <h2 class="section__heading">Was shhnote sehen kann und was nicht</h2>
  <p class="section__intro">Die ehrliche Fassung. Hier steht genau, wo die Vertrauensgrenze verläuft.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Verlässt nie dein Gerät</p>
    <h3>Was wir nicht sehen können</h3>
    <p>Dein Klartext · der Inhaltsschlüssel und der Seed · deine Passphrase · ob eine Passphrase gesetzt wurde · wer ein Geheimnis erstellt oder geöffnet hat · wann es erstellt wurde · Zugriffsprotokolle auf IP-Ebene. Nichts davon wird übertragen oder aufbewahrt.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Auf unseren Servern gespeichert</p>
    <h3>Was wir tatsächlich haben</h3>
    <p>Einen verschlüsselten Blob, den wir nicht öffnen können · seine aufgefüllte Größenklasse · Einweg-Hashes der Werte, mit denen dein Browser es findet oder brennt · ob es eine einmalige Ansicht ist oder befristet · einen gerundeten Ablaufzeitpunkt. Alles nutzlos ohne den Seed in deinem Link.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Gut zu wissen</p>
    <h3>Die ehrlichen Einschränkungen</h3>
    <p>Wer den vollständigen Link hat (und die Passphrase, falls gesetzt), kann ein Einmal-Geheimnis lesen: Behandle den Link wie das Geheimnis selbst. Nachdem ein Geheimnis angezeigt wurde, überschreibt die Seite beim Verlassen, was sie kann, aber JavaScript kann das nicht garantieren; schließ den Tab, wenn du fertig bist. Ein automatisierter Browser, der echte Eingaben erzeugt, kann ein Einmal-Geheimnis öffnen, wie es ein Mensch täte – die empfangende Person findet dann nichts, und das ist das ehrliche Ergebnis. Löschen entfernt den Eintrag; verschlüsselte Reste können in Journalen, freiem Speicherplatz oder Backups verbleiben, bis sie überschrieben werden, als Chiffretext ohne Schlüssel. Große Geheimnisse, die außerhalb der Datenbank liegen, tragen den Zeitpunkt, zu dem die Datei geschrieben wurde. Und wie bei jeder Web-App vertraust du dem Code, der an deinen Browser ausgeliefert wird – deshalb ist shhnote Open Source und lässt sich selbst betreiben.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Kryptografische Spezifikation</p>
  <h2 class="section__heading">Jedes Primitiv an einem Ort</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Verschlüsselung</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Authentifizierte symmetrische Verschlüsselung in Blöcken à 64 KiB. Ein 256-Bit-Schlüssel plus ein Integritäts-Tag pro Block, sodass Manipulation oder Abschneiden erkannt wird, statt nur unlesbar zu bleiben.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Schlüsselableitung</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Schlüssel und Kennungen werden über HKDF-SHA-256 aus dem Seed gewonnen. Optionale Passphrasen werden mit einer speicherintensiven KDF gestreckt. Das macht Offline-Brute-Force-Angriffe langsam und teuer, selbst auf Spezialhardware.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Zufall</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Seeds, Schlüssel, Salts und Nonces stammen aus dem kryptografisch sicheren Zufallsgenerator des Browsers. Nie <span class="color-faint">Math.random()</span>, nie vorhersagbar.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Schlüsselverwahrung</p>
    <div class="spec__val">URL-Fragment&nbsp;#</div>
    <p>Der Seed steht in deinem Link nach dem #. Browser übertragen das Fragment nie, also erreicht er nie unsere Server.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Bei der Übertragung</p>
    <div class="spec__val">TLS</div>
    <p>Nur Chiffretext verlässt dein Gerät, über modernes TLS. Was bei uns ankommt, ist ein undurchsichtiger Blob, den wir nicht öffnen können.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Im Ruhezustand</p>
    <div class="spec__val">Chiffretext + Hashes</div>
    <p>Wir speichern einen verschlüsselten Blob, Einweg-Hashes seiner Zugangsdaten und einen gerundeten Ablaufzeitpunkt – keinen Klartext, keine Schlüssel, keine Metadaten über Absender oder Empfänger.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Technische FAQ</p>
  <h2 class="section__heading">Für Sicherheitsbewusste</h2>
</header>

<div class="faq">
  <details open>
    <summary>Wie wird die einmalige Ansicht gegen gleichzeitige Zugriffe abgesichert?</summary>
    <p>Beim Anzeigen läuft ein einziges bedingtes Update, das die Zeile von „aktiv“ auf „beansprucht“ setzt. Zwei gleichzeitige Anfragen können nicht beide erfolgreich sein; die zweite trifft auf einen bereits beanspruchten Eintrag und bekommt dieselbe Antwort „kein Geheimnis gefunden“ wie alle anderen. Die Beanspruchung wird nie rückgängig gemacht: Geht der Download verloren, lädt der Inhaber des Claim-Tokens innerhalb des Zeitfensters erneut herunter, andernfalls wird das Geheimnis ungelesen zerstört.</p>
  </details>
  <details>
    <summary>Warum das URL-Fragment statt eines Query-Parameters?</summary>
    <p>Query-Parameter werden an den Server gesendet und landen in Zugriffsprotokollen, Proxys und Analysetools. Das Fragment (nach dem <span class="color-accent">#</span>) bleibt laut URL-Spezifikation auf der Client-Seite: Der Browser nimmt es nie in die HTTP-Anfrage auf. Auf dieser Eigenschaft beruht das gesamte Zero-Knowledge-Design. Nach dem Anzeigen entfernt die Seite das Fragment außerdem aus Adressleiste und Verlauf.</p>
  </details>
  <details>
    <summary>Was hindert Link-Scanner daran, Einmal-Geheimnisse vorzeitig zu verbrennen?</summary>
    <p>Die Anzeigeseite ist für jedes Geheimnis dasselbe statische Dokument und lädt beim Aufruf nichts. Die Anfrage wird erst bei einem echten Klick oder Tastendruck gesendet; ein per Skript ausgelöstes <code>click()</code> oder Absenden eines Formulars zählt nicht. Automatische Scanner (E-Mail-Sicherheit, Linkvorschauen in Chats, Virenscanner) laden immer nur diese statische Hülle.</p>
  </details>
  <details>
    <summary>Kann ich das überprüfen oder selbst betreiben?</summary>
    <p>Ja. Der gesamte Quellcode ist unter AGPLv3 öffentlich, das Protokoll ist in einer Spezifikation festgehalten, mit Konformitätsvektoren, an denen sich jede Implementierung selbst prüfen kann, und es gibt eine Anleitung zum Selbstbetrieb. Du kannst die clientseitige Kryptografie prüfen und eine eigene Instanz betreiben, sodass die Vertrauensgrenze ganz bei dir liegt.</p>
  </details>
  <details>
    <summary>Wird zur Missbrauchsabwehr etwas protokolliert?</summary>
    <p>Wir führen keine Zugriffsprotokolle pro Geheimnis und keinen IP-Verlauf. Das Ratenlimit nutzt einen schlüsselbasierten Hash der Adresse mit einem Salt, das regelmäßig wechselt und dabei jeden Zähler mit löscht. Missbrauchsmeldungen werden pro Tag gezählt; welches Geheimnis gemeldet wurde, wird nicht festgehalten.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Tipps zum sicheren Teilen

- Schick die Passphrase auf einem anderen Weg als den Link, zum Beispiel den Link per E-Mail und die Passphrase am Telefon.
- Wähle die kürzeste Ablaufzeit, die für dich passt.
- Nutze ein Einmal-Geheimnis für Passwörter und andere Informationen, die genau einmal gelesen werden sollen.

<h2 id="reporting-a-vulnerability">Sicherheitslücke melden</h2>

Wenn du glaubst, ein Sicherheitsproblem mit dieser Website gefunden zu haben, schreib bitte an [security@shhnote.com](mailto:security@shhnote.com) und informiere uns vertraulich, bevor du es anderen erzählst. Beschreibe, was du gefunden hast und wie es sich nachvollziehen lässt.

Wir werden:

- innerhalb von 5 Werktagen antworten;
- dich auf dem Laufenden halten, während wir es beheben;
- dich bei der Veröffentlichung der Lösung nennen, wenn du möchtest.

Bitte greif beim Testen nicht auf Daten anderer zu, stör den Dienst nicht und führ keine automatischen Scans durch, die ihn stark belasten.

Sicherheitslücken in der shhnote-Software selbst: siehe die [Sicherheitsrichtlinie des Projekts](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/de/#create" class="btn btn--primary"><span>Geheimnis erstellen</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Quellcode auf GitHub ansehen</span></a></p>

</div>
</div>
</section>
