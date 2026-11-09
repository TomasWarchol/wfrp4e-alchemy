/**
 * Silnik Kompendiów i Repozytorium Składników, Mikstur oraz Ksiąg Receptur
 * Rejestruje i automatycznie zasila compendia w Foundry VTT
 */

import { recipeBookFlags, recipeEntry, recipeScrollFlags } from './recipe-book-data.js';
import { MODULE_ID, isSourceModuleActive } from '../config.js';
import { ALCHEMY_INGREDIENTS, createIngredientItemData } from '../data/ingredients.js';
import { RecipeRegistry } from './recipe-registry.js';
import { resolveAlchemyImage } from '../data/image-compatibility.js';
import { buildPotionEffectData } from './effect-data.js';

/**
 * Konwertuje recepturę na obiekt przedmiotu mikstury gotowej do compendium
 * @param {object} recipe
 * @returns {object}
 */
export function createPotionItemData(recipe) {
  const name = game.i18n ? game.i18n.localize(recipe.name) : (recipe.key || recipe.id);
  const desc = game.i18n ? game.i18n.localize(recipe.description) : '';
  const effectDesc = game.i18n ? game.i18n.localize(recipe.effectDescription) : '';

  const effects = [];
  if (recipe.activeEffect) {
    effects.push(buildPotionEffectData(recipe.activeEffect, name));
  }

  return {
    name,
    type: 'trapping',
    img: resolveAlchemyImage(recipe.img, 'potion'),
    system: {
      trappingType: { value: 'drugsPoisonsHerbsDraughts' },
      quantity: { value: 1 },
      encumbrance: { value: 0.1 },
      price: RecipeRegistry.priceFromSS(recipe.listPriceSS),
      availability: { value: recipe.availability || (recipe.track === 'magical' ? 'rare' : 'scarce') },
      description: {
        value: `<p>${desc}</p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Details.Effect')}:</strong> ${effectDesc}</p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Details.ShelfBase')}:</strong> ${recipe.shelfLifeDays} ${game.i18n.localize('GOLD_ALCHEMY.Days')}</p>`
      },
      qualities: { value: [] },
      flaws: { value: [] }
    },
    flags: {
      [MODULE_ID]: {
        isPotion: true,
        recipeId: recipe.id,
        recipeKey: recipe.key,
        attunementCost: recipe.attunementCost || 0,
        alchemyData: {
          recipeId: recipe.id,
          recipeKey: recipe.key,
          attunementCost: recipe.attunementCost || 0,
          isDead: false,
          instantEffect: recipe.instantEffect || null
        }
      }
    },
    effects
  };
}

/**
 * Konwertuje recepturę na zwój / formułę alchemiczną gotową do nauki
 * @param {object} recipe
 * @returns {object}
 */
export function createRecipeScrollItemData(recipe) {
  const baseName = game.i18n ? game.i18n.localize(recipe.name) : (recipe.key || recipe.id);
  const scrollTitle = game.i18n ? game.i18n.format('GOLD_ALCHEMY.RecipeScrollTitle', { name: baseName }) : `Receptura: ${baseName}`;
  const desc = game.i18n ? game.i18n.localize(recipe.description) : '';
  const effectDesc = game.i18n ? game.i18n.localize(recipe.effectDescription) : '';

  const ingredientsListHtml = (recipe.ingredients || []).map(ing => {
    const ingName = game.i18n ? game.i18n.localize(ing.name) : (ing.key || ing.name);
    return `<li>${ingName} x${ing.quantity}</li>`;
  }).join('');

  return {
    name: scrollTitle,
    type: 'trapping',
    img: 'icons/sundries/scrolls/scroll-bound-sealed-brown.webp',
    system: {
      trappingType: { value: 'booksAndDocuments' },
      quantity: { value: 1 },
      encumbrance: { value: 0.1 },
      price: { gc: 1, ss: 10, bp: 0 },
      availability: { value: 'scarce' },
      description: {
        value: `<p><em>${desc}</em></p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Details.Effect')}:</strong> ${effectDesc}</p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Compendium.RequiredIngredients')}</strong></p><ul>${ingredientsListHtml}</ul><p><em>${game.i18n.localize('GOLD_ALCHEMY.Compendium.ScrollHint')}</em></p>`
      }
    },
    flags: {
      [MODULE_ID]: {
        isRecipe: true,
        recipeId: recipe.id,
        recipeKey: recipe.key
      },
      ...recipeScrollFlags(recipeEntry(recipe.id, recipe))
    }
  };
}

