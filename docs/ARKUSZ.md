# Arkusz mikstur i składników

Dane mikstur są w kodzie (`scripts/data/recipes.js`, `scripts/data/ingredients.js`) i w plikach językowych (`lang/pl.json`, `lang/en.json`). Arkusz Excela pozwala je przejrzeć i edytować w jednym miejscu.

```bash
npm run sheet:export                # tworzy docs/alchemia.xlsx z aktualnych danych
npm run sheet:import -- --dry-run   # pokazuje zmiany z arkusza, nic nie zapisuje
npm run sheet:import                # zapisuje zmiany do modułu
npm test
```

- Zakładka **Instrukcja** w arkuszu opisuje kolory kolumn (zielone = edytowalne, szare = wyliczane przez moduł, niebieskie = identyfikatory) i dozwolone wartości.
- **Pochodzenie**: *Autorskie* (treść modułu) albo *Oficjalne* (z podręcznika – w grze tylko przy włączonym oficjalnym module). Wynika z kolumny „Moduł źródłowy”.
- Import sprawdza listy, liczby i oba języki; przy jakimkolwiek błędzie nic nie zapisuje. Zamknij plik w Excelu przed importem.
- Nowe receptury i składniki można dodać wierszem. Usuwanie wierszy niczego nie usuwa z modułu (tylko ostrzeżenie).
- Efektów w grze (skrypty, efekty natychmiastowe) arkusz nie zmienia – to kod.
- `docs/alchemia.xlsx` nie jest w repozytorium: to kopia robocza generowana z danych. Źródłem prawdy pozostaje kod.
