/**
 * Okno Kreatora i Edytora Receptur dla Mistrza Gry (ApplicationV2)
 */

import { MODULE_ID, ALCHEMY_CONFIG } from '../config.js';
import { RecipeRegistry } from '../logic/recipe-registry.js';
import { ALCHEMY_INGREDIENTS } from '../data/ingredients.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RecipeEditorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(recipe = null, options = {}) {
    super(options);
    this.recipe = recipe ? foundry.utils.deepClone(recipe) : this._getDefaultRecipe();
  }

  static DEFAULT_OPTIONS = {
    id: 'alchemy-recipe-editor',
    classes: ['wfrp4e', 'gold-alchemy-editor'],
    tag: 'form',
    window: {
      title: 'GOLD_ALCHEMY.Editor.Title',
      icon: 'fa-solid fa-scroll',
      resizable: true
    },
    position: {
      width: 620,
      height: 720
    },
    actions: {
      addIngredient: this._onAddIngredient,
      removeIngredient: this._onRemoveIngredient,
      saveRecipe: this._onSaveRecipe
    }
  };

  static PARTS = {
    editor: {
      template: `modules/${MODULE_ID}/templates/recipe-editor.hbs`,
      scrollable: ['.editor-scroll']
    }
  };

  /** Otwiera edytor; poprzednio otwarty edytor (to samo id okna) jest najpierw zamykany. */
  static async open(recipe = null) {
    await foundry.applications.instances.get(this.DEFAULT_OPTIONS.id)?.close();
    return new this(recipe).render({ force: true });
  }

  _getDefaultRecipe() {
    return {
      id: `custom-recipe-${foundry.utils.randomID(8)}`,
      key: `CustomRecipe${foundry.utils.randomID(4)}`,
      name: '',
      category: 'apothecary',
      sourceModule: 'wfrp4e-alchemy',
      attunementCost: 0,
      testSkill: game.i18n.localize('GOLD_ALCHEMY.Editor.DefaultSkill'),
      difficulty: 0,
      volatility: 'moderate',
      creationDifficultySL: 0,
      creationTimeDays: 2,
      shelfLifeDays: 60,
      bonusDaysPerSL: 10,
      expiryMode: 'spoilage',
      img: 'icons/consumables/potions/bottle-round-corked-amber.webp',
      ingredients: [
        { key: 'PureWater', name: 'GOLD_ALCHEMY.Ingredients.PureWater', quantity: 1, costZK: 0.25 }
      ],
      description: '',
      effectDescription: ''
    };
  }

  async _prepareContext(options) {
    const categories = ["apothecary", "mundane", "herbal", "college-chamon", "college-aqshy", "college-azyr", "college-ghyran", "college-ghur", "college-hysh", "college-shyish", "college-ulgu", "forbidden"].map(id => ({ id, name: game.i18n.localize(`GOLD_ALCHEMY.Editor.Categories.${id}`) }));

    const volatilityOptions = [
      { value: 'minor', label: game.i18n.localize('GOLD_ALCHEMY.Editor.VolatilityMinor') },
      { value: 'moderate', label: game.i18n.localize('GOLD_ALCHEMY.Editor.VolatilityModerate') },
      { value: 'major', label: game.i18n.localize('GOLD_ALCHEMY.Editor.VolatilityMajor') },
      { value: 'extreme', label: game.i18n.localize('GOLD_ALCHEMY.Editor.VolatilityExtreme') }
    ];
    const expiryOptions = [
      { value: 'spoilage', label: game.i18n.localize('GOLD_ALCHEMY.Editor.ExpirySpoilage') },
      { value: 'deactivate', label: game.i18n.localize('GOLD_ALCHEMY.Editor.ExpiryDeactivate') }
    ];

    const availableIngredients = ALCHEMY_INGREDIENTS.map(ing => ({
      key: ing.key,
      name: game.i18n ? game.i18n.localize(ing.name) : ing.name
    }));

    return {
      recipe: this.recipe,
      categories,
      volatilityOptions,
      expiryOptions,
      availableIngredients,
      isEdit: Boolean(RecipeRegistry.getRecipeById(this.recipe.id))
    };
  }


  /* -------------------------------------------- */
  /*  Obsługa Akcji                               */
  /* -------------------------------------------- */

  static _onAddIngredient(event, target) {
    this._readFormData();
    this.recipe.ingredients.push({
      key: 'IronFilings',
      name: 'GOLD_ALCHEMY.Ingredients.IronFilings',
      quantity: 1,
      costZK: 1
    });
    this.render();
  }

  static _onRemoveIngredient(event, target) {
    this._readFormData();
    const index = Number(target.dataset.index);
    if (!isNaN(index) && index >= 0 && index < this.recipe.ingredients.length) {
      this.recipe.ingredients.splice(index, 1);
      this.render();
    }
  }

  static async _onSaveRecipe(event, target) {
    if (!game.user.isGM) {
      ui.notifications.error(game.i18n.localize('GOLD_ALCHEMY.Notifications.GMOnlyAction'));
      return;
    }
    this._readFormData();

    if (!this.recipe.name.trim()) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.RecipeNameRequired'));
      return;
    }

    if (!this.recipe.ingredients.length) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.IngredientRequired'));
      return;
    }

    const saved = await RecipeRegistry.saveCustomRecipe(this.recipe);
    if (saved) {
      // Odświeżenie instancji Warsztatu
      const workshop = foundry.applications?.instances?.get('alchemy-workshop-app');
      if (workshop) workshop.render({ force: true });
      this.close();
    }
  }

  _readFormData() {
    const form = this.element instanceof HTMLFormElement ? this.element : this.element?.querySelector('form');
    if (!form) return;

    const fd = new FormData(form);
    this.recipe.name = fd.get('name') || this.recipe.name;
    this.recipe.category = fd.get('category') || this.recipe.category;
    this.recipe.attunementCost = Number(fd.get('attunementCost')) || 0;
    this.recipe.testSkill = fd.get('testSkill') || this.recipe.testSkill;
    this.recipe.volatility = fd.get('volatility') || 'moderate';
    this.recipe.creationDifficultySL = Number(fd.get('creationDifficultySL')) || 0;
    const creationTimeDays = Number(fd.get('creationTimeDays'));
    this.recipe.creationTimeDays = Number.isFinite(creationTimeDays) ? Math.max(0.25, creationTimeDays) : 1;
    const shelfLifeDays = Number(fd.get('shelfLifeDays'));
    this.recipe.shelfLifeDays = Number.isFinite(shelfLifeDays) ? Math.max(1, shelfLifeDays) : 30;
    const bonusDaysPerSL = Number(fd.get('bonusDaysPerSL'));
    this.recipe.bonusDaysPerSL = Number.isFinite(bonusDaysPerSL) ? Math.max(0, bonusDaysPerSL) : 5;
    this.recipe.expiryMode = fd.get('expiryMode') === 'deactivate' ? 'deactivate' : 'spoilage';
    this.recipe.img = fd.get('img') || this.recipe.img;
    this.recipe.description = fd.get('description') || '';
    this.recipe.effectDescription = fd.get('effectDescription') || '';

    // Odczyt składników z dynamicznych pól
    const ingKeys = fd.getAll('ingKey');
    const ingQtys = fd.getAll('ingQty');

    this.recipe.ingredients = ingKeys.map((key, i) => {
      const known = ALCHEMY_INGREDIENTS.find(k => k.key === key);
      return {
        key,
        name: known ? known.name : key,
        quantity: Math.max(1, Number(ingQtys[i]) || 1),
        costZK: known ? (Number(known.price?.gc) || 0) + (Number(known.price?.ss) || 0) / 20 + (Number(known.price?.bp) || 0) / 240 : 1
      };
    });
  }

  _onRender(context, options) {
    super._onRender(context, options);

    const html = this.element;
    if (!html) return;

    // Przycisk wyboru ikony przez FilePicker
    const imgPickerBtn = html.querySelector('.file-picker-btn');
    if (imgPickerBtn) {
      imgPickerBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const input = html.querySelector('input[name="img"]');
        const fp = new foundry.applications.apps.FilePicker.implementation({
          type: 'image',
          current: input?.value || '',
          callback: path => {
            if (input) input.value = path;
            const preview = html.querySelector('.recipe-img-preview');
            if (preview) preview.src = path;
          }
        });
        fp.render({ force: true });
      });
    }
  }
}
