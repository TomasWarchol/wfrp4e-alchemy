/**
 * Typ wpisu "receptura" dla silnika ksiąg: status, szczegóły i akcje receptury
 * w księdze albo na zwoju. Limit pamięci i warzenie zostają w Warsztacie.
 */
import { FORM_SCROLL, consumeScroll } from '../../../wfrp4e-grimoires/scripts/public.mjs';
import { registry } from '../../../wfrp4e-companion-lib/scripts/companion-lib.mjs';
import { MODULE_ID } from '../config.js';
import { RecipeRegistry } from './recipe-registry.js';
import { RECIPE_TYPE, recipeEntry } from './recipe-book-data.js';

const loc = key => game.i18n.localize(`GOLD_ALCHEMY.${key}`);
const recipeOf = entry => RecipeRegistry.getRecipeById(entry.data.recipeId);

const STATUS_ICONS = { memorized: 'fa-brain', available: 'fa-flask', notCarried: 'fa-hand-holding' };

/** Identyfikator receptury z upuszczonych danych: przeciągnięcie z Warsztatu albo zwój receptury. */
async function droppedRecipeId(data) {
  if (data?.recipeId) return data.recipeId;
  if (data?.type !== 'Item' || !data.uuid) return null;
  const item = await fromUuid(data.uuid);
  return item?.getFlag(MODULE_ID, 'isRecipe') ? item.getFlag(MODULE_ID, 'recipeId') : null;
}

function description(recipe) {
  const ingredients = (recipe.ingredients || [])
    .map(ingredient => `<li>${game.i18n.localize(ingredient.name)} ×${ingredient.quantity}</li>`)
    .join('');
  return `<p><em>${game.i18n.localize(recipe.description)}</em></p>`
    + `<p><strong>${loc('Details.Effect')}:</strong> ${game.i18n.localize(recipe.effectDescription)}</p>`
    + `<p><strong>${loc('Details.IngredientsTitle')}:</strong></p><ul>${ingredients}</ul>`;
}

export const recipeEntryType = {
  id: RECIPE_TYPE,
  order: 20,
  labelKey: 'GOLD_ALCHEMY.Book.Section',
  writeDeniedKey: 'GOLD_ALCHEMY.Notifications.BookEditGMOnly',
  canWrite: () => game.user.isGM,

  async fromDrop(data) {
    const recipe = RecipeRegistry.getRecipeById(await droppedRecipeId(data));
    return recipe ? recipeEntry(recipe.id, recipe) : null;
  },

  same: (a, b) => a.data.recipeId === b.data.recipeId,

  name(entry) {
    return game.i18n.localize(recipeOf(entry)?.name ?? entry.data.name);
  },

  group(entry) {
    const recipe = recipeOf(entry);
    return { key: recipe?.category ?? 'missing', label: recipe ? RecipeRegistry.categoryLabel(recipe) : '—' };
  },

  visible(entry, ctx) {
    const recipe = recipeOf(entry);
    return !recipe || !ctx.actor || RecipeRegistry.isSchoolVisible(ctx.actor, recipe);
  },

  status(entry, ctx) {
    if (!ctx.view) return 'none';
    const recipe = recipeOf(entry);
    if (!recipe) return 'missing';
    if (RecipeRegistry.getMemorizedRecipeIds(ctx.actor).includes(recipe.id)) return 'memorized';
    if (!ctx.reading.readable) return 'unreadable';
    if (ctx.form !== FORM_SCROLL && !ctx.carried) return 'notCarried';
    return 'available';
  },

  statusLabel: status => (status === 'none' ? '' : loc(`Book.Status.${status}`)),
  statusIcon: status => STATUS_ICONS[status] ?? '',
  corner: () => '',

  async details(entry, status, ctx) {
    const recipe = recipeOf(entry);
    if (!recipe) {
      return { img: entry.data.img, subtitle: '', stats: [], description: '', note: loc('Book.Note.missing'), actions: [] };
    }

    const isScroll = ctx.form === FORM_SCROLL;
    const actions = [];
    if (status === 'available' && ctx.actor?.isOwner) {
      actions.push({ id: 'memorize', label: loc(isScroll ? 'Book.Action.MemorizeScroll' : 'Book.Action.Memorize'), icon: 'fa-brain', primary: true });
    }
    const workshopOpen = ctx.isGM || (ctx.actor && registry.isFeatureUnlocked(ctx.actor, 'alchemy'));
    if (['available', 'memorized'].includes(status) && ctx.actor?.isOwner && workshopOpen) {
      actions.push({ id: 'workshop', label: loc('Book.Action.Workshop'), icon: 'fa-flask' });
    }

    return {
      img: recipe.img,
      subtitle: RecipeRegistry.categoryLabel(recipe),
      stats: [
        { label: loc('Details.CreationTime'), value: RecipeRegistry.formatCreationTime(recipe.creationTimeDays) },
        { label: loc('Details.Doses'), value: recipe.track === 'mundane' ? loc('Details.DosesBatch') : '1' },
        { label: loc('Details.PricePerDose'), value: RecipeRegistry.priceLabel(recipe.listPriceSS) }
      ],
      description: description(recipe),
      note: status === 'none' ? '' : loc(`Book.Note.${isScroll && status === 'available' ? 'availableScroll' : status}`),
      actions
    };
  },

  async run(action, entry, ctx) {
    if (action === 'workshop') return game.alchemy.openWorkshop(ctx.actor);
    if (action !== 'memorize') return;
    const fromScroll = ctx.form === FORM_SCROLL;
    const memorized = await RecipeRegistry.memorizeRecipe(ctx.actor, entry.data.recipeId, { fromScroll });
    if (!memorized) return;
    if (fromScroll) await consumeScroll(ctx.item);
    foundry.applications.instances.get('alchemy-workshop-app')?.render();
  }
};
