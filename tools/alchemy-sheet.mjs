#!/usr/bin/env node
/**
 * Arkusz Excela z miksturami i składnikami modułu.
 *
 *   npm run sheet:export              – zapisuje docs/alchemia.xlsx z aktualnych danych modułu
 *   npm run sheet:import -- --dry-run – pokazuje, co zmieni arkusz, niczego nie zapisując
 *   npm run sheet:import              – przenosi zmiany z arkusza do recipes.js, ingredients.js i lang/*.json
 *
 * Opcjonalnie ścieżka pliku: npm run sheet:export -- moj-plik.xlsx
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ExcelJS from 'exceljs';
import {
  INGREDIENT_COLUMNS, LISTS, RECIPE_COLUMNS, RECIPE_INGREDIENT_COLUMNS, SOURCES,
  applyRows, buildRows, setIngredientCategories
} from './sheet/model.mjs';
import { setStrings } from './sheet/json-text.mjs';
import { appendIngredient, setIngredientProps } from './sheet/ingredients-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = {
  recipes: path.join(ROOT, 'scripts/data/recipes.js'),
  ingredients: path.join(ROOT, 'scripts/data/ingredients.js'),
  pl: path.join(ROOT, 'lang/pl.json'),
  en: path.join(ROOT, 'lang/en.json')
};
const DEFAULT_SHEET = path.join(ROOT, 'docs/alchemia.xlsx');

const SHEETS = {
  recipes: 'Mikstury',
  recipeIngredients: 'Składniki receptur',
  ingredients: 'Składniki',
  lists: 'Listy',
  help: 'Instrukcja'
};

const COLORS = {
  editable: 'FFD9EAD3',
  readonly: 'FFE7E6E6',
  key: 'FFDDEBF7',
  official: 'FFFCE4D6',
  own: 'FFE2EFDA'
};

/** Dane modułu. Rejestr receptur importujemy z atrapą Foundry, żeby wyliczenia były te same co w grze. */
async function loadData() {
  const any = new Proxy(function stub() {}, {
    get: (_t, key) => (key === Symbol.toPrimitive ? () => '' : any),
    apply: () => any,
    construct: () => any
  });
  globalThis.foundry ??= any;
  globalThis.Hooks ??= any;
  const { ALCHEMY_RECIPES } = await import('../scripts/data/recipes.js');
  const { ALCHEMY_INGREDIENTS } = await import('../scripts/data/ingredients.js');
  const { RecipeRegistry } = await import('../scripts/logic/recipe-registry.js');
  const lang = {
    pl: JSON.parse(await readFile(FILES.pl, 'utf8')),
    en: JSON.parse(await readFile(FILES.en, 'utf8'))
  };
  return {
    recipes: ALCHEMY_RECIPES,
    ingredients: ALCHEMY_INGREDIENTS,
    lang,
    normalize: (recipe) => RecipeRegistry.normalizeRecipe(recipe)
  };
}

const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const columnLetter = (n) => {
  let s = '';
  for (let x = n; x > 0; x = Math.floor((x - 1) / 26)) s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
  return s;
};
const editable = (col) => Boolean(col.prop || col.lang || col.duration || col.price || col.list === 'ingredientKey' || col.id === 'quantity' || col.key);

