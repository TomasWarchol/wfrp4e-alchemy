/**
 * Rejestr Receptur i Silnik Wiedzy Alchemicznej (Recipe Registry & Knowledge Engine)
 * Obsługuje:
 * - Dynamiczną agregację receptur wbudowanych, aktywnych modułów oraz własnych receptur MG
 * - Ścisłe filtrowanie modułów źródłowych podręczników
 * - System znajomości receptur (Z Pamięci vs Z Posiadanych Ksiąg vs Nieznane)
 * - Limit zapamiętanych receptur i specjalne bonusy Złotego Kolegium (Chamon)
 * - Przeciąganie i upuszczanie (Drag & Drop) receptur do pamięci i do ksiąg
 */

import { MODULE_ID, ALCHEMY_CONFIG, isSourceModuleActive } from '../config.js';
import { ALCHEMY_RECIPES } from '../data/recipes.js';
import { bookAccess, addEntryToBook, entriesOfType, isGrimoire, languageLabel, openEntries, readBook } from '../../../wfrp4e-grimoires/scripts/public.mjs';
import { RECIPE_TYPE, recipeEntry } from './recipe-book-data.js';
import { ALCHEMY_INGREDIENTS } from '../data/ingredients.js';
import { resolveAlchemyImage } from '../data/image-compatibility.js';

export class RecipeRegistry {
  static _allRecipesCache = null;
  static _customRecipesCacheKey = null;
  static INGREDIENT_UNIT_COSTS = new Map(ALCHEMY_INGREDIENTS.map(ingredient => [
    ingredient.key,
    (Number(ingredient.price?.gc) || 0) + (Number(ingredient.price?.ss) || 0) / 20 + (Number(ingredient.price?.bp) || 0) / 240
  ]));
  static LEGACY_INGREDIENT_KEYS = {
    GrainAlcohol: 'PureAlcohol',
    DistilledSpirits: 'PureAlcohol',
    SpringWater: 'PureWater',
    PurifiedWater: 'PureWater'
  };

  static LEGACY_VOLATILITY = [
    { maxDifficulty: -20, value: 'extreme' },
    { maxDifficulty: -10, value: 'major' },
    { maxDifficulty: 0, value: 'moderate' },
    { maxDifficulty: Infinity, value: 'minor' }
  ];

  /** Tor magiczny: szybkie warzenie (dni), koszt utrzymywany Więzią. */
  static MAGIC_CREATION_DAYS = {
    minor: 0.25,
    moderate: 0.5,
    major: 1,
    extreme: 3
  };

  /** Tor świecki: domyślny czas warzenia partii (jak Rzemiosło z podręcznika), gdy receptura nie podaje własnego. */
  static MUNDANE_CREATION_DAYS = 7;

  /** Przeciętna liczba dawek w partii 1k10 – do wyceny dawki. */
  static AVERAGE_BATCH = 5.5;

  /** Mikstury magiczne: kategoria ogólna i 8 Kolegiów. Reszta (zioła, apteka, alchemia, zakazane) to tor świecki. */
  static isMagical(recipe) {
    const category = recipe?.category || '';
    return category === 'magical' || category.startsWith('college-');
  }

  static getIngredientUnitCost(ingredientKey) {
    const key = this.LEGACY_INGREDIENT_KEYS[ingredientKey] || ingredientKey;
    return this.INGREDIENT_UNIT_COSTS.has(key) ? this.INGREDIENT_UNIT_COSTS.get(key) : null;
  }

