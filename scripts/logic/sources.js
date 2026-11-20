/**
 * Treści z oficjalnych podręczników (receptury i składniki z polem sourceModule) są dostępne
 * tylko wtedy, gdy w świecie jest włączony oficjalny moduł Foundry tego podręcznika.
 * Nie ma wyłącznika ani zamienników: moduł tłumaczenia nie zastępuje modułu z treścią.
 * Czyste funkcje bez `game` – testowane w test/sources.test.js.
 */

const OWN_SOURCE = 'wfrp4e-alchemy';

/** Czy źródło to własna treść modułu (dostępna zawsze). */
export const isOwnSource = (sourceModule) => !sourceModule || sourceModule === OWN_SOURCE;

/**
 * Czy treść z danego źródła może się pokazać.
 * @param {string|undefined|null} sourceModule  identyfikator oficjalnego modułu Foundry
 * @param {(moduleId: string) => boolean} isModuleActive
 */
export function sourceAvailable(sourceModule, isModuleActive) {
  if (isOwnSource(sourceModule)) return true;
  try {
    return Boolean(isModuleActive(sourceModule));
  } catch {
    return false;
  }
}

/**
 * Składnik pokazuje się, gdy jego własne źródło jest dostępne i nie pochodzi wyłącznie
 * z receptur wyłączonych podręczników (składnik bez receptur zostaje).
 * @param {{key: string, sourceModule?: string}} ingredient
 * @param {Array<{sourceModule?: string, ingredients?: Array<{key: string}>}>} recipes  receptury wbudowane
 */
export function ingredientAvailable(ingredient, recipes, isModuleActive) {
  if (!sourceAvailable(ingredient.sourceModule, isModuleActive)) return false;
  const users = recipes.filter((recipe) => (recipe.ingredients || []).some((ing) => ing.key === ingredient.key));
  return users.length === 0 || users.some((recipe) => sourceAvailable(recipe.sourceModule, isModuleActive));
}
