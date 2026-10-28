/**
 * Logika spożywania i rzucania mikstur z pełną lokalizacją
 */

import { MODULE_ID } from '../config.js';
import { SpoilageEngine } from './spoilage-engine.js';
import { RecipeRegistry } from './recipe-registry.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { AlchemyQueries } from '../queries.js';

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
  'ulguShadowMist'
]);

/** Chmury tworzone w miejscu upadku – nie wymagają celu ani testu trafienia. */
const CLOUD_EFFECTS = new Set(['smokePelletCloud', 'ulguShadowMist']);

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
          const ed = effect.toObject();
          delete ed._id;
          ed.disabled = false;
          ed.transfer = false;
          // Foundry v14 ustawia start (czas świata, walka, runda) przy tworzeniu efektu na aktorze
          delete ed.start;
          if (magical) foundry.utils.setProperty(ed, `flags.${MODULE_ID}.magicalPotion`, true);
          const rolled = await this._rollDuration(ed, drinker);
          if (rolled) effectLines.push(rolled);
          effectsToCreate.push(ed);
        }
        await drinker.createEmbeddedDocuments('ActiveEffect', effectsToCreate);
      }

      if (flag.instantEffect) {
        const line = await this.handleInstantEffect(flag.instantEffect, drinker);
        if (line) effectLines.push(line);
      }
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
    const targets = Array.from(game.user.targets || []).filter(token => token.actor);
    if (!isCloud && !targets.length) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NoThrowTarget'));
      return;
    }

    const hit = isCloud ? { success: true, sl: 0 } : await this._rollThrow(thrower, item.name);
    if (!hit) return; // Anulowano okno testu

    const spoilage = await SpoilageEngine.evaluatePotion(item, null, { applySideEffect: false });
    await this._useDose(item, qty);
    const cost = await this._refundTether(flag, item.name, thrower.name);

    const lines = [];
    if (!spoilage.stillWorks) {
      lines.push(game.i18n.localize('GOLD_ALCHEMY.Chat.ThrowFizzled'));
    } else if (isCloud) {
      const rounds = (await (new Roll('1d10')).evaluate()).total;
      lines.push(game.i18n.format('GOLD_ALCHEMY.Chat.CloudCreated', { rounds }));
    } else if (!hit.success) {
      lines.push(game.i18n.localize('GOLD_ALCHEMY.Chat.ThrowMissed'));
    } else {
      const results = await AlchemyQueries.applyThrownEffect({
        effectId,
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

  /** Test trafienia: Broń Zasięgowa (Rzucana), a bez niej Umiejętności Strzeleckie. PS decyduje o sile (jak Podpalacz). */
  static async _rollThrow(thrower, potionName) {
    const skill = (thrower.itemTypes?.skill || []).find(s => /rzucan|throw/i.test(s.name || ''));
    const context = { title: game.i18n.format('GOLD_ALCHEMY.Chat.ThrowTest', { potion: potionName }), skipTargets: true };
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

  /**
   * Natychmiastowy efekt wypitej mikstury. Zwraca linię do karty czatu.
   */
  static async handleInstantEffect(effectId, drinker) {
    if (!drinker) return '';

    const tb = Number(drinker.system?.characteristics?.t?.bonus) || 3;
    const i18n = (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

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
        await drinker.addCondition?.(condition, value);
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
  static async applyThrownToActor(effectId, actor, sl = 0) {
    if (!actor) return '';
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
        await actor.addCondition?.('blinded', 1);
        return i18n('GOLD_ALCHEMY.Chat.ThrownBlinded');
      case 'hyshSunFlash':
        await actor.addCondition?.('blinded', 1 + bonus);
        return i18n('GOLD_ALCHEMY.Chat.ThrownSunFlash', { value: 1 + bonus });
      default:
        return '';
    }
  }
}
