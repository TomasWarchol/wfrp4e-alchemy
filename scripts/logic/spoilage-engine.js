/**
 * Zasady Prawdopodobieństwa Zepsucia i Efektów Ubocznych z pełną lokalizacją
 */

import { MODULE_ID } from '../config.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { spoilageChances } from './rules.js';

export class SpoilageEngine {
  /**
   * @param {Item} potionItem
   * @param {Actor|null} drinker
   * @param {object} [options]
   * @param {boolean} [options.applySideEffect=true]  false dla rzuconej mikstury: zepsuta po prostu nie działa
   */
  static async evaluatePotion(potionItem, drinker, { applySideEffect = true } = {}) {
    const flag = potionItem.getFlag(MODULE_ID, 'alchemyData') || {};
    const expiryTimestamp = flag.expiryTimestamp;

    if (!CalendarIntegration.isExpired(expiryTimestamp)) {
      return {
        stillWorks: true,
        sideEffect: null,
        description: game.i18n.localize('GOLD_ALCHEMY.Spoilage.Fresh')
      };
    }

    if (flag.expiryMode === 'deactivate') {
      return {
        stillWorks: false,
        sideEffect: null,
        description: game.i18n.localize('GOLD_ALCHEMY.Spoilage.Deactivated')
      };
    }

    const currentTs = CalendarIntegration.getCurrentTimestamp();
    const elapsedSeconds = Math.max(0, currentTs - (flag.brewTimestamp || 0));
    const elapsedDays = Math.floor(elapsedSeconds / 86400);

    // Wiek w sezonach od uwarzenia: pierwszy sezon to 1
    const seasons = Math.floor(elapsedDays / 91) + 1;
    const sl = Number(flag.sl) || 0;

    const { spoilChance, partialChance } = this.getSpoilageChances(seasons, sl);

    const roll = await (new Roll('1d100')).evaluate();
    const rollTotal = roll.total;

    let stillWorks = false;
    let hasSideEffect = false;
    let spoilDesc = '';

    if (rollTotal <= spoilChance) {
      stillWorks = false;
      hasSideEffect = true;
      spoilDesc = game.i18n.localize('GOLD_ALCHEMY.Spoilage.CompletelySpoiled');
    } else if (rollTotal <= partialChance) {
      stillWorks = true;
      hasSideEffect = true;
      spoilDesc = game.i18n.localize('GOLD_ALCHEMY.Spoilage.PartiallySpoiled');
    } else {
      stillWorks = true;
      hasSideEffect = false;
      spoilDesc = game.i18n.localize('GOLD_ALCHEMY.Spoilage.MiraclePreserved');
    }

    let sideEffect = null;
    if (hasSideEffect && applySideEffect) {
      sideEffect = await this.rollSideEffect(drinker);
    }

    return {
      stillWorks,
      sideEffect,
      description: spoilDesc,
      rollDetails: game.i18n.format('GOLD_ALCHEMY.Spoilage.RollDetails', {
        roll: rollTotal,
        spoil: spoilChance,
        partial: partialChance
      })
    };
  }

  /** Szanse zepsucia z tabeli Wiatrów Magii (rules.spoilageChances). */
  static getSpoilageChances(seasons, sl) {
    return spoilageChances(seasons, sl);
  }

  static async rollSideEffect(drinker) {
    const roll = await (new Roll('1d100')).evaluate();
    const val = roll.total;

    const effects = [
      { max: 15, key: 'FoulBreath', condition: null },
      { max: 30, key: 'Cramps', condition: null },
      { max: 45, key: 'Flatulence', condition: null },
      { max: 60, key: 'Nausea', condition: 'stunned' },
      { max: 75, key: 'Dizziness', condition: null },
      { max: 85, key: 'GutBurn', damage: '1d10' },
      { max: 95, key: 'Poisoning', condition: 'poisoned' },
      { max: 100, key: 'Deadly', condition: 'poisoned' }
    ];

    const match = effects.find(e => val <= e.max) || effects[effects.length - 1];

    if (match.condition && drinker && drinker.addCondition) {
      try {
        await drinker.addCondition(match.condition);
      } catch (err) {
        console.warn('Condition apply error:', err);
      }
    }

    if (match.damage && drinker) {
      try {
        const dmgRoll = await (new Roll(match.damage)).evaluate();
        const curWounds = Number(drinker.system?.status?.wounds?.value) || 0;
        const newWounds = Math.max(0, curWounds - dmgRoll.total);
        await drinker.update({ 'system.status.wounds.value': newWounds });
      } catch (err) {
        console.warn('Damage apply error:', err);
      }
    }

    const name = game.i18n.localize(`GOLD_ALCHEMY.Spoilage.SideEffects.${match.key}.name`);
    const description = game.i18n.localize(`GOLD_ALCHEMY.Spoilage.SideEffects.${match.key}.desc`);

    return {
      roll: val,
      name,
      description
    };
  }
}