/**
 * Tworzy gotową Księgę Receptur (Grimuar) zawierającą zestaw receptur
 * @param {string} name
 * @param {string} img
 * @param {Array<string>} recipeIds
 * @param {string} description
 * @returns {object}
 */
export function createRecipeBookItemData(name, img, recipeIds, description) {
  return {
    name,
    type: 'trapping',
    img: resolveAlchemyImage(img, 'book'),
    system: {
      trappingType: { value: 'booksAndDocuments' },
      quantity: { value: 1 },
      encumbrance: { value: 1.0 },
      price: { gc: 15, ss: 0, bp: 0 },
      availability: { value: 'rare' },
      description: {
        value: `<p>${description}</p><p><em>${game.i18n.localize('GOLD_ALCHEMY.Compendium.BookHint')}</em></p>`
      }
    },
    flags: {
      [MODULE_ID]: {
        isRecipeBook: true
      },
      ...recipeBookFlags(recipeIds.map(id => recipeEntry(id, RecipeRegistry.getRecipeById(id))), { carried: game.settings.get(MODULE_ID, 'requireEquippedBooks') === true })
    }
  };
}

export class CompendiumEngine {
  static INGREDIENTS_PACK = `${MODULE_ID}.alchemy-ingredients`;
  static POTIONS_PACK = `${MODULE_ID}.alchemy-potions`;
  static RECIPES_PACK = `${MODULE_ID}.alchemy-recipes`;
  /** Podnieś, gdy zmieniają się efekty mikstur – wygenerowane wpisy kompendium zostaną odbudowane. */
  static POTIONS_DATA_VERSION = 3;
  /** Podnieś, gdy zmienia się format zwojów i ksiąg – wygenerowane wpisy zostaną przepisane. */
  static RECIPES_DATA_VERSION = 1;

  /** Update module-owned compendium entries while keeping anything added by a GM. */
  static async syncPack(pack, itemsData, getDataKey, getDocumentKey, force = false) {
    const documents = await pack.getDocuments();
    const generatedByKey = new Map();
    for (const document of documents) {
      const key = getDocumentKey(document);
      if (key) generatedByKey.set(key, document);
    }

    const desiredKeys = new Set();
    const updates = [];
    const creates = [];
    for (const data of itemsData) {
      const key = getDataKey(data);
      if (!key || desiredKeys.has(key)) continue;
      desiredKeys.add(key);
      const existing = generatedByKey.get(key);
      if (existing) {
        if (force) updates.push({ ...data, _id: existing.id });
        else {
          const update = { _id: existing.id };
          let changed = false;
          if (data.img && existing.img !== data.img) {
            update.img = data.img;
            changed = true;
          }
          if (data.system?.price) {
            const oldPrice = existing.system?.price || {};
            const newPrice = data.system.price;
            const priceChanged = ['gc', 'ss', 'bp'].some(coin => Number(oldPrice[coin]) !== Number(newPrice[coin]));
            if (priceChanged) {
              update['system.price'] = newPrice;
              changed = true;
            }
          }
          if (data.system?.availability) {
            const oldAvailability = existing.system?.availability?.value || existing.system?.availability;
            const newAvailability = data.system.availability.value || data.system.availability;
            if (oldAvailability !== newAvailability) {
              update['system.availability'] = data.system.availability;
              changed = true;
            }
          }
          if (changed) updates.push(update);
        }
      }
      else creates.push(data);
    }

    const staleIds = [...generatedByKey]
      .filter(([key]) => !desiredKeys.has(key))
      .map(([, document]) => document.id);
    if (!force && updates.length === 0 && creates.length === 0 && staleIds.length === 0) return;

    const wasLocked = pack.locked;
    if (wasLocked) await pack.configure({ locked: false });
    try {
      if (updates.length) await Item.updateDocuments(updates, { pack: pack.collection });
      if (creates.length) await Item.createDocuments(creates, { pack: pack.collection });
      if (staleIds.length) await Item.deleteDocuments(staleIds, { pack: pack.collection });
    } finally {
      if (wasLocked) await pack.configure({ locked: true });
    }
  }

