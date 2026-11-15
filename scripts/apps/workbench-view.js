/**
 * Dane widoku „Pracownia Alchemika” wyliczane z kontekstu Warsztatu: tradycje, sigile wiatrów, słoje
 * składników, łańcuch Więzi, półka pamięci i naczynie na stole. Logika warzenia się nie zmienia.
 */
import { recipeTradition, recipeWind } from '../ui.js';

/** Rodzaj składnika → ikona słoja (według nazwy klucza, a gdy nie pasuje – według kategorii). */
const INGREDIENT_RULES = [
  [/aethyr|warp|wind|meteoric/i, 'ing_aethyr'],
  [/venom|saliva|nightshade|datura|lotus/i, 'ing_venom'],
  [/root|mandrake/i, 'ing_root'],
  [/mushroom|fung|toadstool/i, 'ing_mushroom'],
  [/crystal|stone|prism|gem|quartz|amber/i, 'ing_mineral'],
  [/gold|silver|iron|lead|copper|mercury|needle|cinnabar/i, 'ing_metal'],
  [/salt|saltpeter|ammonia/i, 'ing_salt'],
  [/oil|wax|fat|resin|sap/i, 'ing_oil'],
  [/blood|bone|feather|down|eye|claw|fang|gland|horn|scale/i, 'ing_animal'],
  [/dust|powder|ash|sulfur|phosphor|charcoal|sand|sediment/i, 'ing_powder'],
  [/water|dew|aqua|alcohol|essence|ink|regia|vitae/i, 'ing_liquid'],
  [/leaf|leaves|petal|clover|herb|balm|nettle|comfrey|sage|valerian|hop|bean|mint|lavender|rose/i, 'ing_herb']
];
const CATEGORY_FALLBACK = { herbal: 'ing_herb', apothecary: 'ing_herb', magical: 'ing_aethyr', mundane: 'ing_powder', forbidden: 'ing_venom' };

export function ingredientGlyph(key = '', category = '') {
  const rule = INGREDIENT_RULES.find(([pattern]) => pattern.test(key));
  return `craft-${rule ? rule[1] : CATEGORY_FALLBACK[category] ?? 'ing_powder'}`;
}

/** Naczynie na stole według tradycji. */
const VESSELS = { colleges: 'ves-alembic', alchemy: 'ves-retort', apothecary: 'ves-mortar', herbal: 'ves-herbal', forbidden: 'ves-forbidden' };
/** Ikona zakładki i karty receptury według tradycji. */
const TRADITION_ICONS = { colleges: 'ui-tab_colleges', alchemy: 'ui-tab_alchemy', apothecary: 'ui-tab_apothecary', herbal: 'ui-tab_herbal', forbidden: 'ui-tab_forbidden' };
/** Lotność → liczba płomieni (trudność warzenia). */
const FLAMES = { minor: 1, moderate: 2, major: 3, extreme: 4 };
/** Najwięcej ogniw i miejsc rysowanych osobno; dalej sama liczba. */
const MAX_PIPS = 24;

const pips = (total, filled) => Array.from({ length: Math.min(Math.max(0, total), MAX_PIPS) }, (_, i) => ({ filled: i < filled }));

/**
 * Uzupełnia kontekst Warsztatu o dane pracowni.
 * @param {object} context  wynik AlchemyWorkshopApp#_prepareContext (bez pola workbench)
 * @param {{ingredientCategory: (key: string) => string}} lookups
 */
export function workbenchContext(context, { ingredientCategory = () => '' } = {}) {
  const decorate = (recipe) => {
    const tradition = recipeTradition(recipe);
    const wind = recipeWind(recipe);
    const missing = (recipe.ingredientsStatus ?? []).filter((i) => !i.sufficient).length;
    return { ...recipe, tradition, wind, traditionIcon: TRADITION_ICONS[tradition], missing };
  };

  const recipes = context.recipes.map(decorate);
  let selected = context.selectedRecipe ? decorate(context.selectedRecipe) : null;
  if (selected) {
    const flames = FLAMES[selected.volatility] ?? 2;
    selected = {
      ...selected,
      vessel: VESSELS[selected.tradition],
      flames: Array.from({ length: 4 }, (_, i) => ({ lit: i < flames })),
      jars: (selected.ingredientsStatus ?? []).map((ing) => ({
        ...ing,
        glyph: ingredientGlyph(ing.key, ingredientCategory(ing.key))
      }))
    };
  }

  const { capacity, memory } = context;
  return {
    recipes,
    selectedRecipe: selected,
    traditionTabs: [
      { id: 'all', icon: 'ui-know_all', label: 'GOLD_ALCHEMY.Category.All' },
      { id: 'magical-all', icon: 'ui-tab_colleges', label: 'GOLD_ALCHEMY.Category.Colleges' },
      { id: 'mundane', icon: 'ui-tab_alchemy', label: 'GOLD_ALCHEMY.Category.Mundane' },
      { id: 'apothecary', icon: 'ui-tab_apothecary', label: 'GOLD_ALCHEMY.Category.Apothecary' },
      { id: 'herbal', icon: 'ui-tab_herbal', label: 'GOLD_ALCHEMY.Category.Herbal' }
    ].map((tab) => ({ ...tab, active: context.selectedCategory === tab.id })),
    windTabs: context.collegeTabs.map((tab) => ({
      ...tab,
      wind: tab.id.replace('college-', ''),
      active: context.selectedSubCategory === tab.id
    })),
    tetherLinks: pips(capacity.max, capacity.used),
    tetherOverflow: Math.max(0, capacity.max - MAX_PIPS),
    memorySlots: pips(memory.max, memory.used),
    memoryOverflow: Math.max(0, memory.max - MAX_PIPS)
  };
}
