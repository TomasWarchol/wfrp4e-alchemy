/**
 * Nałóg – zasada domowa (podręcznik opisuje niektóre środki jako uzależniające, ale nie podaje mechaniki).
 *
 * - Receptura z `addictive: { difficulty }` po każdej dawce wymaga testu Opanowania o tej trudności,
 *   z karą −10 za każdą dawkę tej mikstury w ostatnich 7 dniach. Porażka daje efekt Nałogu.
 * - Nałóg: gdy od ostatniej dawki minęła ponad doba, wszystkie testy mają −10 (głód).
 * - Każdego ranka bez dawki: Wymagający (+0) test Siły Woli; porażka – 1 Stan Zmęczenie,
 *   trzy udane poranki z rzędu zdejmują Nałóg. Dawka zaspokaja głód i zeruje serię.
 * Ustawienie świata `addiction` włącza zasadę (domyślnie włączona).
 */

import { MODULE_ID } from '../config.js';

const DAY = 86400;
export const ADDICTION_WINDOW = 7 * DAY;
export const MORNINGS_TO_RECOVER = 3;
const MAX_CHECKS_PER_UPDATE = 7;

/** Dawki z ostatnich 7 dni (znaczniki czasu świata). */
export function recentDoses(doses, now) {
  return (doses || []).filter(time => Number(time) > now - ADDICTION_WINDOW && Number(time) <= now);
}

/** Kara do testu Opanowania po dawce: −10 za każdą wcześniejszą dawkę z ostatnich 7 dni. */
export const doseModifier = (recentCount) => -10 * Math.max(0, recentCount);

export const dayIndex = (time) => Math.floor(Number(time) / DAY);

/** Czy trwa głód (od ostatniej dawki minęła ponad doba). */
export const craving = (lastDose, now) => now - Number(lastDose) > DAY;

/**
 * Poranki do sprawdzenia od ostatniego testu: dni po `lastCheckDay` do dziś, zaczynające się co najmniej
 * dobę po ostatniej dawce. Najwyżej MAX_CHECKS_PER_UPDATE naraz (duży skok czasu).
 */
export function pendingMornings(lastCheckDay, lastDose, now) {
  const days = [];
  for (let day = Number(lastCheckDay) + 1; day <= dayIndex(now) && days.length < MAX_CHECKS_PER_UPDATE; day++) {
    if (day * DAY - Number(lastDose) >= DAY) days.push(day);
  }
  return days;
}

/** Wynik porannego testu: nowa seria i czy Nałóg mija. */
export function morningResult(streak, succeeded) {
  const next = succeeded ? Number(streak) + 1 : 0;
  return { streak: next, recovered: next >= MORNINGS_TO_RECOVER };
}

/** Kara głodu jako skrypt okna testu: włącza się sama tylko w czasie głodu. */
const CRAVING_CHECK = `const a = this.effect.flags?.["${MODULE_ID}"]?.addiction; return !!a && game.time.worldTime - Number(a.lastDose) > ${DAY};`;

export function addictionEffectData({ name, recipeId, now }) {
  return {
    name,
    img: 'icons/consumables/potions/bottle-round-corked-pink.webp',
    flags: { [MODULE_ID]: { addiction: { recipeId, lastDose: now, lastCheckDay: dayIndex(now), streak: 0 } } },
    system: {
      scriptData: [{
        label: name,
        trigger: 'dialog',
        script: 'args.fields.modifier -= 10;',
        options: {
          activateScript: CRAVING_CHECK,
          hideScript: CRAVING_CHECK.replace('return !!a &&', 'return !a ||').replace('> 86400', '<= 86400')
        }
      }]
    }
  };
}

export class AddictionEngine {
  static enabled() {
    try { return !!game.settings.get(MODULE_ID, 'addiction'); } catch (e) { return false; }
  }

  static init() {
    Hooks.on('updateWorldTime', () => this.checkMornings());
  }

  static _addictions(actor) {
    return (actor?.effects || []).filter(effect => effect.getFlag?.(MODULE_ID, 'addiction'));
  }

