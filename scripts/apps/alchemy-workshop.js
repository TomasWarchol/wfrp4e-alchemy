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
import { createBook, openBook } from '../../../wfrp4e-grimoires/scripts/public.mjs';
import { ALCHEMY_BOOK_KIND } from '../logic/recipe-book-data.js';
import { useWorkbench } from '../ui.js';
import { workbenchContext } from './workbench-view.js';
import { getPendingBrews } from '../logic/pending-brews.js';
import { formatSlMod, getActorLaboratories, labBrewUsage, selectDefaultLabId } from '../logic/laboratories.js';
import { ALCHEMY_INGREDIENTS } from '../data/ingredients.js';

const INGREDIENT_CATEGORY = new Map(ALCHEMY_INGREDIENTS.map((ing) => [ing.key, ing.category]));

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
    this.selectedLabId = null;
    this.gmDrawerOpen = false;

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
      openBook: this._onOpenBook,
      createRecipeBook: this._onCreateRecipeBook,
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
      openRecipesCompendium: this._onOpenRecipesCompendium,
      toggleGmDrawer: this._onToggleGmDrawer
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
    const recipeBooksCount = bookItems.recipeBooks.length;
    let recipeBooks = RecipeRegistry.getRecipeBookDetails(this.actor, [...bookItems.recipeBooks, ...bookItems.emptyBooks]);

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
    // Posiadane laboratoria i aparatury: każde ma własny modyfikator PS oraz liczbę kotłów
    const pendingBrews = getPendingBrews(this.actor);
    const labs = getActorLaboratories(this.actor);
    const labUsage = labBrewUsage(labs, pendingBrews);
    this.selectedLabId = selectDefaultLabId(labUsage.list, this.selectedLabId);
    const selectedLabEntry = this.selectedLabId ? (labUsage.byId.get(this.selectedLabId) ?? null) : null;
    const canStartInSelectedLab = Boolean(selectedLabEntry && selectedLabEntry.free > 0);
    const currentTimestamp = CalendarIntegration.getCurrentTimestamp();
    const recipes = categoryRecipes.map(recipe => {
      const ingCheck = BrewingEngine.checkIngredients(this.actor, recipe, ingredientInventory);
      const knowledge = RecipeRegistry.getRecipeKnowledge(this.actor, recipe, memorizedIds, grimoireMap, memoryState);

      const catLabel = RecipeRegistry.categoryLabel(recipe);

      // Receptura może być warzona, jeśli jest znana (z pamięci lub z księgi) i są składniki oraz podtrzymanie
      const isKnown = knowledge.isMemorized || knowledge.isFromBook;
      const hasTether = recipe.attunementCost === 0 || capacityState.available >= recipe.attunementCost;
      const ownBrew = pendingBrews.find((b) => b.recipeId === recipe.id && currentTimestamp >= b.completesAt)
        ?? pendingBrews.find((b) => b.recipeId === recipe.id);
      const isPendingBrew = Boolean(ownBrew);
      // A4: przy rezerwacji składniki i Więź tego warzenia są już w kotle
      const reservedPending = isPendingBrew && Boolean(ownBrew.reserved);
      const canBrew = (!requireDiscovery || isKnown) && (reservedPending || (ingCheck.canBrew && hasTether))
        && (isPendingBrew ? currentTimestamp >= ownBrew.completesAt : canStartInSelectedLab);

      return {
        ...recipe,
        img: resolveAlchemyImage(recipe.img, 'potion'),
        canBrew,
        isPendingBrew,
        pendingBrewReady: isPendingBrew && currentTimestamp >= ownBrew.completesAt,
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
      const dosesLabel = selectedRecipe.dosesFormula === '1d10'
        ? game.i18n.localize('GOLD_ALCHEMY.Details.DosesBatch')
        : selectedRecipe.dosesFormula === '1d3'
          ? game.i18n.localize('GOLD_ALCHEMY.Details.DosesSmallBatch')
          : '1';
      selectedRecipe = {
        ...selectedRecipe,
        creationTimeLabel: RecipeRegistry.formatCreationTime(selectedRecipe.creationTimeDays),
        dosesLabel,
        priceLabel: RecipeRegistry.priceLabel(selectedRecipe.listPriceSS)
      };
    }

    const currentDateFormatted = CalendarIntegration.formatDate(CalendarIntegration.getCurrentTimestamp());

      const labLookup = new Map(labs.map((l) => [l.id, l]));
      const formatBrew = (brew) => {
        const liveLab = brew.labItemId ? labLookup.get(brew.labItemId) : null;
        const labName = liveLab?.name || brew.labName
          || (brew.labTierId ? game.i18n.localize(ALCHEMY_CONFIG.LAB_TIERS[brew.labTierId]?.name || '') : '')
          || game.i18n.localize('GOLD_ALCHEMY.LabItem.UnknownLab');
        const slMod = liveLab ? liveLab.slMod : (Number.isFinite(Number(brew.labSlMod)) ? Number(brew.labSlMod) : 0);
        const ready = currentTimestamp >= brew.completesAt;
        const date = CalendarIntegration.formatDate(brew.completesAt);
        return {
          ...brew,
          id: brew.id || brew.recipeId,
          name: brew.recipeName,
          labName,
          labSlLabel: formatSlMod(slMod),
          isReady: ready,
          ready,
          completionDate: date,
          date,
          statusText: game.i18n.format('GOLD_ALCHEMY.Details.PendingBrewInLab', {
            recipe: brew.recipeName,
            lab: `${labName} (${formatSlMod(slMod)} ${game.i18n.localize('GOLD_ALCHEMY.Workbench.SL')})`,
            date
          })
        };
      };
      const activeBrews = pendingBrews.map(formatBrew);
      const laboratories = labUsage.list.map((lab) => ({
        id: lab.id,
        name: lab.name,
        slMod: lab.slMod,
        slLabel: formatSlMod(lab.slMod),
        used: lab.used,
        total: lab.total,
        free: lab.free,
        full: lab.free <= 0,
        icon: lab.icon,
        selected: lab.id === this.selectedLabId
      }));
      const selectedLab = laboratories.find((l) => l.id === this.selectedLabId) ?? null;

      const context = {
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
      recipeBooksCount,
      recipeBooks,
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
      laboratories,
      hasLaboratories: laboratories.length > 0,
      multipleLaboratories: laboratories.length > 1,
      selectedLabId: this.selectedLabId,
      selectedLab,
      labIcon: selectedLab?.icon ?? 'ui-lab_poor',
      tetheredPotions: capacityState.tethered,
      currentDateFormatted,
      gmDrawerOpen: this.gmDrawerOpen,
      // Warzenie w toku wybranej receptury (a w widoku klasycznym – pierwsze, jak dawniej)
      pendingBrew: (() => {
        const match = activeBrews.find((b) => b.recipeId === selectedRecipe?.id && b.isReady)
          ?? activeBrews.find((b) => b.recipeId === selectedRecipe?.id)
          ?? (useWorkbench() ? null : activeBrews[0]);
        return match ?? null;
      })(),
      cauldrons: {
        total: labUsage.totalCapacity,
        used: labUsage.totalUsed,
        brewing: activeBrews
      }
    };
    // Pracownia: te same dane ułożone dla nowego wyglądu (ustawienie klienta „Wygląd warsztatu”)
    const workbench = useWorkbench();
    return workbench
      ? { ...context, workbench, ...workbenchContext(context, { ingredientCategory: (key) => INGREDIENT_CATEGORY.get(key) }) }
      : { ...context, workbench };
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

  /** Pracownia: wysuwana szuflada z narzędziami MG. */
  static _onToggleGmDrawer() {
    this.gmDrawerOpen = !this.gmDrawerOpen;
    this.render();
  }

  static _onToggleBookManager() {
    this.showBookManager = !this.showBookManager;
    this.render();
  }

  static _onOpenBook(event, target) {
    const book = this.actor.items.get(target.closest('[data-book-id]')?.dataset.bookId);
    if (book) openBook(book);
  }

  static async _onCreateRecipeBook() {
    if (game.user.isGM) await createBook(this.actor, ALCHEMY_BOOK_KIND);
  }

  static async _onSaveActorAlchemySettings(event, target) {
    if (!game.user.isGM) return;
    const root = target.closest('.gm-alchemy-settings, .al-drawer');
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
    const recipeId = target.dataset.recipeId || this.selectedRecipeId;
    const brewId = target.dataset.brewId || null;
    const recipe = RecipeRegistry.getRecipeById(recipeId);
    if (!recipe || !isSourceModuleActive(recipe.sourceModule)) return;

    target.disabled = true;
    try {
      await BrewingEngine.brew(this.actor, recipe, this.selectedLabId, brewId);
    } finally {
      this.render();
    }
  }

  static async _onCancelPendingBrew(event, target) {
    if (!game.user.isGM) return;
    const id = target.dataset.brewId || this.selectedRecipeId;
    await BrewingEngine.cancelPendingBrew(this.actor, id);
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
    html.classList.toggle('al-workbench', Boolean(context.workbench));
    html.dataset.tradition = context.selectedRecipe?.tradition ?? '';
    html.dataset.wind = context.selectedRecipe?.wind ?? '';
    // Klawiatura: elementy z akcją, które nie są przyciskami (wiersze receptur), reagują na Enter i Spację
    for (const el of html.querySelectorAll('[data-action]:not(button, input, select, textarea, a)')) {
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (el.dataset.alKeys) continue;
      el.dataset.alKeys = '1';
      el.addEventListener('keydown', (ev) => {
        if (ev.target !== el || (ev.key !== 'Enter' && ev.key !== ' ')) return;
        ev.preventDefault();
        el.click();
      });
    }

    // Wybór posiadanej aparatury / laboratorium
    const labSelect = html.querySelector('select[name="labItemId"]');
    if (labSelect) {
      labSelect.addEventListener('change', (ev) => {
        this.selectedLabId = ev.target.value;
        this.render();
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
