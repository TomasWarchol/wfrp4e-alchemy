# Audyt mechaniki mikstur

Stan na 2026-11-20. Sprawdzone wszystkie **157 receptur** z `scripts/data/recipes.js`:
- 77 z ostatniego commita (`0bc2459`);
- 80 nowych z wersji 1.10.0, które leżą w kopii roboczej i nie są jeszcze w żadnym commicie.

Kod sprawdziłem w `potion-consumer.js`, `potion-steps.js` i `effect-data.js`. Działanie skryptów porównałem z kodem WFRP4e 10.1.2 i warhammer-lib. To audyt kodu i danych, nie test na żywo.

Oznaczenia: **✓** działa i ma sens, **~** drobna uwaga albo coś dla MG, **✗** błąd albo luka w mechanice.

## 1. Co działa dobrze

- **Premie do testów (skrypty `dialog`)** mają filtry ukrywania i włączania. Wszystkie 43 pokazują się tylko przy właściwych testach i włączają się same, łącznie z karami (Fiolka Błędnego Ognika, Woń Knura).
- **Zmiany cech** są zwykłymi modyfikatorami efektu, więc karta postaci liczy je sama.
- **Czas działania** działa w obu formach: stałej (`duration.seconds/rounds` zamieniane na format v14) i losowej (`durationRoll`).
- **Odporność na stan** przez skrypt `update` działa: system wywołuje go także przy dodaniu efektu-stanu (`updateDocument` w warhammer-lib). Dotyczy Krwi Pieca, Napoju Zielonej Straży, Ciszy Morra, Toniku Brzasku i Aethyrycznej Równowagi.
- **Testy pijącego** w nowych recepturach (`instantSteps.test`) mają sensowne progi: łatwe przy łagodnych skutkach ubocznych, trudne przy narkotykach i miksturach zakazanych.
- **Pozostałe zasady:**
  - jedna mikstura lecznicza na spotkanie;
  - nowa mikstura magiczna wypiera poprzednią;
  - Eliksir Iluminacji działa raz na tydzień;
  - Fortuna i Determinacja nie rosną ponad Przeznaczenie i Odporność Psychiczną.

## 2. Problemy przekrojowe (od najważniejszych)

### P1. Rzucane mikstury nakładają stany bez testu obronnego ✗

Rzucający wykonuje test trafienia. Każdy trafiony cel dostaje stan, często 1 + PS, i sam nic nie rzuca. W WFRP4e stany z trucizn, strachu i oślepiających substancji zwykle pozwalają ofierze na test: Odporności przy truciźnie, Opanowania przy strachu, Zwinności albo Uniku przy proszku w oczy.

| Mikstura | Stan bez testu | Naturalny test obronny |
|---|---|---|
| Czarna Fiolka | 1 + PS Zatrucie | Odporność |
| Pył Koszmarów | 1 + PS Panika | Opanowanie (jak Strach) |
| Woreczek Wapna | 1 + PS Oślepienie | Unik / Zwinność |
| Flakon Słonecznego Blasku | 1 + PS Oślepienie | Unik / Zwinność (demony i nieumarli bez testu) |
| Fiolka Wygnania | 1 Oślepienie (+ obrażenia) | jak wyżej, tylko dla stanu |
| Oślepiający Proszek Błyskowy | 1 Oślepienie | Unik / Zwinność |
| Pył Zamętu, Proszek Kichający | 1 Oszołomienie | Odporność |
| Gromowy Dzban | 1 + PS Ogłuszenie (+2 obr.) | Odporność |

Smolista Bomba (Pochwycenie) może zostać bez testu, bo działa jak broń z cechą Unieruchamiający: ofiara wyrywa się później testem Siły. Ogień i kwasy (Podpalenie 1/2 + PS) idą za Podpalaczem z podręcznika i też są w porządku.

