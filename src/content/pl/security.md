---
title: "Pełny cykl życia kryptografii"
description: "Co dzieje się z twoimi danymi na każdym etapie w shhnote — prymitywy, parametry i granice zaufania wyłożone wprost, wraz z uczciwymi zastrzeżeniami."
eyebrow: "Bezpieczeństwo · Szczegółowo"
intro: "Dokładny przegląd tego, co dzieje się z twoimi danymi na każdym etapie — z prymitywami, parametrami i granicami zaufania wyłożonymi wprost. Każdy krok zaczyna się od podsumowania prostym językiem, więc możesz czytać na takim poziomie szczegółowości, jaki ci odpowiada."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Krok 01 · Szyfrowanie</p>
      <h3>Twój sekret jest pieczętowany na twoim urządzeniu</h3>
      <p class="plain"><b>Prościej mówiąc:</b> szyfrowanie odbywa się w twojej przeglądarce, zanim cokolwiek zostanie wysłane. To, co otrzymujemy, jest już nieczytelne.</p>
    </div>
    <div class="explainer__detail">
      <p>Gdy naciskasz <b>Zaszyfruj</b>, przeglądarka losuje z WebCrypto CSPRNG nowy 256-bitowy klucz treści i szyfruje twoje dane algorytmem <b>AES-256-GCM</b>. GCM jest szyfrowaniem uwierzytelnionym: każdy fragment ma 128-bitowy znacznik, więc każda późniejsza manipulacja zostaje wykryta, zamiast zostać po cichu odszyfrowana.</p>
      <p>Tekst i pliki są traktowane identycznie — jedne i drugie stają się jednym nieprzejrzystym binarnym blobem, dopełnionym do standardowego rozmiaru, tak że krótkie hasło i mały plik wyglądają tak samo. Tekst jawny nigdy nie trafia do sieci i nigdy nie opuszcza pamięci karty.</p>
      <div class="spec-list">
        <div><span class="k">Szyfr</span><span class="v">AES-256-GCM, fragmenty po 64 KiB</span></div>
        <div><span class="k">Klucz treści</span><span class="v">256-bitowy, nowy dla każdego sekretu</span></div>
        <div><span class="k">Nonce</span><span class="v">7-bajtowy losowy prefiks + licznik</span></div>
        <div><span class="k">Znacznik uwierzytelniający</span><span class="v">128-bitowy na fragment</span></div>
        <div><span class="k">Dopełnienie</span><span class="v">Padmé, minimum 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Krok 02 · Przechowywanie klucza</p>
      <h3>Klucz ukrywa się w linku, nie na naszych serwerach</h3>
      <p class="plain"><b>Prościej mówiąc:</b> część linku po znaku <span class="color-accent">#</span> zawiera klucz — a przeglądarki nigdy nie wysyłają tej części do żadnego serwera.</p>
    </div>
    <div class="explainer__detail">
      <p>Twój link zawiera losowe 256-bitowe <b>ziarno</b> we <b>fragmencie</b> adresu URL — wszystkim, co następuje po znaku <span class="color-accent">#</span>. Zgodnie ze specyfikacją URL przeglądarka odcina fragment i <b>nigdy nie dołącza go do żądania</b> wysyłanego do naszych serwerów. Z tego ziarna przeglądarka wyprowadza za pomocą HKDF wartość wyszukiwania, służącą do odnalezienia sekretu, oraz klucz, który odpakowuje klucz treści. Serwer widzi wyłącznie skrót wartości wyszukiwania.</p>
      <p>Przeglądarka odbiorcy odczytuje ziarno z fragmentu i lokalnie wykonuje to samo wyprowadzenie. Właśnie to oznacza tutaj „zero-knowledge”: sam szyfrogram jest bezużyteczny bez linku.</p>
      <div class="spec-list">
        <div><span class="k">Położenie klucza</span><span class="v">Fragment URL #</span></div>
        <div><span class="k">Wysyłany do serwera?</span><span class="v">nigdy</span></div>
        <div><span class="k">Ziarno</span><span class="v">32 losowe bajty, base64url</span></div>
        <div><span class="k">Wyprowadzanie</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">Serwer przechowuje</span><span class="v">tylko SHA-256(lookup)</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Krok 03 · Opcjonalne hasło</p>
      <h3>Drugi zamek, który znają tylko ludzie</h3>
      <p class="plain"><b>Prościej mówiąc:</b> dodaj hasło, a nawet ktoś z pełnym linkiem nie otworzy sekretu bez niego.</p>
    </div>
    <div class="explainer__detail">
      <p>Jeśli ustawisz hasło, zostanie ono wzmocnione funkcją <b>Argon2id</b> — funkcją wyprowadzania klucza wymagającą dużo pamięci — i połączone z ziarnem w klucz, który opakowuje klucz treści. Samo hasło nigdy nie jest przesyłane ani przechowywane; znasz je tylko ty i odbiorca. Błędne próby są powtarzane w przeglądarce odbiorcy na danych, które już ma, więc serwer nie może ich policzyć.</p>
      <p>Duże wymagania pamięciowe sprawiają, że masowe zgadywanie offline jest kosztowne nawet na GPU i układach ASIC. Przekaż hasło <b>innym kanałem</b> niż link, a oba składniki nigdy nie spotkają się w jednym miejscu. Moduł Argon2 jest pobierany przy każdym tworzeniu i odsłanianiu sekretu, więc z ruchu sieciowego nie da się odczytać, które sekrety mają hasło.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">Sól</span><span class="v">128-bitowa, losowa</span></div>
        <div><span class="k">Opakowanie</span><span class="v">AES-256-GCM, 96-bitowy IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Krok 04 · Transmisja &amp; przechowywanie</p>
      <h3>Twoje urządzenie opuszcza wyłącznie szyfrogram</h3>
      <p class="plain"><b>Prościej mówiąc:</b> przechowujemy zamknięte pudełko i czas wygaśnięcia. Nic więcej — żadnego tekstu jawnego, żadnego klucza, żadnych danych o tobie.</p>
    </div>
    <div class="explainer__detail">
      <p>Blob jest przesyłany przez <b>TLS</b> i przechowywany jako szyfrogram obok zahaszowanych danych uwierzytelniających, swojego trybu ważności i zaokrąglonego czasu wygaśnięcia. Celowo <b>nie</b> przechowujemy tożsamości nadawcy, odbiorcy, logów IP, czasu utworzenia ani historii dostępu. Nie ma systemu kont, który wiązałby sekret z osobą. Ograniczanie liczby żądań działa na HMAC adresu z rotowaną solą, więc niczego sprzed rotacji nie da się powiązać z niczym po niej.</p>
      <p>Ponieważ przechowywany obiekt nie ma znaczenia bez ziarna z fragmentu, włamanie na serwer lub nakaz sądowy dają jedynie nieprzejrzyste bajty i skróty, których nie da się zamienić z powrotem w nic.</p>
      <div class="spec-list">
        <div><span class="k">W transmisji</span><span class="v">TLS</span></div>
        <div><span class="k">W spoczynku</span><span class="v">szyfrogram + zahaszowane klucze + czas wygaśnięcia</span></div>
        <div><span class="k">Logi</span><span class="v">brak logów na poziomie sekretu</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">Krok 05 · Odbiór &amp; zniszczenie</p>
      <h3>Wygrywa pierwszy odczyt — potem sekret jest kasowany</h3>
      <p class="plain"><b>Prościej mówiąc:</b> otwarcie jednorazowego linku jeden raz wydaje pudełko i usuwa kopię z serwera. Możesz też samodzielnie zniszczyć sekret, w dowolnej chwili.</p>
    </div>
    <div class="explainer__detail">
      <p>Gdy strona odsłaniania się ładuje, nic nie jest pobierane: żądanie wychodzi dopiero po prawdziwym kliknięciu lub naciśnięciu klawisza, więc skanery linków i podglądy na czatach nie mogą zużyć sekretu. W przypadku jednorazowego sekretu serwer <b>zajmuje</b> wiersz jedną warunkową aktualizacją — wygrywa dokładnie jedno żądanie — i od tej chwili sekret uznaje się za zużyty. Jeśli połączenie zostanie zerwane, ta sama przeglądarka może pobrać dane ponownie w ciągu 15 minut; nikt inny nie może, a niepotwierdzone zajęcie kończy się zniszczeniem, nigdy cofnięciem. Sekrety czasowe są zwykłym odczytem aż do wygaśnięcia.</p>
      <p>Każdy sekret ma też prywatny <b>link do spalenia</b>. Samo jego otwarcie niczego nie niszczy; potwierdzenie natychmiast kasuje szyfrogram — zanim jakikolwiek odbiorca zdąży go przeczytać.</p>
      <div class="spec-list">
        <div><span class="k">Jednorazowy</span><span class="v">atomowe zajęcie, potem zniszczenie</span></div>
        <div><span class="k">Okno ponownego pobrania</span><span class="v">15 min, tylko ten sam klient</span></div>
        <div><span class="k">Wygaśnięcie</span><span class="v">15 min – 14 dni</span></div>
        <div><span class="k">Kontrola właściciela</span><span class="v">link do spalenia</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Model zagrożeń</p>
  <h2 class="section__heading">Co shhnote widzi, a czego nie</h2>
  <p class="section__intro">Uczciwa wersja. Oto dokładnie, gdzie przebiega granica zaufania.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">Nigdy nie opuszcza twojego urządzenia</p>
    <h3>Czego nie widzimy</h3>
    <p>Twój tekst jawny · klucz treści i ziarno · twoje hasło · czy ustawiono hasło · kto utworzył lub otworzył sekret · kiedy go utworzono · logi dostępu na poziomie IP. Nic z tego nie jest przesyłane ani przechowywane.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Przechowywane na naszych serwerach</p>
    <h3>Co faktycznie mamy</h3>
    <p>Zaszyfrowany blob, którego nie możemy otworzyć · jego klasę rozmiaru po dopełnieniu · jednokierunkowe skróty wartości, których twoja przeglądarka używa, aby go odnaleźć lub spalić · informację, czy jest jednorazowy, czy czasowy · zaokrąglony czas wygaśnięcia. Wszystko to jest bezużyteczne bez ziarna z twojego linku.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">Warto wiedzieć</p>
    <h3>Uczciwe zastrzeżenia</h3>
    <p>Każdy, kto ma pełny link (i hasło, jeśli je ustawiono), może przeczytać jednorazowy sekret — traktuj sam link jak sekret. Po wyświetleniu sekretu strona nadpisuje przy wyjściu to, co może, ale JavaScript nie daje na to gwarancji; zamknij kartę, gdy skończysz. Przeglądarka sterowana automatycznie, która wprowadza prawdziwe zdarzenia wejścia, może otworzyć jednorazowy sekret tak jak człowiek — odbiorca nie znajdzie wtedy niczego, co jest uczciwym wynikiem. Usunięcie sekretu kasuje rekord; zaszyfrowane pozostałości mogą przetrwać w dziennikach, wolnym miejscu na dysku lub kopiach zapasowych, dopóki nie zostaną nadpisane, jako szyfrogram bez klucza. Duże sekrety przechowywane poza bazą danych niosą czas zapisania pliku. I jak w każdej aplikacji internetowej ufasz kodowi dostarczonemu do twojej przeglądarki — dlatego shhnote jest open source i można go hostować samodzielnie.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">Specyfikacja kryptograficzna</p>
  <h2 class="section__heading">Wszystkie prymitywy w jednym miejscu</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">Szyfrowanie</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>Uwierzytelnione szyfrowanie symetryczne we fragmentach po 64 KiB. 256-bitowy klucz plus znacznik integralności dla każdego fragmentu, więc manipulacja lub obcięcie zostaje wykryte — a nie tylko kończy się nieczytelnymi danymi.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Wyprowadzanie klucza</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>Klucze i identyfikatory powstają z ziarna przez HKDF-SHA-256. Opcjonalne hasła są wzmacniane funkcją KDF wymagającą dużo pamięci, przez co brute-force offline jest powolny i kosztowny nawet na dedykowanym sprzęcie.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Losowość</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>Ziarna, klucze, sole i wartości nonce pochodzą z kryptograficznie bezpiecznego generatora przeglądarki. Nigdy <span class="color-faint">Math.random()</span>, nigdy nic przewidywalnego.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">Przechowywanie klucza</p>
    <div class="spec__val">Fragment URL&nbsp;#</div>
    <p>Ziarno znajduje się w twoim linku po znaku #. Przeglądarki nigdy nie przesyłają fragmentu, więc nigdy nie trafia on na nasze serwery.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">W transmisji</p>
    <div class="spec__val">TLS</div>
    <p>Twoje urządzenie opuszcza wyłącznie szyfrogram, przesyłany przez nowoczesny TLS. Otrzymujemy nieprzejrzysty blob, którego nie możemy otworzyć.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">W spoczynku</p>
    <div class="spec__val">Szyfrogram + skróty</div>
    <p>Zapisujemy zaszyfrowany blob, jednokierunkowe skróty jego danych uwierzytelniających i zaokrąglony czas wygaśnięcia — żadnego tekstu jawnego, żadnych kluczy, żadnych metadanych o nadawcy czy odbiorcy.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">FAQ techniczne</p>
  <h2 class="section__heading">Dla dbających o bezpieczeństwo</h2>
