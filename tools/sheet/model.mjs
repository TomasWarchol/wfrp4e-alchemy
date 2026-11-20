/**
 * Model arkusza alchemii: kolumny, wiersze z danych modułu i zastosowanie zmian z arkusza.
 * Czyste funkcje (bez Excela i plików) – testowane w test/sheet.test.js.
 */
import { getString } from './json-text.mjs';

export const OWN = 'wfrp4e-alchemy';

/** Oficjalne moduły Foundry podręczników, z których pochodzą treści. */
export const SOURCES = {
  'wfrp4e-core': 'Core Rulebook (Podręcznik Główny)',
  'wfrp4e-wom': 'Winds of Magic (Wiatry Magii)',
  'wfrp4e-starter-set': 'Starter Set (Zestaw Startowy)',
  'wfrp4e-horned-rat': 'The Horned Rat',
  'wfrp4e-ua1': 'Ubersreik Adventures I',
  'wfrp4e-zoo': 'Imperial Zoo'
};

export const LISTS = {
  category: ['magical', 'college-aqshy', 'college-azyr', 'college-chamon', 'college-ghyran', 'college-ghur', 'college-hysh', 'college-shyish', 'college-ulgu', 'mundane', 'apothecary', 'herbal', 'forbidden'],
  ingredientCategory: null, // z danych
  college: ['aqshy', 'azyr', 'chamon', 'ghyran', 'ghur', 'hysh', 'shyish', 'ulgu'],
  volatility: ['minor', 'moderate', 'major', 'extreme'],
  availability: ['plentiful', 'common', 'scarce', 'rare', 'exotic'],
  source: Object.keys(SOURCES),
  unit: ['rundy', 'minuty', '10 minut', 'godziny'],
  yesNo: ['tak', 'nie']
};

/** Kategorie składników bierzemy z danych (lista rozszerza się razem z nimi). */
export function setIngredientCategories(ingredients) {
  LISTS.ingredientCategory = [...new Set(ingredients.map((i) => i.category))];
}

const UNITS = {
  rundy: { units: 'rounds', multiplier: 1 },
  minuty: { units: 'seconds', multiplier: 60 },
  '10 minut': { units: 'seconds', multiplier: 600 },
  godziny: { units: 'seconds', multiplier: 3600 }
};
const unitName = (roll) => Object.keys(UNITS).find((name) => UNITS[name].units === roll?.units && UNITS[name].multiplier === roll?.multiplier) ?? '';

export const originLabel = (sourceModule) => (!sourceModule || sourceModule === OWN ? 'Autorskie' : 'Oficjalne');

/**
 * Kolumny. `prop` – pole danych (zapisywane przy imporcie), `lang` – tekst z plików językowych,
 * brak obu = kolumna tylko do odczytu (wyliczana). `type`: text | int | number.
 */
