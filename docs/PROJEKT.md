# Alchemia Starego Świata – recenzja projektowa i plan prac

Recenzja z perspektywy projektanta gier: co działa, co psuje rozgrywkę i co warto zmienić. Stan modułu: wersja 1.7.1 (77 receptur: 42 magiczne w 8 Kolegiach i 6 ogólnych, 8 świeckich, 11 aptekarskich, 15 zielarskich, 1 zakazana).

## 1. Co jest dobre i zostaje

- **Dwa tory, dwa rytmy.** Mikstury magiczne warzy się szybko, ale ich moc „wisi” na alchemiku (Więź). Świeckie preparaty, leki i zioła trwają, lecz idą zgodnie z podręcznikami: długo, drogo, partiami. To czytelny podział z naturalnym limitem dla magii.
- **Więź jako waluta.** Mikstura daje przewagę drużynie, a koszt ponosi alchemik, który musi wybierać, co trzymać w obiegu. Zerwanie Więzi na odległość to dobry, fabularny wentyl.
- **Wierność źródłom.** Psucie się według tabeli z *Wiatrów Magii* (PS warzenia × wiek w sezonach), skutki uboczne, jedna mikstura lecznicza na spotkanie, ścieranie się wiatrów (nowa mikstura magiczna wypiera poprzednią) i mikstury do rzucania.
- **Wiedza zamiast listy.** Pamięć receptur, księgi z modułu Grimoires (wspólne okno, warunki czytania, wadliwe odpisy) i zwoje do zapamiętania dają postęp postaci, który da się zdobyć w świecie gry.
- **Efekty przez skrypty systemu.** Mikstury działają jak efekty WFRP4e, więc karta postaci i testy liczą je same.

## 2. Problemy rozgrywki (od najważniejszych)

| # | Problem | Skutek przy stole | Propozycja |
|---|---|---|---|
| 1 | **Poziom laboratorium wybiera gracz z listy** (słabe −1 PS / zwykłe / dobre +1 PS) przy każdym warzeniu. | Każdy wybiera „dobre”; koszt laboratorium (200–800 ZK) nic nie znaczy. | Laboratorium należy do miejsca albo postaci: MG ustawia je w ustawieniach postaci, albo zalicza je przedmiot „Laboratorium” w ekwipunku lub w kryjówce. Gracz widzi poziom, ale go nie zmienia. |
| 2 | **Przeterminowana mikstura magiczna nadal trzyma Więź.** Więź zwalnia dopiero wypicie albo zerwanie. | Zapomniana fiolka w plecaku blokuje punkty na zawsze; gracze nie wiedzą czemu. | Po upływie terminu mikstura magiczna gaśnie sama (jak przy zerwaniu): zwrot punktów i wpis na czacie przy następnym przeliczeniu czasu świata. |
| 3 | **Warzenie nie rezerwuje niczego.** Start warzenia sprawdza składniki i Więź, ale zużywa je dopiero rzut po upływie czasu. | W międzyczasie można sprzedać składniki albo zająć Więź; drugi rzut kończy się błędem. Można też „zacząć” bez ryzyka i wycofać się, gdy test wypada źle. | Składniki odkładane w chwili startu (do kotła), Więź rezerwowana na czas warzenia. Anulowanie przez MG zwraca składniki. |
| 4 | **PS warzenia prawie nic nie znaczą.** Wpływają tylko na trwałość (+dni na PS) i odporność na psucie. | Sukces +1 i +5 dają tę samą miksturę; test nie ma napięcia. | Progi jakości: 0–1 PS zwykła, 2–3 PS dobra (np. +1 do jednej wartości efektu albo dłuższy czas działania), 4+ PS wyborna (druga dawka albo mniejszy koszt Więzi). Dla toru świeckiego: dawki 1k10 + PS. |
| 5 | **Podwójna premia Chamonu.** Dostrojony do Chamonu dostaje +5 miejsc w pamięci *i* zapamiętuje receptury Chamonu za darmo. | Złoty czarodziej pamięta praktycznie wszystko; inne Kolegia odstają. | Jedna z premii: albo darmowe receptury Chamonu, albo +5 miejsc (sugeruję darmowe receptury, bez +5). Ustawienie MG dla zachowania starych kampanii. |
| 6 | **Katastrofa przy pechu to tylko tekst.** Tabela 1k10 opisuje oparzenia, wybuchy i pożary, ale nic nie zadaje obrażeń ani nie nakłada stanów. | MG musi przepisywać skutki ręcznie; łatwo je pominąć. | Automatyzacja tam, gdzie się da: rany (1k10, 1k10+2…), test Odporności na opary ze stanem Zatrucie, uszkodzenie laboratorium jako spadek jego poziomu. Przycisk „Zastosuj” na karcie czatu dla MG. |
| 7 | **Jedno warzenie naraz na postać**, bez kolejki. | Przy długich preparatach (zioła, leki) alchemik stoi; nie ma decyzji „co warzę w tym tygodniu”. | Stanowiska w laboratorium: dobre laboratorium = 2 kotły, zwykłe = 1. Każde z własnym czasem. |
| 8 | **Talenty rozpoznawane po fragmentach nazw** („dostrojony do”, „concoct”). | Liczy się tylko pierwszy znaleziony talent „Dostrojony do…” (dowolny wiatr, bez związku z Kolegium mikstury); własne tłumaczenia i inne nazwy mogą nie zadziałać. | Wspólna lista aliasów EN/PL jak w Grimoires (`names.mjs`), dopasowanie po pełnej nazwie i specjalizacji. |

