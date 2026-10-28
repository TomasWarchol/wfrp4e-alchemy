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
  return effectData;
}
