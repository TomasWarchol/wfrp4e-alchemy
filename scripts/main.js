/**
 * WFRP4e - Alchemia Starego Świata (Imperial Alchemy)
 * Główny punkt wejścia modułu z pełnym wsparciem i18n
 */

import { MODULE_ID, ALCHEMY_CONFIG, isSourceModuleActive } from './config.js';
import { AlchemyQueries } from './queries.js';
import { CapacityEngine } from './logic/capacity-engine.js';
import { iconMarkup, registerUi, syncChatStyle, windMarkup } from './ui.js';
import { registerInventory } from './inventory.js';
import { BrewingEngine } from './logic/brewing-engine.js';
import { PotionConsumer } from './logic/potion-consumer.js';
import { AddictionEngine } from './logic/addiction.js';
import { SpoilageEngine } from './logic/spoilage-engine.js';
import { CalendarIntegration } from './calendar-integration.js';
import { AlchemyWorkshopApp } from './apps/alchemy-workshop.js';
import { ALCHEMY_RECIPES } from './data/recipes.js';
import { CompendiumEngine } from './logic/compendium-engine.js';
import { RecipeRegistry } from './logic/recipe-registry.js';
import { registry, registerSheetButton } from '../../wfrp4e-companion-lib/scripts/companion-lib.mjs';
import { isBook, readBook, registerBookKind, registerCopyCost, registerEntryType, writeBook } from '../../wfrp4e-grimoires/scripts/public.mjs';
import { recipeEntryType } from './logic/recipe-entry-type.js';
import { ALCHEMY_BOOK_KIND, alchemyBookKind, isRecipeOnlyBook, legacyBookUpdate } from './logic/recipe-book-data.js';

registerEntryType(recipeEntryType);
registerBookKind(alchemyBookKind);