**Propozycja:** w `thrownSteps` dodać `resist: { test: 'endurance' | 'cool' | 'dodge', difficulty }`. Cel rzuca, a wynik liczy się tak: `stany = 1 + PS rzutu − PS testu celu`. Przy wyniku 0 lub mniej cel nic nie dostaje. Jeśli cel zda, a wynik i tak wyjdzie dodatni, zostaje 1 poziom.

### P2. Rzut trafia wszystkie namierzone żetony, bez zasięgu i obszaru ✗

`throwPotion` stosuje skutek do każdego żetonu namierzonego przez gracza: do 20 sztuk, na całej scenie, bez kary za zasięg. Test trafienia idzie z `skipTargets`, więc system nie dolicza modyfikatorów zasięgu. Jeden Woreczek Wapna może więc oślepić 20 wrogów po drugiej stronie mapy. Proszek Błyskowy ma w opisie „promień 3 m”, ale kod tego nie sprawdza.

**Propozycja:**
- Rzut w jeden cel (pierwszy namierzony) z prawdziwym testem broni: zasięg, modyfikatory i lokacja trafienia.
- Mikstury obszarowe dostają `blast: N` (jak cecha Wybuchowa). Skutek obejmuje żetony w promieniu N m od celu, z limitem odległości rzutu BS×3 (jak broń rzucana).

### P3. Chmury to tylko tekst ~

Bomba Dymna, Mgła Cienia, Smrodzielnik i Opar Zarazy piszą na czacie „chmura na X rund” i nic więcej. Smrodzielnik i Opar Zarazy mają w opisie test co rundę, ale nikt go nie wywołuje.

**Propozycja:**
- Szablon obszaru (Region w v14) z efektem przy wejściu i na początku rundy: test Odporności i stan.
- Dla Oparu Zarazy przycisk dla MG „wybierz chorobę”.
- Minimum: wpis na czacie z listą żetonów w promieniu i przyciskiem „Test Odporności” dla każdego.

### P4. Uzależnienie bez mechaniki ✗

Opisy Nalewki Makowej i Wywaru Krwawego Szału mówią o uzależnieniu, ale nic go nie śledzi. Podręcznik podstawowy też nie ma ogólnej zasady uzależnienia: Mandragora i Rozkosz Ranalda są w kompendium `wfrp4e-core` tylko opisane jako „highly-addictive”. Mechanika byłaby więc zasadą domową i tak trzeba ją oznaczyć.

**Propozycja „Nałóg”:**
1. Pole receptury `addictive: { difficulty: 'challenging' }`.
2. Każda dawka zapisuje na aktorze `doses[recipeId]` z datą (czas świata).
3. Po wypiciu pijący robi test Opanowania o podanej trudności, −10 za każdą dawkę z ostatnich 7 dni. Porażka daje efekt **Nałóg (nazwa)** bez końca działania. Efekt dodaje premię `dialog` z karą −10 do wszystkich testów, włączaną automatycznie, gdy od ostatniej dawki minęła ponad doba.
4. Każdego ranka bez dawki (`calendar-integration.js` już śledzi czas) pijący zdaje Wymagający test SW albo dostaje 1 Stan Zmęczenie. Trzy udane poranki z rzędu zdejmują Nałóg. Dawka mikstury znosi karę na dobę, ale licznik testów zaczyna się od nowa.

Kandydaci na `addictive`:
- Nalewka Makowa, Wywar Krwawego Szału (opis już to mówi);
- Wino Grobowe, Krople Oka Wiedźmy, Tonik Spalonej Duszy, Skaveński Wywar Spaczeniowy (narkotyki z półki zakazanej);
- Eliksir Bezsenności (opcjonalnie, łagodnie).

### P5. Te same mikstury świeckie kumulują się bez limitu ✗

Limit jednej mikstury naraz dotyczy tylko magicznych. Wypicie dwóch Mikstur Wzmocnienia daje +40 S i +40 Wt na godziny. Łatwo też złożyć premie do Odporności z różnych mikstur, które działają do wszystkich testów Odporności:

| Mikstura | Premia |
|---|---|
| Napar Przeciwgorączkowy | +20 |
| Ekstrakt Skupienia | +20 |
| Tonik na Trawienie | +20 |
| Tonik Ognia Paleniska | +20 |
| Okadzanie Jałowcem | +10 |
| Nalewka Czosnkowa | +1 PS |
| **Razem** | **+90 i +1 PS** |

**Propozycja** (to samo, co tryb „warstwy” w npc-templates):
- Ta sama mikstura wypita ponownie tylko odnawia czas działania.
- Premie z różnych mikstur do tej samej cechy albo testu: liczy się najwyższa.
- Kary zawsze się sumują.

Technicznie: flaga `stackKey` na efekcie (np. `t`, `test:endurance`). Przed utworzeniem efektu wyłączyć (`disabled`) słabsze efekty z tym samym kluczem.

### P6. Opisy „rozstrzyga MG”, których kod nie czyta ~/✗

Te flagi efektów nie są nigdzie odczytywane, więc mikstura nic nie robi poza wpisem na karcie:

| Mikstura | Flaga / obietnica | Da się zautomatyzować |
|---|---|---|
| Destylat Klepsydry Morra (Więź 4!) | `deathWard`: przeżywa z 1 Raną | Tak: `preTakeDamage` lub `takeDamage`; przy spadku do 0 Ran ustawić 1 i usunąć efekt |
| Eliksir Maski Śmierci | `feignDeath`: odporność na trucizny, choroby, magię umysłu | Częściowo: odporność na Zatrucie jak w Napoju Zielonej Straży; reszta dla MG |
| Olej Płonącego Oręża | `flamingWeapon`: trafienie daje Podpalenie | Tak: `applyDamage` atakującego; przy trafieniu bronią białą 1 Podpalenie |
| Olej Wiecznego Spoczynku | `ghostBaneOil`: obrażenia magiczne, +3 przeciw nieumarłym | Tak: `calculateOpposedDamage` (+3, gdy cel ma cechę Nieumarły) |
| Eliksir Widmowego Przejścia | `wraithstep` | Nie: zostaje dla MG (czas zob. P8) |
| Nektar Prawdomówności | `compelledTruth` | Nie: zostaje dla MG |
| Destylat Ołowianej Niewzruszoności, Destylat Gorączki Bojowej | odporność na Strach i Grozę | Tak: `dialog` +100 do testów Opanowania przeciw Strachowi albo cecha Nieustraszony na czas działania |
| Krople Jasności | „usuwa Zaskoczenie” | Tak: brakuje kroku `remove: surprised`, jest tylko +10 I |
| Mikstura Niewidzialności | „zaatakowany cel otrzymuje Zaskoczenie” | Częściowo: `rollWeaponTest`; przy trafieniu dodać Zaskoczenie celowi |
| Wyciąg z Korzenia Trolla | podwójne tempo leczenia | Nie: tylko tekst na czacie |
| Alchemiczny Proszek Leonarda | +2 Obrażeń i Przebijający | Nie: brak efektu; to powinna być zmiana amunicji albo broni, nie napój |
| Kompas z Meteorytowego Srebra | +2 PS do tropienia magii | Tak: `dialog` ze `slBonus` dla Percepcji i Tropienia; przy zmyśle magii dla MG |
| Pryzmat Mocy | reguły WoM s. 160 | Nie: zostaje dla MG |

Najpilniejsza jest Klepsydra: płaci się za nią 4 punkty Więzi, a nic nie robi.

### P7. Stany z czasem, którego nikt nie liczy ✗

