/**
 * Silnik Warzenia Mikstur z pełną lokalizacją i dopasowaniem dwujęzycznym
 */

import { MODULE_ID, ALCHEMY_CONFIG } from '../config.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { CapacityEngine } from './capacity-engine.js';
import { RecipeRegistry } from './recipe-registry.js';
import { resolveAlchemyImage } from '../data/image-compatibility.js';
import { buildPotionEffectData } from './effect-data.js';
import { brewingModifiers, hasTalent, isTestSuccess, mundaneBatchQuantity, potionQuality } from './rules.js';
import { damagedLabSlMod, formatSlMod, getActorLaboratories, labBrewUsage, selectDefaultLabId } from './laboratories.js';
import { recipeTradition, recipeWind } from '../ui.js';
import { ALCHEMY_INGREDIENTS, createIngredientItemData } from '../data/ingredients.js';
import { getPendingBrews, setPendingBrews } from './pending-brews.js';

/** Atrybuty karty czatu dla wyglądu pracowni: tradycja, wiatr i ikona (ikony dokłada hook renderu czatu). */
const cardAttrs = (recipe) => `data-tradition="${recipeTradition(recipe)}" data-wind="${recipeWind(recipe) ?? ''}"`;
const cardMark = (recipe) => {
  const wind = recipeWind(recipe);
  return wind ? `<span class="al-chat-mark" data-al-wind="${wind}"></span>` : `<span class="al-chat-mark" data-al-glyph="ui-tab_${{ colleges: 'colleges', alchemy: 'alchemy', apothecary: 'apothecary', herbal: 'herbal', forbidden: 'forbidden' }[recipeTradition(recipe)]}"></span>`;
};

export class BrewingEngine {
  static INGREDIENT_ALIASES = {
    IronFilings: ['GoldIronFilings'],
    GoldIronFilings: ['IronFilings'],
    Mercury: ['PurifiedQuicksilver', 'QuicksilverCondensate'],
    PurifiedQuicksilver: ['Mercury'],
    Sulfur: ['YellowSulphur', 'SaltpetreSulphur'],
    YellowSulphur: ['Sulfur'],
    RockOil: ['KeroseneRockOil'],
    PureAlcohol: ['NulnWineSpirits', 'ApothecarySpirits'],
    GrainAlcohol: ['PureAlcohol', 'NulnWineSpirits', 'ApothecarySpirits'],
    DistilledSpirits: ['PureAlcohol', 'NulnWineSpirits', 'ApothecarySpirits'],
    AmmoniaSalts: ['AmmoniumCarbonate', 'AlchemicalSalts'],
    AlchemicalSalts: ['AmmoniaSalts'],
    WillowCharcoal: ['CharcoalDust'],
    Comfrey: ['FreshMorrLeaves'],
    MandrakeRoot: ['MandrakeExtractIng'],
    MintOil: ['MintDistillate'],
    PureWater: ['SunDistilledWater'],
    SpringWater: ['PureWater', 'SunDistilledWater'],
    PurifiedWater: ['PureWater', 'SunDistilledWater'],
    Beeswax: ['OintmentBase'],
    LeadSediment: ['LeadOxide'],
    LeadOxide: ['LeadSediment'],
    ActivatedCharcoal: ['SnakeweedCharcoal'],
    AquaRegia: ['DragonAcid', 'SulphuricAcid'],
    AquaVitae: ['ApothecarySpirits', 'NulnWineSpirits'],
    LemonBalm: ['StJohnsWortMelissa'],
    WindStone: ['EthericEssence']
  };

