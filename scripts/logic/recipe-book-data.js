/**
 * Księgi i zwoje receptur w modelu silnika ksiąg (moduł wfrp4e-grimoires).
 * Receptura to wpis typu "recipe"; księga trzyma identyfikator receptury i migawkę nazwy,
 * żeby wpis dało się pokazać także wtedy, gdy receptury chwilowo nie ma w świecie.
 */
import {
  FLAG_SCOPE, FORM_BOOK, FORM_SCROLL, GRIMOIRE_FLAG, emptyBook, languageKey, readBook, writeBook
} from '../../../wfrp4e-grimoires/scripts/public.mjs';
import { MODULE_ID } from '../config.js';

export const RECIPE_TYPE = 'recipe';

const NO_LANGUAGE = 'reikspiel';
const COVER = '#2f5d50';

/** Wpis receptury. @param {object|null} recipe  dane z rejestru (migawka nazwy i obrazka) */
export function recipeEntry(recipeId, recipe = null) {
  return {
    id: foundry.utils.randomID(),
    type: RECIPE_TYPE,
    sourceUuid: null,
    data: { recipeId, name: recipe?.name ?? recipeId, img: recipe?.img ?? null }
  };
}

/** Warunki jak w dotychczasowych księgach alchemicznych: język opcjonalny, bez wymogu Czytania/Pisania. */
function alchemyBook(form, { entries, language = '', carried = false }) {
  return {
    ...emptyBook(form),
    cover: COVER,
    language: language ? languageKey(language) : NO_LANGUAGE,
    requirements: { readWrite: false, language: Boolean(language), lore: false, carried },
    entries
  };
}

/** Flagi silnika dla gotowej księgi receptur. */
export function recipeBookFlags(entries, options = {}) {
  return { [FLAG_SCOPE]: { [GRIMOIRE_FLAG]: alchemyBook(FORM_BOOK, { ...options, entries }) } };
}

/** Flagi silnika dla zwoju z jedną recepturą. */
export function recipeScrollFlags(entry) {
  return { [FLAG_SCOPE]: { [GRIMOIRE_FLAG]: alchemyBook(FORM_SCROLL, { entries: [entry] }) } };
}

/**
 * Aktualizacja przedmiotu zapisanego w starym formacie alchemii (przed 1.6) albo `null`.
 * @param {object} item  dokument lub jego dane
 * @param {{carried: boolean, resolve: (id: string) => object|null}} options
 */
export function legacyBookUpdate(item, { carried, resolve }) {
  const flags = item.flags?.[MODULE_ID];
  if (!flags) return null;

  const existing = readBook(item);
  const recipeIds = Array.isArray(flags.recipes) ? flags.recipes : [];
  const toEntry = id => recipeEntry(resolve(id)?.id ?? id, resolve(id));
  const legacyKeys = {
    [`flags.${MODULE_ID}.-=recipes`]: null,
    [`flags.${MODULE_ID}.-=requiredLanguage`]: null,
    'system.trappingType.value': 'booksAndDocuments'
  };

  // Księga zaklęć, do której dopisano też receptury
  if (existing && recipeIds.length) {
    return { ...writeBook({ ...existing, entries: [...existing.entries, ...recipeIds.map(toEntry)] }), ...legacyKeys };
  }
  if (existing) return null;

  if (flags.isRecipe && flags.recipeId) {
    return { ...writeBook(alchemyBook(FORM_SCROLL, { entries: [toEntry(flags.recipeId)] })), ...legacyKeys };
  }
  if (flags.isRecipeBook || recipeIds.length) {
    const book = alchemyBook(FORM_BOOK, { entries: recipeIds.map(toEntry), language: flags.requiredLanguage || '', carried });
    return { ...writeBook(book), ...legacyKeys };
  }
  return null;
}