- **Hollow Heart (Eliksir Pustego Serca): błąd.** Krok `add fatigued 2` idzie po utworzeniu efektu ze skryptem `update`, który od razu zdejmuje Zmęczenie. Zmęczenie, które ma przyjść po wygaśnięciu eliksiru, znika na zawsze. Poprawka: zamiast kroku dać skrypt `deleteEffect` z `addCondition("fatigued", 2)`, jak w Eliksirze Bezsenności.
- **Tonik Cordelii:** skutek uboczny ma trwać tyle minut, ile PS porażki, ale stan zostaje według własnych zasad systemu. Utrata Przytomności nie mija w ogóle, a Oślepienie 3 mija po 6 rundach. Lepiej nałożyć stan przez osobny efekt z czasem w minutach i skryptem `deleteEffect`, który zdejmie stan.
- **Krople Snu:** Utrata Przytomności (i Powalenie) bez czasu; opis mówi o śnie 1k10 godzin. Rozwiązanie jak wyżej, z czasem 1k10 h.
- **Ekstrakt z Mandragory:** porażka tylko pisze „zaśnie za 2–3 godziny”, nic nie nakłada. Wystarczy efekt z opóźnieniem albo przynajmniej przypomnienie dla MG w kalendarzu.

### P8. Balans: magia przegrywa ze świeckimi wywarami ✗

Mikstura magiczna kosztuje Więź, ma trudniejszy test i jest jedna naraz, więc powinna być wyraźnie mocniejsza od świeckiej. Kilka par wypada odwrotnie:

| Magiczna (koszt) | Świecka lub ziołowa (bez Więzi) | Wniosek |
|---|---|---|
| Eliksir Niedźwiedziej Krzepy: +20 S, +10 Wt, 10 min (Więź 3) | Mikstura Wzmocnienia: +20 S, +20 Wt, 1k10 h | Świecka lepsza we wszystkim. Sprawdzić wartości WoM; jeśli są zgodne, podnieść Krzepę (np. +20/+20 i cecha Twardy) |
| Tinctura Błękitnego Wiatru: +10 Wt, 2 h (Więź 1) | Okład Gorczyczny: +10 Wt, 4 h | Magiczna gorsza. Dać Tincturze +20 Wt albo odporność na Zmęczenie z zimna |
| Sole Aethyru: +10 Splatanie, 1 h (Więź 1) | Balsam na Duszę: +20 do testów SW, 6 h (do włączenia, więc także Splatanie); Eliksir Bezsenności: +1 PS do Int i SW, 3k10 h (rzucanie i splatanie) | Świecka apteka daje czarodziejowi więcej niż magia. Wykluczyć Splatanie i Język (Magiczny) z filtrów „wp” i „int” mikstur niemagicznych |
| Napój Osłony: +20 do testów SW, 10 min (Więź 2) | Latarnia Dusz: to samo przez 1 h, ten sam koszt | Osłona zbędna. Dać jej np. +20 tylko przeciw zaklęciom i 1 h, albo odporność na Panikę |
| Destylat Płynnego Złota (Chamon): +20 SW, 1 h, Więź 3, −10 | Napar Czystego Umysłu (Hysh): +20 SW, 1 h, Więź 3, +10 | Duplikat; Hysh łatwiejszy. Zróżnicować (np. Złoto: odporność na Strach) |

Inne pary do przejrzenia:
- Maść z Ciernistej Kory (+10 Wt, −10 Zw, 1 h) przegrywa z Okładem Gorczycznym (+10 Wt, 4 h, bez kary).
- Wywar Piorunującego Refleksu i Mikstura Żywego Srebra prawie się pokrywają.

### P9. Drobiazgi ~