</header>

<div class="faq">
  <details open>
    <summary>Jak gwarancja jednorazowości jest chroniona przed wyścigami?</summary>
    <p>Odsłonięcie wykonuje jedną warunkową aktualizację, która przestawia wiersz ze stanu „aktywny” na „zajęty”. Dwa równoczesne żądania nie mogą się powieść jednocześnie; drugie widzi już zajęty rekord i dostaje tę samą odpowiedź „nie znaleziono sekretu” co każdy inny. Zajęcia nigdy się nie cofa: jeśli pobieranie się nie powiedzie, posiadacz tokenu zajęcia pobiera dane ponownie w wyznaczonym oknie czasowym, a w przeciwnym razie sekret zostaje zniszczony nieprzeczytany.</p>
  </details>
  <details>
    <summary>Dlaczego fragment URL, a nie parametr zapytania?</summary>
    <p>Parametry zapytania są wysyłane do serwera i trafiają do logów dostępu, serwerów proxy i narzędzi analitycznych. Fragment (po znaku <span class="color-accent">#</span>) zgodnie ze specyfikacją URL pozostaje po stronie klienta — przeglądarka nigdy nie umieszcza go w żądaniu HTTP. Na tej właściwości opiera się cały model zero-knowledge. Po odsłonięciu strona usuwa też fragment z paska adresu i historii.</p>
  </details>
  <details>
    <summary>Co chroni jednorazowe sekrety przed przedwczesnym spaleniem przez skanery linków?</summary>
    <p>Strona wyświetlania to ten sam statyczny dokument dla każdego sekretu i przy ładowaniu niczego nie pobiera. Żądanie jest wysyłane dopiero po zaufanym kliknięciu lub naciśnięciu klawisza — skryptowe <code>click()</code> ani wysłanie formularza się nie liczą. Automatyczne skanery (filtry poczty, podglądy linków na czatach, antywirusy) wczytują zawsze tylko tę statyczną powłokę.</p>
  </details>
  <details>
    <summary>Czy mogę to zweryfikować lub hostować samodzielnie?</summary>
    <p>Tak. Pełny kod źródłowy jest publiczny na licencji AGPLv3, protokół jest opisany w specyfikacji z wektorami zgodności, względem których każda implementacja może się sprawdzić, jest też przewodnik po własnej instalacji. Możesz przeanalizować kryptografię po stronie klienta i uruchomić własną instancję, tak by granica zaufania była w całości twoja.</p>
  </details>
  <details>
    <summary>Czy coś jest logowane w celu zapobiegania nadużyciom?</summary>
    <p>Nie prowadzimy logów dostępu do poszczególnych sekretów ani historii adresów IP. Ograniczanie liczby żądań korzysta z kluczowanego skrótu adresu z solą, która jest rotowana i przy każdej rotacji zeruje wszystkie liczniki. Zgłoszenia nadużyć są liczone dziennie; nie ma zapisu, który sekret został zgłoszony.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## Wskazówki dotyczące bezpiecznego udostępniania

- Wyślij hasło inną drogą niż link, na przykład link e-mailem, a hasło przez telefon.
- Wybierz najkrótszy czas wygaśnięcia, który ci wystarczy.
- Używaj jednorazowego sekretu do haseł i innych informacji, które powinny zostać przeczytane dokładnie raz.

<h2 id="reporting-a-vulnerability">Zgłaszanie podatności</h2>

Jeśli trafisz na problem z bezpieczeństwem tej strony, napisz na [security@shhnote.com](mailto:security@shhnote.com) i poinformuj nas poufnie, zanim powiesz o tym komukolwiek innemu. Opisz, co udało ci się znaleźć i jak to odtworzyć.

Zobowiązujemy się:

- odpowiedzieć w ciągu 5 dni roboczych;
- informować cię na bieżąco w trakcie naprawy;
- wymienić cię przy publikacji poprawki, jeśli sobie tego życzysz.

Podczas testów nie uzyskuj dostępu do danych innych osób, nie zakłócaj działania usługi i nie uruchamiaj automatycznych skanów, które mocno ją obciążają.

Podatności w samym oprogramowaniu shhnote: zobacz [politykę bezpieczeństwa projektu](https://github.com/shhnote/shhnote/security).

<p class="btn-row btn-row--center"><a href="/pl/#create" class="btn btn--primary"><span>Utwórz sekret</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>Zobacz kod na GitHubie</span></a></p>

</div>
</div>
</section>