export const RECIPE_COLUMNS = [
  { id: 'id', header: 'ID', width: 30, key: true },
  { id: 'key', header: 'Klucz', width: 24, key: true },
  { id: 'origin', header: 'Pochodzenie', width: 12 },
  { id: 'sourceModule', header: 'Moduł źródłowy', width: 20, prop: 'sourceModule', list: 'source', optional: true },
  { id: 'sourceTitle', header: 'Podręcznik', width: 26 },
  { id: 'namePl', header: 'Nazwa PL', width: 30, lang: ['pl', 'name'] },
  { id: 'nameEn', header: 'Nazwa EN', width: 30, lang: ['en', 'name'] },
  { id: 'category', header: 'Kategoria', width: 16, prop: 'category', list: 'category' },
  { id: 'college', header: 'Kolegium', width: 10, prop: 'college', list: 'college', optional: true },
  { id: 'track', header: 'Tor', width: 10 },
  { id: 'attunementCost', header: 'Koszt Więzi', width: 9, prop: 'attunementCost', type: 'int' },
  { id: 'testSkill', header: 'Umiejętność', width: 26, prop: 'testSkill' },
  { id: 'fallbackSkill', header: 'Umiejętność zastępcza', width: 22, prop: 'fallbackSkill', optional: true },
  { id: 'difficulty', header: 'Trudność (stara)', width: 9, prop: 'difficulty', type: 'int', optional: true },
  { id: 'volatility', header: 'Niestabilność', width: 11, prop: 'volatility', list: 'volatility' },
  { id: 'creationDifficultySL', header: 'Modyfikator PS warzenia', width: 10, prop: 'creationDifficultySL', type: 'int', optional: true },
  { id: 'creationTimeDays', header: 'Czas warzenia (dni, ręcznie)', width: 11, prop: 'creationTimeDays', type: 'number', optional: true },
  { id: 'creationTimeEffective', header: 'Czas warzenia (dni, w grze)', width: 11 },
  { id: 'shelfLifeDays', header: 'Trwałość (dni)', width: 9, prop: 'shelfLifeDays', type: 'int' },
  { id: 'bonusDaysPerSL', header: 'Dni trwałości za PS', width: 9, prop: 'bonusDaysPerSL', type: 'int' },
  { id: 'doses', header: 'Dawki', width: 7 },
  { id: 'ingredientsSummary', header: 'Składniki (edycja w arkuszu „Składniki receptur”)', width: 40 },
  { id: 'ingredientCost', header: 'Koszt składników (zk)', width: 10 },
  { id: 'listPriceSS', header: 'Cena dawki (s, ręcznie)', width: 10, prop: 'listPriceSS', type: 'int', optional: true },
  { id: 'priceEffective', header: 'Cena dawki (w grze)', width: 12 },
  { id: 'availability', header: 'Dostępność (ręcznie)', width: 11, prop: 'availability', list: 'availability', optional: true },
  { id: 'durationFormula', header: 'Czas działania – kości', width: 9, duration: 'formula', optional: true },
  { id: 'durationUnit', header: 'Czas działania – jednostka', width: 11, duration: 'unit', list: 'unit', optional: true },
  { id: 'durationMinusTB', header: 'Czas działania minus BWt', width: 9, duration: 'minusTB', list: 'yesNo', optional: true },
  { id: 'instantEffect', header: 'Efekt natychmiastowy (kod)', width: 18 },
  { id: 'hasScript', header: 'Ma skrypt efektu', width: 8 },
  { id: 'img', header: 'Obrazek', width: 40, prop: 'img' },
  { id: 'descPl', header: 'Opis PL', width: 50, lang: ['pl', 'description'], wrap: true },
  { id: 'descEn', header: 'Opis EN', width: 50, lang: ['en', 'description'], wrap: true },
  { id: 'effectPl', header: 'Efekt PL', width: 60, lang: ['pl', 'effectDescription'], wrap: true },
  { id: 'effectEn', header: 'Efekt EN', width: 60, lang: ['en', 'effectDescription'], wrap: true }
];

export const RECIPE_INGREDIENT_COLUMNS = [
  { id: 'recipeId', header: 'ID receptury', width: 30, key: true },
  { id: 'recipeName', header: 'Receptura (PL)', width: 30 },
  { id: 'ingredientKey', header: 'Klucz składnika', width: 22, list: 'ingredientKey' },
  { id: 'ingredientName', header: 'Składnik (PL)', width: 30 },
  { id: 'quantity', header: 'Ilość', width: 7, type: 'int' }
];