- **Eliksir Widmowego Przejścia:** opis mówi 1k10 rund, a czas jest stały, 10 rund (`duration.rounds`). Zamienić na `durationRoll`.
- **Eliksir Zapomnienia:** opis EN i PL mówi „obrona SW −10”, a kod robi test Opanowania −10. Ujednolicić opis.
- **Dopasowanie umiejętności:** starsze filtry (Eliksir Zwodniczej Maski, Olej Cichego Kroku, Balsam Dzikości) używają `startsWith`, więc „Charm” łapie też „Charm Animal”. Nowe receptury robią to dobrze (`n === x || n.startsWith(x + " (")`); przenieść ten wzór do starych.
- **Wywar Łamacza Woli:** pije go ofiara, ale nie ma ścieżki „podaj komuś” ani testu Odporności, którym ofiara mogłaby wyczuć albo wypluć wywar.
- **Skaveński Wywar Spaczeniowy:** zrobiony ze spaczenia, a nie daje Zepsucia, choć CHANGELOG 1.10.0 mówi, że mikstury ze spaczeniem ryzykują Zepsucie. Sprawdzić z *The Horned Rat*.
- **Karta czatu po wypiciu mikstury magicznej:** zawsze pisze „Chamon Tether expired / Więź Chamonu wygasła”, także przy miksturach innych Kolegiów (np. Ulgu). Lepiej „Więź wygasła”.
- **Mistrzowska Mikstura Medyczna:** odmowa przełknięcia (porażka testu Opanowania) i tak zużywa dawkę. Zgodne z Zestawem Startowym; zostawić.

## 3. Ocena każdej mikstury

### Magiczne ogólne (11)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Mikstura Magicznej Mocy | ✓ | Połowa WR przez 2k10 rund; mocna, ale z WoM |
| Mikstura Lotu | ✓ | |
| Mikstura Losu | ✓ | |
| Mikstura Niewidzialności | ~ | Zaskoczenie celu nieautomatyczne (P6) |
| Nektar Witalności | ✓ | |
| Esencja Osnowy | ~ | +10 SW za 1 Więzi; słaba przy Naparze Czystego Umysłu |
| Sole Aethyru | ✗ | Przegrywa ze świeckimi (P8) |
| Napój Osłony | ✗ | Dominowany przez Latarnię Dusz (P8) |
| Eliksir Cichego Umysłu | ✓ | |
| Aethyryczna Równowaga | ✓ | |
| Fiolka Błędnego Ognika | ✓ | Kara do Skradania włącza się sama |

### Aqshy (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Płynny Ogień Aqshy | ~ | Obszar i cele (P2) |
| Eliksir Berserkerskiego Żaru | ✓ | |
| Olej Płonącego Oręża | ✗ | Flaga nieczytana (P6) |
| Destylat Gorączki Bojowej | ~ | Odporność na Strach tylko w opisie |
| Tonik Ognia Paleniska | ~ | +20 do każdej Odporności, kumuluje się (P5) |
| Płomień Odwagi | ✓ | |
| Krew Pieca | ✓ | |

### Azyr (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Destylat Gwiezdnego Pyłu | ✓ | |
| Eliksir Proroczego Wglądu | ✓ | |
| Wywar Piorunującego Refleksu | ~ | Prawie duplikat Żywego Srebra |
| Tinctura Błękitnego Wiatru | ✗ | Słabsza od Okładu Gorczycznego (P8) |
| Oko Niebios | ✓ | |
| Wywar Augura | ✓ | |
| Wywar Gwiezdnego Kompasu | ✓ | |

### Chamon (10)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Eliksir Żelaznej Skóry | ✓ | |
| Destylat Płynnego Złota | ✗ | Duplikat Naparu Czystego Umysłu, trudniejszy (P8) |
| Mikstura Żywego Srebra | ✓ | |
| Wywar Ołowianej Niewzruszoności | ~ | Odporność na Strach i Grozę tylko w opisie |
| Al-kahest | ~ | Obszar i cele (P2) |
| Kompas z Meteorytowego Srebra | ~ | +2 PS nieautomatyczne (P6) |
| Pryzmat Mocy | ~ | Tylko odsyłacz do WoM |
| Eliksir Rtęciowego Umysłu | ~ | +1 PS do Int obejmuje rzucanie zaklęć; brak pola `difficulty` w recepturze |
| Oko Probierza | ✓ | |
| Ołowiana Osłona | ✓ | |

### Ghyran (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Krople Wiecznej Wiosny | ✓ | |
| Eliksir Przebudzenia Ziemi | ✓ | |
| Napar Oczyszczenia Krwi | ✓ | |
| Balsam Życiodajnej Kory | ✓ | |
| Balsam Rozkwitu | ✓ | |
| Napar Zielonej Straży | ✓ | |
| Cierpliwość Dębu | ✓ | |

