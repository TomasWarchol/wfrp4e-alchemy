/**
 * Efekty mikstur opisane danymi receptury zamiast osobnego kodu dla każdej mikstury.
 *
 * Receptura z `instantEffect: 'recipe'` ma `instantSteps` (wypicie), z `'recipeThrown'` ma `thrownSteps`
 * (na każdym trafionym celu), `'recipeCloud'` tworzy chmurę w miejscu upadku (opis w tekście efektu).
 *
 * Kroki wypicia:
 *   { heal: 'tb' | '2tb' | '3tb' | 4 | '1d10' }        leczy Rany (formuła rzutu albo wielokrotność BWt)
 *   { remove: 'poisoned', value: 1 | 'all' }            zdejmuje poziomy stanu
 *   { add: 'fatigued', value: 1 }                      nakłada stan
 *   { add: 'unconscious', duration: { formula: '1d10', units: 'hours' } }
 *                                                      stan na określony czas: po nim efekt-licznik zdejmuje stan
 *   { fortune: 1 } / { resolve: 1 }                    przywraca Szczęście / Determinację (najwyżej do Przeznaczenia / Odporności Psychicznej)
 *   { corruption: 1 }                                  dodaje Punkty Zepsucia
 *   { test: 'endurance' | 'cool', difficulty: 'hard', pass: [...], fail: [...] }
 *   { note: 'GOLD_ALCHEMY.…' }                         linia dla MG na karcie czatu ({target} – imię)
 * Chmury (`'recipeCloud'`, receptura z `cloud`) – zob. clouds.js; `cloud.roundSteps` to kroki jak przy wypiciu,
 * wykonywane na początku tury każdego żetonu w chmurze (testy bez okna).
 * Kroki rzutu (na celu, `sl` – PS testu trafienia):
 *   { add: 'blinded', value: 1, perSL: true }          stan, +1 poziom za każdy PS
 *   { damage: 4, perSL: true, ignoreAP: false }        obrażenia
 *   { add: 'poisoned', ..., resist: { test: 'endurance' | 'cool' | 'dodge', difficulty } }
 *                                                      cel zdaje test (bez okna) – sukces chroni przed stanem
 * Receptura rzucana może mieć `blast` (promień wybuchu w jednostkach sceny) – zob. throwing.js.
 *
 * Funkcje dostają zależności przez `ctx`, żeby dało się je testować bez Foundry.
 */

export const RECIPE_DRINK = 'recipe';
export const RECIPE_THROWN = 'recipeThrown';
export const RECIPE_CLOUD = 'recipeCloud';

const TEST_SKILLS = { endurance: 'NAME.Endurance', cool: 'NAME.Cool', dodge: 'NAME.Dodge', athletics: 'NAME.Athletics' };

const SIZE_ORDER = ['tiny', 'ltl', 'sml', 'avg', 'lrg', 'enor', 'mnst'];

function hasTrait(actor, trait, ctx) {
  const localized = ctx.i18n('NAME.' + trait);
  return Boolean(actor.has?.(localized) || (localized !== trait && actor.has?.(trait)));
}

/** Sekundy w jednostce czasu kroku. */
const UNIT_SECONDS = { rounds: 6, minutes: 60, hours: 3600, days: 86400 };

/**
 * Dane efektu-licznika: po wygaśnięciu (Foundry v14 usuwa go sam) zdejmuje stan nałożony przez miksturę.
 * Ręczne usunięcie efektu też zdejmuje stan.
 * @param {{name: string, img?: string, key: string, value?: number, seconds: number}} options
 */
export function timedConditionEffect({ name, img, key, value = 1, seconds }) {
  return {
    name,
    img: img || 'icons/svg/clockwork.svg',
    duration: { value: Math.max(1, Math.round(seconds)), units: 'seconds' },
    system: {
      scriptData: [{
        label: name,
        trigger: 'deleteEffect',
        script: `if (this.actor.hasCondition(${JSON.stringify(key)})) await this.actor.removeCondition(${JSON.stringify(key)}, ${Number(value) || 1});`
      }]
    }
  };
}

/** Czas kroku w sekundach (rzut formuły × jednostka) albo null, gdy krok nie ma czasu. */
async function stepSeconds(duration, ctx) {
  if (!duration?.formula) return null;
  const amount = await ctx.roll(String(duration.formula));
  return Math.max(1, amount) * (UNIT_SECONDS[duration.units] ?? 1);
}

/** Liczba Ran do wyleczenia. */
async function healAmount(spec, actor, ctx) {
  const tb = Number(actor.system?.characteristics?.t?.bonus) || 0;
  if (typeof spec === 'number') return spec;
  const multiple = /^(\d*)tb$/i.exec(String(spec));
  if (multiple) return tb * (Number(multiple[1]) || 1);
  return ctx.roll(String(spec));
}

async function removeCondition(actor, key, value) {
  const effect = actor.hasCondition?.(key);
  if (!effect) return false;
  const current = Number(effect.conditionValue) || 1;
  await actor.removeCondition(key, value === 'all' ? current : Math.min(current, Number(value) || 1));
  return true;
}

/**
 * Wykonuje kroki wypicia na pijącym. Zwraca linie do karty czatu.
 * @param {object[]} steps
 * @param {Actor} actor
 * @param {{i18n: Function, roll: (formula: string) => Promise<number>, test: Function, conditionLabel: (key: string) => string}} ctx
 */
