# WFRP4e – Alchemia Starego Świata (Old World Alchemy) (`wfrp4e-alchemy`)

[English](README.md) | **Polski**

Moduł do **Foundry VTT v14** dla systemu **Warhammer Fantasy Roleplay 4th Edition**. Zastępuje standardowe warzenie mikstur **Warsztatem Alchemicznym**:

* **Mikstury magiczne** ośmiu Kolegiów warzy się szybko, a ich moc trwa, dopóki alchemik podtrzymuje je swoją **Więzią** (punkty podtrzymania związane z magią alchemika).
* **Alchemia świecka, aptekarstwo i zielarstwo** trzymają się zasad z podręczników: dłuższy czas przygotowania, koszt składników i ceny katalogowe.

Język interfejsu przełącza się razem z językiem Foundry (polski lub angielski; inne języki dostają angielski).

---

## 📥 Instalacja

W Foundry: **Dodatki → Zainstaluj moduł**, w polu *Manifest URL* wklej:

```
https://github.com/TomasWarchol/wfrp4e-alchemy/releases/latest/download/module.json
```

Foundry doinstaluje też wymaganą bibliotekę **WFRP4e – Companion Library** (`wfrp4e-companion-lib`) oraz moduł **WFRP4e – Grimoires** (`wfrp4e-grimoires`). Włącz wszystkie trzy moduły w świecie.

## 📦 Wymagania

* Foundry VTT v14 i system WFRP4e 10.0+.
* **WFRP4e – Companion Library** (`wfrp4e-companion-lib`).
* **WFRP4e – Grimoires** (`wfrp4e-grimoires`) 0.5+.
* Opcjonalnie: Simple Calendar (bez niego moduł korzysta z kalendarza Foundry) oraz oficjalne moduły z treścią WFRP4e (dodatkowe składniki i receptury pojawiają się, gdy ich moduły są aktywne).

---

## ⚗️ Funkcje

* **Warsztat Alchemiczny** dla postaci: receptury według Kolegiów i rzemiosł, wymagane składniki, umiejętność testu, czas przygotowania, liczba dawek i cena.
* **Punkty Więzi**: każda magiczna mikstura zajmuje część Więzi alchemika, dopóki istnieje. Przekazanie mikstury sojusznikowi nie zrywa Więzi; zużycie lub rozwiązanie mikstury zwraca punkty.
* **Pamięć receptur**: alchemik pamięta ograniczoną liczbę receptur; kolejne dają **księgi** w ekwipunku, które korzystają z tego samego okna i warunków czytania co księgi zaklęć i mogą zawierać zaklęcia razem z recepturami. Otwarcie **zwoju receptury** pozwala ją zapamiętać, co zużywa zwój.
* **Test warzenia** z modyfikatorami widocznymi w oknie testu WFRP4e; wynik i mikstura trafiają na czat i do ekwipunku.
* **Efekty mikstur** oparte na skryptach efektów WFRP4e: stany, pancerz, premie do cech i umiejętności, leczenie; mikstury bojowe można **rzucić** w cel z menu kontekstowego przedmiotu.
* **Psucie się** świeckich preparatów z upływem sezonów.
* **Kompendia** generowane przez moduł: składniki, mikstury, zwoje receptur i księgi (odbudowywane w języku świata).
* **Edytor receptur** dla MG i ustawienia MG dla postaci (dostęp gracza, modyfikatory Więzi i pamięci, widoczne Kolegia).

## 🛠️ Uruchomienie

* Ikona kolby w nagłówku karty postaci (gdy MG włączy moduł dla tej postaci w **Centrum Dodatków MG**, `/hub`).
* Makro: `game.alchemy.openWorkshop()` lub `game.alchemy.openWorkshop(actor)`.

---

Nieoficjalna twórczość fanowska, niezwiązana z Games Workshop ani Cubicle 7. Kod na [licencji MIT](LICENSE).