### Ghur (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Wywar Wilczego Zmysłu | ✓ | |
| Eliksir Niedźwiedziej Krzepy | ✗ | Słabszy od Mikstury Wzmocnienia (P8) |
| Destylat Pierwotnego Ryku | ✓ | |
| Balsam Dzikości | ~ | Filtr `startsWith` (P9) |
| Skok Jelenia | ✓ | |
| Eliksir Skóry Odyńca | ✓ | |
| Tonik Wycia Watahy | ✓ | |

### Hysh (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Świetlisty Eliksir Iluminacji | ✓ | |
| Flakon Słonecznego Blasku | ✗ | Oślepienie bez testu, wiele celów (P1, P2) |
| Napar Czystego Umysłu | ~ | Duplikat Płynnego Złota |
| Krople Prawdy Hysh | ✓ | |
| Tonik Brzasku | ✓ | |
| Oczy Latarni | ✓ | |
| Fiolka Wygnania | ~ | Oślepienie bez testu (P1); obrażenia bez pancerza w porządku |

### Shyish (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Eliksir Maski Śmierci | ✗ | Flaga nieczytana (P6) |
| Olej Wiecznego Spoczynku | ✗ | Flaga nieczytana (P6) |
| Destylat Klepsydry Morra | ✗ | Więź 4 za nic (P6) |
| Esencja Całunu | ✓ | |
| Cisza Morra | ✓ | |
| Memento Mori | ✓ | |
| Latarnia Dusz | ~ | +20 do SW obejmuje Splatanie (P8) |

### Ulgu (7)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Wywary Mgły Cienia | ~ | Chmura tylko tekstem (P3) |
| Eliksir Zwodniczej Maski | ~ | Filtr `startsWith` (P9) |
| Olej Cichego Kroku | ✓ | |
| Eliksir Widmowego Przejścia | ✗ | Flaga nieczytana i czas 10 zamiast 1k10 rund |
| Olej Cienistych Palców | ✓ | |
| Wywar Płaszcza Mroku | ✓ | |
| Pył Zamętu | ✗ | Oszołomienie bez testu (P1) |

### Alchemia świecka (22)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Alchemiczny Proszek Leonarda | ✗ | Brak efektu (P6) |
| Kwas Witriolowy | ~ | Obszar i cele (P2) |
| Ogień Fosforowy | ~ | Obszar i cele (P2) |
| Oślepiający Proszek Błyskowy | ✗ | Oślepienie bez testu, „3 m” niesprawdzane (P1, P2) |
| Bomba Dymna | ~ | Chmura tylko tekstem (P3) |
| Sole Trzeźwiące | ✓ | |
| Alchemiczny Klej Szybkoschnący | ~ | Brak efektu; mógłby dawać Pochwycenie jak Smolista Bomba |
| Kwas Trolla | ~ | Obszar i cele (P2); cechy Przebijający i Niebezpieczny nie działają |
| Gromowy Dzban | ✗ | Ogłuszenie bez testu (P1) |
| Smolista Bomba | ✓ | Pochwycenie bez testu jest zgodne z zasadami |
| Woreczek Wapna | ✗ | Oślepienie bez testu (P1) |
| Smrodzielnik | ✗ | Test co rundę tylko w opisie (P3) |
| Czernidło Nocne | ~ | Działa przy każdym Skradaniu, nie tylko w ciemności |
| Olej Ostrej Klingi | ~ | Działa każdą bronią białą, nie tylko naoliwioną |
| Krople Pewnej Ręki | ✓ | |
| Maść Ognioodporna | ✓ | |
| Ładunek Górniczy | ~ | Jeden cel na raz zamiast wybuchu (P2) |
| Fiolka Świetlika | ✓ | Opisowa |
| Kwas Trawiący | ✓ | |
| Żywica Wspinacza | ✓ | |
| Proszek Kichający | ✗ | Oszołomienie bez testu (P1) |
| Atrament Sympatyczny | ✓ | Opisowy |

