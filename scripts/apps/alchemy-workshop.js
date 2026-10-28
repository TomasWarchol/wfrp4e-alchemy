/**
 * Okno Warsztatu Alchemicznego (ApplicationV2) z pełnym i18n
 * Obsługuje:
 * - Filtrowanie 8 Kolegiów, Aptekarstwa, Alchemii Świeckiej i Zielarstwa
 * - System Wiedzy o Recepturach (Z Pamięci vs Z Ksiąg vs Wszystkie w świecie)
 * - Paski Punktów Podtrzymania oraz Pamięci Receptur (z bonusami Chamonu)
 * - Tworzenie, edycję i usuwanie receptur przez Mistrza Gry
 * - Przeciąganie i upuszczanie (Drag & Drop) receptur z kompendium
 */

import { MODULE_ID, ALCHEMY_CONFIG, isSourceModuleActive } from '../config.js';
import { CapacityEngine } from '../logic/capacity-engine.js';
import { BrewingEngine } from '../logic/brewing-engine.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { CompendiumEngine } from '../logic/compendium-engine.js';
import { RecipeRegistry } from '../logic/recipe-registry.js';
import { RecipeEditorApp } from './recipe-editor.js';
import { ALCHEMY_IMAGE_FALLBACKS, resolveAlchemyImage } from '../data/image-compatibility.js';
import { registry } from '../../../wfrp4e-companion-lib/scripts/companion-lib.mjs';

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