  /**
   * Inicjalizuje pakiety kompendium jeśli są puste (tylko dla aktywnego Mistrza Gry)
   * @param {boolean} force - wymuszenie ponownego zaludnienia
   */
  static async initializeCompendiums(force = false) {
    if (game.user !== game.users.activeGM) return;

    // Po zmianie języka świata nazwy i opisy w kompendiach trzeba przepisać
    const seededLang = game.settings.get(MODULE_ID, 'compendiumLang');
    if (seededLang !== game.i18n.lang) force = true;

    try {
      await this.seedIngredients(force);
      await this.seedPotions(force);
      await this.seedRecipes(force);
      await game.settings.set(MODULE_ID, 'compendiumLang', game.i18n.lang);
    } catch (err) {
      console.error(`${MODULE_ID} | Error initializing compendiums:`, err);
    }
  }

  /**
   * Wypełnia compendium składników
   */
  static async seedIngredients(force = false) {
    const pack = game.packs.get(this.INGREDIENTS_PACK);
    if (!pack) {
      console.warn(`${MODULE_ID} | Pack ${this.INGREDIENTS_PACK} not found.`);
      return;
    }

    const activeIngredients = ALCHEMY_INGREDIENTS.filter(ing => isSourceModuleActive(ing.sourceModule));
    console.log(`${MODULE_ID} | Seeding ${activeIngredients.length} ingredients into ${this.INGREDIENTS_PACK}...`);
    const itemsData = activeIngredients.map(ing => createIngredientItemData(ing, 1));
    await this.syncPack(
      pack,
      itemsData,
      data => data.flags?.[MODULE_ID]?.ingredientKey,
      document => document.getFlag(MODULE_ID, 'ingredientKey'),
      force
    );
    console.log(`${MODULE_ID} | Ingredients compendium initialized with ${itemsData.length} items.`);
  }

  /**
   * Wypełnia compendium mikstur
   */
  static async seedPotions(force = false) {
    const pack = game.packs.get(this.POTIONS_PACK);
    if (!pack) {
      console.warn(`${MODULE_ID} | Pack ${this.POTIONS_PACK} not found.`);
      return;
    }

    const activeRecipes = RecipeRegistry.getActiveRecipes();
    console.log(`${MODULE_ID} | Seeding ${activeRecipes.length} potions into ${this.POTIONS_PACK}...`);
    const itemsData = activeRecipes.map(recipe => createPotionItemData(recipe));

    // Nowa wersja efektów: usuń wpisy wygenerowane przez moduł (dodane przez MG zostają), syncPack utworzy je od nowa
    const storedVersion = Number(game.settings.get(MODULE_ID, 'potionsDataVersion')) || 0;
    if (storedVersion < this.POTIONS_DATA_VERSION) {
      const generatedIds = (await pack.getDocuments()).filter(doc => doc.getFlag(MODULE_ID, 'recipeId')).map(doc => doc.id);
      if (generatedIds.length) {
        const wasLocked = pack.locked;
        if (wasLocked) await pack.configure({ locked: false });
        try {
          await Item.deleteDocuments(generatedIds, { pack: pack.collection });
        } finally {
          if (wasLocked) await pack.configure({ locked: true });
        }
      }
      await game.settings.set(MODULE_ID, 'potionsDataVersion', this.POTIONS_DATA_VERSION);
    }
    await this.syncPack(
      pack,
      itemsData,
      data => data.flags?.[MODULE_ID]?.recipeId,
      document => document.getFlag(MODULE_ID, 'recipeId'),
      force
    );
    console.log(`${MODULE_ID} | Potions compendium initialized with ${itemsData.length} items.`);
  }