### Aptekarstwo (25)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Mikstura Wzmocnienia | ✗ | Kumuluje się sama ze sobą (P5); mocniejsza od magii (P8) |
| Eliksir Bezsenności | ~ | +1 PS do rzucania i splatania (P8) |
| Przyjaciel Opoja | ✓ | |
| Eliksir Urody | ~ | Włącza się do każdego testu Ogd, nie tylko wobec zauroczonych |
| Nektar Prawdomówności | ~ | Tylko dla MG |
| Płyn na Porost Włosów | ✓ | Opisowy |
| Eliksir Zapomnienia | ~ | Opis SW, kod Opanowanie (P9) |
| Eliksir Udobruchający | ✓ | |
| Ripostny Odwar | ✓ | |
| Tonik Niewidywanych Widoków | ✓ | |
| Cudowny Regeneracyjny Tonik Cordelii | ✗ | Stany bez czasu (P7) |
| Proszek z Kory Wierzby | ✓ | |
| Okład z Krwawnika | ✓ | |
| Napar Przeciwgorączkowy | ~ | Kumulacja Odporności (P5) |
| Napar Czuwania | ✓ | |
| Uspokajacz Rumiankowy | ✓ | |
| Nalewka Pewnego Skalpela | ✓ | |
| Syrop z Podbiału | ✓ | |
| Krople Snu | ✗ | Utrata Przytomności bez końca (P7) |
| Przemywanie Świetlikiem | ✓ | |
| Maść Zrostowa | ✓ | |
| Nalewka Czosnkowa | ✓ | |
| Nalewka Makowa | ✗ | Uzależnienie bez mechaniki (P4) |
| Okład Gorczyczny | ~ | Lepszy od dwóch mikstur (P8), kumuluje się (P5) |
| Olejek Spokoju | ✓ | |

### Zielarstwo (29)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Panacea Universalis | ✓ | |
| Mikstura Lecznicza | ✓ | |
| Mistrzowska Mikstura Medyczna | ✓ | Placebo z Zestawu Startowego |
| Eliksir Żywotności | ✓ | |
| Tonik na Trawienie | ~ | Działa przy każdym teście Odporności (P5) |
| Panaceum Świeckie | ✓ | |
| Balsam na Duszę | ~ | Do włączenia przy każdym teście SW, więc i przy Splataniu (P8) |
| Woń Knura | ✓ | |
| Balsam z Morzyca | ✓ | |
| Ekstrakt z Mandragory | ✗ | Porażka nic nie nakłada (P7) |
| Uniwersalna Odtrutka | ✓ | |
| Krople Jasności | ✗ | Nie zdejmuje Zaskoczenia (P6) |
| Wyciąg z Korzenia Trolla | ~ | Tylko tekst |
| Ekstrakt Skupienia | ~ | Kumulacja Odporności (P5) |
| Proszek Żylny | ✓ | |
| Herbata Wędrowca | ✓ | |
| Okład z Pokrzywy | ✓ | |
| Liście Świeżego Oddechu | ✓ | |
| Gorzkówka Piołunowa | ✓ | |
| Syrop z Czarnego Bzu | ✓ | |
| Okadzanie Jałowcem | ~ | Kumulacja Odporności (P5) |
| Napar z Dziurawca | ✓ | |
| Senna Herbatka z Bylicy | ~ | Działa od razu, nie „po przebudzeniu” |
| Krople Naparstnicy | ✓ | |
| Maść Miodowa | ✓ | |
| Napar z Ostropestu | ✓ | |
| Herbatka Dobrego Snu | ✓ | |
| Okład z Babki na Ukąszenia | ✓ | |
| Maść z Ciernistej Kory | ~ | Dominowana przez Okład Gorczyczny |

