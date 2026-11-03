---
title: "Pytania i odpowiedzi"
description: "Najczęstsze pytania o shhnote — konta, linki, hasła, wygasanie oraz szczegóły techniczne dla dbających o bezpieczeństwo."
eyebrow: "FAQ"
intro: "Najpierw krótkie odpowiedzi, potem techniczne. Jeśli nie ma tu twojego pytania, strony o działaniu i bezpieczeństwie wchodzą głębiej, a zawsze możesz też zapytać nas."
wide: true
---

<section class="section">
<div class="container">
<div class="faq">
  <details open>
    <summary>Czy potrzebuję konta?</summary>
    <p>Nie. Nie trzeba się rejestrować ani niczego instalować. Otwórz shhnote, wpisz sekret, udostępnij link. To wszystko.</p>
  </details>
  <details>
    <summary>A jeśli link zobaczy niewłaściwa osoba?</summary>
    <p>Jednorazowy sekret może przeczytać tylko pierwsza osoba, która go otworzy — potem zostaje zniszczony, a ty dowiesz się, że coś go odczytało, bo zamierzony odbiorca niczego nie znajdzie. Dla większego bezpieczeństwa możesz dodać hasło i przekazać je osobno, tak by sam link nie wystarczył. A jeśli zmienisz zdanie, możesz samodzielnie zniszczyć sekret swoim prywatnym linkiem do spalenia.</p>
  </details>
  <details>
    <summary>Czy shhnote może przeczytać mój sekret?</summary>
    <p>Nie. Klucz, który go otwiera, nigdy do nas nie trafia — zostaje ukryty w twoim linku, po twojej stronie. Mamy tylko zaszyfrowaną wersję, której nie jesteśmy w stanie otworzyć.</p>
  </details>
  <details>
    <summary>Co się stanie, jeśli nikt go nie otworzy?</summary>
    <p>Ty wybierasz czas wygaśnięcia — od 15 minut do 14 dni. Gdy czas minie, sekret zostaje automatycznie usunięty, niezależnie od tego, czy ktoś go otworzył.</p>
  </details>
  <details>
    <summary>Czym różni się sekret jednorazowy od czasowego?</summary>
    <p>Sekret jednorazowy jest niszczony w chwili otwarcia. Sekret czasowy można otwierać ponownie aż do wygaśnięcia — ale strona nigdy nie pokazuje, ile czasu zostało, więc traktuj każdy sekret jak coś, co trzeba zapisać przy pierwszym odczycie.</p>
  </details>
  <details>
    <summary>Czym jest link do spalenia?</summary>
    <p>To drugi, prywatny link, który dostajesz przy tworzeniu sekretu. Jego otwarcie wyświetla potwierdzenie; potwierdzenie natychmiast niszczy sekret, zanim ktokolwiek zdąży go przeczytać. Zachowaj go dla siebie.</p>
  </details>
  <details>
    <summary>Czy mogę wysyłać pliki?</summary>
    <p>Tak. Pliki są szyfrowane w przeglądarce dokładnie tak jak tekst i podróżują w tym samym zapieczętowanym blobie. Wszystko jest dopełniane do standardowych rozmiarów, więc nawet my nie odróżnimy krótkiej notatki od małego pliku.</p>
  </details>
  <details>
    <summary>Czy działa w Tor Browser albo z wyłączonym JavaScriptem?</summary>
    <p>Tworzenie i odsłanianie sekretu wymaga JavaScriptu, bo szyfrowanie odbywa się w przeglądarce. Działa w Tor Browser na poziomie „Bezpieczniejszy”; na poziomie „Najbezpieczniejszy” WebAssembly jest wyłączony, więc sekretów chronionych hasłem nie da się otworzyć i strona o tym informuje. Wszystkie pozostałe strony działają bez JavaScriptu.</p>
  </details>
  <details>
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
  <details>
    <summary>Czy jest API?</summary>
    <p>Tak — to samo, z którego korzysta ta strona. Opisuje je <a href="/en/docs/">dokumentacja</a>, a otwartoźródłowy pakiet klienta implementuje protokół na potrzeby twoich własnych narzędzi.</p>
  </details>
</div>

<p class="prose-note">Masz jeszcze wątpliwości? Przeczytaj, <a href="/pl/how-it-works/">jak to działa</a>, zajrzyj do <a href="/pl/security/">szczegółów bezpieczeństwa</a> albo <a href="/pl/contact/">zapytaj nas</a>.</p>
</div>
</section>
