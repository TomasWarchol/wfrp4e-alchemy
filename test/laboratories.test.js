import { describe, expect, it } from "vitest";
import {
  damagedLabSlMod, formatSlMod, getActorLaboratories, isLaboratoryItem, labBrewUsage,
  readLaboratory, selectDefaultLabId
} from "../scripts/logic/laboratories.js";
import { ALCHEMY_LABORATORIES } from "../scripts/data/laboratories.js";

const makeLab = (id, name, { slMod = 0, cauldrons = 1, quantity = 1 } = {}) => ({
  id,
  name,
  type: "trapping",
  img: "icons/consumables/potions/potion-flask-capped-yellow-green.webp",
  system: { quantity: { value: quantity } },
  flags: {
    "wfrp4e-alchemy": {
      isLaboratory: true,
      laboratory: { slMod, cauldrons }
    }
  }
});

describe("Posiadane laboratoria i aparatura alchemiczna", () => {
  it("rozpoznaje wyłącznie przedmioty typu trapping z flagą isLaboratory", () => {
    const lab = makeLab("l1", "Pracownia", { slMod: 1, cauldrons: 2 });
    const regular = { id: "i1", name: "Młotek", type: "trapping", flags: {} };
    const wrongType = { id: "s1", name: "Zaklęcie", type: "spell", flags: { "wfrp4e-alchemy": { isLaboratory: true } } };
    expect(isLaboratoryItem(lab)).toBe(true);
    expect(isLaboratoryItem(regular)).toBe(false);
    expect(isLaboratoryItem(wrongType)).toBe(false);
  });

  it("odczytuje poziom +PS, liczbę kotłów (mnożoną przez sztuki) i sortuje po najwyższym +PS", () => {
    const poor = makeLab("l1", "Alembik polowy", { slMod: -1, cauldrons: 1 });
    const fine = makeLab("l2", "Wyśmienita pracownia", { slMod: 2, cauldrons: 3 });
    const doubled = makeLab("l3", "Kociołek zapasowy", { slMod: 0, cauldrons: 1, quantity: 2 });
    const empty = makeLab("l4", "Zużyte szkło", { slMod: 1, cauldrons: 2, quantity: 0 });
    const actor = { itemTypes: { trapping: [poor, empty, doubled, fine] } };

    const labs = getActorLaboratories(actor);
    expect(labs.map((l) => l.id)).toEqual(["l2", "l3", "l1"]);
    expect(labs[0]).toMatchObject({ slMod: 2, cauldrons: 3, icon: "ui-lab_fine" });
    expect(labs[1]).toMatchObject({ slMod: 0, unitCauldrons: 1, cauldrons: 2, quantity: 2, icon: "ui-lab_standard" });
    expect(labs[2]).toMatchObject({ slMod: -1, cauldrons: 1, icon: "ui-lab_poor" });
    expect(formatSlMod(2)).toBe("+2");
    expect(formatSlMod(0)).toBe("+0");
    expect(formatSlMod(-1)).toBe("-1");
  });

  it("odcina skrajne wartości parametrów do bezpiecznych widełek", () => {
    const wild = makeLab("l1", "Szalona aparatura", { slMod: 99, cauldrons: 0 });
    expect(readLaboratory(wild)).toMatchObject({ slMod: 10, unitCauldrons: 1, cauldrons: 1 });
  });

  it("zlicza zajętość kotłów osobno na każdej aparaturze i obsługuje starsze/osierocone warzenia", () => {
    const labs = [
      readLaboratory(makeLab("labA", "Standard", { slMod: 0, cauldrons: 1 })),
      readLaboratory(makeLab("labB", "Fine", { slMod: 1, cauldrons: 2 }))
    ];
    const brews = [
      { id: "b1", recipeId: "r1", recipeName: "Mikstura 1", labItemId: "labA" },
      { id: "b2", recipeId: "r2", recipeName: "Mikstura 2", labItemId: "labB" },
      { id: "b3", recipeId: "r3", recipeName: "Stare warzenie" },
      { id: "b4", recipeId: "r4", recipeName: "Zaginiona aparatura", labItemId: "removed-lab" }
    ];

    const usage = labBrewUsage(labs, brews);
    expect(usage.totalCapacity).toBe(3);
    expect(usage.totalUsed).toBe(4);
    expect(usage.byId.get("labA")).toMatchObject({ used: 2, free: 0 });
    expect(usage.byId.get("labB")).toMatchObject({ used: 1, free: 1 });
    expect(usage.orphanBrews).toHaveLength(1);

    expect(selectDefaultLabId(usage.list, null)).toBe("labB");
    expect(selectDefaultLabId(usage.list, "labA")).toBe("labA");
  });

  it("uszkodzenie aparatury przy pechu obniża poziom o 1 (nie niżej niż -2) i presety mają poprawne dane", () => {
    expect(damagedLabSlMod(1)).toBe(0);
    expect(damagedLabSlMod(0)).toBe(-1);
    expect(damagedLabSlMod(-2)).toBe(-2);
    expect(ALCHEMY_LABORATORIES).toHaveLength(4);
    expect(ALCHEMY_LABORATORIES.every((l) => l.cauldrons >= 1 && Number.isInteger(l.slMod))).toBe(true);
  });
});
