---
title: "Datenschutzerklärung"
description: "Was shhnote.com speichert, wie lange und was es nie tut. Wir können deine Geheimnisse nicht lesen, und alles andere speichern wir so wenig wie möglich."
eyebrow: "Rechtliches"
updated: "5. November 2026"
---

> **Entwurf.** Diese Erklärung ist ein Ausgangspunkt und wurde nicht anwaltlich geprüft.

## Kurz gesagt

shhnote.com („diese Website“) kann deine Geheimnisse nicht lesen. Sie werden auf deinem Gerät verschlüsselt, und der Schlüssel erreicht uns nie. Alles andere speichern wir so wenig und so kurz wie möglich.

## Was wir speichern

Wenn du ein Geheimnis erstellst, speichern wir:

- **Das verschlüsselte Geheimnis.** Ohne den Schlüssel in deinem Link ist es unlesbar, auch für uns.
- **Seine Einstellungen:** wann es abläuft und ob es nach einmaligem Ansehen gelöscht wird.
- **Gehashte Zugangsdaten:** Einweg-Hashes der Werte, mit denen dein Browser es findet oder brennt; daraus lässt sich nichts Brauchbares zurückgewinnen.

Deine Passphrase, den Schlüssel aus deinem Link, den Erstellungszeitpunkt und ob eine Passphrase gesetzt wurde, speichern wir nicht. Die Ablaufzeit wird gerundet, sodass sich daraus der Erstellungszeitpunkt nicht zurückrechnen lässt. Die verschlüsselten Daten sind aufgefüllt, daher kennen wir nur ihre grobe Größenklasse.

Große Geheimnisse können außerhalb der Datenbank liegen, auf einer Festplatte oder in einem Objektspeicher. Dieser Speicher hält fest, wann jede Datei geschrieben wurde; das ist die einzige Stelle, an der ein Erstellungszeitpunkt existiert. Er hängt an einer verschlüsselten Datei, die wir nicht öffnen können, und verschwindet mit ihr.

Wird ein Link gemeldet, zählen wir die Meldung für diesen Tag. Welches Geheimnis gemeldet wurde, halten wir nicht fest.

## Wann wir es löschen

Ein Geheimnis wird gelöscht, wenn es abläuft, oder direkt nach dem Öffnen, wenn es ein Einmal-Geheimnis ist. Gelöschte Geheimnisse können nicht wiederhergestellt werden.

Löschen entfernt den Eintrag. Wie auf jedem Computer können verschlüsselte Reste in Datenbank-Journalen, freiem Speicherplatz oder Backups verbleiben, bis sie überschrieben werden. Es ist Chiffretext ohne Schlüssel, und wir behandeln Backups entsprechend.

## Was wir nicht tun

- Wir verwenden keine Cookies und kein Tracking und zeigen keine Werbung.
- Wir laden nichts von anderen Websites: keine Schriften, Skripte oder Bilder von anderswo, also sieht kein Dritter deinen Besuch.
- Du musst kein Konto anlegen.
- Wir verkaufen deine Daten nicht und geben sie nicht weiter.

Deine Wahl des Designs und, wenn du eine im Sprachmenü triffst, deine Sprache werden im lokalen Speicher deines Browsers gemerkt und nirgendwohin gesendet.

## Server-Protokolle

Diese Website führt keine Anfrageprotokolle: Der Webserver davor protokolliert keine Anfragen, und der shhnote-Server führt kein Zugriffsprotokoll pro Geheimnis und keine IP-Historie (die Ratenbegrenzung verwendet einen Schlüssel-Hash der Adresse unter einem rotierenden Salt). Cloudflare terminiert TLS für diese Website und sieht IP-Adressen gemäß seiner eigenen Datenschutzerklärung; ein Link-Fragment oder einen Schlüssel sieht es nie, weil Browser den Teil des Links mit dem Schlüssel nicht mitsenden.

## Deine Rechte

Je nachdem, wo du lebst, hast du das Recht zu erfahren, welche Daten wir über dich haben, und sie berichtigen oder löschen zu lassen. Da wir kaum etwas speichern, das dich identifiziert, gibt es meist wenig mitzuteilen. Schreib uns an [contact@shhnote.com](mailto:contact@shhnote.com).

## Kontakt

Fragen zu dieser Erklärung: [contact@shhnote.com](mailto:contact@shhnote.com).
