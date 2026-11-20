/**
 * Logika spożywania i rzucania mikstur z pełną lokalizacją
 */

import { MODULE_ID } from '../config.js';
import { SpoilageEngine } from './spoilage-engine.js';
import { RecipeRegistry } from './recipe-registry.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { AlchemyQueries } from '../queries.js';
import { RECIPE_CLOUD, RECIPE_DRINK, RECIPE_THROWN, runDrinkSteps, runThrownSteps, stepsHeal, timedConditionEffect } from './potion-steps.js';
import { applyHighestBonus } from './effect-data.js';
import { blastTargets, throwRangeBand } from './throwing.js';
import { AddictionEngine } from './addiction.js';

/** Mikstury bojowe: rzuca się je we wskazane tokeny zamiast pić. */
const THROWN_EFFECTS = new Set([
  'liquidFireExplosion',
  'phosphorFireExplosion',
  'alkahest',
  'alkahestAcid',
  'acidDamage',
  'trollAcidSplash',
  'flashPowderBlast',
  'hyshSunFlash',
  'smokePelletCloud',
  'ulguShadowMist',
  RECIPE_THROWN,
  RECIPE_CLOUD
]);

/** Chmury tworzone w miejscu upadku – nie wymagają celu ani testu trafienia. */
const CLOUD_EFFECTS = new Set(['smokePelletCloud', 'ulguShadowMist', RECIPE_CLOUD]);

/** Mikstury leczące rany: najwyżej jedna na starcie (zasada Mikstury Leczniczej z podręcznika). */
const HEALING_EFFECTS = new Set([
  'healingDraught',
  'morrSalve',
  'morrSalveHeal',
  'cordeliaHeal',
  'panaceaUniversalis',
  'ghyranSpringHeal',
  'chamonPanacea'
]);

/** Okno limitu leczenia (sekundy czasu świata) – jedno spotkanie. */
const HEALING_WINDOW_SECONDS = 3600;
/** Odstęp między oczyszczeniami duszy Eliksirem Iluminacji. */
const PURITY_COOLDOWN_DAYS = 7;

export class PotionConsumer {
  static THROWN_EFFECTS = THROWN_EFFECTS;
  static HEALING_EFFECTS = HEALING_EFFECTS;

  /** Czy przedmiot to mikstura bojowa (do rzucania). */
  static isThrowable(item) {
    const effectId = item?.getFlag?.(MODULE_ID, 'alchemyData')?.instantEffect;
    return THROWN_EFFECTS.has(effectId);
  }

  /** Mikstura magiczna (tor Więzi): naraz działa tylko jedna. */
  static isMagicalPotion(flag) {
    if (Number(flag?.attunementCost) > 0) return true;
    const recipe = flag?.recipeId ? RecipeRegistry.getRecipeById(flag.recipeId) : null;
    return recipe?.track === 'magical';
  }

