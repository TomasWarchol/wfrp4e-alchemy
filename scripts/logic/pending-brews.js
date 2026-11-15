/**
 * Warzenia w toku: lista na postaci (flaga `pendingBrews`), po jednym kotle na warzenie.
 * Dawna pojedyncza flaga `pendingBrew` jest odczytywana i zastępowana listą przy pierwszym zapisie.
 */
import { MODULE_ID, ALCHEMY_CONFIG } from '../config.js';

/** Warzenia w toku z danych flag (czysta funkcja: lista albo dawna pojedyncza flaga). */
export function pendingFromFlags(flags = {}) {
  if (Array.isArray(flags.pendingBrews)) return flags.pendingBrews.filter((b) => b?.recipeId);
  return flags.pendingBrew?.recipeId ? [flags.pendingBrew] : [];
}

/** Liczba kotłów w laboratorium danego poziomu (słabe i zwykłe: 1, dobre: 2). */
export const cauldronCount = (labTierId) => ALCHEMY_CONFIG.LAB_TIERS[labTierId]?.cauldrons ?? 1;

/** Więź zarezerwowana przez wszystkie warzenia w toku. */
export const reservedTether = (brews) => brews.reduce((sum, b) => sum + (b.reserved ? Number(b.attunementReserved) || 0 : 0), 0);

export function getPendingBrews(actor) {
  return pendingFromFlags(actor?.flags?.[MODULE_ID] ?? {});
}

export async function setPendingBrews(actor, brews) {
  await actor.update({
    [`flags.${MODULE_ID}.pendingBrews`]: brews,
    [`flags.${MODULE_ID}.-=pendingBrew`]: null
  });
}