  /**
   * Po wypiciu mikstury uzależniającej. Zwraca linię do karty czatu albo ''.
   * @param {Actor} actor
   * @param {object} recipe
   * @param {string} potionName
   */
  static async afterDose(actor, recipe, potionName) {
    if (!this.enabled() || !actor || !recipe?.addictive) return '';
    const now = game.time.worldTime;
    const i18n = (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

    const doses = actor.getFlag(MODULE_ID, `doses.${recipe.id}`) || [];
    const recent = recentDoses(doses, now);
    await actor.setFlag(MODULE_ID, `doses.${recipe.id}`, [...recent, now]);

    // Uzależniony: dawka zaspokaja głód i zeruje serię
    const existing = this._addictions(actor).find(effect => effect.getFlag(MODULE_ID, 'addiction')?.recipeId === recipe.id);
    if (existing) {
      await existing.update({ [`flags.${MODULE_ID}.addiction`]: { ...existing.getFlag(MODULE_ID, 'addiction'), lastDose: now, lastCheckDay: dayIndex(now), streak: 0 } });
      return i18n('GOLD_ALCHEMY.Addiction.Sated', { potion: potionName });
    }

    const modifier = doseModifier(recent.length);
    const test = await actor.setupSkill(game.i18n.localize('NAME.Cool'), {
      fields: { difficulty: recipe.addictive.difficulty || 'challenging', modifier },
      appendTitle: ` – ${i18n('GOLD_ALCHEMY.Addiction.TestTitle', { potion: potionName })}`,
      skipTargets: true
    });
    if (!test) return '';
    await test.roll();
    if (test.succeeded) return i18n('GOLD_ALCHEMY.Addiction.Resisted');

    const name = i18n('GOLD_ALCHEMY.Addiction.Name', { potion: potionName });
    await actor.createEmbeddedDocuments('ActiveEffect', [addictionEffectData({ name, recipeId: recipe.id, now })]);
    return i18n('GOLD_ALCHEMY.Addiction.Gained', { potion: potionName });
  }

  static #lastCheckedDay = null;

  /** Poranne testy głodu (wykonuje aktywny MG, gdy czas świata przejdzie na nowy dzień). */
  static async checkMornings() {
    if (!this.enabled() || !game.users.activeGM?.isSelf) return;
    const now = game.time.worldTime;
    if (this.#lastCheckedDay === dayIndex(now)) return;
    this.#lastCheckedDay = dayIndex(now);
    const actors = new Set(game.actors.contents);
    for (const token of canvas?.tokens?.placeables || []) if (token.actor && !token.document.actorLink) actors.add(token.actor);

    for (const actor of actors) {
      for (const effect of this._addictions(actor)) {
        const state = { ...effect.getFlag(MODULE_ID, 'addiction') };
        const mornings = pendingMornings(state.lastCheckDay, state.lastDose, now);
        if (!mornings.length) continue;
        let recovered = false;
        let fatigue = 0;
        for (const day of mornings) {
          const test = await actor.setupCharacteristic('wp', {
            skipDialog: true,
            fields: { difficulty: 'challenging' },
            appendTitle: ` – ${effect.name}`
          });
          if (!test) break;
          await test.roll();
          const result = morningResult(state.streak, !!test.succeeded);
          state.streak = result.streak;
          state.lastCheckDay = day;
          if (!test.succeeded) fatigue++;
          if (result.recovered) { recovered = true; break; }
        }
        if (fatigue) await actor.addCondition('fatigued', fatigue);
        if (recovered) {
          await effect.delete();
          ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${game.i18n.format('GOLD_ALCHEMY.Addiction.Recovered', { name: effect.name })}</p>` });
        }
        else {
          state.lastCheckDay = Math.max(Number(state.lastCheckDay) || 0, mornings.at(-1));
          await effect.update({ [`flags.${MODULE_ID}.addiction`]: state });
        }
      }
    }
  }
}
