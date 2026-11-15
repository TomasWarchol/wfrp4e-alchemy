/**
 * Składniki alchemiczne jako osobny rodzaj przedmiotu (jak księgi zaklęć w Grimoires):
 *  - przedmiot pozostaje zwykłym „trapping” systemu z flagą `isIngredient` (bez modułu to zwykły przedmiot),
 *  - własny dział „Składniki alchemiczne” w ekwipunku (hook systemu wfrp4e:constructInventory),
 *  - pozycja „Składnik alchemiczny” w oknie tworzenia przedmiotu,
 *  - przycisk „Zamień w składnik alchemiczny” w nagłówku arkusza przedmiotu.
 */
import { MODULE_ID } from './config.js';
import { ALCHEMY_INGREDIENTS } from './data/ingredients.js';
import { CompendiumEngine } from './logic/compendium-engine.js';

export const INGREDIENT_SECTION = 'alchemyIngredients';
const CREATE_MARKER = 'newIngredient';

const loc = (key) => game.i18n.localize(`GOLD_ALCHEMY.Inventory.${key}`);

/** Czy przedmiot jest składnikiem alchemicznym modułu. */
export function isIngredient(item) {
  return item?.type === 'trapping' && Boolean(item.flags?.[MODULE_ID]?.isIngredient);
}

/** Klucz składnika z bazy modułu pasujący do nazwy przedmiotu (w języku świata albo po kluczu); null, gdy brak. */
export function ingredientKeyForName(name) {
  const wanted = String(name ?? '').trim().toLowerCase();
  if (!wanted) return null;
  const found = ALCHEMY_INGREDIENTS.find((ing) => ing.key.toLowerCase() === wanted
    || game.i18n.localize(ing.name).trim().toLowerCase() === wanted);
  return found?.key ?? null;
}

/** Dane flag i typu systemowego składnika (bez nazwy). */
function ingredientData(name) {
  const key = ingredientKeyForName(name);
  const base = key ? ALCHEMY_INGREDIENTS.find((ing) => ing.key === key) : null;
  return {
    'system.trappingType.value': 'ingredient',
    [`flags.${MODULE_ID}.isIngredient`]: true,
    [`flags.${MODULE_ID}.ingredientKey`]: key,
    [`flags.${MODULE_ID}.category`]: base?.category ?? null
  };
}

/** Zamienia zwykły przedmiot w składnik alchemiczny. */
export async function makeIngredient(item) {
  await item.update(ingredientData(item.name));
  ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Inventory.Made', { name: item.name }));
}

/** Przesuwa składniki z działów systemu do własnego działu, zaraz za systemowym „Składnikiem”. */
function buildSection(categories, collapsed) {
  const items = [];
  for (const category of Object.values(categories)) {
    if (!Array.isArray(category?.items) || category.dataType !== 'trapping') continue;
    const keep = [];
    for (const item of category.items) (isIngredient(item) ? items : keep).push(item);
    category.items = keep;
  }
  const section = {
    label: loc('Section'),
    items,
    show: false,
    collapsed: collapsed?.[INGREDIENT_SECTION],
    dataType: 'trapping'
  };
  // Kolejność działów to kolejność kluczy obiektu: wstawiamy dział po systemowym „Składniku”
  const entries = Object.entries(categories);
  for (const key of Object.keys(categories)) delete categories[key];
  let placed = false;
  for (const [key, value] of entries) {
    categories[key] = value;
    if (key === 'ingredient') {
      categories[INGREDIENT_SECTION] = section;
      placed = true;
    }
  }
  if (!placed) categories[INGREDIENT_SECTION] = section;
}

/** „+” w dziale otwiera kompendium składników, skąd można je przeciągnąć. */
function decorateSheet(element) {
  const add = element?.querySelector(`.sheet-list.inventory.${INGREDIENT_SECTION} [data-action='createItem']`);
  if (!add) return;
  add.removeAttribute('data-action');
  add.dataset.tooltip = loc('OpenCompendium');
  add.addEventListener('click', (ev) => {
    ev.preventDefault();
    CompendiumEngine.openIngredientsCompendium();
  });
}

/** Pozycja „Składnik alchemiczny” w oknie tworzenia przedmiotu (typ „trapping” z ukrytym znacznikiem). */
function addToCreateDialog(element) {
  const select = element.querySelector('select[name="type"]');
  if (!select?.querySelector('option[value="trapping"]') || !select.querySelector('option[value="spell"]')) return;
  if (select.querySelector('option[data-alchemy-ingredient]')) return;
  const label = loc('CreateType');
  const option = new Option(label, 'trapping');
  option.dataset.alchemyIngredient = 'true';
  select.insertBefore(option, [...select.options].find((o) => o.label.localeCompare(label, game.i18n.lang) > 0) ?? null);

  const marker = document.createElement('input');
  Object.assign(marker, { type: 'hidden', name: `flags.${MODULE_ID}.${CREATE_MARKER}`, value: 'true', disabled: true });
  select.after(marker);
  select.addEventListener('change', () => {
    const chosen = Boolean(select.selectedOptions[0]?.dataset.alchemyIngredient);
    marker.disabled = !chosen;
    if (chosen) element.querySelector('[name="name"]')?.setAttribute('placeholder', loc('NewIngredient'));
  });
}

export function registerInventory() {
  Hooks.on('wfrp4e:constructInventory', (_sheet, categories, collapsed) => buildSection(categories, collapsed));
  Hooks.on('renderActorSheetV2', (_app, element) => decorateSheet(element));
  Hooks.on('renderDialogV2', (_app, element) => addToCreateDialog(element));

  Hooks.on('preCreateItem', (item) => {
    if (!item.flags?.[MODULE_ID]?.[CREATE_MARKER]) return;
    const unnamed = item.name === item.constructor.defaultName({ type: 'trapping', parent: item.parent, pack: item.pack });
    const name = unnamed ? loc('NewIngredient') : item.name;
    const data = foundry.utils.expandObject(ingredientData(name));
    const base = ALCHEMY_INGREDIENTS.find((ing) => ing.key === data.flags[MODULE_ID].ingredientKey);
    data.flags[MODULE_ID][`-=${CREATE_MARKER}`] = null;
    item.updateSource({
      ...data,
      name,
      img: base?.img ?? 'icons/consumables/potions/bottle-round-corked-yellow.webp'
    });
  });

  // Nagłówek arkusza przedmiotu: zamiana zwykłego przedmiotu w składnik
  Hooks.on('getHeaderControlsDocumentSheetV2', (app, controls) => {
    const item = app.document;
    if (!(item instanceof Item) || item.type !== 'trapping' || !item.isOwner || isIngredient(item)) return;
    if (item.flags?.['wfrp4e-grimoires']?.grimoire) return;
    const action = `${MODULE_ID}-make-ingredient`;
    app.options.actions[action] ??= () => makeIngredient(item);
    controls.unshift({ action, icon: 'fa-solid fa-mortar-pestle', label: loc('Make') });
  });
}