  static normalizeRecipe(recipe) {
    const legacyDifficulty = Number(recipe.difficulty) || 0;
    const volatility = recipe.volatility || this.LEGACY_VOLATILITY.find(row => legacyDifficulty <= row.maxDifficulty)?.value || 'moderate';
    const magical = this.isMagical(recipe);
    const ingredients = (recipe.ingredients || []).map(ingredient => {
      const cost = this.getIngredientUnitCost(ingredient.key);
      return { ...ingredient, costZK: cost ?? (Number(ingredient.costZK) || 0) };
    });
    const ingredientCostGC = ingredients.reduce((sum, ingredient) => sum + ingredient.costZK * (Number(ingredient.quantity) || 1), 0);
    // Cena dawki: magiczna = 2× składniki; świecka = 4× koszt materiałów na dawkę (materiały to ¼ ceny – Rzemiosło, podręcznik)
    const derivedPriceSS = magical
      ? ingredientCostGC * 20 * 2
      : ingredientCostGC * 20 * 4 / this.AVERAGE_BATCH;
    return {
      ...recipe,
      volatility,
      track: magical ? 'magical' : 'mundane',
      dosesFormula: magical ? '1' : (recipe.dosesFormula || '1d10'),
      creationTimeDays: Math.max(0.25, Number(recipe.creationTimeDays) || (magical ? this.MAGIC_CREATION_DAYS[volatility] : this.MUNDANE_CREATION_DAYS) || 1),
      creationDifficultySL: Number(recipe.creationDifficultySL) || 0,
      shelfLifeDays: Math.max(1, Number(recipe.shelfLifeDays) || 30),
      bonusDaysPerSL: Math.max(0, Number(recipe.bonusDaysPerSL) || 0),
      expiryMode: recipe.expiryMode === 'deactivate' ? 'deactivate' : 'spoilage',
      ingredientCostGC: Math.round(ingredientCostGC * 100) / 100,
      listPriceSS: Math.max(1, Math.round(Number(recipe.listPriceSS) || derivedPriceSS)),
      ingredients
    };
  }

  /** Czas warzenia czytelnie: godziny, dni albo tygodnie. */
  static formatCreationTime(days) {
    const value = Number(days) || 0;
    const i18n = (key, count) => game.i18n.format(key, { count });
    if (value < 1) return i18n('GOLD_ALCHEMY.Time.Hours', Math.round(value * 24));
    if (value >= 14 && value % 7 === 0) return i18n('GOLD_ALCHEMY.Time.Weeks', value / 7);
    return i18n('GOLD_ALCHEMY.Time.Days', value);
  }

  /** Cena w ZK/s/p z szylingów. */
  static priceFromSS(ss) {
    const total = Math.max(0, Math.round(Number(ss) || 0));
    return { gc: Math.floor(total / 20), ss: total % 20, bp: 0 };
  }

  /**
   * Zwraca wszystkie receptury (wbudowane + niestandardowe utworzone przez MG)
   * @returns {Array<object>}
   */
  static getAllRecipes() {
    let customRecipes = [];
    try {
      if (game.settings && game.settings.settings?.has(`${MODULE_ID}.${ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES}`)) {
        customRecipes = game.settings.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES) || [];
      }
    } catch (_) {}