  /**
   * Sprawdza czy dany przedmiot odpowiada wymaganemu składnikowi
   * 1. Po fladze ingredientKey (oraz aliasach)
   * 2. Po zlokalizowanej nazwie lub kluczu
   */
  static _matchIngredientItem(item, ing) {
    if (!item || !ing) return false;

    // 1. Sprawdzenie flagi wfrp4e-alchemy.ingredientKey (wraz z aliasami)
    const flagKey = item.getFlag ? item.getFlag(MODULE_ID, 'ingredientKey') : item.flags?.[MODULE_ID]?.ingredientKey;
    if (flagKey && ing.key) {
      if (flagKey.toLowerCase() === ing.key.toLowerCase()) return true;
      const aliases = this.INGREDIENT_ALIASES[ing.key] || [];
      if (aliases.some(a => a.toLowerCase() === flagKey.toLowerCase())) return true;
    }

    // 2. Porównanie tekstowe (fallback dla tradycyjnych itemów w ekwipunku)
    const itemName = (item.name || '').toLowerCase().trim();
    const locName = game.i18n ? game.i18n.localize(ing.name).toLowerCase().trim() : '';
    const rawKey = (ing.key || '').toLowerCase().trim();
    const rawName = (ing.name || '').toLowerCase().trim();

    if (locName && (itemName === locName || itemName.includes(locName) || locName.includes(itemName))) return true;
    if (rawKey && (itemName === rawKey || itemName.includes(rawKey))) return true;
    if (rawName && itemName.includes(rawName)) return true;

    // Sprawdzenie po nazwach aliasów
    const aliases = this.INGREDIENT_ALIASES[ing.key] || [];
    for (const alias of aliases) {
      if (itemName.includes(alias.toLowerCase())) return true;
    }

    return false;
  }