export async function runDrinkSteps(steps, actor, ctx) {
  const lines = [];
  for (const step of steps || []) {
    if (step.heal !== undefined) {
      const cur = Number(actor.system?.status?.wounds?.value) || 0;
      if (step.requireWounds && cur <= 0) {
        lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.HealNoWounds'));
        continue;
      }
      const wounds = await healAmount(step.heal, actor, ctx);
      const max = Number(actor.system?.status?.wounds?.max) || cur;
      const healed = Math.max(0, Math.min(max, cur + wounds) - cur);
      await actor.update({ 'system.status.wounds.value': cur + healed });
      lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.Healed', { wounds: healed }));
    } else if (step.remove) {
      if (await removeCondition(actor, step.remove, step.value ?? 1)) {
        lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.Removed', { condition: ctx.conditionLabel(step.remove) }));
      }
    } else if (step.add) {
      const value = Number(step.value) || 1;
      await actor.addCondition?.(step.add, value);
      lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.Added', { condition: ctx.conditionLabel(step.add), value }));
      const seconds = await stepSeconds(step.duration, ctx);
      if (seconds) {
        const name = ctx.i18n('GOLD_ALCHEMY.Steps.TimedName', { condition: ctx.conditionLabel(step.add) });
        await actor.createEmbeddedDocuments?.('ActiveEffect', [timedConditionEffect({ name, key: step.add, value, seconds })]);
        lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.TimedFor', { duration: ctx.formatDuration?.(seconds) ?? `${seconds} s` }));
      }
    } else if (step.fortune || step.resolve) {
      const [pool, cap, key] = step.fortune ? ['fortune', 'fate', 'Fortune'] : ['resolve', 'resilience', 'Resolve'];
      const cur = Number(actor.system?.status?.[pool]?.value) || 0;
      const max = Number(actor.system?.status?.[cap]?.value) || 0;
      const next = Math.min(Math.max(cur, max), cur + (step.fortune || step.resolve));
      await actor.update({ [`system.status.${pool}.value`]: next });
      lines.push(ctx.i18n(next > cur ? `GOLD_ALCHEMY.Steps.${key}` : `GOLD_ALCHEMY.Steps.${key}Full`));
    } else if (step.corruption) {
      const cur = Number(actor.system?.status?.corruption?.value) || 0;
      await actor.update({ 'system.status.corruption.value': Math.max(0, cur + step.corruption) });
      lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.Corruption', { value: step.corruption }));
    } else if (step.note) {
      lines.push(ctx.i18n(step.note, { target: actor.prototypeToken?.name || actor.name }));
    } else if (step.test) {
      const result = await ctx.test(actor, TEST_SKILLS[step.test] ?? step.test, step.difficulty || 'challenging');
      if (!result) {
        if (!step.mandatory) continue; // anulowane okno testu: bez skutków (chyba że test jest obowiązkowy)
        lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.TestFailed'));
        lines.push(...await runDrinkSteps(step.fail, actor, ctx));
        continue;
      }
      lines.push(ctx.i18n(result.succeeded ? 'GOLD_ALCHEMY.Steps.TestPassed' : 'GOLD_ALCHEMY.Steps.TestFailed'));
      lines.push(...await runDrinkSteps(result.succeeded ? step.pass : step.fail, actor, ctx));
    }
  }
  return lines;
}

/**
 * Wykonuje kroki rzutu na jednym celu. Zwraca linie do karty czatu.
 * @param {{i18n: Function, conditionLabel: Function, damageTypes: object}} ctx
 */
export async function runThrownSteps(steps, actor, sl, ctx) {
  const lines = [];
  const bonus = Math.max(0, Number(sl) || 0);
  const target = actor.prototypeToken?.name || actor.name;
  for (const step of steps || []) {
    // Test obronny celu: sukces chroni przed tym stanem (obrażenia i Podpalenie działają bez testu)
    if (step.against && !step.against.some(trait => hasTrait(actor, trait, ctx))) continue;
    if (step.excludeTraits && step.excludeTraits.some(trait => hasTrait(actor, trait, ctx))) continue;
    if (step.maxSize) {
      const actorSize = actor.system?.details?.size?.value;
      const limitIdx = SIZE_ORDER.indexOf(step.maxSize);
      const actorIdx = SIZE_ORDER.indexOf(actorSize);
      if (limitIdx >= 0 && actorIdx > limitIdx) continue;
    }
    if (step.onlyIfAbsent && actor.hasCondition?.(step.add)) continue;
    if (step.resist && (step.add || step.note)) {
      const result = await ctx.resist?.(actor, TEST_SKILLS[step.resist.test] ?? step.resist.test, step.resist.difficulty || 'challenging');
      if (result?.succeeded) {
        const condition = step.add ? ctx.conditionLabel(step.add) : ctx.i18n(step.resistLabel || 'GOLD_ALCHEMY.Steps.EffectLabel');
        lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.ThrownResisted', { target, condition }));
        continue;
      }
    }
    if (step.add) {
      const value = (Number(step.value) || 1) + (step.perSL ? bonus : 0) + Number(step.extraAtSL > 0 && bonus >= step.extraAtSL);
      await actor.addCondition?.(step.add, value);
      lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.ThrownCondition', { target, condition: ctx.conditionLabel(step.add), value }));
    } else if (step.damage) {
      const damage = Number(step.damage) + (step.perSL ? bonus : 0);
      const type = step.ignoreAP ? ctx.damageTypes.IGNORE_AP : ctx.damageTypes.NORMAL;
      const details = await actor.applyBasicDamage?.(damage, { damageType: type, suppressMsg: true });
      lines.push(ctx.i18n('GOLD_ALCHEMY.Steps.ThrownDamage', { target, damage, details: details || '' }));
    } else if (step.note) {
      lines.push(ctx.i18n(step.note, { target }));
    }
  }
  return lines;
}

/** Czy kroki mają leczenie (zasada: jedna mikstura lecznicza na spotkanie). */
export const stepsHeal = (steps) => (steps || []).some((step) => step.heal !== undefined
  || stepsHeal(step.pass) || stepsHeal(step.fail));
