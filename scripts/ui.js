/**
 * Wygląd „Pracownia Alchemika”: przełącznik wyglądu Warsztatu, ikony ze sprite'a modułu
 * i sigile wiatrów ze sprite'a Grimoires (wspólne dla serii: ten sam znak każdego wiatru).
 */
import { MODULE_ID } from './config.js';

export const STYLE_WORKBENCH = 'workbench';
export const STYLE_CLASSIC = 'classic';

/** Wiatr Kolegium → sigil szkoły magii w sprite'cie Grimoires. */
export const WIND_LORE = {
  aqshy: 'fire', azyr: 'heavens', chamon: 'metal', ghyran: 'life',
  ghur: 'beasts', hysh: 'light', shyish: 'death', ulgu: 'shadow'
};

/** Tradycja warzenia receptury: kolegia (magia), alchemia, apteka, zielarstwo albo zakazane. */
export function recipeTradition(recipe) {
  const category = recipe?.category || '';
  if (category === 'herbal') return 'herbal';
  if (category === 'apothecary') return 'apothecary';
  if (category === 'mundane') return 'alchemy';
  if (category === 'forbidden') return 'forbidden';
  return 'colleges';
}

/** Wiatr receptury magicznej („aqshy”…) albo null dla receptur ogólnych i niemagicznych. */
export function recipeWind(recipe) {
  const category = recipe?.category || '';
  if (category === 'chamon') return 'chamon';
  return category.startsWith('college-') ? category.slice('college-'.length) : null;
}

/** Czy klient używa wyglądu pracowni (domyślnie tak). */
export function useWorkbench() {
  try {
    return game.settings.get(MODULE_ID, 'workshopStyle') !== STYLE_CLASSIC;
  } catch {
    return true;
  }
}

const route = (path) => foundry.utils.getRoute(path);

/** Znacznik `<svg><use>` dla symbolu ze sprite'a modułu (`ui-*`, `craft-*`, `orn-*`, `ves-*`). */
export function iconMarkup(id, cls = '') {
  const safeId = String(id).replace(/[^\w-]/g, '');
  const safeCls = String(cls).replace(/[^\w\s-]/g, '');
  return `<svg class="al-icon${safeCls ? ` ${safeCls}` : ''}" aria-hidden="true" focusable="false"><use href="${route(`modules/${MODULE_ID}/assets/ui/sprite.svg`)}#${safeId}"></use></svg>`;
}

/** Sigil wiatru ze sprite'a Grimoires; dla receptur ogólnych sigil magii bez szkoły. */
export function windMarkup(wind, cls = '') {
  const lore = WIND_LORE[wind] ?? 'arcane';
  const safeCls = String(cls).replace(/[^\w\s-]/g, '');
  return `<svg class="al-icon${safeCls ? ` ${safeCls}` : ''}" aria-hidden="true" focusable="false"><use href="${route('modules/wfrp4e-grimoires/assets/ui/sprite.svg')}#lore-${lore}"></use></svg>`;
}

/** Ustawienie klienta i pomocniki szablonów – wołać w "init". */
export function registerUi() {
  game.settings.register(MODULE_ID, 'workshopStyle', {
    name: 'GOLD_ALCHEMY.Settings.WorkshopStyle',
    hint: 'GOLD_ALCHEMY.Settings.WorkshopStyleHint',
    scope: 'client',
    config: true,
    type: String,
    choices: {
      [STYLE_WORKBENCH]: 'GOLD_ALCHEMY.Settings.WorkshopStyleWorkbench',
      [STYLE_CLASSIC]: 'GOLD_ALCHEMY.Settings.WorkshopStyleClassic'
    },
    default: STYLE_WORKBENCH,
    onChange: () => {
      syncChatStyle();
      foundry.applications.instances.get('alchemy-workshop-app')?.render();
    }
  });
  Handlebars.registerHelper('alIcon', (id, cls) => new Handlebars.SafeString(iconMarkup(id, typeof cls === 'string' ? cls : '')));
  Handlebars.registerHelper('alWind', (wind, cls) => new Handlebars.SafeString(windMarkup(wind, typeof cls === 'string' ? cls : '')));
}

/** Karty czatu w wyglądzie pracowni zależą od ustawienia oglądającego. */
export function syncChatStyle() {
  document.body?.classList.toggle('al-workbench-chat', useWorkbench());
}