// Przepisywanie wymaga atramentu: zaklęcia i receptury magiczne, po jednym na stronę
const INK = { key: 'AlchemicalInk', name: 'GOLD_ALCHEMY.Ingredients.AlchemicalInk' };
registerCopyCost(({ entry, pages, actor }) => {
  if (!game.settings.get(MODULE_ID, 'copyNeedsInk')) return null;
  const recipe = entry.type === 'recipe' ? RecipeRegistry.getRecipeById(entry.data.recipeId) : null;
  if (recipe && !RecipeRegistry.isMagical(recipe)) return null;
  const need = { ingredients: [{ ...INK, quantity: pages }] };
  return {
    label: `${game.i18n.localize(INK.name)} ×${pages}`,
    available: BrewingEngine.checkIngredients(actor, need).canBrew,
    consume: () => BrewingEngine.consumeIngredients(actor, need)
  };
});

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | Old World Alchemy – init`);

  // Rejestracja w Centrum Dodatków dla MG (GM Hub)
  registry.registerFeature({
    id: "alchemy",
    name: "WFRP4E_COMPANION.Features.Alchemy",
    icon: "fas fa-flask",
    description: "WFRP4E_COMPANION.Features.AlchemyDesc",
    module: MODULE_ID,
    open: (actor) => game.alchemy.openWorkshop(actor)
  });

  // Zapytania do MG / właścicieli zamiast surowego socketu
  AlchemyQueries.init();
  CapacityEngine.registerHooks();
  registerUi();
  registerInventory();

  // Rejestracja ustawień modułu
  game.settings.register(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.REQUIRE_DISCOVERY, {
    name: 'GOLD_ALCHEMY.Settings.RequireDiscovery',
    hint: 'GOLD_ALCHEMY.Settings.RequireDiscoveryHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  // Warunki należą teraz do księgi; ustawienie służy konwersji starych ksiąg
  // A3: laboratorium należy do postaci i ustawia je MG (gracz nie wybiera poziomu przy każdym warzeniu)
  game.settings.register(MODULE_ID, 'labByGM', {
    name: 'GOLD_ALCHEMY.Settings.LabByGM',
    hint: 'GOLD_ALCHEMY.Settings.LabByGMHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  // A4: rozpoczęcie warzenia od razu zużywa składniki i rezerwuje Więź do końca warzenia
  game.settings.register(MODULE_ID, 'reserveOnStart', {
    name: 'GOLD_ALCHEMY.Settings.ReserveOnStart',
    hint: 'GOLD_ALCHEMY.Settings.ReserveOnStartHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  // A5: jakość mikstury z PS warzenia (dodatkowe dawki, tańsza Więź dla wybornej)
  game.settings.register(MODULE_ID, 'qualityFromSL', {
    name: 'GOLD_ALCHEMY.Settings.QualityFromSL',
    hint: 'GOLD_ALCHEMY.Settings.QualityFromSLHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  // A6: premia Chamonu w pamięci receptur
  game.settings.register(MODULE_ID, 'chamonBonusMode', {
    name: 'GOLD_ALCHEMY.Settings.ChamonBonusMode',
    hint: 'GOLD_ALCHEMY.Settings.ChamonBonusModeHint',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      freeRecipes: 'GOLD_ALCHEMY.Settings.ChamonFreeRecipes',
      both: 'GOLD_ALCHEMY.Settings.ChamonBoth',
      slots: 'GOLD_ALCHEMY.Settings.ChamonSlots'
    },
    default: 'freeRecipes'
  });

  // A7: skutki katastrof przy pechu działają same
  game.settings.register(MODULE_ID, 'automateDisasters', {
    name: 'GOLD_ALCHEMY.Settings.AutomateDisasters',
    hint: 'GOLD_ALCHEMY.Settings.AutomateDisastersHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  // Nałóg – zasada domowa dla mikstur uzależniających
  game.settings.register(MODULE_ID, 'addiction', {
    name: 'GOLD_ALCHEMY.Settings.Addiction',
    hint: 'GOLD_ALCHEMY.Settings.AddictionHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });
  AddictionEngine.init();

  game.settings.register(MODULE_ID, 'requireEquippedBooks', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.CUSTOM_RECIPES, {
    scope: 'world',
    config: false,
    type: Array,
    default: []
  });

  // Wersja danych mikstur w kompendium (odbudowa po zmianie efektów)
  game.settings.register(MODULE_ID, 'compendiumLang', {
    scope: 'world',
    config: false,
    type: String,
    default: ''
  });

  game.settings.register(MODULE_ID, 'copyNeedsInk', {
    name: 'GOLD_ALCHEMY.Settings.CopyNeedsInk',
    hint: 'GOLD_ALCHEMY.Settings.CopyNeedsInkHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, 'recipesDataVersion', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0
  });

  game.settings.register(MODULE_ID, 'alchemyBooksMigrated', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, 'booksMigrated', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, 'potionsDataVersion', {
    scope: 'world',
    config: false,
    type: Number,
    default: 0
  });

  foundry.applications.handlebars.loadTemplates([
    `modules/${MODULE_ID}/templates/workshop-app.hbs`,
    `modules/${MODULE_ID}/templates/recipe-editor.hbs`,
    `modules/${MODULE_ID}/templates/parts/workshop-classic.hbs`,
    `modules/${MODULE_ID}/templates/parts/workshop-workbench.hbs`
  ]);

});

// Karty czatu w wyglądzie pracowni: sanitizer wycina <svg>, więc karta niesie data-al-glyph / data-al-wind
Hooks.on('renderChatMessageHTML', (_message, html) => {
  for (const el of html.querySelectorAll?.('.gold-alchemy-card [data-al-glyph], .gold-alchemy-card [data-al-wind]') ?? []) {
    if (el.querySelector('svg')) continue;
    el.insertAdjacentHTML('afterbegin', el.dataset.alWind ? windMarkup(el.dataset.alWind) : iconMarkup(el.dataset.alGlyph));
  }
});

Hooks.once('ready', async () => {
  syncChatStyle();
  await CompendiumEngine.initializeCompendiums();
  await migrateRecipeBooks();
  await migrateAlchemyBooks();

  game.alchemy = {
    CapacityEngine,
    BrewingEngine,
    PotionConsumer,
    SpoilageEngine,
    CalendarIntegration,
    CompendiumEngine,
    RecipeRegistry,
    openIngredients: () => CompendiumEngine.openIngredientsCompendium(),
    openPotions: () => CompendiumEngine.openPotionsCompendium(),
    openRecipes: () => CompendiumEngine.openRecipesCompendium(),
    isSourceModuleActive,
    get activeRecipes() {
      return RecipeRegistry.getActiveRecipes();
    },
    /** Receptury z włączonych podręczników (to samo co activeRecipes). */
    get recipes() {
      return RecipeRegistry.getActiveRecipes();
    },
    openWorkshop: (actor) => {
      const targetActor = actor || game.user.character || canvas.tokens?.controlled?.[0]?.actor || Array.from(game.actors?.values() || []).find(a => a.isOwner);
      if (!targetActor) {
        ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.SelectCharacter'));
        return;
      }
      if (!game.user.isGM) {
        if (!targetActor.isOwner || !registry.isFeatureUnlocked(targetActor, 'alchemy')) {
          ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.WorkshopUnavailable'));
          return;
        }
      }
      const existing = foundry.applications?.instances?.get('alchemy-workshop-app');
      if (existing) {
        existing.render({ force: true });
        existing.bringToFront?.();
        return;
      }
      new AlchemyWorkshopApp(targetActor).render({ force: true });
    }
  };

  // Rejestracja opcji menu kontekstowego "Wypij miksturę" na kartach postaci WFRP4e
  const drinkPotionLabel = game.i18n.localize('GOLD_ALCHEMY.Action.DrinkPotion');
  const findPotion = (sheet, target) => {
    const el = target instanceof HTMLElement ? target : target?.[0];
    if (!el) return null;
    const uuid = el.closest('[data-uuid]')?.dataset.uuid;
    let doc = null;
    if (uuid) {
      try {
        doc = fromUuidSync(uuid);
      } catch (_) {}
    } else if (el.dataset.documentId || el.dataset.itemId) {
      doc = sheet.actor?.items?.get(el.dataset.documentId || el.dataset.itemId);
    }
    const isPotion = doc?.documentName === 'Item' && doc.type === 'trapping' && doc.system?.trappingType?.value === 'drugsPoisonsHerbsDraughts';
    return isPotion ? doc : null;
  };
  // Pozycje menu w formacie ContextMenuEntry z Foundry v14 (label / visible / onClick).
  // Mikstury bojowe się rzuca (we wskazane tokeny), pozostałe pije.
  const throwPotionLabel = game.i18n.localize('GOLD_ALCHEMY.Action.ThrowPotion');
  const buildDrinkOption = (sheet) => ({
    label: drinkPotionLabel,
    icon: '<i class="fas fa-wine-bottle"></i>',
    visible: target => {
      const doc = findPotion(sheet, target);
      return !!doc && !PotionConsumer.isThrowable(doc);
    },
    onClick: async (event, target) => {
      const doc = findPotion(sheet, target);
      if (doc && sheet.actor) await PotionConsumer.consume(doc, sheet.actor);
    }
  });
  const buildThrowOption = (sheet) => ({
    label: throwPotionLabel,
    icon: '<i class="fas fa-bomb"></i>',
    visible: target => PotionConsumer.isThrowable(findPotion(sheet, target)),
    onClick: async (event, target) => {
      const doc = findPotion(sheet, target);
      if (doc && sheet.actor) await PotionConsumer.throwPotion(doc, sheet.actor);
    }
  });

  const patchedClasses = new Set();
  for (const type in (CONFIG.Actor?.sheetClasses || {})) {
    for (const sheetId in CONFIG.Actor.sheetClasses[type]) {
      const cls = CONFIG.Actor.sheetClasses[type][sheetId]?.cls;
      if (cls && cls.prototype && typeof cls.prototype._getContextMenuOptions === 'function' && !patchedClasses.has(cls)) {
        patchedClasses.add(cls);
        const origMethod = cls.prototype._getContextMenuOptions;
        cls.prototype._getContextMenuOptions = function() {
          const options = origMethod.call(this) || [];
          if (!options.some(opt => (opt.label ?? opt.name) === drinkPotionLabel)) {
            options.push(buildDrinkOption(this), buildThrowOption(this));
          }
          return options;
        };
      }
    }
  }


  console.log(`${MODULE_ID} | Module ready. API accessible at game.alchemy`);
});

const legacyOptions = () => ({
  carried: game.settings.get(MODULE_ID, 'requireEquippedBooks') === true,
  resolve: id => RecipeRegistry.getRecipeById(id)
});

/** Jednorazowa konwersja ksiąg i zwojów receptur sprzed 1.6 w całym świecie (aktywny MG). */
async function migrateRecipeBooks() {
  if (game.user !== game.users.activeGM || game.settings.get(MODULE_ID, 'booksMigrated')) return;
  const options = legacyOptions();
  const updatesFor = items => [...items].flatMap(item => {
    const update = legacyBookUpdate(item, options);
    return update ? [{ _id: item.id, ...update }] : [];
  });

  const worldItems = updatesFor(game.items);
  if (worldItems.length) await Item.updateDocuments(worldItems);
  const tokenActors = game.scenes.contents.flatMap(scene => scene.tokens.contents.filter(token => !token.actorLink && token.actor).map(token => token.actor));
  for (const actor of [...game.actors, ...tokenActors]) {
    const updates = updatesFor(actor.items);
    if (updates.length) await actor.updateEmbeddedDocuments('Item', updates);
  }
  await game.settings.set(MODULE_ID, 'booksMigrated', true);
}

/**
 * Jednorazowo (aktywny MG): księgi z samymi recepturami stają się księgami alchemicznymi – własny dział
 * w ekwipunku, działają z samego ekwipunku. Księgi z zaklęciami i recepturami zostają księgami zaklęć.
 * Pojemność się nie zmienia (dotychczasowe księgi receptur nie miały limitu).
 */
async function migrateAlchemyBooks() {
  if (game.user !== game.users.activeGM || game.settings.get(MODULE_ID, 'alchemyBooksMigrated')) return;
  const updatesFor = items => [...items].flatMap(item => {
    const book = readBook(item);
    return isRecipeOnlyBook(book) ? [{ _id: item.id, ...writeBook({ ...book, kind: ALCHEMY_BOOK_KIND }) }] : [];
  });
  const worldItems = updatesFor(game.items);
  if (worldItems.length) await Item.updateDocuments(worldItems);
  const tokenActors = game.scenes.contents.flatMap(scene => scene.tokens.contents.filter(token => !token.actorLink && token.actor).map(token => token.actor));
  let count = worldItems.length;
  for (const actor of [...game.actors, ...tokenActors]) {
    const updates = updatesFor(actor.items);
    count += updates.length;
    if (updates.length) await actor.updateEmbeddedDocuments('Item', updates);
  }
  await game.settings.set(MODULE_ID, 'alchemyBooksMigrated', true);
  if (count) console.log(`${MODULE_ID} | ${count} recipe books became alchemical books`);
}

// Przedmioty w starym formacie, które trafiają do świata później (np. z importu)
Hooks.on('preCreateItem', item => {
  if (!game.ready) return;
  const update = legacyBookUpdate(item, legacyOptions());
  if (update) item.updateSource(update);
});

function refreshOpenWorkshop(document) {
  const workshop = foundry.applications?.instances?.get('alchemy-workshop-app');
  const ownerId = document?.parent?.id || document?.id;
  if (workshop?.actor?.id !== ownerId) return;
  // Inventory totals stay cached while navigating tabs; invalidate when any owned item changes.
  workshop._alchemyIngredientInventoryCache = null;
  const isRecipeBook = isBook(document);
  const isLanguageSkill = document.type === 'skill' && /(language|język)/i.test(document.name || '');
  const isReadingTalent = document.type === 'talent' && /read|czyt/i.test(document.name || '');
  if ((isRecipeBook || isLanguageSkill || isReadingTalent) && !workshop._alchemyRefreshScheduled) {
    workshop._alchemyRefreshScheduled = true;
    requestAnimationFrame(() => {
      workshop._alchemyRefreshScheduled = false;
      if (foundry.applications.instances.get('alchemy-workshop-app') === workshop) workshop.render();
    });
  }
}

Hooks.on('updateItem', refreshOpenWorkshop);
Hooks.on('createItem', refreshOpenWorkshop);
Hooks.on('deleteItem', refreshOpenWorkshop);

/* -------------------------------------------- */
/*  Przycisk na karcie postaci                  */
/* -------------------------------------------- */

registerSheetButton({
  featureId: "alchemy",
  className: "open-alchemy-workshop",
  icon: "fa-solid fa-flask",
  label: "GOLD_ALCHEMY.Button.Alchemy",
  action: "alchemyWorkshop",
  legacyClasses: ["alchemy-sheet-tab"],
  onClick: (actor) => game.alchemy.openWorkshop(actor)
});



// Obsługa przeciągania receptur na kartę postaci
Hooks.on('dropActorSheetData', async (actor, sheet, data) => {
  if (!actor || !data) return;
  if (data.type === 'Item' || data.recipeId) {
    const handled = await RecipeRegistry.handleRecipeDrop(actor, data);
    if (handled) return false;
  }
});