    const customRecipesKey = JSON.stringify(customRecipes);
    if (this._allRecipesCache && customRecipesKey === this._customRecipesCacheKey) return this._allRecipesCache;
    this._customRecipesCacheKey = customRecipesKey;
    // MG może nadpisać parametry receptury z pakietu. Nadpisania zachowują
    // pozycję i źródło oryginału, a nowo dodane receptury trafiają na koniec.
    const recipesById = new Map(ALCHEMY_RECIPES.map(recipe => [recipe.id, recipe]));
    for (const recipe of customRecipes) {
      if (recipe?.id) recipesById.set(recipe.id, recipe);
    }
    this._allRecipesCache = [...recipesById.values()].map(recipe => this.normalizeRecipe(recipe));
    return this._allRecipesCache;
  }

  /**
   * Zwraca receptury aktywne w danym świecie (zgodne z włączonymi podręcznikami)
   * @returns {Array<object>}
   */
  static getActiveRecipes() {
    return this.getAllRecipes().filter(r => isSourceModuleActive(r.sourceModule));
  }

  /**
   * Pobiera pojedynczą recepturę po identyfikatorze
   * @param {string} recipeId
   * @returns {object|null}
   */
  static getRecipeById(recipeId) {
    return this.getAllRecipes().find(r => r.id === recipeId || r.key === recipeId) || null;
  }

  /* -------------------------------------------- */
  /*  Zarządzanie Własnymi Recepturami MG         */
  /* -------------------------------------------- */

  /**
   * Zapisuje nową lub zmodyfikowaną recepturę MG do ustawień świata
   * @param {object} recipeData
   * @returns {Promise<boolean>}
   */
  static async saveCustomRecipe(recipeData) {
    if (!game.user.isGM) {
      ui.notifications.error(game.i18n.localize('GOLD_ALCHEMY.Notifications.GMOnlyAction'));
      return false;
    }

    const custom = game.settings.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES) || [];
    const index = custom.findIndex(r => r.id === recipeData.id);

    const originalRecipe = ALCHEMY_RECIPES.find(recipe => recipe.id === recipeData.id);
    const cleanRecipe = {
      ...recipeData,
      isCustom: !originalRecipe,
      isOverride: Boolean(originalRecipe),
      sourceModule: originalRecipe?.sourceModule || recipeData.sourceModule || 'wfrp4e-alchemy'
    };

    if (index >= 0) {
      custom[index] = cleanRecipe;
    } else {
      custom.push(cleanRecipe);
    }

    await game.settings.set(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES, custom);
    this._allRecipesCache = null;
    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.RecipeSaved', { name: cleanRecipe.name }));
    return true;
  }

  /**
   * Usuwa recepturę niestandardową
   * @param {string} recipeId
   * @returns {Promise<boolean>}
   */
  static async deleteCustomRecipe(recipeId) {
    if (!game.user.isGM) return false;

    let custom = game.settings.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES) || [];
    const beforeCount = custom.length;
    custom = custom.filter(r => r.id !== recipeId);

    if (custom.length !== beforeCount) {
      await game.settings.set(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES, custom);
      this._allRecipesCache = null;
      ui.notifications.info(game.i18n.localize('GOLD_ALCHEMY.Notifications.RecipeDeleted'));
      return true;
    }
    return false;
  }

  /** Etykieta kategorii receptury (szkoła, rzemiosło). */
  static categoryLabel(recipe) {
    if (recipe.college) return recipe.college.toUpperCase();
    const key = { magical: 'Magical', apothecary: 'Apothecary', mundane: 'Mundane', herbal: 'Herbal', forbidden: 'Forbidden' }[recipe.category];
    return key ? game.i18n.localize(`GOLD_ALCHEMY.Category.${key}`) : recipe.category;
  }

  /** Cena z szylingów jako tekst. */
  static priceLabel(listPriceSS) {
    const price = this.priceFromSS(listPriceSS);
    return `${price.gc ? `${price.gc} ${game.i18n.localize('GOLD_ALCHEMY.Currency.GC')} ` : ''}${price.ss} ${game.i18n.localize('GOLD_ALCHEMY.Currency.SS')}`;
  }

  /** Czy szkoła receptury jest widoczna dla tej postaci (ustawienie MG). */
  static isSchoolVisible(actor, recipe) {
    if (!recipe.category.startsWith('college-') && recipe.category !== 'chamon') return true;
    const allowed = actor.getFlag(MODULE_ID, 'visibleAlchemySchools');
    return !Array.isArray(allowed) || allowed.includes(recipe.category === 'chamon' ? 'chamon' : recipe.category.slice('college-'.length));
  }

  /* -------------------------------------------- */
  /*  System Wiedzy o Recepturach i Pamięć        */
  /* -------------------------------------------- */

  /** Księgi postaci: z recepturami i puste (można do nich wpisać receptury). */
  static getRecipeBookItems(actor) {
    const recipeBooks = [];
    const emptyBooks = [];
    if (!actor?.items) return { recipeBooks, emptyBooks };
    for (const item of actor.items) {
      if (!isGrimoire(item)) continue;
      const book = readBook(item);
      if (entriesOfType(book, RECIPE_TYPE).length) recipeBooks.push(item);
      else if (!book.entries.length) emptyBooks.push(item);
    }
    return { recipeBooks, emptyBooks };
  }

  static getRecipeBooks(actor) {
    return this.getRecipeBookItems(actor).recipeBooks;
  }

  /** Identyfikatory receptur zapisanych w księdze. */
  static bookRecipeIds(book) {
    return this.openRecipeEntries(book).map(entry => this.canonicalRecipeId(entry));
  }

  /** Wpisy receptur dostępne właścicielowi księgi (bez stron szyfrowanych i zakazanych). */
  static openRecipeEntries(book) {
    return entriesOfType({ entries: openEntries(book) }, RECIPE_TYPE);
  }

  static canonicalRecipeId(entry) {
    return this.getRecipeById(entry.data.recipeId)?.id ?? entry.data.recipeId;
  }

  /** Czy postać ma recepturę wyłącznie z wadliwych odpisów (i nie zna jej na pamięć). */
  static brewsFromFlawedCopy(actor, recipe) {
    if (this.getMemorizedRecipeIds(actor).includes(recipe.id)) return false;
    const copies = this.getRecipeBooks(actor)
      .filter(book => bookAccess(book).accessible)
      .flatMap(book => this.openRecipeEntries(book))
      .filter(entry => this.canonicalRecipeId(entry) === recipe.id);
    return copies.length > 0 && copies.every(entry => entry.flawed);
  }

  static getRecipeBookDetails(actor, books = null) {
    return (books || this.getRecipeBooks(actor)).map(book => {
      const data = readBook(book);
      const access = bookAccess(book);
      const recipes = this.bookRecipeIds(book).map(id => {
        const recipe = this.getRecipeById(id);
        return { id, name: recipe ? game.i18n.localize(recipe.name) : id };
      });
      return {
        id: book.id,
        name: book.name,
        img: resolveAlchemyImage(book.img, 'book'),
        recipes,
        languageLabel: languageLabel(data.language),
        accessible: access.accessible,
        accessReason: access.reason
      };
    });
  }

  /**
   * Pobiera zbiór identyfikatorów receptur zawartych w posiadanych księgach postaci
   * @param {Actor} actor
   * @returns {Map<string, string[]>} Mapa: recipeId => lista nazw dostępnych ksiąg
   */
  static getGrimoireRecipeMap(actor, books = null) {
    const map = new Map();
    books = books || this.getRecipeBooks(actor);

    for (const book of books) {
      if (!bookAccess(book).accessible) continue;
      for (const recipeId of this.bookRecipeIds(book)) {
        const names = map.get(recipeId) || [];
        if (!names.includes(book.name)) names.push(book.name);
        map.set(recipeId, names);
      }
    }

    return map;
  }

  /**
   * Zwraca listę identyfikatorów receptur zapamiętanych na stałe w umyśle alchemika
   * @param {Actor} actor
   * @returns {Array<string>}
   */
  static getMemorizedRecipeIds(actor) {
    if (!actor) return [];
    return actor.getFlag(MODULE_ID, 'memorizedRecipes') || [];
  }

  /**
   * Oblicza stan pamięci alchemika (limit, zapamiętane, wolne sloty, bonus Chamonu)
   * @param {Actor} actor
   * @returns {object}
   */
  static getMemoryState(actor) {
    if (!actor || !actor.system) {
      return { max: 0, used: 0, available: 0, hasChamonBonus: false, chamonBonus: 0, memorizedCount: 0 };
    }

    // 1. Bonus Inteligencji (BInt)
    const bInt = Number(actor.system.characteristics?.int?.bonus) || 0;

    // 2. Umiejętność Alchemii lub Splatania Magii (/ 10)
    let highestSkillAdvances = 0;
    if (actor.itemTypes?.skill) {
      for (const skill of actor.itemTypes.skill) {
        const sName = skill.name.toLowerCase();
        if (sName.includes('alchemi') || sName.includes('splatanie') || sName.includes('channelling') || sName.includes('aptekar')) {
          const adv = Number(skill.system.advances?.value) || 0;
          if (adv > highestSkillAdvances) highestSkillAdvances = adv;
        }
      }
    }
    const skillBonus = Math.floor(highestSkillAdvances / 10);

    // 3. Talent Przyrządzanie Mikstur (Concoct) -> +2 sloty za każdy stopień
    let concoctAdvances = 0;
    if (actor.itemTypes?.talent) {
      for (const t of actor.itemTypes.talent) {
        const tName = t.name.toLowerCase();
        if (tName.includes('przyrządzanie mikstur') || tName.includes('przyrzadzanie mikstur') || tName.includes('concoct')) {
          concoctAdvances += (Number(t.system.advances?.value) || 1);
        }
      }
    }
    const concoctBonus = concoctAdvances * 2;

    // 4. Bonus Złotego Kolegium (Chamon):
    // Czarodzieje Chamonu mają umysły stworzone do formuł transmutacji (+5 slotów)
    let hasChamonBonus = false;
    if (actor.itemTypes?.talent) {
      hasChamonBonus = actor.itemTypes.talent.some(t => /dostrojony do chamonu|attuned to chamon/i.test(t.name));
    }
    if (!hasChamonBonus && actor.itemTypes?.skill) {
      hasChamonBonus = actor.itemTypes.skill.some(s => /splatanie magii \(chamon\)|channelling \(chamon\)/i.test(s.name));
    }
    const chamonBonus = hasChamonBonus ? 5 : 0;

    // Sumaryczny limit slotów pamięci
    const customMod = Number(actor.getFlag(MODULE_ID, 'customMemoryMod')) || 0;
    const baseMax = bInt + skillBonus + concoctBonus + chamonBonus;
    const maxSlots = Math.max(0, baseMax + customMod);

    // Kalkulacja zajętych slotów:
    // Dla postaci Chamonu receptury z kategorii 'college-chamon' są darmowe w pamięci!
    const memorizedIds = this.getMemorizedRecipeIds(actor);
    let usedSlots = 0;

    for (const id of memorizedIds) {
      const recipe = this.getRecipeById(id);
      if (recipe && hasChamonBonus && (recipe.category === 'college-chamon' || recipe.category === 'chamon')) {
        // Darmowy slot (wrodzona wiedza o metalu)
        continue;
      }
      usedSlots += 1;
    }

    const availableSlots = Math.max(0, maxSlots - usedSlots);

    return {
      max: maxSlots,
      baseMax,
      customMod,
      used: usedSlots,
      available: availableSlots,
      hasChamonBonus,
      chamonBonus,
      memorizedCount: memorizedIds.length,
      bInt,
      skillBonus,
      concoctBonus
    };
  }

  /**
   * Zwraca status wiedzy postaci o danej recepturze
   * @param {Actor} actor
   * @param {object} recipe
   * @param {Array<string>} memorizedIds
   * @param {Map<string, string>} grimoireMap
   * @returns {object} { state: 'memorized'|'grimoire'|'unknown', bookName: string|null, isFreeChamon: boolean }
   */
  static getRecipeKnowledge(actor, recipe, memorizedIds = null, grimoireMap = null, knownMemoryState = null) {
    const memIds = memorizedIds || this.getMemorizedRecipeIds(actor);
    const gMap = grimoireMap || this.getGrimoireRecipeMap(actor);

    const isMemorized = memIds.includes(recipe.id);
    const bookNames = gMap.get(recipe.id) || [];
    const bookName = bookNames.length ? bookNames.join(', ') : null;

    let state = ALCHEMY_CONFIG.KNOWLEDGE_STATES.UNKNOWN;
    if (isMemorized) {
      state = ALCHEMY_CONFIG.KNOWLEDGE_STATES.MEMORIZED;
    } else if (bookName) {
      state = ALCHEMY_CONFIG.KNOWLEDGE_STATES.GRIMOIRE;
    }

    // Czy receptura jest darmowa dla alchemika Chamonu
    const memoryState = knownMemoryState || this.getMemoryState(actor);
    const isFreeChamon = memoryState.hasChamonBonus && (recipe.category === 'college-chamon' || recipe.category === 'chamon');

    return {
      state,
      isMemorized,
      isFromBook: Boolean(bookName),
      isKnown: isMemorized || Boolean(bookName),
      bookName,
      bookNames,
      isFreeChamon
    };
  }

  static canBrewRecipe(actor, recipe) {
    const requireDiscovery = game.settings?.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.REQUIRE_DISCOVERY) !== false;
    return !requireDiscovery || this.getRecipeKnowledge(actor, recipe).isKnown;
  }

  /**
   * Zapamiętuje recepturę w pamięci postaci
   * @param {Actor} actor
   * @param {string} recipeId
   * @param {{fromScroll?: boolean}} [options]  zapamiętanie z posiadanego zwoju
   * @returns {Promise<boolean>}
   */
  static async memorizeRecipe(actor, recipeId, { fromScroll = false } = {}) {
    if (!actor) return false;
    const recipe = this.getRecipeById(recipeId);
    if (!recipe) return false;

    // Gracze mogą zapamiętać formułę tylko z dostępnej księgi; MG może ją nadać.
    if (!game.user.isGM) {
      if (!actor.isOwner) return false;
      const knowledge = this.getRecipeKnowledge(actor, recipe);
      if (!knowledge.isFromBook && !fromScroll) {
        ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.MemorizeFromBookOnly'));
        return false;
      }
    }

    const memIds = [...this.getMemorizedRecipeIds(actor)];
    if (memIds.includes(recipeId)) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.AlreadyMemorized'));
      return false;
    }

    const memState = this.getMemoryState(actor);
    const isFree = memState.hasChamonBonus && (recipe.category === 'college-chamon' || recipe.category === 'chamon');

    if (!game.user.isGM && !isFree && memState.available <= 0) {
      ui.notifications.error(game.i18n.localize('GOLD_ALCHEMY.Notifications.NoMemorySlotsAvailable'));
      return false;
    }

    memIds.push(recipeId);
    await actor.setFlag(MODULE_ID, 'memorizedRecipes', memIds);

    const recipeName = game.i18n.localize(recipe.name);
    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.RecipeMemorized', { name: recipeName }));
    return true;
  }

  /**
   * Usuwa recepturę z pamięci postaci (zwalnia slot)
   * @param {Actor} actor
   * @param {string} recipeId
   * @returns {Promise<boolean>}
   */
  static async forgetRecipe(actor, recipeId) {
    if (!actor) return false;
    const memIds = this.getMemorizedRecipeIds(actor).filter(id => id !== recipeId);
    await actor.setFlag(MODULE_ID, 'memorizedRecipes', memIds);

    const recipe = this.getRecipeById(recipeId);
    const recipeName = recipe ? game.i18n.localize(recipe.name) : recipeId;
    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.RecipeForgotten', { name: recipeName }));
    return true;
  }

  /**
   * Zapisuje recepturę do księgi (tylko MG)
   * @param {Item} bookItem
   * @param {string} recipeId
   * @returns {Promise<boolean>}
   */
  static async addRecipeToBook(bookItem, recipeId) {
    if (!game.user.isGM) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.BookEditGMOnly'));
      return false;
    }
    const recipe = this.getRecipeById(recipeId);
    if (!isGrimoire(bookItem) || !recipe) return false;
    const added = await addEntryToBook(bookItem, recipeEntry(recipe.id, recipe), (a, b) => a.data.recipeId === b.data.recipeId);
    if (!added) return false;
    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.RecipeAddedToBook', {
      recipe: game.i18n.localize(recipe.name),
      book: bookItem.name
    }));
    return true;
  }

  /**
   * Obsługa przeciągania i upuszczania receptury (Drag & Drop)
   * @param {Actor} actor
   * @param {object} dropData
   * @param {Item|null} targetItem
   * @returns {Promise<boolean>}
   */
  static async handleRecipeDrop(actor, dropData, targetItem = null) {
    if (!actor || !dropData) return false;

    let recipeId = null;

    // Przeciągnięcie z kompendium lub niestandardowego payloadu
    if (dropData.type === 'Item' && dropData.uuid) {
      const item = await fromUuid(dropData.uuid);
      // Mikstury też noszą identyfikator receptury – liczą się tylko zwoje
      if (item?.getFlag(MODULE_ID, 'isRecipe')) {
        recipeId = item.getFlag(MODULE_ID, 'recipeId') || item.flags?.[MODULE_ID]?.recipeKey || null;
      }
    } else if (dropData.recipeId) {
      recipeId = dropData.recipeId;
    }

    if (!recipeId) return false;

    if (!game.user.isGM && targetItem) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.BookEditGMOnly'));
      return false;
    }
    if (!game.user.isGM) {
      const recipe = this.getRecipeById(recipeId);
      if (!recipe || !this.getRecipeKnowledge(actor, recipe).isFromBook) {
        ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.MemorizeFromBookOnly'));
        return false;
      }
    }

    // Jeśli upuszczono na konkretną księgę w ekwipunku
    if (targetItem && isGrimoire(targetItem) && targetItem.parent?.id === actor.id) {
      return await this.addRecipeToBook(targetItem, recipeId);
    }

    // Domyślnie: próba zapamiętania w umyśle postaci
    return await this.memorizeRecipe(actor, recipeId);
  }
}