### Zakazane (11)
| Mikstura | Ocena | Uwaga |
|---|---|---|
| Skaveński Wywar Spaczeniowy | ~ | Brak Zepsucia (P9); kandydat na Nałóg |
| Wywar Krwawego Szału | ✗ | Uzależnienie bez mechaniki (P4) |
| Wino Grobowe | ~ | Kandydat na Nałóg |
| Czarna Fiolka | ✗ | Zatrucie bez testu (P1) |
| Wywar Łamacza Woli | ~ | Brak podania ofierze i testu (P9) |
| Krople Oka Wiedźmy | ✓ | |
| Pył Koszmarów | ✗ | Panika bez testu Opanowania (P1) |
| Maść Zmiennolicego | ✓ | |
| Eliksir Pustego Serca | ✗ | Błąd: Zmęczenie znika (P7) |
| Opar Zarazy | ✗ | Test tylko w opisie (P3) |
| Tonik Spalonej Duszy | ✓ | Kandydat na Nałóg |

**Podsumowanie:** 157 mikstur, z czego 87 ✓, 41 ~ i 29 ✗.

## 4. Kolejność poprawek

1. **Błędy bez decyzji projektowych.** **Zrobione 2026-11-20**, sprawdzone w DEV-test:
   - Eliksir Pustego Serca (`deleteEffect`);
   - Krople Jasności (Zaskoczenie);
   - czas Widmowego Przejścia;
   - opis Eliksiru Zapomnienia;
   - filtry `startsWith`;
   - wykluczenie Splatania i Języka (Magicznego) z mikstur niemagicznych.
2. **Test obronny celu w rzucanych miksturach (P1) i rzut w jeden cel z obszarem `blast` (P2).** **Zrobione 2026-11-20**, sprawdzone w DEV-test.
   - Decyzja Tomka: prosty test celu, bez okna (`resist` w kroku); sukces chroni przed stanem, obrażenia i Podpalenie działają.
   - Rzut w pierwszy namierzony cel, zasięg = Bonus Siły z progami systemu, ponad 3× zasięg nie da się rzucić.
   - Wybuch: ogień 4, Ładunek Górniczy 5, błyski i Gromowy Dzban 3, proszki i kwasy 2. Wartości są w polu `blast` receptury.
3. **Limit kumulacji (P5).** **Zrobione 2026-11-20**, sprawdzone w DEV-test.
   - Decyzja Tomka: ta sama mikstura odnawia czas; z różnych mikstur do tej samej cechy albo testu liczy się najwyższa premia; kary się sumują.
   - Dotyczy wszystkich mikstur (`applyHighestBonus` w `effect-data.js`), także flakonów uwarzonych wcześniej.
4. **Automatyzacja flag (P6).** **Zrobione 2026-11-20**, sprawdzone w DEV-test:
   - Klepsydra, oba oleje do broni, odporność na Strach i Grozę, Maska Śmierci (Zatrucie).
   - Zostały: Kompas z Meteorytowego Srebra (+2 PS) i Zaskoczenie celu przy Niewidzialności.
5. **Stany z czasem (P7).** **Zrobione 2026-11-20**, sprawdzone w DEV-test: Cordelia, Krople Snu, Mandragora. Krok receptury `add` przyjmuje teraz `duration`.
   - Przy okazji naprawione: skrypty blokujące stan w 12 miksturach dawały czerwone błędy przy każdym nałożeniu stanu (podwójne usuwanie).
6. **Nałóg (P4).** **Zrobione 2026-11-20**, sprawdzone w DEV-test. Zasada domowa z ustawieniem świata `addiction` (domyślnie włączona), kod w `scripts/logic/addiction.js`, pole `addictive` w 6 recepturach.
7. **Przegląd balansu (P8)** po sprawdzeniu wartości z WoM.

Decyzji wymagają:
- wzór testu obronnego w P1;
- zasada kumulacji w P5: „najwyższa premia” czy „ta sama mikstura odnawia czas”;
- kształt Nałogu w P4 i to, czy Nałóg ma być domyślnie włączony.
