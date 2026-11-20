/**
 * Budowanie danych Active Effect mikstur w formacie Foundry v14
 * (img zamiast icon, system.changes z typem zamiast mode, duration.value + units)
 */

import { resolveAlchemyImage } from '../data/image-compatibility.js';

// Numeryczne tryby CONST.ACTIVE_EFFECT_MODES sprzed v14 → typy zmian v14
const MODE_TO_TYPE = {
  0: 'custom',
  1: 'multiply',
  2: 'add',
  3: 'downgrade',
  4: 'upgrade',
  5: 'override'
};

const DURATION_UNITS = ['seconds', 'turns', 'rounds'];

/** Wartości zmian w v14 są danymi JSON ("10" → 10, "true" → true). */
function parseChangeValue(value) {
  if (typeof value !== 'string' || value === '') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function convertChange(change) {
  if (change.type) return { ...change, value: parseChangeValue(change.value) };
  const { mode, ...rest } = change;
  return {
    ...rest,
    type: MODE_TO_TYPE[mode] ?? `custom.${mode}`,
    value: parseChangeValue(change.value)
  };
}

function convertDuration(duration) {
  if (!duration || typeof duration !== 'object') return undefined;
  if (duration.units) return { ...duration };
  for (const units of DURATION_UNITS) {
    if (typeof duration[units] === 'number') return { value: duration[units], units };
  }
  return undefined;
}

const OWN = 'wfrp4e-alchemy';
const CHARACTERISTIC_KEY = /^system\.characteristics\.([a-z]+)\.modifier$/;

/**
 * Skrypt premii do cech: z kilku mikstur dających premię do tej samej cechy działa tylko najwyższa
 * (przy remisie efekt o mniejszym id). Kary zostają zwykłymi zmianami i się sumują.
 * Wyzwalacz prePrepareItems działa po nałożeniu efektów, a przed przeliczeniem cech.
 */
export const BONUS_SCRIPT = [
  `const mine = this.effect.flags?.["${OWN}"]?.bonus || {};`,
  `const rivals = this.actor.effects.filter(e => e.active && e.flags?.["${OWN}"]?.bonus);`,
  'for (const [key, value] of Object.entries(mine)) {',
  '  let best = this.effect;',
  '  for (const e of rivals) {',
  `    const v = Number(e.flags["${OWN}"].bonus[key]) || 0;`,
  `    const b = Number(best.flags["${OWN}"].bonus[key]) || 0;`,
  '    if (v > b || (v === b && e.id < best.id)) best = e;',
  '  }',
  '  const characteristic = this.actor.system.characteristics?.[key];',
  '  if (best.id === this.effect.id && characteristic) characteristic.modifier += Number(value);',
  '}'
].join('\n');

/** Premia do testu z mikstury: przy kilku miksturach do tego samego testu liczy się najwyższa (licznik w args.flags okna testu). */
export function highestTestBonusScript(field, value) {
  const tracker = field === 'slBonus' ? 'alchemySL' : 'alchemyModifier';
  return `const bonus = ${value}; const best = args.flags.${tracker} ?? 0;\nif (bonus > best) { args.fields.${field} += bonus - best; args.flags.${tracker} = bonus; }`;
}

const PLAIN_TEST_BONUS = /^\s*args\.fields\.(modifier|slBonus)\s*\+=\s*(\d+)\s*;\s*$/;

/**
 * Premie mikstury liczone jako najwyższa: dodatnie zmiany cech trafiają do flagi `bonus` (ze skryptem BONUS_SCRIPT),
 * dodatnie premie do testów dostają skrypt z licznikiem. Kary i inne zmiany zostają bez zmian.
 */
export function applyHighestBonus(effectData) {
  const bonus = {};
  const changes = [];
  for (const change of effectData.system?.changes || []) {
    const key = CHARACTERISTIC_KEY.exec(change.key)?.[1];
    const value = Number(change.value);
    if (key && change.type === 'add' && value > 0) bonus[key] = (bonus[key] || 0) + value;
    else changes.push(change);
  }
  const scriptData = (effectData.system?.scriptData || []).map((script) => {
    const plain = script.trigger === 'dialog' && PLAIN_TEST_BONUS.exec(script.script || '');
    return plain ? { ...script, script: highestTestBonusScript(plain[1], Number(plain[2])) } : script;
  });
  if (Object.keys(bonus).length) {
    scriptData.push({ label: effectData.name, trigger: 'prePrepareItems', script: BONUS_SCRIPT });
    effectData.flags = { ...effectData.flags, [OWN]: { ...effectData.flags?.[OWN], bonus } };
  }
  effectData.system = { ...effectData.system, changes, scriptData };
  return effectData;
}

/**
 * Tworzy dane efektu mikstury z definicji receptury (recipe.activeEffect).
 * @param {object} activeEffect  Definicja efektu z receptury (stary format: icon, changes, duration.seconds/rounds)
 * @param {string} name          Nazwa efektu
 * @returns {object}
 */
export function buildPotionEffectData(activeEffect, name) {
  const { icon, img, changes, duration, system, ...rest } = activeEffect;
  const effectData = {
    ...rest,
    name,
    img: resolveAlchemyImage(img || icon, 'potion'),
    disabled: false,
    transfer: false,
    system: {
      ...(system || {}),
      changes: (system?.changes || changes || []).map(convertChange)
    }
  };
  const convertedDuration = convertDuration(duration);
  if (convertedDuration) effectData.duration = convertedDuration;
  return applyHighestBonus(effectData);
}