export const INGREDIENT_COLUMNS = [
  { id: 'key', header: 'Klucz', width: 22, key: true },
  { id: 'origin', header: 'Pochodzenie', width: 22 },
  { id: 'sourceModule', header: 'Moduł źródłowy', width: 20, prop: 'sourceModule', list: 'source', optional: true },
  { id: 'sourceTitle', header: 'Podręcznik', width: 26 },
  { id: 'namePl', header: 'Nazwa PL', width: 30, lang: ['pl', 'name'] },
  { id: 'nameEn', header: 'Nazwa EN', width: 30, lang: ['en', 'name'] },
  { id: 'category', header: 'Kategoria', width: 14, prop: 'category', list: 'ingredientCategory' },
  { id: 'gc', header: 'Cena zk', width: 7, price: 'gc', type: 'int' },
  { id: 'ss', header: 'Cena s', width: 7, price: 'ss', type: 'int' },
  { id: 'bp', header: 'Cena p', width: 7, price: 'bp', type: 'int' },
  { id: 'encumbrance', header: 'Obciążenie', width: 9, prop: 'encumbrance', type: 'number' },
  { id: 'availability', header: 'Dostępność', width: 11, prop: 'availability', list: 'availability' },
  { id: 'usedBy', header: 'Używany w recepturach', width: 50 },
  { id: 'img', header: 'Obrazek', width: 40, prop: 'img' },
  { id: 'descPl', header: 'Opis PL', width: 60, lang: ['pl', 'description'], wrap: true },
  { id: 'descEn', header: 'Opis EN', width: 60, lang: ['en', 'description'], wrap: true }
];

const priceText = (ss) => {
  const gc = Math.floor(ss / 20);
  return `${gc ? `${gc} zk ` : ''}${ss % 20} s`;
};

/**
 * Wiersze arkuszy z danych modułu.
 * @param {{recipes: object[], ingredients: object[], lang: {pl: object, en: object}, normalize: (r: object) => object}} data
 */
export function buildRows({ recipes, ingredients, lang, normalize }) {
  const t = (code, path) => getString(lang[code], path) ?? '';
  const ingByKey = new Map(ingredients.map((ing) => [ing.key, ing]));
  const ingName = (key) => (ingByKey.has(key) ? t('pl', ingByKey.get(key).name) : key);

  const recipeRows = recipes.map((recipe) => {
    const n = normalize(recipe);
    const roll = recipe.activeEffect?.flags?.[OWN]?.durationRoll;
    const row = {
      id: recipe.id,
      key: recipe.key,
      origin: originLabel(recipe.sourceModule),
      sourceTitle: SOURCES[recipe.sourceModule] ?? '',
      track: n.track === 'magical' ? 'magiczny' : 'świecki',
      creationTimeEffective: n.creationTimeDays,
      doses: n.dosesFormula,
      ingredientsSummary: (recipe.ingredients || []).map((ing) => `${ingName(ing.key)} ×${ing.quantity}`).join('; '),
      ingredientCost: n.ingredientCostGC,
      priceEffective: priceText(n.listPriceSS),
      durationFormula: roll?.formula ?? '',
      durationUnit: roll ? unitName(roll) : '',
      durationMinusTB: roll ? (roll.minusTB ? 'tak' : 'nie') : '',
      instantEffect: recipe.instantEffect ?? '',
      hasScript: recipe.activeEffect?.system?.scriptData?.length ? 'tak' : 'nie'
    };
    for (const col of RECIPE_COLUMNS) {
      if (col.prop) row[col.id] = recipe[col.prop] ?? '';
      if (col.lang) row[col.id] = t(col.lang[0], recipe[col.lang[1]]);
    }
    if (row.sourceModule === OWN) row.sourceModule = '';
    return row;
  });

  const ingredientRows = recipes.flatMap((recipe) => (recipe.ingredients || []).map((ing) => ({
    recipeId: recipe.id,
    recipeName: t('pl', recipe.name),
    ingredientKey: ing.key,
    ingredientName: ingName(ing.key),
    quantity: ing.quantity
  })));

  const ingredientsSheet = ingredients.map((ing) => {
    const users = recipes.filter((r) => (r.ingredients || []).some((x) => x.key === ing.key));
    const officialOnly = users.length > 0 && users.every((r) => originLabel(r.sourceModule) === 'Oficjalne');
    const origin = originLabel(ing.sourceModule) === 'Oficjalne' ? 'Oficjalne'
      : officialOnly ? 'Oficjalne (tylko z receptur)' : 'Autorskie';
    const row = {
      key: ing.key,
      origin,
      sourceTitle: SOURCES[ing.sourceModule] ?? (officialOnly ? [...new Set(users.map((r) => SOURCES[r.sourceModule]))].join(', ') : ''),
      gc: ing.price?.gc ?? 0,
      ss: ing.price?.ss ?? 0,
      bp: ing.price?.bp ?? 0,
      usedBy: users.map((r) => t('pl', r.name)).join('; ')
    };
    for (const col of INGREDIENT_COLUMNS) {
      if (col.prop) row[col.id] = ing[col.prop] ?? '';
      if (col.lang) row[col.id] = t(col.lang[0], ing[col.lang[1]]);
    }
    return row;
  });

  return { recipeRows, ingredientRows, ingredientsSheet };
}

