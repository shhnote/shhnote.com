---
title: "Fragen und Antworten"
description: "Häufige Fragen zu shhnote: Konten, Links, Passphrasen, Ablaufzeiten und die technischen Details für Sicherheitsbewusste."
eyebrow: "FAQ"
intro: "Erst die kurzen Antworten, dann die technischen. Wenn deine Frage nicht dabei ist: Die Seiten „So funktioniert's“ und „Sicherheit“ gehen tiefer, und du kannst uns jederzeit fragen."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Brauche ich ein Konto?</summary>
    <p>Nein. Es gibt nichts, wofür du dich anmelden, und nichts, was du installieren musst. Öffne shhnote, schreib dein Geheimnis, teile den Link. Das war's.</p>
  </details>
  <details>
    <summary>Was, wenn die falsche Person den Link sieht?</summary>
    <p>Ein Einmal-Geheimnis kann nur die erste Person lesen, die es öffnet. Danach ist es zerstört, und du merkst, dass etwas es gelesen hat, weil die eigentliche empfangende Person nichts mehr findet. Für zusätzliche Sicherheit kannst du eine Passphrase hinzufügen und sie getrennt teilen, damit der Link allein nicht reicht. Und wenn du es dir anders überlegst, kannst du das Geheimnis mit deinem privaten Brenn-Link selbst zerstören.</p>
  </details>
  <details>
    <summary>Kann shhnote mein Geheimnis lesen?</summary>
    <p>Nein. Der Schlüssel, der es öffnet, erreicht uns nie: Er steckt in deinem Link, auf deiner Seite. Wir haben nur eine verschlüsselte Fassung, die wir auf keinem Weg öffnen können.</p>
  </details>
  <details>
    <summary>Was passiert, wenn niemand es öffnet?</summary>
    <p>Du wählst eine Ablaufzeit, irgendwo zwischen 15 Minuten und 14 Tagen. Ist die Zeit um, wird das Geheimnis automatisch gelöscht, ob es geöffnet wurde oder nicht.</p>
  </details>
  <details>
    <summary>Was ist der Unterschied zwischen einem Einmal-Geheimnis und einem befristeten?</summary>
    <p>Ein Einmal-Geheimnis wird in dem Moment zerstört, in dem es geöffnet wird. Ein befristetes Geheimnis lässt sich bis zum Ablauf erneut öffnen. Die Seite sagt aber nie, wie viel Zeit noch bleibt, also sichere jedes Geheimnis gleich beim ersten Lesen.</p>
  </details>
  <details>
    <summary>Was ist der Brenn-Link?</summary>
    <p>Ein zweiter, privater Link, den du beim Erstellen eines Geheimnisses bekommst. Beim Öffnen erscheint eine Bestätigung; bestätigst du, wird das Geheimnis sofort zerstört, bevor jemand es lesen kann. Behalte ihn für dich.</p>
  </details>
  <details>
    <summary>Kann ich Dateien verschicken?</summary>
    <p>Ja. Dateien werden in deinem Browser genauso verschlüsselt wie Text und reisen im selben versiegelten Blob. Alles wird auf Standardgrößen aufgefüllt, sodass nicht einmal wir eine kurze Notiz von einer kleinen Datei unterscheiden können.</p>
  </details>
  <details>
    <summary>Funktioniert es im Tor Browser oder ohne JavaScript?</summary>
    <p>Zum Erstellen und Anzeigen eines Geheimnisses wird JavaScript benötigt, weil die Verschlüsselung in deinem Browser passiert. Im Tor Browser funktioniert es auf der Stufe „Sicherer“; auf „Am sichersten“ ist WebAssembly abgeschaltet, sodass sich Geheimnisse mit Passphrase nicht öffnen lassen, und die Seite weist darauf hin. Alle anderen Seiten funktionieren ohne JavaScript.</p>
  </details>
  <details>
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
  <details>
    <summary>Gibt es eine API?</summary>
    <p>Ja, dieselbe, die diese Website nutzt. Die <a href="/en/docs/">Dokumentation</a> beschreibt sie, und das quelloffene Client-Paket implementiert das Protokoll für deine eigenen Werkzeuge.</p>
  </details>
</div>

<p class="prose-note">Noch Fragen? Lies, <a href="/de/how-it-works/">wie es funktioniert</a>, sieh dir die <a href="/de/security/">Sicherheitsdetails</a> an oder <a href="/de/contact/">frag uns</a>.</p>
</div>
</section>
