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
import { BrewingEngine } from './logic/brewing-engine.js';
import { isLaboratoryItem, readLaboratory } from './logic/laboratories.js';

export const INGREDIENT_SECTION = 'alchemyIngredients';
export const LABORATORY_SECTION = 'alchemyLaboratories';
const CREATE_MARKER = 'newIngredient';
const CREATE_LAB_MARKER = 'newLaboratory';

const loc = (key) => game.i18n.localize(`GOLD_ALCHEMY.Inventory.${key}`);
const labLoc = (key) => game.i18n.localize(`GOLD_ALCHEMY.LabItem.${key}`);

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

/** Dane flag i typu systemowego laboratorium alchemicznego. */
function laboratoryData(slMod = 0, cauldrons = 1) {
  return {
    'system.trappingType.value': 'toolsAndKits',
    [`flags.${MODULE_ID}.isLaboratory`]: true,
    [`flags.${MODULE_ID}.laboratory`]: {
      slMod: Math.max(-5, Math.min(10, Math.trunc(Number(slMod) || 0))),
      cauldrons: Math.max(1, Math.min(20, Math.trunc(Number(cauldrons) || 1)))
    }
  };
}

/** Zamienia zwykły przedmiot w laboratorium / aparaturę alchemiczną. */
export async function makeLaboratory(item) {
  await item.update(laboratoryData(0, 1));
  ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.LabItem.Made', { name: item.name }));
}

/** Przesuwa składniki i laboratoria z działów systemu do własnych działów, zaraz za systemowym „Składnikiem”. */
function buildSection(categories, collapsed) {
  const ingredients = [];
  const laboratories = [];
  for (const category of Object.values(categories)) {
    if (!Array.isArray(category?.items) || category.dataType !== 'trapping') continue;
    const keep = [];
    for (const item of category.items) {
      if (isIngredient(item)) ingredients.push(item);
      else if (isLaboratoryItem(item)) laboratories.push(item);
      else keep.push(item);
    }
    category.items = keep;
  }
  const ingSection = {
    label: loc('Section'),
    items: ingredients,
    show: false,
    collapsed: collapsed?.[INGREDIENT_SECTION],
    dataType: 'trapping'
  };
  const labSection = {
    label: labLoc('Section'),
    items: laboratories,
    show: false,
    collapsed: collapsed?.[LABORATORY_SECTION],
    dataType: 'trapping'
  };
  // Kolejność działów to kolejność kluczy obiektu: wstawiamy działy po systemowym „Składniku”
  const entries = Object.entries(categories);
  for (const key of Object.keys(categories)) delete categories[key];
  let placed = false;
  for (const [key, value] of entries) {
    categories[key] = value;
    if (key === 'ingredient') {
      categories[INGREDIENT_SECTION] = ingSection;
      categories[LABORATORY_SECTION] = labSection;
      placed = true;
    }
  }
  if (!placed) {
    categories[INGREDIENT_SECTION] = ingSection;
    categories[LABORATORY_SECTION] = labSection;
  }
}

/** „+” w działach składników i laboratoriów otwiera kompendium, skąd można je przeciągnąć. */
function decorateSheet(element) {
  for (const sec of [INGREDIENT_SECTION, LABORATORY_SECTION]) {
    const add = element?.querySelector(`.sheet-list.inventory.${sec} [data-action='createItem']`);
    if (!add) continue;
    add.removeAttribute('data-action');
    add.dataset.tooltip = loc('OpenCompendium');
    add.addEventListener('click', (ev) => {
      ev.preventDefault();
      CompendiumEngine.openIngredientsCompendium();
    });
  }
}

/** Pozycje „Składnik alchemiczny” i „Aparatura alchemiczna” w oknie tworzenia przedmiotu. */
function addToCreateDialog(element) {
  const select = element.querySelector('select[name="type"]');
  if (!select?.querySelector('option[value="trapping"]') || !select.querySelector('option[value="spell"]')) return;
  if (select.querySelector('option[data-alchemy-ingredient]')) return;

  const insertSorted = (label, dataKey) => {
    const option = new Option(label, 'trapping');
    option.dataset[dataKey] = 'true';
    select.insertBefore(option, [...select.options].find((o) => o.label.localeCompare(label, game.i18n.lang) > 0) ?? null);
  };
  insertSorted(loc('CreateType'), 'alchemyIngredient');
  insertSorted(labLoc('CreateType'), 'alchemyLab');

  const ingMarker = document.createElement('input');
  Object.assign(ingMarker, { type: 'hidden', name: `flags.${MODULE_ID}.${CREATE_MARKER}`, value: 'true', disabled: true });
  const labMarker = document.createElement('input');
  Object.assign(labMarker, { type: 'hidden', name: `flags.${MODULE_ID}.${CREATE_LAB_MARKER}`, value: 'true', disabled: true });
  select.after(ingMarker, labMarker);

  select.addEventListener('change', () => {
    const opt = select.selectedOptions[0];
    const isIng = Boolean(opt?.dataset.alchemyIngredient);
    const isLab = Boolean(opt?.dataset.alchemyLab);
    ingMarker.disabled = !isIng;
    labMarker.disabled = !isLab;
    const nameInput = element.querySelector('[name="name"]');
    if (isIng && nameInput) nameInput.setAttribute('placeholder', loc('NewIngredient'));
    else if (isLab && nameInput) nameInput.setAttribute('placeholder', labLoc('NewName'));
  });
}

