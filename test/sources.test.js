import { describe, expect, it } from "vitest";
import { ingredientAvailable, isOwnSource, sourceAvailable } from "../scripts/logic/sources.js";
import { ALCHEMY_RECIPES } from "../scripts/data/recipes.js";
import { ALCHEMY_INGREDIENTS } from "../scripts/data/ingredients.js";

const none = () => false;
const only = (...ids) => (id) => ids.includes(id);

/** Oficjalne moduły treści WFRP4e, z których pochodzą receptury i składniki. */
const OFFICIAL = ["wfrp4e-core", "wfrp4e-wom", "wfrp4e-starter-set", "wfrp4e-horned-rat", "wfrp4e-ua1", "wfrp4e-zoo"];

describe("Źródła treści", () => {
  it("własne treści są dostępne zawsze, oficjalne tylko z włączonym modułem", () => {
    expect(sourceAvailable(undefined, none)).toBe(true);
    expect(sourceAvailable("wfrp4e-alchemy", none)).toBe(true);
    expect(sourceAvailable("wfrp4e-wom", none)).toBe(false);
    expect(sourceAvailable("wfrp4e-wom", only("wfrp4e-wom"))).toBe(true);
  });

  it("moduł tłumaczenia nie zastępuje modułu z treścią", () => {
    expect(sourceAvailable("wfrp4e-core", only("wfrp4e-core-pl", "wfrp4e-core-pl-dev"))).toBe(false);
    expect(sourceAvailable("wfrp4e-wom", only("wfrp4e-wom-pl"))).toBe(false);
  });

  it("błąd przy sprawdzaniu modułu ukrywa treść", () => {
    expect(sourceAvailable("wfrp4e-core", () => { throw new Error("no game"); })).toBe(false);
  });

  it("każde źródło w danych to znany oficjalny moduł albo własna treść", () => {
    const sources = [...ALCHEMY_RECIPES, ...ALCHEMY_INGREDIENTS].map((entry) => entry.sourceModule).filter((s) => !isOwnSource(s));
    expect(sources.filter((s) => !OFFICIAL.includes(s))).toEqual([]);
  });

  it("bez oficjalnych modułów zostają tylko własne receptury", () => {
    const visible = ALCHEMY_RECIPES.filter((recipe) => sourceAvailable(recipe.sourceModule, none));
    expect(visible.length).toBeGreaterThan(0);
    expect(visible.every((recipe) => isOwnSource(recipe.sourceModule))).toBe(true);
  });

  it("składniki tylko z oficjalnych receptur znikają razem z nimi", () => {
    const byKey = Object.fromEntries(ALCHEMY_INGREDIENTS.map((ing) => [ing.key, ing]));
    expect(ingredientAvailable(byKey.GriffinDown, ALCHEMY_RECIPES, none)).toBe(false);
    expect(ingredientAvailable(byKey.GriffinDown, ALCHEMY_RECIPES, only("wfrp4e-wom"))).toBe(true);
    expect(ingredientAvailable(byKey.SkavenBlood, ALCHEMY_RECIPES, only("wfrp4e-wom"))).toBe(false);
    // Składnik oznaczony podręcznikiem wymaga właśnie tego podręcznika
    expect(ingredientAvailable(byKey.SilverLotus, ALCHEMY_RECIPES, only("wfrp4e-wom"))).toBe(false);
    // Składnik używany też przez własne receptury zostaje
    expect(ingredientAvailable(byKey.AethyrCrystal, ALCHEMY_RECIPES, none)).toBe(true);
  });

  it("bez oficjalnych modułów żaden widoczny składnik nie służy wyłącznie oficjalnym recepturom", () => {
    for (const ing of ALCHEMY_INGREDIENTS.filter((i) => ingredientAvailable(i, ALCHEMY_RECIPES, none))) {
      const users = ALCHEMY_RECIPES.filter((r) => r.ingredients.some((x) => x.key === ing.key));
      expect(users.length === 0 || users.some((r) => isOwnSource(r.sourceModule)), ing.key).toBe(true);
    }
  });
});
