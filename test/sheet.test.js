import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyRows, buildRows } from "../tools/sheet/model.mjs";
import { locate, setStrings } from "../tools/sheet/json-text.mjs";
import { appendIngredient, setIngredientProps } from "../tools/sheet/ingredients-text.mjs";
import { ALCHEMY_RECIPES } from "../scripts/data/recipes.js";
import { ALCHEMY_INGREDIENTS } from "../scripts/data/ingredients.js";

const lang = {
  pl: JSON.parse(readFileSync(new URL("../lang/pl.json", import.meta.url), "utf8")),
  en: JSON.parse(readFileSync(new URL("../lang/en.json", import.meta.url), "utf8"))
};
const normalize = (recipe) => ({ ...recipe, track: "magical", creationTimeDays: 1, dosesFormula: "1", ingredientCostGC: 0, listPriceSS: 1 });
const data = { recipes: ALCHEMY_RECIPES, ingredients: ALCHEMY_INGREDIENTS, lang, normalize };

describe("Arkusz mikstur", () => {
  it("eksport i import bez zmian niczego nie zmienia", () => {
    const result = applyRows(data, buildRows(data));
    expect(result.errors).toEqual([]);
    expect(result.changes).toEqual([]);
  });

  it("każda receptura i składnik mają teksty PL i EN", () => {
    const { recipeRows, ingredientsSheet } = buildRows(data);
    for (const row of recipeRows) {
      for (const col of ["namePl", "nameEn", "descPl", "descEn", "effectPl", "effectEn"]) expect(row[col], `${row.id} ${col}`).not.toBe("");
    }
    for (const row of ingredientsSheet) {
      for (const col of ["namePl", "nameEn", "descPl", "descEn"]) expect(row[col], `${row.key} ${col}`).not.toBe("");
    }
  });

  it("pochodzenie oznacza oficjalne receptury i składniki", () => {
    const { recipeRows, ingredientsSheet } = buildRows(data);
    expect(recipeRows.find((r) => r.id === "potion-flight").origin).toBe("Oficjalne");
    expect(recipeRows.find((r) => r.id === "potion-iron-skin").origin).toBe("Autorskie");
    expect(ingredientsSheet.find((r) => r.key === "GriffinDown").origin).toBe("Oficjalne (tylko z receptur)");
    expect(ingredientsSheet.find((r) => r.key === "SilverLotus").origin).toBe("Oficjalne");
  });

  it("zmiany trafiają do danych, błędy blokują zapis", () => {
    const rows = buildRows(data);
    const flight = rows.recipeRows.find((r) => r.id === "potion-flight");
    flight.namePl = "Lot";
    flight.shelfLifeDays = 45;
    flight.durationFormula = "2d10";
    const ok = applyRows(data, rows);
    expect(ok.errors).toEqual([]);
    expect(ok.langChanges.pl[ALCHEMY_RECIPES.find((r) => r.id === "potion-flight").name]).toBe("Lot");
    const next = ok.recipes.find((r) => r.id === "potion-flight");
    expect(next.shelfLifeDays).toBe(45);
    expect(next.activeEffect.flags["wfrp4e-alchemy"].durationRoll.formula).toBe("2d10");
    expect(ALCHEMY_RECIPES.find((r) => r.id === "potion-flight").shelfLifeDays).not.toBe(45);

    flight.volatility = "huge";
    flight.nameEn = "";
    flight.key = "Other";
    const bad = applyRows(data, rows);
    expect(bad.errors.length).toBe(3);
  });

  it("puste źródło receptury to treść własna, bez zmiany kolejności pól", () => {
    const rows = buildRows(data);
    const result = applyRows(data, rows);
    const recipe = result.recipes.find((r) => r.id === "potion-iron-skin");
    expect(recipe.sourceModule).toBe("wfrp4e-alchemy");
    expect(Object.keys(recipe)).toEqual(Object.keys(ALCHEMY_RECIPES.find((r) => r.id === "potion-iron-skin")));
  });
});

describe("Edycja plików w miejscu", () => {
  it("JSON: zmienia wartość i dopisuje klucz, reszta pliku bez zmian", () => {
    const text = '{\n  "A": { "x": "1" },\n  "B": {\n    "y": "2"\n  }\n}\n';
    expect(setStrings(text, { "A.x": "1" })).toBe(text);
    const next = setStrings(text, { "A.x": "nowe \"x\"", "B.z.w": "3" });
    expect(JSON.parse(next)).toEqual({ A: { x: 'nowe "x"' }, B: { y: "2", z: { w: "3" } } });
    expect(next.startsWith('{\n  "A": { "x": "nowe \\"x\\"" },\n')).toBe(true);
    expect(locate(next).get("B.z.w").type).toBe("string");
  });

  it("ingredients.js: zmienia, dodaje i usuwa właściwości oraz dopisuje składnik", async () => {
    const text = "export const ALCHEMY_INGREDIENTS = [\n  {\n    key: 'A',\n    category: 'herbal',\n    img: 'a.webp',\n    price: { gc: 1, ss: 0, bp: 0 },\n    availability: 'rare'\n  }\n];\n";
    let next = setIngredientProps(text, "A", { sourceModule: "wfrp4e-core", price: { gc: 2, ss: 1, bp: 0 }, availability: "common" });
    next = appendIngredient(next, { key: "B", name: "N", category: "herbal", price: { gc: 0, ss: 1, bp: 0 }, availability: "it's" });
    const mod = await import(`data:text/javascript,${encodeURIComponent(next)}`);
    expect(mod.ALCHEMY_INGREDIENTS).toEqual([
      { key: "A", category: "herbal", sourceModule: "wfrp4e-core", img: "a.webp", price: { gc: 2, ss: 1, bp: 0 }, availability: "common" },
      { key: "B", name: "N", category: "herbal", price: { gc: 0, ss: 1, bp: 0 }, availability: "it's" }
    ]);
    const removed = setIngredientProps(next, "A", { sourceModule: undefined });
    expect(removed).not.toContain("sourceModule");
  });
});