/** Arkusz z nagłówkiem, kolorami kolumn, filtrem i listami wyboru. */
function addTable(workbook, name, columns, rows, { freezeColumns = 1, listRanges, extraRows = 300 }) {
  const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', xSplit: freezeColumns, ySplit: 1 }] });
  sheet.columns = columns.map((col) => ({ header: col.header, key: col.id, width: col.width }));
  for (const row of rows) sheet.addRow(row);

  const header = sheet.getRow(1);
  header.height = 45;
  columns.forEach((col, index) => {
    const cell = header.getCell(index + 1);
    cell.font = { bold: true };
    cell.alignment = { wrapText: true, vertical: 'middle' };
    cell.fill = fill(col.key ? COLORS.key : editable(col) ? COLORS.editable : COLORS.readonly);
    cell.note = col.key ? 'Identyfikator – nie zmieniaj w istniejących wierszach. Nowy wiersz = nowy wpis.'
      : editable(col) ? 'Edytowalne – import przeniesie zmianę do modułu.'
        : 'Tylko do odczytu – wyliczane przez moduł, import pomija tę kolumnę.';
  });

  const last = rows.length + 1;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    columns.forEach((col, index) => {
      const cell = row.getCell(index + 1);
      cell.alignment = { vertical: 'top', wrapText: Boolean(col.wrap) };
      if (!editable(col)) cell.font = { color: { argb: 'FF7F7F7F' } };
      if (col.id === 'origin') {
        cell.fill = fill(String(cell.value).startsWith('Oficjalne') ? COLORS.official : COLORS.own);
        cell.font = { bold: true };
      }
    });
  });

  columns.forEach((col, index) => {
    if (!col.list) return;
    const letter = columnLetter(index + 1);
    for (let r = 2; r <= last + extraRows; r++) {
      sheet.getCell(`${letter}${r}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [listRanges[col.list]],
        showErrorMessage: true,
        errorTitle: 'Niedozwolona wartość',
        error: 'Wybierz wartość z listy.'
      };
    }
  });
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: last, column: columns.length } };
  return sheet;
}

function addLists(workbook, ingredients) {
  setIngredientCategories(ingredients);
  const lists = { ...LISTS, ingredientKey: ingredients.map((ing) => ing.key) };
  const sheet = workbook.addWorksheet(SHEETS.lists);
  const ranges = {};
  Object.entries(lists).forEach(([name, values], index) => {
    const letter = columnLetter(index + 1);
    sheet.getCell(`${letter}1`).value = name;
    sheet.getCell(`${letter}1`).font = { bold: true };
    values.forEach((value, i) => { sheet.getCell(`${letter}${i + 2}`).value = value; });
    sheet.getColumn(index + 1).width = 22;
    ranges[name] = `'${SHEETS.lists}'!$${letter}$2:$${letter}$${values.length + 1}`;
  });
  sheet.state = 'hidden';
  return ranges;
}

function addHelp(workbook, counts) {
  const sheet = workbook.addWorksheet(SHEETS.help);
  sheet.getColumn(1).width = 120;
  const lines = [
    ['Arkusz mikstur i składników – WFRP4e Old World Alchemy', { bold: true, size: 14 }],
    [`Wygenerowano: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}. Receptur: ${counts.recipes} (autorskich ${counts.own}, oficjalnych ${counts.official}), składników: ${counts.ingredients}.`],
    [''],
    ['Kolory nagłówków', { bold: true }],
    ['Zielony – kolumna edytowalna: import przeniesie zmianę do modułu.', { fill: COLORS.editable }],
    ['Szary – tylko do odczytu: wartość wylicza moduł (np. cena i czas w grze), import ją pomija.', { fill: COLORS.readonly }],
    ['Niebieski – identyfikator (ID, Klucz): nie zmieniaj w istniejących wierszach.', { fill: COLORS.key }],
    [''],
    ['Pochodzenie', { bold: true }],
    ['Autorskie – treść tego modułu, dostępna zawsze.', { fill: COLORS.own }],
    ['Oficjalne – treść z podręcznika: pokazuje się w grze tylko przy włączonym oficjalnym module Foundry tego podręcznika.', { fill: COLORS.official }],
    ['Oficjalne (tylko z receptur) – składnik bez własnego oznaczenia, ale używany wyłącznie przez oficjalne receptury: znika razem z nimi.', { fill: COLORS.official }],
    ['Pochodzenie wynika z kolumny „Moduł źródłowy”: puste = autorskie. Nie oznaczaj treści oficjalnej jako autorskiej.'],
    [`Moduły źródłowe: ${Object.entries(SOURCES).map(([id, title]) => `${id} = ${title}`).join('; ')}.`],
    [''],
    ['Jak wprowadzać zmiany', { bold: true }],
    ['1. Edytuj zielone kolumny. Teksty (nazwa, opis, efekt) muszą mieć wersję PL i EN.'],
    ['2. Składniki receptury zmieniasz w arkuszu „Składniki receptur”: jeden wiersz = jeden składnik (ID receptury, klucz składnika z listy, ilość).'],
    ['3. Nowa receptura: nowy wiersz w „Mikstury” z nowym ID (np. potion-moja-mikstura) i Kluczem (np. MojaMikstura, same litery) oraz jej składniki w „Składniki receptur”.'],
    ['   Nowa receptura dostaje opis i parametry warzenia, ale bez efektu w grze – mechanikę trzeba dopisać w kodzie.'],
    ['4. Nowy składnik: nowy wiersz w „Składniki” z nowym Kluczem.'],
    ['5. Usuwanie wierszy niczego nie usuwa z modułu (import tylko ostrzeże) – usuwanie robimy ręcznie w kodzie.'],
    ['6. Zapisz plik i uruchom w folderze modułu: npm run sheet:import -- --dry-run (podgląd zmian), potem npm run sheet:import (zapis).'],
    ['   Import sprawdza wartości (listy, liczby, oba języki) i przy błędach niczego nie zapisuje.'],
    ['7. Po imporcie: npm test, potem npm run sheet:export, żeby arkusz odzwierciedlał aktualny stan.'],
    [''],
    ['Kolumny wybranych pól', { bold: true }],
    ['Kategoria: magical (magia ogólna), college-* (Kolegium), mundane (alchemia), apothecary (aptekarstwo), herbal (zielarstwo), forbidden (zakazane). Tor magiczny/świecki wynika z kategorii.'],
    ['Niestabilność: minor, moderate, major, extreme – wpływa na trudność i czas warzenia magicznego.'],
    ['„(ręcznie)” – wartość nadpisująca wyliczenie modułu; puste = moduł liczy sam (kolumna „w grze” pokazuje wynik).'],
    ['Czas działania: tylko dla receptur z efektem trwałym (kości + jednostka, opcjonalnie minus BWt pijącego).'],
    ['Efekt natychmiastowy i skrypt efektu to kod modułu – arkusz je pokazuje, ale nie zmienia.']
  ];
  lines.forEach(([text, style = {}], index) => {
    const cell = sheet.getCell(`A${index + 1}`);
    cell.value = text;
    cell.alignment = { wrapText: true };
    if (style.bold || style.size) cell.font = { bold: Boolean(style.bold), size: style.size };
    if (style.fill) cell.fill = fill(style.fill);
  });
}

async function exportSheet(file) {
  const data = await loadData();
  const { recipeRows, ingredientRows, ingredientsSheet } = buildRows(data);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'wfrp4e-alchemy';
  const official = recipeRows.filter((r) => r.origin === 'Oficjalne').length;
  addHelp(workbook, { recipes: recipeRows.length, own: recipeRows.length - official, official, ingredients: ingredientsSheet.length });
  const listRanges = addLists(workbook, data.ingredients);
  addTable(workbook, SHEETS.recipes, RECIPE_COLUMNS, recipeRows, { freezeColumns: 3, listRanges });
  addTable(workbook, SHEETS.recipeIngredients, RECIPE_INGREDIENT_COLUMNS, ingredientRows, { freezeColumns: 2, listRanges, extraRows: 500 });
  addTable(workbook, SHEETS.ingredients, INGREDIENT_COLUMNS, ingredientsSheet, { freezeColumns: 2, listRanges });
  // Kolejność zakładek: Instrukcja, (ukryte Listy), Mikstury, Składniki receptur, Składniki – po otwarciu aktywne Mikstury
  workbook.views = [{ activeTab: 2 }];
  await workbook.xlsx.writeFile(file);
  console.log(`Zapisano ${path.relative(process.cwd(), file)}: ${recipeRows.length} receptur (${official} oficjalnych), ${ingredientsSheet.length} składników.`);
}

/** Wartość komórki jako zwykła wartość (tekst bogaty, formuła, hiperłącze). */
function plain(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return value.toISOString();
  if (value.richText) return value.richText.map((part) => part.text).join('');
  if ('result' in value) return plain(value.result);
  if ('text' in value) return plain(value.text);
  return String(value);
}

function readTable(workbook, name, columns) {
  const sheet = workbook.getWorksheet(name);
  if (!sheet) throw new Error(`Brak arkusza „${name}” w pliku.`);
  const headers = {};
  sheet.getRow(1).eachCell((cell, index) => { headers[String(plain(cell.value)).trim()] = index; });
  const missing = columns.filter((col) => !headers[col.header]);
  if (missing.length) throw new Error(`Arkusz „${name}”: brak kolumn ${missing.map((c) => `„${c.header}”`).join(', ')}. Nie zmieniaj nagłówków.`);
  const rows = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const values = Object.fromEntries(columns.map((col) => [col.id, plain(row.getCell(headers[col.header]).value)]));
    rows.push(values);
  }
  // Puste wiersze na końcu (z listami wyboru) nie są błędem
  while (rows.length && Object.values(rows.at(-1)).every((v) => String(v).trim() === '')) rows.pop();
  return rows;
}

async function importSheet(file, { dryRun }) {
  const data = await loadData();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const result = applyRows(data, {
    recipeRows: readTable(workbook, SHEETS.recipes, RECIPE_COLUMNS),
    ingredientRows: readTable(workbook, SHEETS.recipeIngredients, RECIPE_INGREDIENT_COLUMNS),
    ingredientsSheet: readTable(workbook, SHEETS.ingredients, INGREDIENT_COLUMNS)
  });

  for (const warning of result.warnings) console.log(`Uwaga: ${warning}`);
  if (result.errors.length) {
    console.error(`\nBłędy (${result.errors.length}) – nic nie zapisano:`);
    for (const error of result.errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }
  if (!result.changes.length) {
    console.log('Brak zmian – arkusz zgadza się z modułem.');
    return;
  }
  console.log(`\nZmiany (${result.changes.length}):`);
  for (const change of result.changes) console.log(`  - ${change}`);
  if (dryRun) {
    console.log('\nPodgląd (--dry-run): nic nie zapisano.');
    return;
  }

  const recipesChanged = result.recipes.length !== data.recipes.length || result.recipes.some((r, i) => r !== data.recipes[i]);
  if (recipesChanged) {
    const text = await readFile(FILES.recipes, 'utf8');
    const marker = 'export const ALCHEMY_RECIPES = ';
    const head = text.slice(0, text.indexOf(marker));
    await writeFile(FILES.recipes, `${head}${marker}${JSON.stringify(result.recipes, null, 2)};\n`);
  }
  if (result.ingredients.changed.size || result.ingredients.added.length) {
    let text = await readFile(FILES.ingredients, 'utf8');
    const original = new Map(data.ingredients.map((ing) => [ing.key, ing]));
    for (const [key, next] of result.ingredients.changed) {
      const old = original.get(key);
      const props = {};
      for (const prop of new Set([...Object.keys(old), ...Object.keys(next)])) {
        if (JSON.stringify(old[prop]) !== JSON.stringify(next[prop])) props[prop] = next[prop];
      }
      text = setIngredientProps(text, key, props);
    }
    for (const ing of result.ingredients.added) text = appendIngredient(text, ing);
    await writeFile(FILES.ingredients, text);
  }
  for (const code of ['pl', 'en']) {
    if (!Object.keys(result.langChanges[code]).length) continue;
    const text = await readFile(FILES[code], 'utf8');
    await writeFile(FILES[code], setStrings(text, result.langChanges[code]));
  }
  console.log('\nZapisano zmiany w module. Uruchom npm test i npm run sheet:export.');
}

const [command, ...args] = process.argv.slice(2);
const file = path.resolve(args.find((a) => !a.startsWith('--')) ?? DEFAULT_SHEET);
try {
  if (command === 'export') await exportSheet(file);
  else if (command === 'import') await importSheet(file, { dryRun: args.includes('--dry-run') });
  else {
    console.log('Użycie: node tools/alchemy-sheet.mjs export|import [--dry-run] [plik.xlsx]');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.code === 'EBUSY' ? `Plik ${file} jest otwarty w Excelu – zamknij go i spróbuj ponownie.` : error.message);
  process.exitCode = 1;
}