export class AlchemyWorkshopApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
    this.selectedCategory = 'all';
    this.selectedSubCategory = 'all-colleges';
    this.knowledgeFilter = 'all'; // 'all', 'memorized', 'grimoire', 'unknown'
    this.showBookManager = false;
    this.showAllWorldRecipes = false; // Podgląd receptur świata wymaga jawnego włączenia przez MG
    this.selectedLabTier = 'standard';

    this.selectedRecipeId = RecipeRegistry.getActiveRecipes()[0]?.id || null;
  }

  static DEFAULT_OPTIONS = {
    id: 'alchemy-workshop-app',
    classes: ['wfrp4e', 'gold-alchemy-app'],
    tag: 'div',
    window: {
      title: 'GOLD_ALCHEMY.Title',
      icon: 'fa-solid fa-flask',
      resizable: true
    },
    position: {
      width: 820,
      height: 680
    },
    actions: {
      selectCategory: this._onSelectCategory,
      selectSubCategory: this._onSelectSubCategory,
      selectKnowledgeFilter: this._onSelectKnowledgeFilter,
      toggleBookManager: this._onToggleBookManager,
      saveBookRequirements: this._onSaveBookRequirements,
      removeRecipeFromBook: this._onRemoveRecipeFromBook,
      registerRecipeBook: this._onRegisterRecipeBook,
      saveActorAlchemySettings: this._onSaveActorAlchemySettings,
      toggleAllWorldRecipes: this._onToggleAllWorldRecipes,
      selectRecipe: this._onSelectRecipe,
      brewPotion: this._onBrewPotion,
      cancelPendingBrew: this._onCancelPendingBrew,
      severTether: this._onSeverTether,
      memorizeRecipe: this._onMemorizeRecipe,
      forgetRecipe: this._onForgetRecipe,
      createRecipe: this._onCreateRecipe,
      editRecipe: this._onEditRecipe,
      deleteRecipe: this._onDeleteRecipe,
      openIngredientsCompendium: this._onOpenIngredientsCompendium,
      openPotionsCompendium: this._onOpenPotionsCompendium,
      openRecipesCompendium: this._onOpenRecipesCompendium
    }
  };

  static PARTS = {
    workshop: {
      template: `modules/${MODULE_ID}/templates/workshop-app.hbs`,
      scrollable: ['.recipe-scroll', '.recipe-details-pane', '.tether-list']
    }
  };


  /**
   * Przygotowanie kontekstu danych dla szablonu Handlebars
   */
  async _prepareContext(options) {
    // 1. Stan Punktów Podtrzymania
    const capacityState = CapacityEngine.getCapacityState(this.actor);
    const capacityPercent = capacityState.max
      ? Math.min(100, Math.round((capacityState.used / capacityState.max) * 100))
      : 0;

    // 2. Stan Pamięci Receptur (Memory State)
    const memoryState = RecipeRegistry.getMemoryState(this.actor);
    const memoryPercent = memoryState.max
      ? Math.min(100, Math.round((memoryState.used / memoryState.max) * 100))
      : 0;

    // 3. Posiadane księgi i receptury w pamięci
    const memorizedIds = RecipeRegistry.getMemorizedRecipeIds(this.actor);
    const bookItems = RecipeRegistry.getRecipeBookItems(this.actor);
    const grimoireMap = RecipeRegistry.getGrimoireRecipeMap(this.actor, bookItems.recipeBooks);
    let recipeBooks = RecipeRegistry.getRecipeBookDetails(this.actor, bookItems.recipeBooks);
    const unregisteredBooks = bookItems.unregisteredBooks.map(book => ({
      id: book.id,
      name: book.name,
      img: book.img
    }));

    // 4. Pobranie aktywnych receptur i wstępne zawężenie kategorii.
    // Nie przygotowujemy wiedzy i składników dla receptur, których ten widok nie pokaże.
    const activeRecipes = RecipeRegistry.getActiveRecipes();
    const inventoryRecipeKey = JSON.stringify(activeRecipes.map(recipe => [recipe.id, recipe.ingredients]));
    if (!this._alchemyIngredientInventoryCache
      || this._alchemyIngredientInventoryCache.actorId !== this.actor.id
      || this._alchemyIngredientInventoryCache.recipeKey !== inventoryRecipeKey) {
      this._alchemyIngredientInventoryCache = {
        actorId: this.actor.id,
        recipeKey: inventoryRecipeKey,
        totals: BrewingEngine.buildIngredientInventory(this.actor, activeRecipes)
      };
    }
    const ingredientInventory = this._alchemyIngredientInventoryCache.totals;
    const isMagicalTab = this.selectedCategory === 'magical-all';
    let categoryRecipes = activeRecipes;
    if (this.selectedCategory === 'magical-all') {
      if (this.selectedSubCategory === 'all-colleges') {
        categoryRecipes = activeRecipes.filter(r => r.category === 'magical' || r.category.startsWith('college-') || r.category === 'chamon');
      } else {
        categoryRecipes = activeRecipes.filter(r => r.category === this.selectedSubCategory || (this.selectedSubCategory === 'college-chamon' && r.category === 'chamon'));
      }
    } else if (this.selectedCategory !== 'all') {
      categoryRecipes = activeRecipes.filter(r => r.category === this.selectedCategory);
    }

    const requireDiscovery = game.settings?.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.REQUIRE_DISCOVERY) !== false;

    // 5. Przetworzenie każdej receptury pod kątem wiedzy, składników i uprawnień
    const pendingBrew = this.actor.getFlag(MODULE_ID, 'pendingBrew');
    const currentTimestamp = CalendarIntegration.getCurrentTimestamp();
    const recipes = categoryRecipes.map(recipe => {
      const ingCheck = BrewingEngine.checkIngredients(this.actor, recipe, ingredientInventory);
      const knowledge = RecipeRegistry.getRecipeKnowledge(this.actor, recipe, memorizedIds, grimoireMap, memoryState);

      let catLabel = recipe.category;
      if (recipe.college) {
        catLabel = recipe.college.toUpperCase();
      } else if (recipe.category === 'magical') {
        catLabel = game.i18n.localize('GOLD_ALCHEMY.Category.Magical');
      } else if (recipe.category === 'apothecary') {
        catLabel = game.i18n.localize('GOLD_ALCHEMY.Category.Apothecary');
      } else if (recipe.category === 'mundane') {
        catLabel = game.i18n.localize('GOLD_ALCHEMY.Category.Mundane');
      } else if (recipe.category === 'herbal') {
        catLabel = game.i18n.localize('GOLD_ALCHEMY.Category.Herbal');
      } else if (recipe.category === 'forbidden') {
        catLabel = game.i18n.localize('GOLD_ALCHEMY.Category.Forbidden');
      }

      // Receptura może być warzona, jeśli jest znana (z pamięci lub z księgi) i są składniki oraz podtrzymanie
      const isKnown = knowledge.isMemorized || knowledge.isFromBook;
      const hasTether = recipe.attunementCost === 0 || capacityState.available >= recipe.attunementCost;
      const isPendingBrew = pendingBrew?.recipeId === recipe.id;
      const canBrew = (!requireDiscovery || isKnown) && ingCheck.canBrew && hasTether
        && (!pendingBrew || (isPendingBrew && currentTimestamp >= pendingBrew.completesAt));

      return {
        ...recipe,
        img: resolveAlchemyImage(recipe.img, 'potion'),
        canBrew,
        isPendingBrew,
        pendingBrewReady: isPendingBrew && currentTimestamp >= pendingBrew.completesAt,
        isKnown,
        knowledge,
        isMemorized: knowledge.isMemorized,
        isFromBook: knowledge.isFromBook,
        bookName: knowledge.bookName,
        bookNames: knowledge.bookNames,
        isFreeChamon: knowledge.isFreeChamon,
        isCustom: Boolean(recipe.isCustom),
        ingredientsStatus: ingCheck.ingredientsStatus,
        categoryLabel: catLabel
      };
    });

    // 6. Filtrowanie po kategorii
    let filteredRecipes = recipes;

    // 7. Filtrowanie po stanie wiedzy (gracz widzi tylko znane, chyba że MG włączył tryb podglądu świata)
    const isGM = Boolean(game.user.isGM);
    const showUnknownToGM = isGM && this.knowledgeFilter === 'unknown';
    if ((!isGM || (!this.showAllWorldRecipes && !showUnknownToGM)) && requireDiscovery) {
      filteredRecipes = filteredRecipes.filter(r => r.isKnown);
    }

    const visibleSchools = this.actor.getFlag(MODULE_ID, 'visibleAlchemySchools');
    const allSchools = Object.keys(ALCHEMY_CONFIG.COLLEGES);
    const allowedSchools = Array.isArray(visibleSchools) ? visibleSchools : allSchools;
    if (!isGM) {
      const recipeMap = new Map(activeRecipes.map(recipe => [recipe.id, recipe]));
      recipeBooks = recipeBooks.map(book => ({
        ...book,
        recipes: book.recipes.filter(entry => {
          const recipe = recipeMap.get(entry.id);
          if (!recipe || (!recipe.category.startsWith('college-') && recipe.category !== 'chamon')) return true;
          const school = recipe.category === 'chamon' ? 'chamon' : recipe.category.slice('college-'.length);
          return allowedSchools.includes(school);
        })
      }));
    }
    if (!isGM) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const school = recipe.category === 'chamon' ? 'chamon' : recipe.category.replace(/^college-/, '');
        return !recipe.category.startsWith('college-') && recipe.category !== 'chamon' || allowedSchools.includes(school);
      });
    }

    // Dodatkowy filtr podzakładek wiedzy (Wszystkie / Z Pamięci / Z Ksiąg / Nieznane)
    if (this.knowledgeFilter === 'memorized') {
      filteredRecipes = filteredRecipes.filter(r => r.isMemorized);
    } else if (this.knowledgeFilter === 'grimoire') {
      filteredRecipes = filteredRecipes.filter(r => r.isFromBook);
    } else if (this.knowledgeFilter === 'unknown') {
      filteredRecipes = filteredRecipes.filter(r => !r.isKnown);
    }

    let selectedRecipe = filteredRecipes.find(r => r.id === this.selectedRecipeId);
    if (!selectedRecipe) {
      selectedRecipe = filteredRecipes[0] || null;
      this.selectedRecipeId = selectedRecipe?.id || null;
    }
    if (selectedRecipe) {
      const price = RecipeRegistry.priceFromSS(selectedRecipe.listPriceSS);
      selectedRecipe = {
        ...selectedRecipe,
        creationTimeLabel: RecipeRegistry.formatCreationTime(selectedRecipe.creationTimeDays),
        dosesLabel: selectedRecipe.track === 'mundane' ? game.i18n.localize('GOLD_ALCHEMY.Details.DosesBatch') : '1',
        priceLabel: `${price.gc ? `${price.gc} ${game.i18n.localize('GOLD_ALCHEMY.Currency.GC')} ` : ''}${price.ss} ${game.i18n.localize('GOLD_ALCHEMY.Currency.SS')}`
      };
    }

    const currentDateFormatted = CalendarIntegration.formatDate(CalendarIntegration.getCurrentTimestamp());

    return {
      actor: this.actor,
      isGM,
      showAllWorldRecipes: this.showAllWorldRecipes,
      capacity: {
        ...capacityState,
        percent: capacityPercent
      },
      memory: {
        ...memoryState,
        percent: memoryPercent
      },
      recipeBooksCount: recipeBooks.length,
      recipeBooks,
      unregisteredBooks,
      showBookManager: this.showBookManager,
      categories: ALCHEMY_CONFIG.CATEGORIES,
      selectedCategory: this.selectedCategory,
      selectedSubCategory: this.selectedSubCategory,
      knowledgeFilter: this.knowledgeFilter,
      isAllKnownFilterActive: this.knowledgeFilter === 'all' && !this.showAllWorldRecipes,
      showCollegeSubTabs: isMagicalTab,
      collegeTabs: [
        { id: 'college-aqshy', name: 'Aqshy', className: 'btn-aqshy' },
        { id: 'college-azyr', name: 'Azyr', className: 'btn-azyr' },
        { id: 'college-chamon', name: 'Chamon', className: 'btn-chamon' },
        { id: 'college-ghyran', name: 'Ghyran', className: 'btn-ghyran' },
        { id: 'college-ghur', name: 'Ghur', className: 'btn-ghur' },
        { id: 'college-hysh', name: 'Hysh', className: 'btn-hysh' },
        { id: 'college-shyish', name: 'Shyish', className: 'btn-shyish' },
        { id: 'college-ulgu', name: 'Ulgu', className: 'btn-ulgu' }
      ].filter(tab => isGM || allowedSchools.includes(tab.id.replace('college-', ''))),
      schoolSettings: allSchools.map(id => ({
        id,
        name: game.i18n?.localize(ALCHEMY_CONFIG.COLLEGES[id].name) || id,
        enabled: allowedSchools.includes(id)
      })),
      customCapacityMod: Number(this.actor.getFlag(MODULE_ID, 'customCapacityMod')) || 0,
      customMemoryMod: Number(this.actor.getFlag(MODULE_ID, 'customMemoryMod')) || 0,
      playerWorkshopEnabled: registry.isFeatureUnlocked(this.actor, 'alchemy'),
      recipes: filteredRecipes,
      selectedRecipe,
      selectedLabTier: this.selectedLabTier,
      labTiers: ALCHEMY_CONFIG.LAB_TIERS,
      tetheredPotions: capacityState.tethered,
      currentDateFormatted,
      pendingBrew: pendingBrew ? {
        ...pendingBrew,
        isReady: currentTimestamp >= pendingBrew.completesAt,
        completionDate: CalendarIntegration.formatDate(pendingBrew.completesAt),
        statusText: game.i18n.format('GOLD_ALCHEMY.Details.PendingBrew', {
          recipe: pendingBrew.recipeName,
          date: CalendarIntegration.formatDate(pendingBrew.completesAt)
        })
      } : null
    };
  }


  /* -------------------------------------------- */
  /*  Akcje ApplicationV2                         */
  /* -------------------------------------------- */

  static _onSelectCategory(event, target) {
    const nextCategory = target.dataset.category;
    const nextSubCategory = nextCategory === 'magical-all' ? this.selectedSubCategory : 'all-colleges';
    if (this.selectedCategory === nextCategory && this.selectedSubCategory === nextSubCategory) return;
    this.selectedCategory = nextCategory;
    if (this.selectedCategory !== 'magical-all') {
      this.selectedSubCategory = 'all-colleges';
    }
    this.render();
  }

  static _onSelectSubCategory(event, target) {
    const nextSubCategory = target.dataset.subcategory;
    if (this.selectedSubCategory === nextSubCategory) return;
    this.selectedSubCategory = nextSubCategory;
    this.render();
  }

  static _onSelectKnowledgeFilter(event, target) {
    const nextKnowledgeFilter = target.dataset.knowledge || 'all';
    if (this.knowledgeFilter === nextKnowledgeFilter && !this.showAllWorldRecipes) return;
    this.knowledgeFilter = nextKnowledgeFilter;
    this.showAllWorldRecipes = false;
    this.render();
  }

  static _onToggleBookManager() {
    this.showBookManager = !this.showBookManager;
    this.render();
  }

  static async _onSaveBookRequirements(event, target) {
    if (!game.user.isGM) return;
    const card = target.closest('.recipe-book-card');
    const book = this.actor.items.get(card?.dataset.bookId);
    const requiredLanguage = card?.querySelector('[name="requiredLanguage"]')?.value || '';
    await RecipeRegistry.setBookRequirements(book, requiredLanguage);
  }

  static async _onRemoveRecipeFromBook(event, target) {
    const card = target.closest('.recipe-book-card');
    const book = this.actor.items.get(card?.dataset.bookId);
    const recipeId = target.dataset.recipeId;
    await RecipeRegistry.removeRecipeFromBook(book, recipeId);
  }

  static async _onRegisterRecipeBook(event, target) {
    if (!game.user.isGM) return;
    const book = this.actor.items.get(target.dataset.bookId);
    await RecipeRegistry.registerRecipeBook(book);
  }

  static async _onSaveActorAlchemySettings(event, target) {
    if (!game.user.isGM) return;
    const root = target.closest('.gm-alchemy-settings');
    const capacity = Number.parseInt(root?.querySelector('[name="customCapacityMod"]')?.value, 10);
    const memory = Number.parseInt(root?.querySelector('[name="customMemoryMod"]')?.value, 10);
    const schools = [...(root?.querySelectorAll('[name="visibleAlchemySchools"]:checked') || [])]
      .map(input => input.value);
    const playerWorkshopEnabled = Boolean(root?.querySelector('[name="playerWorkshopEnabled"]')?.checked);
    await this.actor.setFlag(MODULE_ID, 'customCapacityMod', Number.isFinite(capacity) ? capacity : 0);
    await this.actor.setFlag(MODULE_ID, 'customMemoryMod', Number.isFinite(memory) ? memory : 0);
    await this.actor.setFlag(MODULE_ID, 'visibleAlchemySchools', schools);
    await registry.setFeatureUnlocked(this.actor, 'alchemy', playerWorkshopEnabled);
    if (this.selectedSubCategory.startsWith('college-') && !schools.includes(this.selectedSubCategory.slice('college-'.length))) {
      this.selectedSubCategory = 'all-colleges';
    }
    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.SettingsSaved', { actor: this.actor.name }));
    this.render();
  }

  static _onToggleAllWorldRecipes(event, target) {
    if (!game.user.isGM) return;
    this.showAllWorldRecipes = !this.showAllWorldRecipes;
    if (this.showAllWorldRecipes) this.knowledgeFilter = 'all';
    this.render();
  }

  static _onSelectRecipe(event, target) {
    const recipeId = target.dataset.recipeId || target.closest('[data-recipe-id]')?.dataset.recipeId;
    if (recipeId) {
      this.selectedRecipeId = recipeId;
      this.render();
    }
  }

  static async _onBrewPotion(event, target) {
    const recipe = RecipeRegistry.getRecipeById(this.selectedRecipeId);
    if (!recipe || !isSourceModuleActive(recipe.sourceModule)) return;

    target.disabled = true;
    try {
      await BrewingEngine.brew(this.actor, recipe, this.selectedLabTier);
    } finally {
      this.render();
    }
  }

  static async _onCancelPendingBrew() {
    if (!game.user.isGM) return;
    await BrewingEngine.cancelPendingBrew(this.actor);
    this.render();
  }

  static async _onSeverTether(event, target) {
    const uuid = target.dataset.uuid || target.closest('[data-uuid]')?.dataset.uuid;
    if (uuid) {
      await CapacityEngine.severTether(uuid, this.actor);
      this.render();
    }
  }

  static async _onMemorizeRecipe(event, target) {
    const recipeId = target.dataset.recipeId || target.closest('[data-recipe-id]')?.dataset.recipeId;
    if (recipeId) {
      await RecipeRegistry.memorizeRecipe(this.actor, recipeId);
      this.render();
    }
  }

  static async _onForgetRecipe(event, target) {
    const recipeId = target.dataset.recipeId || target.closest('[data-recipe-id]')?.dataset.recipeId;
    if (recipeId) {
      await RecipeRegistry.forgetRecipe(this.actor, recipeId);
      this.render();
    }
  }

  static _onCreateRecipe(event, target) {
    if (!game.user.isGM) return;
    RecipeEditorApp.open();
  }

  static _onEditRecipe(event, target) {
    if (!game.user.isGM) return;
    const recipeId = target.dataset.recipeId || target.closest('[data-recipe-id]')?.dataset.recipeId;
    const recipe = RecipeRegistry.getRecipeById(recipeId);
    if (recipe) {
      RecipeEditorApp.open(recipe);
    }
  }

  static async _onDeleteRecipe(event, target) {
    if (!game.user.isGM) return;
    const recipeId = target.dataset.recipeId || target.closest('[data-recipe-id]')?.dataset.recipeId;
    if (recipeId) {
      const confirm = await DialogV2.confirm({
        window: { title: game.i18n.localize('GOLD_ALCHEMY.Editor.DeleteConfirmTitle') },
        content: `<p>${game.i18n.localize('GOLD_ALCHEMY.Editor.DeleteConfirmContent')}</p>`
      });
      if (confirm) {
        await RecipeRegistry.deleteCustomRecipe(recipeId);
        this.render();
      }
    }
  }

  static async _onOpenIngredientsCompendium(event, target) {
    await CompendiumEngine.openIngredientsCompendium();
  }

  static async _onOpenPotionsCompendium(event, target) {
    await CompendiumEngine.openPotionsCompendium();
  }

  static async _onOpenRecipesCompendium(event, target) {
    await CompendiumEngine.openRecipesCompendium();
  }

  /* -------------------------------------------- */
  /*  Listenery DOM i Obsługa Drag & Drop         */
  /* -------------------------------------------- */

  _onRender(context, options) {
    super._onRender(context, options);

    const html = this.element;
    if (!html) return;

    // Wybór poziomu laboratorium
    const labSelect = html.querySelector('select[name="labTier"]');
    if (labSelect) {
      labSelect.addEventListener('change', (ev) => {
        this.selectedLabTier = ev.target.value;
      });
    }

    // ApplicationV2 reuses root element on render; bind delegated listeners only once.
    if (this._alchemyDnDBoundElement !== html) {
      this._alchemyDnDBoundElement = html;

      // Image errors do not bubble; capture one delegated listener instead of one per icon.
      html.addEventListener('error', (ev) => {
        const image = ev.target;
        if (!image?.matches?.('[data-alchemy-image]') || image.dataset.fallbackApplied) return;
        image.dataset.fallbackApplied = 'true';
        image.src = image.dataset.fallbackSrc || ALCHEMY_IMAGE_FALLBACKS.potion;
      }, true);

      html.addEventListener('dragstart', (ev) => {
        const card = ev.target.closest?.('.recipe-card[data-recipe-id]');
        if (!card) return;
        ev.dataTransfer.setData('text/plain', JSON.stringify({ recipeId: card.dataset.recipeId }));
        ev.dataTransfer.effectAllowed = 'copy';
      });

      html.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';
      });

      html.addEventListener('drop', async (ev) => {
        ev.preventDefault();

        let data = null;
        try {
          data = JSON.parse(ev.dataTransfer.getData('text/plain'));
        } catch (_) {}

        if (!data) return;
        const bookCard = ev.target.closest?.('.recipe-book-card[data-book-id]');
        const targetBook = bookCard ? this.actor.items.get(bookCard.dataset.bookId) : null;
        const handled = await RecipeRegistry.handleRecipeDrop(this.actor, data, targetBook);
        // Updating a book triggers the coalesced item hook; memorization changes actor flags only.
        if (handled && !targetBook) this.render();
      });
    }
  }
}
