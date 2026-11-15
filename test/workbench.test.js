import { describe, expect, it } from "vitest";
import { ingredientGlyph, workbenchContext } from "../scripts/apps/workbench-view.js";
import { recipeTradition, recipeWind } from "../scripts/ui.js";
import { ALCHEMY_INGREDIENTS } from "../scripts/data/ingredients.js";

describe("pracownia: tradycje i wiatry", () => {
  it("tradycja według kategorii receptury", () => {
    expect(recipeTradition({ category: "college-aqshy" })).toBe("colleges");
    expect(recipeTradition({ category: "magical" })).toBe("colleges");
    expect(recipeTradition({ category: "mundane" })).toBe("alchemy");
    expect(recipeTradition({ category: "apothecary" })).toBe("apothecary");
    expect(recipeTradition({ category: "herbal" })).toBe("herbal");
    expect(recipeTradition({ category: "forbidden" })).toBe("forbidden");
  });
  it("wiatr tylko dla receptur Kolegiów", () => {
    expect(recipeWind({ category: "college-shyish" })).toBe("shyish");
    expect(recipeWind({ category: "chamon" })).toBe("chamon");
    expect(recipeWind({ category: "magical" })).toBeNull();
  });
});

describe("pracownia: słoje składników", () => {
  it("ikona według nazwy, a gdy nie pasuje – według kategorii", () => {
    expect(ingredientGlyph("MandrakeRoot")).toBe("craft-ing_root");
    expect(ingredientGlyph("AethyrCrystal")).toBe("craft-ing_aethyr");
    expect(ingredientGlyph("GoldDust")).toBe("craft-ing_metal");
    expect(ingredientGlyph("Sulfur")).toBe("craft-ing_powder");
    expect(ingredientGlyph("RoseWater")).toBe("craft-ing_liquid");
    expect(ingredientGlyph("Nieznany", "herbal")).toBe("craft-ing_herb");
  });
  it("każdy składnik z bazy dostaje ikonę", () => {
    for (const ing of ALCHEMY_INGREDIENTS) expect(ingredientGlyph(ing.key, ing.category)).toMatch(/^craft-ing_\w+$/);
  });
});

describe("pracownia: kontekst", () => {
  const base = {
    recipes: [{ id: "a", category: "college-aqshy", ingredientsStatus: [{ key: "Sulfur", sufficient: false }, { key: "Beeswax", sufficient: true }] }],
    selectedRecipe: { id: "a", category: "college-aqshy", volatility: "major", ingredientsStatus: [{ key: "Sulfur", sufficient: false }] },
    selectedCategory: "magical-all",
    selectedSubCategory: "college-aqshy",
    collegeTabs: [{ id: "college-aqshy", name: "Aqshy" }],
    capacity: { max: 7, used: 3 },
    memory: { max: 5, used: 1 }
  };
  it("receptury z tradycją, wiatrem i liczbą brakujących składników", () => {
    const ctx = workbenchContext(base);
    expect(ctx.recipes[0]).toMatchObject({ tradition: "colleges", wind: "aqshy", missing: 1 });
    expect(ctx.selectedRecipe.vessel).toBe("ves-alembic");
    expect(ctx.selectedRecipe.flames.filter((f) => f.lit)).toHaveLength(3);
    expect(ctx.selectedRecipe.jars[0].glyph).toBe("craft-ing_powder");
  });
  it("ogniwa Więzi i miejsca pamięci", () => {
    const ctx = workbenchContext(base);
    expect(ctx.tetherLinks).toHaveLength(7);
    expect(ctx.tetherLinks.filter((l) => l.filled)).toHaveLength(3);
    expect(ctx.memorySlots.filter((s) => s.filled)).toHaveLength(1);
    expect(ctx.traditionTabs.find((t) => t.active).id).toBe("magical-all");
    expect(ctx.windTabs[0]).toMatchObject({ wind: "aqshy", active: true });
  });
});