## 3. Problemy techniczne

- **Wydajność Więzi** (zrobione, A2). `CapacityEngine.getTetheredPotions` przeglądał przy każdym renderze Warsztatu wszystkich aktorów świata i żetony scen; w DEV-test (1375 aktorów) kosztowało to ok. 4 ms na wywołanie. Teraz indeks twórca → mikstury powstaje raz i jest aktualizowany hookami przedmiotów (0,02 ms). Rejestr w fladze alchemika odrzuciłem, bo przekazanie mikstury tworzy nowy przedmiot z nowym UUID.
- **Obliczenia w szablonie.** Ten sam stan Więzi liczony dwa razy przy warzeniu. Do uporządkowania razem z rejestrem.
- **Nazewnictwo.** Pomocnik szablonu `bajeryEq` (pozostałość po innym module) i klucze `GOLD_ALCHEMY` – do ujednolicenia przy przebudowie UI, bez zmiany zapisanych danych.
- **Testy jednostkowe** (zrobione, A1). Wzory Więzi, pamięci, modyfikatorów warzenia, wyniku testu, psucia i stanu mikstury są w `scripts/logic/rules.js` z testami Vitest (`npm test`); silniki z nich korzystają.

## 4. Problemy interfejsu (obecny Warsztat)

- **Pięć rzędów sterowania przed treścią:** kompendia i narzędzia MG, ustawienia MG, kategorie, Kolegia, filtry wiedzy. Lista receptur zaczyna się w połowie okna.
- **Nagłówek się rozjeżdża:** przy szerokości 800 px paski Więzi i pamięci wychodzą poza okno, a tekst nakłada się na paski.
- **Karty receptur są przeładowane:** do 6 plakietek na kartę (kategoria, stan wiedzy, księga, Chamon, koszt, gotowość), nazwy nachodzą na plakietki.
- **Najważniejsza decyzja jest na dole:** wybór laboratorium, czas, dawki i przycisk warzenia są pod opisem efektu i listą składników; trzeba przewijać.
- **Więź to pasek z liczbami**, a aktywne mikstury to stopka widoczna dopiero na dole. Gracz nie widzi, kto ma którą miksturę i kiedy wygaśnie.
- **Warzenie w toku to jedna linijka tekstu.** Brak poczucia, że w pracowni coś się dzieje.

## 4a. Znalezione przy przebudowie UI (stare błędy, do poprawy)

- Edytor receptur pokazywał nazwę wbudowanej receptury jako surowy klucz tłumaczenia. **Naprawione.**
- Edytor nie miał kategorii „magical” (ogólne receptury magiczne), więc zaznaczał Aptekarstwo. **Naprawione.**

## 5. Plan prac

Dwa tory, które można prowadzić osobno. Tor A zmienia zasady (wymaga decyzji), tor B to nowy wygląd (jak w Underworld i Grimoires).

### Tor A – mechanika (do wyboru, każdy punkt osobno)

1. Testy jednostkowe silników (fundament pod zmiany). **Zrobione 2026-11-15.**
2. Indeks Więzi (wydajność) i gaśnięcie przeterminowanych mikstur (problem 2). **Zrobione 2026-11-15**, sprawdzone w DEV-test.
3. Laboratorium ustawiane przez MG (problem 1). **Zrobione 2026-11-15** (ustawienie `labByGM`, flaga postaci `labTier`), sprawdzone w DEV-test.
4. Rezerwacja składników i Więzi przy starcie warzenia (problem 3). **Zrobione** (`reserveOnStart`; anulowanie zwraca składniki), sprawdzone w DEV-test.
5. Jakość mikstury z PS (problem 4). **Zrobione** (`qualityFromSL`, `rules.potionQuality`, testy).
6. Premia Chamonu (problem 5). **Zrobione** (`chamonBonusMode`, domyślnie tylko darmowe receptury). Aliasy talentów: **zrobione** – `rules.ALIASES` i `splitName` (cała nazwa bazowa EN/PL bez polskich znaków, specjalizacja w nawiasie albo w polu specyfikacji, z kilku talentów liczy się ten z największą liczbą stopni).
7. Automatyczne skutki katastrof (problem 6). **Zrobione** (`automateDisasters`). Kotły w laboratorium (problem 7): **zrobione** – lista `pendingBrews` (`scripts/logic/pending-brews.js`, dawna flaga czytana i zastępowana), dobre laboratorium ma 2 kotły, sprawdzone w DEV-test.

### Tor B – interfejs „Pracownia Alchemika”

Szczegóły w `docs/ui/KONCEPCJA.md`, assety w `docs/ui/ART-BIBLE.md`.

1. Assety (ikony, ornamenty, winiety naczyń) z przejęciem sigili wiatrów z Grimoires.
2. Fundament stylu: przełącznik wyglądu, czcionki, rama pracowni.
3. Układ: receptariusz, stół roboczy, nawigacja.
4. Więź jako łańcuch z fiolkami, pamięć jako półka, warzenie w toku.
5. Karty czatu, edytor receptur, szuflada MG.
6. Szlif: dostępność, kontrast, zrzuty.

Kolejność zalecana: A1 → A2 (bo wydajność i Więź dotykają też widoku) → tor B → reszta toru A.