  static async consume(item, drinker) {
    if (!item || !drinker) return;

    const flag = item.getFlag(MODULE_ID, 'alchemyData') || {};
    const qty = Number(item.system?.quantity?.value) || 1;
    if (qty <= 0) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoDoses'));
      return;
    }
    if (this.isThrowable(item)) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.ThrowNotDrink'));
      return;
    }

    const spoilageResult = await SpoilageEngine.evaluatePotion(item, drinker);
    const effectLines = [];

    if (spoilageResult.stillWorks) {
      const magical = this.isMagicalPotion(flag);
      if (item.effects && item.effects.size > 0) {
        // Wiatry się ścierają: nowa mikstura magiczna wypiera poprzednią
        if (magical) {
          const previous = drinker.effects.filter(e => e.getFlag?.(MODULE_ID, 'magicalPotion'));
          if (previous.length) {
            await drinker.deleteEmbeddedDocuments('ActiveEffect', previous.map(e => e.id));
            effectLines.push(game.i18n.format('GOLD_ALCHEMY.Chat.MagicalReplaced', { names: [...new Set(previous.map(e => e.name))].join(', ') }));
          }
        }
        const effectsToCreate = [];
        for (const effect of item.effects) {
          const ed = applyHighestBonus(effect.toObject());
          delete ed._id;
          ed.disabled = false;
          ed.transfer = false;
          // Foundry v14 ustawia start (czas świata, walka, runda) przy tworzeniu efektu na aktorze
          delete ed.start;
          if (magical) foundry.utils.setProperty(ed, `flags.${MODULE_ID}.magicalPotion`, true);
          if (flag.recipeId) foundry.utils.setProperty(ed, `flags.${MODULE_ID}.recipeId`, flag.recipeId);
          const rolled = await this._rollDuration(ed, drinker);
          if (rolled) effectLines.push(rolled);
          // Ta sama mikstura wypita ponownie odnawia czas działania zamiast dublować premie
          const same = flag.recipeId && drinker.effects.find(e => e.getFlag?.(MODULE_ID, 'recipeId') === flag.recipeId && e.name === ed.name);
          if (same) {
            await this._refreshEffect(same, ed.duration);
            effectLines.push(game.i18n.format('GOLD_ALCHEMY.Chat.EffectRefreshed', { effect: ed.name }));
          }
          else effectsToCreate.push(ed);
        }
        if (effectsToCreate.length) await drinker.createEmbeddedDocuments('ActiveEffect', effectsToCreate);
      }

      if (flag.instantEffect) {
        const line = await this.handleInstantEffect(flag.instantEffect, drinker, flag.recipeId);
        if (line) effectLines.push(line);
      }

      // Nałóg (zasada domowa): test po dawce mikstury uzależniającej, dawka zaspokaja głód
      const recipe = flag.recipeId ? RecipeRegistry.getRecipeById(flag.recipeId, { includeUnavailable: true }) : null;
      const addictionLine = await AddictionEngine.afterDose(drinker, recipe, item.name);
      if (addictionLine) effectLines.push(addictionLine);
    }

    await this._useDose(item, qty);
    const cost = await this._refundTether(flag, item.name, drinker.name);

    const chatHtml = `
      <div class="wfrp4e chat-card gold-alchemy-card">
        <div class="card-header">
          <h3><i class="fas fa-wine-bottle"></i> ${game.i18n.format('GOLD_ALCHEMY.Chat.Drinks', { drinker: drinker.name, potion: item.name })}</h3>
        </div>
        <div class="card-content">
          <p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.PotionCondition')}:</strong> ${spoilageResult.description}</p>
          ${spoilageResult.rollDetails ? `<p class="small"><em>${spoilageResult.rollDetails}</em></p>` : ''}
          ${effectLines.map(line => `<p>${line}</p>`).join('')}
          ${spoilageResult.sideEffect ? `
            <div class="disaster-alert">
              <strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.SideEffect')}: ${spoilageResult.sideEffect.name}</strong>
              <p>${spoilageResult.sideEffect.description}</p>
            </div>
          ` : ''}
          ${cost > 0 ? `<p class="tether-refund"><i class="fas fa-link-slash"></i> <strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.TetherExpired')}:</strong> ${game.i18n.format('GOLD_ALCHEMY.Chat.TetherRefundInfo', { points: cost })}</p>` : ''}
        </div>
      </div>
    `;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: drinker }),
      content: chatHtml
    });
  }

  /** Odnawia czas działania efektu: liczy się od teraz, z nowym (wylosowanym) czasem. */
  static async _refreshEffect(effect, duration) {
    const combat = game.combat;
    const update = { start: { time: game.time.worldTime, combat: combat?.id ?? null, round: combat?.round ?? null, turn: combat?.turn ?? null } };
    if (duration?.value) update.duration = { value: duration.value, units: duration.units };
    await effect.update(update);
  }

  /**
   * Losowy czas działania z flagi efektu (np. 1k10 godzin): {formula, units, multiplier, minusTB}.
   * Zwraca linię do karty czatu albo ''.
   */
  static async _rollDuration(effectData, drinker) {
    const spec = effectData.flags?.[MODULE_ID]?.durationRoll;
    if (!spec?.formula) return '';
    let value = (await (new Roll(spec.formula)).evaluate()).total;
    if (spec.minusTB) value -= Number(drinker.system?.characteristics?.t?.bonus) || 0;
    value = Math.max(1, value);
    const units = spec.units === 'rounds' ? 'rounds' : 'seconds';
    const multiplier = Number(spec.multiplier) || 1;
    effectData.duration = { value: value * multiplier, units };
    const label = units === 'rounds'
      ? game.i18n.format('GOLD_ALCHEMY.Time.Rounds', { count: value })
      : multiplier >= 3600
        ? game.i18n.format('GOLD_ALCHEMY.Time.HoursShort', { count: value * multiplier / 3600 })
        : game.i18n.format('GOLD_ALCHEMY.Time.Minutes', { count: value * multiplier / 60 });
    return game.i18n.format('GOLD_ALCHEMY.Chat.DurationRolled', { effect: effectData.name, duration: label });
  }

  /**
   * Rzut miksturą bojową we wskazane tokeny (klawisz T). Rzucający wykonuje test Broni Zasięgowej (Rzucanej)
   * albo Umiejętności Strzeleckich; skutki na celach nakłada klient MG.
   */
  static async throwPotion(item, thrower) {
    if (!item || !thrower) return;
    const flag = item.getFlag(MODULE_ID, 'alchemyData') || {};
    const effectId = flag.instantEffect;
    const qty = Number(item.system?.quantity?.value) || 1;
    if (!THROWN_EFFECTS.has(effectId)) return;
    if (qty <= 0) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoDoses'));
      return;
    }

    const isCloud = CLOUD_EFFECTS.has(effectId);
    // Rzut w jeden cel (pierwszy namierzony); mikstury wybuchowe trafiają też żetony w promieniu wybuchu
    const target = Array.from(game.user.targets || []).find(token => token.actor);
    if (!isCloud && !target) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoThrowTarget'));
      return;
    }

    let difficulty = 'challenging';
    const throwerToken = thrower.getActiveTokens?.(true, false)?.find(token => token.scene === (target?.scene ?? canvas?.scene)) ?? null;
    // Zasięg sprawdzany także dla chmur rzucanych w cel; chmura bez celu spada pod nogi rzucającego
    if (target && throwerToken) {
      const range = Math.max(1, Number(thrower.system?.characteristics?.s?.bonus) || 1);
      const band = throwRangeBand(this._distance(throwerToken, target), range);
      if (!band) {
        ui.notifications.warn(game.i18n.format('GOLD_ALCHEMY.Errors.ThrowOutOfRange', { range: range * 3 }));
        return;
      }
      difficulty = band.difficulty;
    }

    const recipe = flag.recipeId ? RecipeRegistry.getRecipeById(flag.recipeId, { includeUnavailable: true }) : null;
    const targets = isCloud ? [] : blastTargets(target, (canvas?.tokens?.placeables || []).filter(token => token.actor), recipe?.blast, (a, b) => this._distance(a, b));

    const hit = isCloud ? { success: true, sl: 0 } : await this._rollThrow(thrower, item.name, difficulty);
    if (!hit) return; // Anulowano okno testu

    const spoilage = await SpoilageEngine.evaluatePotion(item, null, { applySideEffect: false });
    await this._useDose(item, qty);
    const cost = await this._refundTether(flag, item.name, thrower.name);

    const lines = [];
    if (!spoilage.stillWorks) {
      lines.push(game.i18n.localize('GOLD_ALCHEMY.Chat.ThrowFizzled'));
    } else if (isCloud) {
      // Chmura jako region sceny w miejscu celu (albo pod rzucającym); bez żetonu na scenie – tylko opis
      const spot = target ?? throwerToken;
      let rounds = 0;
      if (spot && recipe?.cloud) {
        rounds = await AlchemyQueries.createCloud({
          recipeId: recipe.id,
          sceneId: spot.scene.id,
          x: spot.center.x,
          y: spot.center.y,
          level: spot.document.level ?? null,
          name: item.name,
          throwerUuid: thrower.uuid
        });
      }
      if (!rounds) rounds = (await (new Roll('1d10')).evaluate()).total;
      lines.push(game.i18n.format('GOLD_ALCHEMY.Chat.CloudCreated', { rounds }));
    } else if (!hit.success) {
      lines.push(game.i18n.localize('GOLD_ALCHEMY.Chat.ThrowMissed'));
    } else {
      const results = await AlchemyQueries.applyThrownEffect({
        effectId,
        recipeId: flag.recipeId,
        sl: hit.sl,
        throwerUuid: thrower.uuid,
        targetUuids: targets.map(token => token.document.uuid)
      });
      lines.push(...(results || []));
    }

    const targetNames = targets.map(token => token.name).join(', ');
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: thrower }),
      content: `
        <div class="wfrp4e chat-card gold-alchemy-card">
          <div class="card-header">
            <h3><i class="fas fa-bomb"></i> ${game.i18n.format('GOLD_ALCHEMY.Chat.Throws', { thrower: thrower.name, potion: item.name })}</h3>
          </div>
          <div class="card-content">
            ${targetNames ? `<p><strong>${game.i18n.localize('GOLD_ALCHEMY.Chat.ThrowTargets')}:</strong> ${targetNames}</p>` : ''}
            ${spoilage.rollDetails ? `<p class="small"><em>${spoilage.description} – ${spoilage.rollDetails}</em></p>` : ''}
            ${lines.map(line => `<p>${line}</p>`).join('')}
            ${cost > 0 ? `<p class="tether-refund"><i class="fas fa-link-slash"></i> ${game.i18n.format('GOLD_ALCHEMY.Chat.TetherRefundInfo', { points: cost })}</p>` : ''}
          </div>
        </div>`
    });
  }

  /** Odległość między żetonami w jednostkach sceny (środek do środka). */
  static _distance(a, b) {
    if (!a || !b) return 0;
    return canvas.grid.measurePath([a.center, b.center]).distance;
  }

  /**
   * Test trafienia: Broń Zasięgowa (Materiały Wybuchowe albo Rzucana), a bez niej Umiejętności Strzeleckie.
   * Trudność z progu zasięgu, PS decyduje o sile (jak Podpalacz).
   */
  static async _rollThrow(thrower, potionName, difficulty = 'challenging') {
    const skills = thrower.itemTypes?.skill || [];
    const skill = skills.find(s => /explosiv|wybuch/i.test(s.name || '')) ?? skills.find(s => /rzucan|throw/i.test(s.name || ''));
    const context = { title: game.i18n.format('GOLD_ALCHEMY.Chat.ThrowTest', { potion: potionName }), skipTargets: true, fields: { difficulty } };
    const test = skill ? await thrower.setupSkill(skill, context) : await thrower.setupCharacteristic('bs', context);
    if (!test) return null;
    await test.roll();
    return { success: !!test.succeeded, sl: Math.max(0, Number(test.result?.SL) || 0) };
  }

  static async _useDose(item, qty) {
    if (qty > 1) await item.update({ 'system.quantity.value': qty - 1 });
    else await item.delete();
  }

  /** Zużyta mikstura zwalnia Więź alchemika. Zwraca liczbę zwolnionych punktów. */
  static async _refundTether(flag, potionName, userName) {
    const cost = Number(flag.attunementCost) || 0;
    if (cost > 0 && flag.creatorId) await AlchemyQueries.refundCapacity(flag.creatorId, potionName, cost, userName);
    return cost;
  }

  /** Usuwa wszystkie poziomy stanu (removeCondition domyślnie zdejmuje jeden). */
  static async removeAllConditions(actor, key) {
    const effect = actor?.hasCondition?.(key);
    if (!effect) return false;
    await actor.removeCondition(key, Number(effect.conditionValue) || 1);
    return true;
  }

  static async _heal(actor, amount) {
    const cur = Number(actor.system?.status?.wounds?.value) || 0;
    const max = Number(actor.system?.status?.wounds?.max) || cur;
    await actor.update({ 'system.status.wounds.value': Math.min(max, cur + amount) });
  }

  /** Czy pijący w tym spotkaniu wypił już miksturę leczącą. */
  static _healingLimitActive(actor) {
    return (actor?.effects || []).some(e => e.getFlag?.(MODULE_ID, 'healingLimit') && !e.disabled && !e.duration?.expired);
  }

  static async _markHealing(actor) {
    await actor.createEmbeddedDocuments?.('ActiveEffect', [{
      name: game.i18n.localize('GOLD_ALCHEMY.Effects.HealingLimit'),
      img: 'icons/consumables/potions/bottle-round-corked-red.webp',
      duration: { value: HEALING_WINDOW_SECONDS, units: 'seconds' },
      flags: { [MODULE_ID]: { healingLimit: true } }
    }]);
  }

  /**
   * Test pijącego (np. Odporność przeciw truciźnie). Zwraca {succeeded, sl} lub null przy anulowaniu.
   */
  static async _drinkerTest(actor, skillKey, difficulty, title) {
    if (!actor?.setupSkill) return { succeeded: false, sl: 0 };
    const test = await actor.setupSkill(game.i18n.localize(skillKey), { fields: { difficulty }, title, skipTargets: true });
    if (!test) return null;
    await test.roll();
    return { succeeded: !!test.succeeded, sl: Number(test.result?.SL) || 0 };
  }

  /** Zależności kroków receptury: tłumaczenia, rzuty, testy pijącego i nazwy stanów systemu. */
  static _stepContext() {
    return {
      i18n: (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key)),
      roll: async (formula) => (await (new Roll(formula)).evaluate()).total,
      test: (actor, skillKey, difficulty) => this._drinkerTest(actor, skillKey, difficulty, game.i18n.localize('GOLD_ALCHEMY.Steps.TestTitle')),
      conditionLabel: (key) => game.i18n.localize(game.wfrp4e?.config?.conditions?.[key] ?? key),
      damageTypes: game.wfrp4e?.config?.DAMAGE_TYPE || { NORMAL: 0, IGNORE_AP: 1 },
      formatDuration: (seconds) => this._formatDuration(seconds),
      resist: (actor, skillKey, difficulty) => this._targetTest(actor, skillKey, difficulty)
    };
  }

  /**
   * Test obronny celu rzuconej mikstury (u MG, bez okna: przy wybuchu celów może być wiele).
   * Zwraca {succeeded, sl}; gdy testu nie da się wykonać – porażka.
   */
  static async _targetTest(actor, skillKey, difficulty = 'challenging') {
    try {
      const test = await actor.setupSkill(game.i18n.localize(skillKey), {
        skipDialog: true,
        skipTargets: true,
        fields: { difficulty },
        appendTitle: ` – ${game.i18n.localize('GOLD_ALCHEMY.Steps.ResistTitle')}`
      });
      if (!test) return { succeeded: false, sl: 0 };
      await test.roll();
      return { succeeded: !!test.succeeded, sl: Number(test.result?.SL) || 0 };
    } catch (error) {
      console.warn(`${MODULE_ID} | Resist test failed for ${actor?.name}`, error);
      return { succeeded: false, sl: 0 };
    }
  }

  /** Stan z rzuconej mikstury, przed którym cel broni się Unikiem (stare mikstury z efektem w kodzie). */
  static async _addResistedCondition(actor, key, value, name) {
    const result = await this._targetTest(actor, 'NAME.Dodge', 'challenging');
    if (result.succeeded) {
      return game.i18n.format('GOLD_ALCHEMY.Steps.ThrownResisted', { target: name, condition: game.i18n.localize(game.wfrp4e?.config?.conditions?.[key] ?? key) });
    }
    await actor.addCondition?.(key, value);
    return null;
  }

  /** Czas w czytelnej postaci: godziny, a krótsze w minutach. */
  static _formatDuration(seconds) {
    return seconds >= 3600
      ? game.i18n.format('GOLD_ALCHEMY.Time.HoursShort', { count: Math.round(seconds / 360) / 10 })
      : game.i18n.format('GOLD_ALCHEMY.Time.Minutes', { count: Math.max(1, Math.round(seconds / 60)) });
  }

  /**
   * Senność po Mandragorze: po upływie onsetMinutes pijący zasypia (Utrata Przytomności) na `hours` godzin.
   * Zdjęcie senności przed czasem (np. przez MG) nie usypia.
   */
  static _mandrakeOnset(drinker, hours, onsetMinutes) {
    const label = game.i18n.localize(game.wfrp4e?.config?.conditions?.unconscious ?? 'unconscious');
    const sleep = timedConditionEffect({
      name: game.i18n.format('GOLD_ALCHEMY.Steps.TimedName', { condition: label }),
      key: 'unconscious',
      seconds: hours * 3600
    });
    return {
      name: game.i18n.localize('GOLD_ALCHEMY.Effects.MandrakeDrowsy'),
      img: 'icons/svg/sleep.svg',
      duration: { value: onsetMinutes * 60, units: 'seconds' },
      system: {
        scriptData: [{
          label: game.i18n.localize('GOLD_ALCHEMY.Effects.MandrakeDrowsy'),
          trigger: 'deleteEffect',
          script: `if ((this.effect.duration?.remaining ?? 0) > 0) return;\nawait this.actor.addCondition("unconscious");\nawait this.actor.createEmbeddedDocuments("ActiveEffect", [${JSON.stringify(sleep)}]);`
        }]
      }
    };
  }

  /** Nakłada stan na określony czas (efekt-licznik zdejmuje go po wygaśnięciu). */
  static async _addTimedCondition(actor, key, value, seconds, label) {
    await actor.addCondition?.(key, value);
    const name = game.i18n.format('GOLD_ALCHEMY.Steps.TimedName', { condition: label });
    await actor.createEmbeddedDocuments?.('ActiveEffect', [timedConditionEffect({ name, key, value, seconds })]);
  }

  /**
   * Natychmiastowy efekt wypitej mikstury. Zwraca linię do karty czatu.
   */
  static async handleInstantEffect(effectId, drinker, recipeId = null) {
    if (!drinker) return '';

    const tb = Number(drinker.system?.characteristics?.t?.bonus) || 3;
    const i18n = (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

    // Kroki opisane w recepturze (nowe receptury bez własnego kodu)
    if (effectId === RECIPE_DRINK) {
      const steps = RecipeRegistry.getRecipeById(recipeId, { includeUnavailable: true })?.instantSteps;
      if (stepsHeal(steps)) {
        if (this._healingLimitActive(drinker)) return i18n('GOLD_ALCHEMY.Notifications.HealingLimit');
        await this._markHealing(drinker);
      }
      const lines = await runDrinkSteps(steps, drinker, this._stepContext());
      return lines.join(' ');
    }

    // Jedna mikstura lecznicza na spotkanie
    if (HEALING_EFFECTS.has(effectId)) {
      if (this._healingLimitActive(drinker)) return i18n('GOLD_ALCHEMY.Notifications.HealingLimit');
      await this._markHealing(drinker);
    }

    switch (effectId) {
      case 'chamonPanacea': {
        // Receptura wycofana – stare flakony działają jak dawniej
        const roll = await (new Roll('2d10')).evaluate();
        await this._heal(drinker, roll.total);
        await this.removeAllConditions(drinker, 'poisoned');
        await this.removeAllConditions(drinker, 'bleeding');
        return i18n('GOLD_ALCHEMY.Notifications.PanaceaRestored', { wounds: roll.total });
      }
      case 'panaceaUniversalis':
        // Wiatry Magii: 3×BWt Ran, wszystkie Krwawienia i Zmęczenia (Rany Krytyczne – tabela, rozstrzyga MG)
        await this._heal(drinker, tb * 3);
        await this.removeAllConditions(drinker, 'bleeding');
        await this.removeAllConditions(drinker, 'fatigued');
        return i18n('GOLD_ALCHEMY.Notifications.PanaceaUniversalisRestored', { wounds: tb * 3 });
      case 'ghyranSpringHeal':
        await this._heal(drinker, tb * 3);
        await this.removeAllConditions(drinker, 'bleeding');
        return i18n('GOLD_ALCHEMY.Notifications.SpringDewHealed', { wounds: tb * 3 });
      case 'ghyranPurify':
        await this.removeAllConditions(drinker, 'poisoned');
        return i18n('GOLD_ALCHEMY.Notifications.Purified');
      case 'healingDraught': {
        // Podręcznik: BWt Ran, tylko gdy postać ma więcej niż 0 Ran
        const wounds = Number(drinker.system?.status?.wounds?.value) || 0;
        if (wounds <= 0) return i18n('GOLD_ALCHEMY.Notifications.HealingDraughtNoEffect');
        await this._heal(drinker, tb);
        return i18n('GOLD_ALCHEMY.Notifications.HealingDraughtRestored', { wounds: tb });
      }
      case 'masterworkHeal':
      case 'marvelousMixture': {
        // Zestaw Startowy: aby przełknąć – Przeciętny (+20) Test Opanowania; skutek: 1 Zmęczenie i nic więcej
        const result = await this._drinkerTest(drinker, 'NAME.Cool', 'average', game.i18n.localize('GOLD_ALCHEMY.Chat.ResistMarvelous'));
        if (!result?.succeeded) return i18n('GOLD_ALCHEMY.Notifications.MarvelousRefused');
        await drinker.addCondition?.('fatigued', 1);
        return i18n('GOLD_ALCHEMY.Notifications.MarvelousDrunk');
      }
      case 'vitalityDraught':
        await this.removeAllConditions(drinker, 'fatigued');
        return i18n('GOLD_ALCHEMY.Notifications.VitalityDraughtRestored');
      case 'soothingDraught':
        await drinker.removeCondition?.('fatigued', 1);
        return i18n('GOLD_ALCHEMY.Notifications.SoothingDraught');
      case 'digestiveTonic':
        await this.removeAllConditions(drinker, 'poisoned');
        return i18n('GOLD_ALCHEMY.Notifications.DigestiveTonicRestored');
      case 'mundanePanacea':
        // Jak Faxtoryll: tamuje krwawienie i neutralizuje truciznę, nie leczy Ran
        await this.removeAllConditions(drinker, 'poisoned');
        await this.removeAllConditions(drinker, 'bleeding');
        return i18n('GOLD_ALCHEMY.Notifications.MundanePanacea');
      case 'fortuneDraught':
      case 'potionOfFortune': {
        const curFortune = Number(drinker.system?.status?.fortune?.value) || 0;
        const maxFate = Number(drinker.system?.status?.fate?.value) || 3;
        if (curFortune < maxFate) {
          await drinker.update({ 'system.status.fortune.value': curFortune + 1 });
          return i18n('GOLD_ALCHEMY.Notifications.FortuneRestored');
        }
        return i18n('GOLD_ALCHEMY.Notifications.FortuneFull');
      }
      case 'smellingSalts':
      case 'smellingSaltsRevive':
        // Jak Salwort: 1 Ogłuszenie; dodatkowo cuci nieprzytomnego
        await this.removeAllConditions(drinker, 'unconscious');
        await drinker.removeCondition?.('stunned', 1);
        return i18n('GOLD_ALCHEMY.Notifications.SmellingSalts');
      case 'morrSalve':
      case 'morrSalveHeal':
        await this._heal(drinker, tb);
        await drinker.removeCondition?.('bleeding', 1);
        return i18n('GOLD_ALCHEMY.Notifications.MorrSalve', { wounds: tb });
      case 'antitoxinBroad':
      case 'antidoteCure':
        await this.removeAllConditions(drinker, 'poisoned');
        return i18n('GOLD_ALCHEMY.Notifications.Antitoxin');
      case 'hyshPurity': {
        const now = CalendarIntegration.getCurrentTimestamp();
        const last = Number(drinker.getFlag?.(MODULE_ID, 'lastPurity')) || null;
        if (last !== null && now - last < PURITY_COOLDOWN_DAYS * 86400) return i18n('GOLD_ALCHEMY.Notifications.PurityCooldown');
        await drinker.setFlag?.(MODULE_ID, 'lastPurity', now);
        const curCorruption = Number(drinker.system?.status?.corruption?.value) || 0;
        if (curCorruption > 0) {
          await drinker.update({ 'system.status.corruption.value': Math.max(0, curCorruption - 1) });
          return i18n('GOLD_ALCHEMY.Notifications.CorruptionPurified');
        }
        return i18n('GOLD_ALCHEMY.Notifications.SoulPurified');
      }
      case 'mandrakeSleep': {
        // Jak Nocny Cień: Wymagający (+0) Test Odporności, porażka – sen za 2–3 godziny na 1k10+4 godziny
        const result = await this._drinkerTest(drinker, 'NAME.Endurance', 'challenging', game.i18n.localize('GOLD_ALCHEMY.Chat.ResistMandrake'));
        if (result?.succeeded) return i18n('GOLD_ALCHEMY.Notifications.MandrakeResisted');
        const hours = (await (new Roll('1d10+4')).evaluate()).total;
        const onsetMinutes = 120 + (await (new Roll('1d60')).evaluate()).total;
        await drinker.createEmbeddedDocuments?.('ActiveEffect', [this._mandrakeOnset(drinker, hours, onsetMinutes)]);
        return i18n('GOLD_ALCHEMY.Notifications.SleepComing', { hours });
      }
      case 'forgetMemory': {
        // Trudny (−10) test Opanowania, porażka – utrata wspomnień z ostatniej doby
        const result = await this._drinkerTest(drinker, 'NAME.Cool', 'difficult', game.i18n.localize('GOLD_ALCHEMY.Chat.ResistForget'));
        return i18n(result?.succeeded ? 'GOLD_ALCHEMY.Notifications.ForgetResisted' : 'GOLD_ALCHEMY.Notifications.ForgetFailed');
      }
      case 'trollrootRegen':
        return i18n('GOLD_ALCHEMY.Notifications.TrollrootRegen');
      case 'warpstoneMutation': {
        // Stare flakony skaveńskiego wywaru sprzed zmiany receptury
        const roll = await (new Roll('1d10')).evaluate();
        const curC = Number(drinker.system?.status?.corruption?.value) || 0;
        await drinker.update({ 'system.status.corruption.value': curC + roll.total });
        return i18n('GOLD_ALCHEMY.Notifications.WarpstoneCorruption', { corruption: roll.total });
      }
      case 'cordeliaHeal': {
        // UA1: 2×BWt Ran; Trudny (−10) Test Odporności, porażka – skutek uboczny na tyle minut, ile PS porażki
        await this._heal(drinker, tb * 2);
        const healed = i18n('GOLD_ALCHEMY.Notifications.HealingDraughtRestored', { wounds: tb * 2 });
        const result = await this._drinkerTest(drinker, 'NAME.Endurance', 'difficult', game.i18n.localize('GOLD_ALCHEMY.Chat.ResistCordelia'));
        if (!result || result.succeeded) return healed;
        const minutes = Math.max(1, Math.abs(result.sl));
        const side = (await (new Roll('1d10')).evaluate()).total;
        const [condition, value, key] = side <= 3 ? ['blinded', 3, 'Blinded']
          : side <= 6 ? ['broken', 1, 'Broken']
            : side <= 9 ? ['stunned', 1, 'Stunned']
              : ['unconscious', 1, 'Unconscious'];
        // Skutek uboczny trwa tyle minut, ile PS porażki; potem efekt-licznik zdejmuje stan
        await this._addTimedCondition(drinker, condition, value, minutes * 60, i18n(`GOLD_ALCHEMY.Conditions.${key}`));
        return `${healed} ${i18n('GOLD_ALCHEMY.Notifications.CordeliaSideEffect', { condition: i18n(`GOLD_ALCHEMY.Conditions.${key}`), minutes })}`;
      }
      default:
        return '';
    }
  }

  /**
   * Skutek rzuconej mikstury na jednym celu (wykonywane u MG). Zwraca linię do karty czatu.
   * Ogień i kwasy działają jak Podpalacz z podręcznika: 1 + PS poziomów Podpalenia (magiczne o 1 więcej).
   */
  static async applyThrownToActor(effectId, actor, sl = 0, recipeId = null) {
    if (!actor) return '';
    if (effectId === RECIPE_THROWN) {
      const steps = RecipeRegistry.getRecipeById(recipeId, { includeUnavailable: true })?.thrownSteps;
      return (await runThrownSteps(steps, actor, Math.max(0, Number(sl) || 0), this._stepContext())).join(' ');
    }
    const name = actor.prototypeToken?.name || actor.name;
    const bonus = Math.max(0, Number(sl) || 0);
    const damageTypes = game.wfrp4e?.config?.DAMAGE_TYPE || { NORMAL: 0, IGNORE_AP: 1 };
    const i18n = (key, data = {}) => game.i18n.format(key, { target: name, ...data });

    switch (effectId) {
      case 'phosphorFireExplosion':
        await actor.addCondition?.('ablaze', 1 + bonus);
        return i18n('GOLD_ALCHEMY.Chat.ThrownAblaze', { value: 1 + bonus });
      case 'liquidFireExplosion':
        await actor.addCondition?.('ablaze', 2 + bonus);
        return i18n('GOLD_ALCHEMY.Chat.ThrownAblaze', { value: 2 + bonus });
      case 'acidDamage':
        await actor.addCondition?.('ablaze', 1 + bonus);
        return i18n('GOLD_ALCHEMY.Chat.ThrownAcid', { value: 1 + bonus });
      case 'alkahest':
      case 'alkahestAcid':
        await actor.addCondition?.('ablaze', 2 + bonus);
        return i18n('GOLD_ALCHEMY.Chat.ThrownAlkahest', { value: 2 + bonus });
      case 'trollAcidSplash': {
        // ZOO: Obrażenia +9, Przebijający, Niebezpieczny
        const damage = 9 + bonus;
        const msg = await actor.applyBasicDamage?.(damage, { damageType: damageTypes.NORMAL, suppressMsg: true });
        return i18n('GOLD_ALCHEMY.Chat.ThrownTrollAcid', { damage, details: msg || '' });
      }
      case 'flashPowderBlast':
        return (await this._addResistedCondition(actor, 'blinded', 1, name)) ?? i18n('GOLD_ALCHEMY.Chat.ThrownBlinded');
      case 'hyshSunFlash':
        return (await this._addResistedCondition(actor, 'blinded', 1 + bonus, name)) ?? i18n('GOLD_ALCHEMY.Chat.ThrownSunFlash', { value: 1 + bonus });
      default:
        return '';
    }
  }
}
