---
title: "Integritetspolicy"
description: "Vad shhnote.com lagrar, hur länge och vad den aldrig gör. Vi kan inte läsa dina hemligheter, och vi sparar så lite annat som möjligt."
eyebrow: "Juridik"
updated: "[date]"
---

> **Utkast.** Den här policyn är en utgångspunkt och har inte granskats av en jurist.

## Den korta versionen

shhnote.com (”den här webbplatsen”) kan inte läsa dina hemligheter. De krypteras på din enhet, och nyckeln når aldrig oss. Vi sparar så lite annat som möjligt och raderar det så snart vi kan.

## Vad vi lagrar

När du skapar en hemlighet lagrar vi:

- **Den krypterade hemligheten.** Utan nyckeln i din länk är den oläslig, även för oss.
- **Dess inställningar:** när den upphör och om den raderas efter en visning.
- **Hashade inloggningsvärden:** envägshashar av de värden din webbläsare använder för att hitta eller radera den, som inte kan omvandlas tillbaka till något användbart.

Vi lagrar inte din lösenfras, nyckeln från din länk, när hemligheten skapades eller om en lösenfras har angetts. Tidpunkten då den upphör avrundas, så att den inte kan räknas om till tidpunkten då den skapades. De krypterade data fylls ut, så vi känner bara till deras ungefärliga storleksklass.

Stora hemligheter kan sparas utanför databasen, på disk eller i objektlagring. Den lagringen registrerar när varje fil skrevs, och det är det enda stället där en tidpunkt för skapandet finns. Den hör till en krypterad fil som vi inte kan öppna, och den försvinner när filen försvinner.

Om någon anmäler en länk räknar vi anmälan för den dagen. Vi sparar inga uppgifter om vilken hemlighet som anmäldes.

## När vi raderar den

En hemlighet raderas när den upphör, eller direkt efter att den har öppnats om det är en engångshemlighet. Raderade hemligheter går inte att återställa.

Raderingen tar bort posten. Som på alla datorer kan krypterade rester finnas kvar i databasjournaler, ledigt diskutrymme eller säkerhetskopior tills de skrivs över. De är chiffertext utan nyckel, och vi hanterar säkerhetskopior därefter.

## Vad vi inte gör

- Vi använder inte kakor eller spårning, och vi visar inga annonser.
- Vi läser inte in något från andra webbplatser: inga typsnitt, skript eller bilder från annat håll, så ingen tredje part ser ditt besök.
- Vi ber dig inte skapa något konto.
- Vi säljer eller delar inte dina data.

Ditt val av tema (ljust eller mörkt) sparas i webbläsarens lokala lagring och skickas aldrig någonstans.

## Serverloggar

Som de flesta webbplatser kan vår server kortvarigt registrera tekniska uppgifter om varje förfrågan, till exempel din IP-adress och tidpunkten, för att hålla tjänsten säker och fungerande. [Describe how long logs are kept, or state that they are not kept.] Loggarna innehåller aldrig hemliga nycklar, eftersom webbläsare inte skickar den del av länken som innehåller nyckeln.

## Dina rättigheter

Beroende på var du bor kan du ha rätt att fråga vilka uppgifter vi har om dig och att få dem rättade eller raderade. Eftersom vi nästan inte har något som identifierar dig finns det oftast lite att lämna ut. Kontakta oss på [contact@shhnote.com](mailto:contact@shhnote.com).

## Kontakt

Frågor om den här policyn: [contact@shhnote.com](mailto:contact@shhnote.com).