  /**
   * Wypełnia compendium receptur i ksiąg alchemicznych
   */
  static async seedRecipes(force = false) {
    const pack = game.packs.get(this.RECIPES_PACK);
    if (!pack) {
      console.warn(`${MODULE_ID} | Pack ${this.RECIPES_PACK} not found.`);
      return;
    }

    const dataVersionStale = (Number(game.settings.get(MODULE_ID, 'recipesDataVersion')) || 0) < this.RECIPES_DATA_VERSION;
    const activeRecipes = RecipeRegistry.getActiveRecipes();
    console.log(`${MODULE_ID} | Seeding recipes and grimoires into ${this.RECIPES_PACK}...`);

    // 1. Indywidualne zwoje receptur
    const scrolls = activeRecipes.map(r => createRecipeScrollItemData(r));

    // 2. Startowe Księgi Receptur (Grimuary)
    const grimoires = [
      createRecipeBookItemData(
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Chamon.Name'),
        'icons/sundries/books/book-embossed-gold.webp',
        ['potion-iron-skin', 'potion-liquid-gold', 'potion-quicksilver-speed', 'potion-lead-fortitude', 'potion-chamon-quicksilver-mind', 'potion-alkahest', 'potion-meteoric-compass'],
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Chamon.Desc')
      ),
      createRecipeBookItemData(
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Apothecary.Name'),
        'icons/sundries/books/book-embossed-bound-leather-green.webp',
        ['potion-healing-draught', 'potion-vitality-draught', 'potion-digestive-tonic', 'potion-mundane-panacea', 'potion-soul-balm', 'potion-morr-salve', 'potion-mandrake-extract', 'potion-antitoxin-broad', 'potion-panacea-universalis'],
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Apothecary.Desc')
      ),
      createRecipeBookItemData(
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Field.Name'),
        'icons/sundries/books/book-embossed-red.webp',
        ['potion-leonardo-powder', 'potion-flash-powder', 'potion-smoke-pellet', 'potion-smelling-salts', 'potion-quick-glue', 'potion-vitriol-acid', 'potion-phosphor-fire'],
        game.i18n.localize('GOLD_ALCHEMY.Compendium.Books.Field.Desc')
      )
    ];

    const allData = [...scrolls, ...grimoires];
    await this.syncPack(
      pack,
      allData,
      data => {
        const flags = data.flags?.[MODULE_ID] || {};
        return flags.recipeId || (flags.isRecipeBook ? `book:${data.name}` : null);
      },
      document => {
        const flags = document.flags?.[MODULE_ID] || {};
        return flags.recipeId || (flags.isRecipeBook ? `book:${document.name}` : null);
      },
      force || dataVersionStale
    );
    if (dataVersionStale) await game.settings.set(MODULE_ID, 'recipesDataVersion', this.RECIPES_DATA_VERSION);
    console.log(`${MODULE_ID} | Recipes compendium initialized with ${allData.length} items.`);
  }

  /**
   * Otwiera okno kompendium składników
   */
  static async openIngredientsCompendium() {
    const pack = game.packs.get(this.INGREDIENTS_PACK);
    if (pack) pack.render({ force: true });
    else ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.PackNotFound'));
  }

  /**
   * Otwiera okno kompendium mikstur
   */
  static async openPotionsCompendium() {
    const pack = game.packs.get(this.POTIONS_PACK);
    if (pack) pack.render({ force: true });
    else ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.PackNotFound'));
  }

  /**
   * Otwiera okno kompendium ksiąg i receptur
   */
  static async openRecipesCompendium() {
    const pack = game.packs.get(this.RECIPES_PACK);
    if (pack) pack.render({ force: true });
    else ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.PackNotFound'));
  }
}