/* ------------------------------------------------------------------ */
/*  Import                                                             */
/* ------------------------------------------------------------------ */

/** Wartość odrzucona przez walidację (błąd już zgłoszony). */
const INVALID = Symbol('invalid');

const blank = (v) => v === undefined || v === null || String(v).trim() === '';

function parseCell(col, raw, where, errors) {
  if (blank(raw)) return undefined;
  if (col.type === 'int' || col.type === 'number') {
    const num = Number(String(raw).replace(',', '.'));
    if (!Number.isFinite(num) || (col.type === 'int' && !Number.isInteger(num))) {
      errors.push(`${where}: „${col.header}” musi być ${col.type === 'int' ? 'liczbą całkowitą' : 'liczbą'} (jest: ${raw})`);
      return INVALID;
    }
    return num;
  }
  const text = String(raw).trim();
  const list = col.list && LISTS[col.list];
  if (list && !list.includes(text)) {
    errors.push(`${where}: „${col.header}” – niedozwolona wartość „${text}” (dozwolone: ${list.join(', ')})`);
    return INVALID;
  }
  return text;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Stosuje wiersze z arkusza do danych. Nic nie zapisuje – zwraca nowe dane i opis zmian.
 * @returns {{recipes: object[], ingredients: {changed: Map<string, object>, added: object[]}, langChanges: {pl: object, en: object}, changes: string[], errors: string[], warnings: string[]}}
 */
export function applyRows({ recipes, ingredients, lang }, { recipeRows, ingredientRows, ingredientsSheet }) {
  const errors = [];
  const warnings = [];
  const changes = [];
  const langChanges = { pl: {}, en: {} };
  const setLang = (code, path, value, label, label2) => {
    if (getString(lang[code], path) === value) return;
    langChanges[code][path] = value;
    changes.push(`${label}: ${label2 ?? path} → ${value.length > 80 ? `${value.slice(0, 77)}…` : value}`);
  };
  setIngredientCategories(ingredients);

  /* --- Składniki --- */
  const ingByKey = new Map(ingredients.map((ing) => [ing.key, ing]));
  const changedIngredients = new Map();
  const addedIngredients = [];
  const sheetIngKeys = new Set();
  ingredientsSheet.forEach((row, index) => {
    const where = `Składniki, wiersz ${index + 2}`;
    const key = String(row.key ?? '').trim();
    if (!key) return;
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(key)) errors.push(`${where}: klucz „${key}” – tylko litery i cyfry, bez spacji`);
    if (sheetIngKeys.has(key)) errors.push(`${where}: klucz „${key}” powtarza się`);
    sheetIngKeys.add(key);
    const old = ingByKey.get(key);
    const next = old ? structuredClone(old) : { key, name: `GOLD_ALCHEMY.Ingredients.${key}`, description: `GOLD_ALCHEMY.IngredientsDesc.${key}` };
    for (const col of INGREDIENT_COLUMNS) {
      if (!col.prop && !col.price && !col.lang) continue;
      const value = parseCell(col, row[col.id], where, errors);
      if (value === INVALID) continue;
      if (col.lang) {
        if (blank(value)) errors.push(`${where}: „${col.header}” nie może być pusty (moduł wymaga EN i PL)`);
        else setLang(col.lang[0], next[col.lang[1]], value, `Składnik ${key}`, col.header);
      } else if (col.price) {
        next.price = { gc: 0, ss: 0, bp: 0, ...next.price, [col.price]: value ?? 0 };
      } else if (value === undefined) {
        if (!col.optional) errors.push(`${where}: „${col.header}” nie może być pusty`);
        else delete next[col.prop];
      } else next[col.prop] = value;
    }
    if (next.sourceModule === OWN) delete next.sourceModule;
    if (!old) {
      addedIngredients.push(next);
      changes.push(`Nowy składnik: ${key}`);
    } else if (!same(old, next)) {
      changedIngredients.set(key, next);
      for (const prop of Object.keys({ ...old, ...next })) {
        if (!same(old[prop], next[prop])) changes.push(`Składnik ${key}: ${prop} ${JSON.stringify(old[prop])} → ${JSON.stringify(next[prop])}`);
      }
    }
  });
  for (const ing of ingredients) {
    if (!sheetIngKeys.has(ing.key)) warnings.push(`Składnik ${ing.key} nie ma wiersza w arkuszu – zostaje bez zmian (usuwanie tylko ręcznie w kodzie).`);
  }
  const allIngKeys = new Set([...ingByKey.keys(), ...addedIngredients.map((i) => i.key)]);

  /* --- Składniki receptur --- */
  const ingredientsByRecipe = new Map();
  ingredientRows.forEach((row, index) => {
    const where = `Składniki receptur, wiersz ${index + 2}`;
    const recipeId = String(row.recipeId ?? '').trim();
    const key = String(row.ingredientKey ?? '').trim();
    if (!recipeId && !key) return;
    if (!allIngKeys.has(key)) errors.push(`${where}: nieznany składnik „${key}”`);
    const parsed = parseCell({ header: 'Ilość', type: 'int' }, row.quantity, where, errors);
    const quantity = parsed === INVALID || parsed === undefined ? 1 : parsed;
    if (quantity < 1) errors.push(`${where}: ilość musi być co najmniej 1`);
    const list = ingredientsByRecipe.get(recipeId) ?? [];
    list.push({ key, quantity });
    ingredientsByRecipe.set(recipeId, list);
  });

  /* --- Receptury --- */
  const byId = new Map(recipes.map((r) => [r.id, r]));
  const seenIds = new Set();
  const seenKeys = new Set();
  const nextRecipes = recipes.map((r) => r);
  recipeRows.forEach((row, index) => {
    const where = `Mikstury, wiersz ${index + 2}`;
    const id = String(row.id ?? '').trim();
    const key = String(row.key ?? '').trim();
    if (!id && !key) return;
    if (!id || !key) { errors.push(`${where}: ID i Klucz są wymagane`); return; }
    if (seenIds.has(id)) errors.push(`${where}: ID „${id}” powtarza się`);
    if (seenKeys.has(key)) errors.push(`${where}: klucz „${key}” powtarza się`);
    seenIds.add(id);
    seenKeys.add(key);
    const old = byId.get(id);
    if (old && old.key !== key) errors.push(`${where}: nie zmieniaj klucza istniejącej receptury (${old.key} → ${key}) – postaci i księgi go używają`);
    if (!old && !/^[A-Za-z][A-Za-z0-9]*$/.test(key)) errors.push(`${where}: klucz „${key}” – tylko litery i cyfry, bez spacji`);
    const next = old ? structuredClone(old) : {
      id, key,
      name: `GOLD_ALCHEMY.Recipes.${key}.Name`,
      description: `GOLD_ALCHEMY.Recipes.${key}.Desc`,
      effectDescription: `GOLD_ALCHEMY.Recipes.${key}.Effect`,
      ingredients: []
    };
    const label = `Receptura ${id}`;
    const duration = {};
    for (const col of RECIPE_COLUMNS) {
      if (!col.prop && !col.lang && !col.duration) continue;
      const value = parseCell(col, row[col.id], where, errors);
      if (value === INVALID) continue;
      if (col.lang) {
        if (blank(value)) errors.push(`${where}: „${col.header}” nie może być pusty (moduł wymaga EN i PL)`);
        else setLang(col.lang[0], next[col.lang[1]], value, label, col.header);
      } else if (col.duration) {
        duration[col.duration] = value;
      } else if (col.prop === 'sourceModule') {
        next.sourceModule = value ?? OWN; // receptury zawsze mają źródło; zmiana w miejscu zachowuje kolejność pól
      } else if (value === undefined) {
        if (!col.optional) errors.push(`${where}: „${col.header}” nie może być pusty`);
        else delete next[col.prop];
      } else next[col.prop] = value;
    }

    // Czas działania: tylko dla receptur z efektem trwałym
    const roll = next.activeEffect?.flags?.[OWN]?.durationRoll;
    if (roll) {
      if (!duration.formula || !duration.unit) errors.push(`${where}: receptura ma efekt trwały – podaj kości i jednostkę czasu działania`);
      else {
        Object.assign(roll, { formula: duration.formula, ...UNITS[duration.unit] });
        const minusTB = duration.minusTB === 'tak';
        if (minusTB || roll.minusTB !== undefined) roll.minusTB = minusTB;
      }
    } else if (duration.formula || duration.unit) {
      warnings.push(`${where}: czas działania pominięty – ta receptura nie ma efektu trwałego (trzeba go dodać w kodzie).`);
    }

    const newIngredients = ingredientsByRecipe.get(id) ?? [];
    if (!newIngredients.length) errors.push(`${where}: receptura nie ma żadnego składnika w arkuszu „Składniki receptur”`);
    next.ingredients = newIngredients.map(({ key: ingKey, quantity }) => {
      const before = (old?.ingredients || []).find((x) => x.key === ingKey);
      const base = ingByKey.get(ingKey) ?? addedIngredients.find((x) => x.key === ingKey);
      return {
        key: ingKey,
        name: before?.name ?? base?.name ?? `GOLD_ALCHEMY.Ingredients.${ingKey}`,
        quantity,
        costZK: before?.costZK ?? ((base?.price?.gc || 0) + (base?.price?.ss || 0) / 20 + (base?.price?.bp || 0) / 240)
      };
    });

    if (!old) {
      nextRecipes.push(next);
      changes.push(`Nowa receptura: ${id} (bez efektu w grze – mechanikę trzeba dodać w kodzie)`);
    } else if (!same(old, next)) {
      nextRecipes[nextRecipes.indexOf(old)] = next;
      for (const prop of Object.keys({ ...old, ...next })) {
        if (!same(old[prop], next[prop])) {
          const show = (v) => (prop === 'ingredients' ? (v || []).map((x) => `${x.key}×${x.quantity}`).join(', ') : prop === 'activeEffect' ? JSON.stringify(v?.flags?.[OWN]?.durationRoll) : JSON.stringify(v));
          changes.push(`${label}: ${prop} ${show(old[prop])} → ${show(next[prop])}`);
        }
      }
    }
  });
  for (const recipe of recipes) {
    if (!seenIds.has(recipe.id)) warnings.push(`Receptura ${recipe.id} nie ma wiersza w arkuszu – zostaje bez zmian (usuwanie tylko ręcznie w kodzie).`);
  }
  for (const id of ingredientsByRecipe.keys()) {
    if (!seenIds.has(id) && !byId.has(id)) errors.push(`Składniki receptur: nieznana receptura „${id}”`);
  }

  return {
    recipes: nextRecipes,
    ingredients: { changed: changedIngredients, added: addedIngredients },
    langChanges,
    changes,
    errors,
    warnings
  };
}