  /**
   * Sprawdza dostępność składników w ekwipunku alchemika (ŚCISŁY TRYB)
   * Dopasowuje po fladze ingredientKey, nazwach PL/EN oraz po kluczu
   */
  static buildIngredientInventory(actor, recipes = []) {
    const ingredients = new Map();
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients || []) {
        if (ingredient?.key && !ingredients.has(ingredient.key)) ingredients.set(ingredient.key, ingredient);
      }
    }

    const trappings = (actor?.itemTypes?.trapping || []).map(item => ({
      name: String(item.name || '').toLowerCase().trim(),
      flagKey: String(item.getFlag ? item.getFlag(MODULE_ID, 'ingredientKey') : item.flags?.[MODULE_ID]?.ingredientKey || '').toLowerCase(),
      quantity: Number(item.system?.quantity?.value) || 0
    }));
    const totals = new Map();

    for (const ingredient of ingredients.values()) {
      const key = String(ingredient.key || '').toLowerCase();
      const aliases = (this.INGREDIENT_ALIASES[ingredient.key] || []).map(alias => alias.toLowerCase());
      const localizedName = game.i18n ? game.i18n.localize(ingredient.name).toLowerCase().trim() : '';
      const rawName = String(ingredient.name || '').toLowerCase().trim();
      let total = 0;

      for (const item of trappings) {
        const flagMatches = Boolean(item.flagKey && (item.flagKey === key || aliases.includes(item.flagKey)));
        const nameMatches = Boolean(
          (localizedName && (item.name === localizedName || item.name.includes(localizedName) || localizedName.includes(item.name)))
          || (key && (item.name === key || item.name.includes(key)))
          || (rawName && item.name.includes(rawName))
          || aliases.some(alias => item.name.includes(alias))
        );
        if (flagMatches || nameMatches) total += item.quantity;
      }

      totals.set(ingredient.key, total);
    }

    return totals;
  }

  static checkIngredients(actor, recipe, inventory = null) {
    if (!actor || !recipe) return { canBrew: false, ingredientsStatus: [] };

    let allSufficient = true;
    const ingredientsStatus = (recipe.ingredients || []).map(ingredient => {
      const totalOwned = inventory instanceof Map
        ? (inventory.get(ingredient.key) || 0)
        : (actor.itemTypes?.trapping || [])
          .filter(item => this._matchIngredientItem(item, ingredient))
          .reduce((sum, item) => sum + (Number(item.system?.quantity?.value) || 0), 0);
      const sufficient = totalOwned >= ingredient.quantity;
      if (!sufficient) allSufficient = false;
      return {
        key: ingredient.key,
        name: ingredient.name,
        required: ingredient.quantity,
        owned: totalOwned,
        estimatedCostGC: Number(((Number(ingredient.costZK) || 0) * ingredient.quantity).toFixed(2)),
        estimatedCostLabel: RecipeRegistry.formatPriceGC((Number(ingredient.costZK) || 0) * ingredient.quantity),
        sufficient
      };
    });

    return { canBrew: allSufficient, ingredientsStatus };
  }

  /**
   * Konsumuje składniki z ekwipunku alchemika
   */
  static async consumeIngredients(actor, recipe) {
    const trappings = actor.itemTypes?.trapping || [];

    for (const ing of (recipe.ingredients || [])) {
      let remainingToDeduct = ing.quantity;
      const matchedItems = trappings.filter(item => this._matchIngredientItem(item, ing));

      for (const item of matchedItems) {
        if (remainingToDeduct <= 0) break;
        const currentQty = Number(item.system?.quantity?.value) || 1;

        if (currentQty <= remainingToDeduct) {
          remainingToDeduct -= currentQty;
          await item.delete();
        } else {
          await item.update({ 'system.quantity.value': currentQty - remainingToDeduct });
          remainingToDeduct = 0;
        }
      }
    }
  }

  /**
   * Główna procedura warzenia mikstury
   */
  static async brew(actor, recipe, labItemId = null, brewId = null) {
    if (!actor || !recipe || recipe.referenceOnly) return;

    const brews = getPendingBrews(actor);
    const labs = getActorLaboratories(actor);
    const usage = labBrewUsage(labs, brews);
    const now = CalendarIntegration.getCurrentTimestamp();

    const pendingBrew = (brewId && brews.find((b) => b.id === brewId && b.recipeId === recipe.id))
      || brews.find((b) => b.recipeId === recipe.id && now >= b.completesAt)
      || brews.find((b) => b.recipeId === recipe.id)
      || null;

    let lab = null;
    if (pendingBrew) {
      if (now < pendingBrew.completesAt) {
        ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Errors.BrewNotReady', {
          date: CalendarIntegration.formatDate(pendingBrew.completesAt)
        }));
        return;
      }
      lab = pendingBrew.labItemId ? labs.find((l) => l.id === pendingBrew.labItemId) ?? null : labs[0] ?? null;
    } else {
      if (!labs.length) {
        ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoLaboratory'));
        return;
      }
      const chosenId = selectDefaultLabId(usage.list, labItemId);
      lab = chosenId ? usage.byId.get(chosenId) ?? null : null;
      if (!lab) {
        ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoLaboratory'));
        return;
      }
      if (lab.free <= 0) {
        ui.notifications.warn(game.i18n.format('GOLD_ALCHEMY.Errors.LabFull', { lab: lab.name, count: lab.total }));
        return;
      }
    }

    if (!RecipeRegistry.canBrewRecipe(actor, recipe)) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.RecipeNotKnown'));
      return;
    }

    const recipeName = game.i18n.localize(recipe.name);

    // 1. Sprawdź pojemność (Więź zarezerwowana przy starcie tego warzenia jest już wliczona w zajętą)
    const reserved = Boolean(pendingBrew?.reserved);
    if (recipe.attunementCost > 0) {
      const capState = CapacityEngine.getCapacityState(actor);
      const ownReservation = reserved ? Number(pendingBrew.attunementReserved) || 0 : 0;
      if (capState.available + ownReservation < recipe.attunementCost) {
        ui.notifications.warn(game.i18n.format('GOLD_ALCHEMY.Errors.NotEnoughCapacity', {
          required: recipe.attunementCost,
          available: capState.available
        }));
        return;
      }
    }

    // 2. Sprawdź składniki (zarezerwowane przy starcie są już w kotle)
    const ingCheck = reserved ? { canBrew: true } : this.checkIngredients(actor, recipe);
    if (!ingCheck.canBrew) {
      ui.notifications.error(game.i18n.localize('GOLD_ALCHEMY.Errors.MissingIngredients'));
      return;
    }

    if (!pendingBrew) {
      const startedAt = now;
      const completesAt = CalendarIntegration.addDays(startedAt, recipe.creationTimeDays || 1);
      // A4: składniki idą do kotła od razu, a Więź czeka zarezerwowana; anulowanie przez MG zwraca składniki
      const reserve = this.reserveOnStart();
      if (reserve) await this.consumeIngredients(actor, recipe);
      await setPendingBrews(actor, [...brews, {
        id: foundry.utils.randomID(),
        recipeId: recipe.id,
        recipeName: game.i18n.localize(recipe.name),
        startedAt,
        completesAt,
        labItemId: lab.id,
        labName: lab.name,
        labSlMod: lab.slMod,
        reserved: reserve,
        attunementReserved: reserve ? Number(recipe.attunementCost) || 0 : 0
      }]);
      ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.BrewStarted', {
        date: CalendarIntegration.formatDate(completesAt)
      }));
      return;
    }

    // 3. Określ umiejętność (Uniwersalna detekcja Kolegiów i Rzemiosł)
    const skills = actor.itemTypes?.skill || [];
    let skillItem = null;

    // A. Jeśli receptura powiązana jest z konkretnym Kolegium (np. aqshy, chamon, etc.)
    if (recipe.college) {
      const col = recipe.college.toLowerCase();
      skillItem = skills.find(s => {
        const n = (s.name || '').toLowerCase();
        return (n.includes('splatanie') || n.includes('channelling')) && n.includes(col);
      });
    }

    // B. Jeśli receptura jest uniwersalna magiczna lub nie znaleziono specyficznego wiatru:
    if (!skillItem && (recipe.category === 'magical' || recipe.attunementCost > 0)) {
      const channellingSkills = skills.filter(s => {
        const n = (s.name || '').toLowerCase();
        return n.includes('splatanie') || n.includes('channelling');
      });
      if (channellingSkills.length > 0) {
        channellingSkills.sort((a, b) => {
          const valA = Number(a.system?.total?.value) || Number(a.system?.advances?.value) || 0;
          const valB = Number(b.system?.total?.value) || Number(b.system?.advances?.value) || 0;
          return valB - valA;
        });
        skillItem = channellingSkills[0];
      }
    }

    // C. Dopasowanie po dokładnej nazwie testSkill lub fallbackSkill
    if (!skillItem && recipe.testSkill) {
      skillItem = skills.find(s => (s.name || '').toLowerCase() === (recipe.testSkill || '').toLowerCase());
    }
    if (!skillItem && recipe.fallbackSkill) {
      skillItem = skills.find(s => (s.name || '').toLowerCase() === recipe.fallbackSkill.toLowerCase());
    }

    // D. Inteligentne dopasowanie rzemiosł (Aptekarstwo, Zielarstwo, Alchemia)
    if (!skillItem) {
      const craftSkills = skills.filter(s => {
        const n = (s.name || '').toLowerCase();
        return n.includes('rzemiosło') || n.includes('trade');
      });
      if (recipe.category === 'herbal') {
        skillItem = craftSkills.find(s => (s.name || '').toLowerCase().includes('zielar') || (s.name || '').toLowerCase().includes('herbal'));
      } else if (recipe.category === 'apothecary') {
        skillItem = craftSkills.find(s => (s.name || '').toLowerCase().includes('aptek') || (s.name || '').toLowerCase().includes('apothecary'));
      } else if (recipe.category === 'mundane') {
        skillItem = craftSkills.find(s => (s.name || '').toLowerCase().includes('alchem') || (s.name || '').toLowerCase().includes('aptek'));
      }
    }

    // 4. Modyfikatory (z posiadanej aparatury albo zapisanego przy starcie poziomu)
    const fallbackSl = ALCHEMY_CONFIG.LAB_TIERS[pendingBrew.labTierId]?.slMod || 0;
    const labSlMod = lab ? lab.slMod : (Number.isFinite(Number(pendingBrew.labSlMod)) ? Number(pendingBrew.labSlMod) : fallbackSl);

    const hasMagicalSense = hasTalent(actor.itemTypes?.talent ?? [], 'magicalSense');
    const { difficultyMod, slBonus: totalSlBonus } = brewingModifiers(recipe, {
      labSlMod,
      magicalSense: hasMagicalSense,
      flawed: RecipeRegistry.brewsFromFlawedCopy(actor, recipe)
    });

    // 5. Test WFRP 4e – modyfikatory trafiają do okna testu tylko przez `fields`
    let rollResult = null;
    if (actor.setupSkill && skillItem) {
      const test = await actor.setupSkill(skillItem, {
        fields: { modifier: difficultyMod, slBonus: totalSlBonus },
        title: `${game.i18n.localize('GOLD_ALCHEMY.Chat.Brewed')}: ${recipeName}`,
        skipTargets: true
      });
      if (!test) return; // Anulowano dialog testu
      rollResult = await test.roll();
    } else {
      rollResult = { result: await this.rollWithoutSkill(difficultyMod, totalSlBonus) };
    }

    if (!rollResult) return;
    const res = rollResult.result || rollResult;
    if (res.SL === undefined && res.total === undefined && !res.description) return;

    await setPendingBrews(actor, brews.filter((b) => b !== pendingBrew));

    const sl = Number(res.SL) || 0;
    // O sukcesie decyduje rozstrzygnięcie testu, nie znak PS: porażka w tej samej dziesiątce to „-0”
    const isSuccess = this.isTestSuccess(res);
    const isFumble = !!res.fumble;
    const isCritical = !!res.critical;

    if (!reserved) await this.consumeIngredients(actor, recipe);

    if (isSuccess) {
      // Tor magiczny: 1 dawka (krytyk: 2, jeśli starczy Więzi). Tor świecki: partia 1k10 dawek (krytyk: podwójna) – Wiatry Magii
      // A5: jakość z PS – dodatkowe dawki świeckie albo tańsza Więź wybornej mikstury magicznej
      const quality = this.qualityFromSL()
        ? potionQuality(sl, { track: recipe.track, attunementCost: recipe.attunementCost })
        : { tier: 'standard', bonusDoses: 0, tetherCost: recipe.attunementCost || 0 };
      const tetherCost = quality.tetherCost;
      let createdQty = 1;
      if (recipe.track === 'mundane') {
        const rolled = (await (new Roll(recipe.dosesFormula || '1d10')).evaluate()).total;
        createdQty = mundaneBatchQuantity(rolled, { critical: isCritical, bonusDoses: quality.bonusDoses, maxDoses: recipe.maxDoses });
      } else if (isCritical) {
        if (tetherCost === 0) {
          createdQty = 2;
        } else {
          const capState = CapacityEngine.getCapacityState(actor);
          if (capState.available >= tetherCost * 2) {
            createdQty = 2;
          }
        }
      }

      const shelfDays = recipe.shelfLifeDays + Math.max(0, sl * recipe.bonusDaysPerSL);
      const currentTs = CalendarIntegration.getCurrentTimestamp();
      const expiryTs = CalendarIntegration.addDays(currentTs, shelfDays);
      const expiryFormatted = CalendarIntegration.formatDate(expiryTs);

      const effects = [];
      if (recipe.activeEffect) {
        effects.push(buildPotionEffectData(recipe.activeEffect, recipeName));
      }

      const itemData = {
        name: recipeName,
        type: 'trapping',
        img: resolveAlchemyImage(recipe.img, 'potion'),
        system: {
          trappingType: { value: 'drugsPoisonsHerbsDraughts' },
          quantity: { value: createdQty },
          price: RecipeRegistry.priceFromSS(recipe.listPriceSS),
          description: {
            value: `<p>${game.i18n.localize(recipe.description)}</p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Details.Effect')}:</strong> ${game.i18n.localize(recipe.effectDescription)}</p><p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.ExpiryDate')}:</strong> ${expiryFormatted} (${shelfDays} ${game.i18n.localize('GOLD_ALCHEMY.Days')})</p><p><em>${game.i18n.localize('GOLD_ALCHEMY.Chat.Brewer')}: ${actor.name} (${sl >= 0 ? '+' : ''}${sl} PS)</em></p>`
          }
        },
        flags: {
          [MODULE_ID]: {
            alchemyData: {
              recipeId: recipe.id,
              creatorId: actor.id,
              creatorName: actor.name,
              attunementCost: tetherCost,
              quality: quality.tier,
              brewTimestamp: currentTs,
              expiryTimestamp: expiryTs,
              expiryDateFormatted: expiryFormatted,
              expiryMode: recipe.expiryMode || 'spoilage',
              sl,
              isDead: false,
              instantEffect: recipe.instantEffect || null
            }
          }
        },
        effects
      };

      await actor.createEmbeddedDocuments('Item', [itemData]);

      const chatHtml = `
        <div class="wfrp4e chat-card gold-alchemy-card al-card is-brewed" ${cardAttrs(recipe)}>
          <span class="al-chat-seal" data-al-glyph="ui-state_ready"></span>
          <div class="card-header">
            ${cardMark(recipe)}
            <h3><i class="fas fa-flask"></i> ${game.i18n.localize('GOLD_ALCHEMY.Chat.Brewed')}: ${recipeName}</h3>
          </div>
          <div class="card-content">
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.Brewer')}:</strong> ${actor.name}</p>
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.TestResult')}:</strong> ${sl >= 0 ? '+' : ''}${sl} PS (${res.description || game.i18n.localize('GOLD_ALCHEMY.Chat.Success')})</p>
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.CreatedQty')}:</strong> ${createdQty} ${game.i18n.localize('GOLD_ALCHEMY.Pieces')}</p>
            ${quality.tier !== 'standard' ? `<p><strong>${game.i18n.localize('GOLD_ALCHEMY.Quality.Label')}:</strong> ${game.i18n.localize(`GOLD_ALCHEMY.Quality.${quality.tier}`)}</p>` : ''}
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.ExpiryDate')}:</strong> ${expiryFormatted} (${shelfDays} ${game.i18n.localize('GOLD_ALCHEMY.Days')})</p>
            ${tetherCost > 0 ? `<p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.ChamonTether')}:</strong> ${game.i18n.format('GOLD_ALCHEMY.Chat.ChamonTetherLocked', { points: tetherCost * createdQty })}</p>` : ''}
          </div>
        </div>
      `;
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: chatHtml
      });

      ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.BrewSuccess', { qty: createdQty, potion: recipeName }));
    } else {
      let disasterMsg = '';
      if (isFumble) {
        disasterMsg = await this.rollDisaster(actor, lab?.item ?? null);
      }

      const chatHtml = `
        <div class="wfrp4e chat-card gold-alchemy-card disaster al-card is-failed" ${cardAttrs(recipe)}>
          <div class="card-header">
            ${cardMark(recipe)}
            <h3><i class="fas fa-skull-crossbones"></i> ${game.i18n.localize('GOLD_ALCHEMY.Chat.Failed')}: ${recipeName}</h3>
          </div>
          <div class="card-content">
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.Brewer')}:</strong> ${actor.name}</p>
            <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.TestResult')}:</strong> ${res.SL} PS (${game.i18n.localize('GOLD_ALCHEMY.Chat.Failure')})</p>
            <p><em>${game.i18n.localize('GOLD_ALCHEMY.Chat.IngredientsDestroyed')}</em></p>
            ${disasterMsg ? `<div class="disaster-alert"><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.BrewingDisaster')}:</strong> ${disasterMsg}</div>` : ''}
          </div>
        </div>
      `;
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: chatHtml
      });

      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Notifications.BrewFailure'));
    }
  }

  /**
   * Wynik testu WFRP4e: `outcome` z systemu, a gdy go brak – rzut względem progu.
   * @param {object} res  result testu (roll, target, SL, outcome)
   */
  static isTestSuccess(res) {
    return isTestSuccess(res);
  }

  /**
   * Test bez umiejętności na karcie: 1d100 przeciwko 30 + modyfikator (01–05 sukces, 96–00 porażka).
   */
  static async rollWithoutSkill(difficultyMod, slBonus = 0) {
    const testRoll = await (new Roll('1d100')).evaluate();
    const roll = testRoll.total;
    const target = Math.max(1, 30 + difficultyMod);
    const success = roll <= 5 || (roll <= target && roll <= 95);
    const sl = Math.floor(target / 10) - Math.floor(roll / 10) + slBonus;
    const doubles = roll % 11 === 0 || roll === 100;
    return {
      roll,
      target,
      SL: sl,
      outcome: success ? 'success' : 'failure',
      description: game.i18n.localize(success ? 'GOLD_ALCHEMY.Chat.Success' : 'GOLD_ALCHEMY.Chat.Failure'),
      fumble: !success && (roll >= 96 || doubles),
      critical: success && (roll <= 5 || doubles)
    };
  }

  /** Czy laboratorium ustawia MG (ustawienie świata). */
  static labByGM() {
    try {
      return game.settings.get(MODULE_ID, 'labByGM') !== false;
    } catch {
      return true;
    }
  }

  /** Poziom laboratorium postaci (flaga ustawiana przez MG; domyślnie zwykłe). */
  static actorLabTier(actor) {
    const tier = actor?.getFlag(MODULE_ID, 'labTier');
    return ALCHEMY_CONFIG.LAB_TIERS[tier] ? tier : 'standard';
  }

  /** Czy PS warzenia dają jakość mikstury (ustawienie świata). */
  static qualityFromSL() {
    try {
      return game.settings.get(MODULE_ID, 'qualityFromSL') !== false;
    } catch {
      return true;
    }
  }

  /** Czy start warzenia rezerwuje składniki i Więź (ustawienie świata). */
  static reserveOnStart() {
    try {
      return game.settings.get(MODULE_ID, 'reserveOnStart') !== false;
    } catch {
      return true;
    }
  }

  static async cancelPendingBrew(actor, brewIdOrRecipeId = null) {
    if (!game.user.isGM || !actor) return false;
    const brews = getPendingBrews(actor);
    const pending = (brewIdOrRecipeId && brews.find((b) => b.id && b.id === brewIdOrRecipeId))
      ?? brews.find((b) => b.recipeId === brewIdOrRecipeId)
      ?? brews[0];
    if (!pending) return false;
    await setPendingBrews(actor, brews.filter((b) => b !== pending));
    // Zarezerwowane składniki wracają z kotła do ekwipunku
    const recipe = pending?.reserved ? RecipeRegistry.getRecipeById(pending.recipeId, { includeUnavailable: true }) : null;
    if (recipe) {
      const byKey = new Map(ALCHEMY_INGREDIENTS.map((ing) => [ing.key, ing]));
      const items = (recipe.ingredients || []).map((ing) => byKey.has(ing.key)
        ? createIngredientItemData(byKey.get(ing.key), ing.quantity)
        : { name: game.i18n.localize(ing.name), type: 'trapping', system: { quantity: { value: ing.quantity } } });
      if (items.length) await actor.createEmbeddedDocuments('Item', items);
    }
    return true;
  }

  static async rollDisaster(actor, labItem = null) {
    const roll = await (new Roll('1d10')).evaluate();
    const val = roll.total;

    // A7: skutki działają same – rany, stan Zatrucia po nieudanym Teście Odporności, uszkodzenie aparatury
    const disasterKeys = [
      { max: 3, key: 'Ruined' },
      { max: 4, key: 'Smoke' },
      { max: 5, key: 'Clumsy' },
      { max: 6, key: 'Fumes', test: { skill: 'Endurance', difficulty: 'hard', condition: 'poisoned' } },
      { max: 7, key: 'AcidBurn', damage: '1d10' },
      { max: 8, key: 'MinorBlast', damage: '1d10+2' },
      { max: 9, key: 'MajorBlast', damage: '1d10+4', labDamage: true },
      { max: 10, key: 'Fire', labDamage: true }
    ];

    const d = disasterKeys.find(item => val <= item.max) || disasterKeys[disasterKeys.length - 1];
    const lines = [`[${val}] ${game.i18n.localize(`GOLD_ALCHEMY.Disasters.${d.key}`)}`];
    if (this.automateDisasters()) lines.push(...await this.#applyDisaster(actor, d, labItem));
    return lines.join('<br>');
  }

  /** Czy skutki katastrof działają same (ustawienie świata). */
  static automateDisasters() {
    try {
      return game.settings.get(MODULE_ID, 'automateDisasters') !== false;
    } catch {
      return true;
    }
  }

  /** Nakłada skutki katastrofy na alchemika; zwraca linie do karty czatu. */
  static async #applyDisaster(actor, disaster, labItem = null) {
    const lines = [];
    const loc = (key, data) => (data ? game.i18n.format(`GOLD_ALCHEMY.DisasterEffects.${key}`, data) : game.i18n.localize(`GOLD_ALCHEMY.DisasterEffects.${key}`));
    try {
      if (disaster.damage) {
        const dmg = await (new Roll(disaster.damage)).evaluate();
        const current = Number(actor.system?.status?.wounds?.value) || 0;
        await actor.update({ 'system.status.wounds.value': Math.max(0, current - dmg.total) });
        lines.push(loc('Wounds', { wounds: dmg.total }));
      }
      if (disaster.test && actor.setupSkill) {
        const skill = actor.itemTypes?.skill?.find((s) => /endurance|odporno/i.test(s.name)) ?? game.i18n.localize('NAME.Endurance');
        const test = await actor.setupSkill(skill, { fields: { difficulty: disaster.test.difficulty }, skipTargets: true });
        const result = test ? await test.roll() : null;
        if (result && !this.isTestSuccess(result.result || result)) {
          await actor.addCondition?.(disaster.test.condition);
          lines.push(loc('Poisoned'));
        } else if (result) {
          lines.push(loc('Resisted'));
        }
      }
      if (disaster.labDamage && labItem) {
        const currentSl = Math.trunc(Number(labItem.flags?.[MODULE_ID]?.laboratory?.slMod) || 0);
        const nextSl = damagedLabSlMod(currentSl);
        if (nextSl !== currentSl) {
          await labItem.update({ [`flags.${MODULE_ID}.laboratory.slMod`]: nextSl });
          const slLabel = game.i18n.localize('GOLD_ALCHEMY.Workbench.SL');
          lines.push(loc('LabDamaged', { lab: `${labItem.name} (${formatSlMod(nextSl)} ${slLabel})` }));
        }
      }
    } catch (err) {
      console.warn(`${MODULE_ID} | disaster effects`, err);
    }
    return lines;
  }

}