/** Wstrzykuje pola poziomu (+PS) i pojemności (kotły) do arkusza przedmiotu będącego laboratorium. */
function renderLaboratoryFields(app, element) {
  const item = app.document;
  if (!(item instanceof Item) || !isLaboratoryItem(item)) return;
  element.querySelectorAll('.al-lab-sheet-fields').forEach((node) => node.remove());

  const lab = readLaboratory(item);
  const editable = Boolean(item.isOwner && (game.user?.isGM || !BrewingEngine.labByGM()));
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'al-lab-sheet-fields';
  fieldset.innerHTML = `
    <legend><i class="fa-solid fa-flask-vial"></i> ${foundry.utils.escapeHTML(labLoc('SheetTitle'))}</legend>
    <div class="al-lab-row">
      <label class="al-lab-label">${foundry.utils.escapeHTML(labLoc('SLMod'))}</label>
      <input class="al-lab-input" type="number" step="1" min="-5" max="10" name="flags.${MODULE_ID}.laboratory.slMod" value="${lab.slMod}" ${editable ? '' : 'disabled'} />
    </div>
    <div class="al-lab-row">
      <label class="al-lab-label">${foundry.utils.escapeHTML(labLoc('Cauldrons'))}</label>
      <input class="al-lab-input" type="number" step="1" min="1" max="20" name="flags.${MODULE_ID}.laboratory.cauldrons" value="${lab.unitCauldrons}" ${editable ? '' : 'disabled'} />
    </div>
    <p class="hint">${foundry.utils.escapeHTML(labLoc('SheetHint'))}</p>
  `;

  if (editable) {
    const slInput = fieldset.querySelector(`[name="flags.${MODULE_ID}.laboratory.slMod"]`);
    const cauldronsInput = fieldset.querySelector(`[name="flags.${MODULE_ID}.laboratory.cauldrons"]`);
    const saveFields = async () => {
      const nextSl = Math.max(-5, Math.min(10, Math.trunc(Number(slInput.value) || 0)));
      const nextCauldrons = Math.max(1, Math.min(20, Math.trunc(Number(cauldronsInput.value) || 1)));
      slInput.value = String(nextSl);
      cauldronsInput.value = String(nextCauldrons);
      await item.update({
        [`flags.${MODULE_ID}.laboratory.slMod`]: nextSl,
        [`flags.${MODULE_ID}.laboratory.cauldrons`]: nextCauldrons
      });
    };
    slInput?.addEventListener('change', saveFields);
    cauldronsInput?.addEventListener('change', saveFields);
  }

  const host = element.querySelector('.tab[data-tab="details"]')
    || element.querySelector('.tab.details')
    || element.querySelector('.tab[data-tab="description"]')
    || element.querySelector('.window-content')
    || element;
  if (host) host.appendChild(fieldset);
}

export function registerInventory() {
  Hooks.on('wfrp4e:constructInventory', (_sheet, categories, collapsed) => buildSection(categories, collapsed));
  Hooks.on('renderActorSheetV2', (_app, element) => decorateSheet(element));
  Hooks.on('renderDialogV2', (_app, element) => addToCreateDialog(element));
  Hooks.on('renderItemSheetV2', (app, element) => renderLaboratoryFields(app, element));

  Hooks.on('preCreateItem', (item) => {
    if (item.flags?.[MODULE_ID]?.[CREATE_MARKER]) {
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
      return;
    }
    if (item.flags?.[MODULE_ID]?.[CREATE_LAB_MARKER]) {
      const unnamed = item.name === item.constructor.defaultName({ type: 'trapping', parent: item.parent, pack: item.pack });
      const name = unnamed ? labLoc('NewName') : item.name;
      const data = foundry.utils.expandObject(laboratoryData(0, 1));
      data.flags[MODULE_ID][`-=${CREATE_LAB_MARKER}`] = null;
      item.updateSource({
        ...data,
        name,
        img: 'icons/consumables/potions/potion-flask-capped-yellow-green.webp'
      });
    }
  });

  // Nagłówek arkusza przedmiotu: zamiana zwykłego przedmiotu w składnik lub aparaturę alchemiczną
  Hooks.on('getHeaderControlsDocumentSheetV2', (app, controls) => {
    const item = app.document;
    if (!(item instanceof Item) || item.type !== 'trapping' || !item.isOwner || isIngredient(item) || isLaboratoryItem(item)) return;
    if (item.flags?.['wfrp4e-grimoires']?.grimoire) return;
    const ingAction = `${MODULE_ID}-make-ingredient`;
    app.options.actions[ingAction] ??= () => makeIngredient(item);
    controls.unshift({ action: ingAction, icon: 'fa-solid fa-mortar-pestle', label: loc('Make') });
    const labAction = `${MODULE_ID}-make-laboratory`;
    app.options.actions[labAction] ??= () => makeLaboratory(item);
    controls.unshift({ action: labAction, icon: 'fa-solid fa-flask-vial', label: labLoc('Make') });
  });
}
