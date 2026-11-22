import { describe, expect, it } from "vitest";
import {
  BREWING_DIFFICULTY, brewingApproach, brewingModifiers, isTestSuccess, memoryState, seasonsSince,
  spoilageChances, tetherMax, tetherState, tetherUsed
} from "../scripts/logic/rules.js";
import { ALCHEMY_RECIPES } from "../scripts/data/recipes.js";

const talent = (name, advances) => ({ name, system: advances ? { advances: { value: advances } } : {} });
const skill = (name, advances) => ({ name, system: { advances: { value: advances } } });

describe("Więź (tetherMax)", () => {
  it("BSW + BInt bez talentów", () => {
    expect(tetherMax({ wpBonus: 4, intBonus: 3 })).toBe(7);
  });
  it("Przyrządzanie Mikstur dodaje stopnie, Dostrojenie i Zmysł Aethyru po 2 na stopień", () => {
    expect(tetherMax({ wpBonus: 4, intBonus: 3, talents: [talent("Concoct", 2)] })).toBe(9);
    expect(tetherMax({ wpBonus: 4, intBonus: 3, talents: [talent("Dostrojony do Chamonu", 1)] })).toBe(9);
    expect(tetherMax({ wpBonus: 4, intBonus: 3, talents: [talent("Aethyric Attunement", 2)] })).toBe(11);
  });
  it("talent bez pola stopni liczy się jako 1; z kilku tego rodzaju liczy się ten z największą liczbą stopni", () => {
    expect(tetherMax({ wpBonus: 1, intBonus: 1, talents: [talent("Przyrządzanie Mikstur")] })).toBe(3);
    expect(tetherMax({ wpBonus: 1, intBonus: 1, talents: [talent("Attuned to Aqshy", 1), talent("Attuned to Azyr", 3)] })).toBe(8);
  });
  it("nazwy bez polskich znaków i ze specjalizacją w nawiasie", () => {
    expect(tetherMax({ wpBonus: 0, intBonus: 0, talents: [talent("Przyrzadzanie mikstur", 2)] })).toBe(2);
    expect(tetherMax({ wpBonus: 0, intBonus: 0, talents: [talent("Zmysl Aethyru", 1)] })).toBe(2);
    expect(tetherMax({ wpBonus: 0, intBonus: 0, talents: [talent("Attuned to (Ghur)", 1)] })).toBe(2);
    expect(tetherMax({ wpBonus: 0, intBonus: 0, talents: [talent("Concoction Master", 3)] })).toBe(0);
  });
  it("modyfikator MG i brak wartości ujemnych", () => {
    expect(tetherMax({ wpBonus: 2, intBonus: 2, customMod: 3 })).toBe(7);
    expect(tetherMax({ wpBonus: 1, intBonus: 1, customMod: -9 })).toBe(0);
    expect(tetherMax({ wpBonus: 1, intBonus: 1, customMod: "zły" })).toBe(2);
  });
});

describe("pamięć receptur (memoryState)", () => {
  it("BInt + najwyższa umiejętność ÷ 10 + 2 × Przyrządzanie", () => {
    const state = memoryState({
      intBonus: 3,
      skills: [skill("Trade (Apothecary)", 0), skill("Alchemia", 15), skill("Splatanie Magii (Ghyran)", 22)],
      talents: [talent("Concoct", 1), talent("Przyrządzanie Mikstur", 2)]
    });
    expect(state.skillBonus).toBe(2);
    expect(state.concoctBonus).toBe(6);
    expect(state.max).toBe(11);
  });
  it("Chamon: +5 miejsc i receptury Chamonu za darmo; nieznane receptury zajmują miejsce", () => {
    const state = memoryState({
      intBonus: 2,
      talents: [talent("Attuned to Chamon", 1)],
      memorized: [{ category: "college-chamon" }, { category: "college-aqshy" }, null]
    });
    expect(state.hasChamonBonus).toBe(true);
    expect(state.max).toBe(7);
    expect(state.used).toBe(2);
    expect(state.available).toBe(5);
    expect(state.memorizedCount).toBe(3);
  });
  it("Chamon: talent z wiatrem w nawiasie, umiejętność ze specjalizacją z pola", () => {
    expect(memoryState({ talents: [{ name: "Dostrojony do (Chamonu)" }] }).hasChamonBonus).toBe(true);
    expect(memoryState({ skills: [{ name: "Splatanie Magii", system: { specification: { value: "Chamon" }, advances: { value: 5 } } }] }).hasChamonBonus).toBe(true);
    expect(memoryState({ talents: [{ name: "Attuned to Aqshy" }] }).hasChamonBonus).toBe(false);
  });
  it("Chamon rozpoznany także po umiejętności Splatania", () => {
    expect(memoryState({ skills: [skill("Channelling (Chamon)", 5)] }).hasChamonBonus).toBe(true);
  });
  it("modyfikator MG", () => {
    expect(memoryState({ intBonus: 2, customMod: -1 }).max).toBe(1);
  });
});

describe("warzenie", () => {
  it("tor według kategorii", () => {
    expect(brewingApproach("herbal")).toBe("herbalism");
    expect(brewingApproach("apothecary")).toBe("apothecary");
    expect(brewingApproach("mundane")).toBe("alchemy");
    expect(brewingApproach("forbidden")).toBe("alchemy");
    expect(brewingApproach("college-aqshy")).toBe("magic");
  });
  it("trudność z toru i lotności, PS z laboratorium, Percepcji, wadliwego odpisu i receptury", () => {
    expect(brewingModifiers({ category: "magical", volatility: "extreme", creationDifficultySL: -3 })).toEqual({ approach: "magic", difficultyMod: -10, slBonus: -3 });
    expect(brewingModifiers({ category: "herbal", volatility: "major" }, { labSlMod: 1, magicalSense: true, flawed: true }))
      .toEqual({ approach: "herbalism", difficultyMod: -20, slBonus: 1 });
  });
  it("wynik testu: outcome systemu, 01–05 zawsze, 96–00 nigdy, -0 to porażka", () => {
    expect(isTestSuccess({ outcome: "success" })).toBe(true);
    expect(isTestSuccess({ outcome: "failure", SL: 2 })).toBe(false);
    expect(isTestSuccess({ roll: 4, target: 1 })).toBe(true);
    expect(isTestSuccess({ roll: 96, target: 120 })).toBe(false);
    expect(isTestSuccess({ roll: 40, target: 45 })).toBe(true);
    expect(isTestSuccess({ SL: "-0" })).toBe(false);
    expect(isTestSuccess({ SL: 0 })).toBe(true);
  });
});

describe("psucie (Wiatry Magii)", () => {
  it("wiersz według PS (0–6), kolumna według sezonów", () => {
    expect(spoilageChances(1, 0)).toEqual({ spoilChance: 11, partialChance: 22 });
    expect(spoilageChances(2, 3)).toEqual({ spoilChance: 16, partialChance: 32 });
    expect(spoilageChances(4, 9)).toEqual({ spoilChance: 15, partialChance: 30 });
    expect(spoilageChances(20, -2)).toEqual({ spoilChance: 65, partialChance: 95 });
  });
  it("wiek w sezonach: pierwszy sezon to 1, sezon ma 91 dni", () => {
    const day = 86400;
    expect(seasonsSince(0)).toBe(1);
    expect(seasonsSince(90 * day)).toBe(1);
    expect(seasonsSince(91 * day)).toBe(2);
  });
});

describe("mikstura na Więzi (tetherState)", () => {
  const flag = { attunementCost: 2, expiryTimestamp: 1000 };
  it("aktywna przed terminem, przeterminowana po nim", () => {
    expect(tetherState(flag, 1, 999)).toBe("active");
    expect(tetherState(flag, 1, 1000)).toBe("active");
    expect(tetherState(flag, 1, 1001)).toBe("expired");
  });
  it("nie trzyma Więzi: zerwana, bez kosztu, bez sztuk, bez flagi", () => {
    expect(tetherState({ ...flag, isDead: true }, 1, 0)).toBe("none");
    expect(tetherState({ ...flag, attunementCost: 0 }, 1, 0)).toBe("none");
    expect(tetherState(flag, 0, 0)).toBe("none");
    expect(tetherState(null, 1, 0)).toBe("none");
  });
  it("bez terminu trzyma Więź zawsze", () => {
    expect(tetherState({ attunementCost: 1 }, 1, 9e9)).toBe("active");
  });
  it("zajęta Więź: koszt × sztuki", () => {
    expect(tetherUsed([{ cost: 2, quantity: 3 }, { cost: 5, quantity: 1 }])).toBe(11);
  });
});

describe("dane receptur", () => {
  it("unikalne identyfikatory i znana lotność", () => {
    const ids = ALCHEMY_RECIPES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const volatilities = Object.keys(BREWING_DIFFICULTY.magic);
    for (const recipe of ALCHEMY_RECIPES) {
      if (recipe.volatility) expect(volatilities).toContain(recipe.volatility);
    }
  });
});

import { formatPrice, potionQuality, priceFromGC, scalePrice, scalePriceSS } from "../scripts/logic/rules.js";

describe("A5: jakość mikstury z PS", () => {
  it("progi: 0–1 zwykła, 2–3 dobra, 4+ wyborna", () => {
    expect(potionQuality(1).tier).toBe("standard");
    expect(potionQuality(2).tier).toBe("good");
    expect(potionQuality(4).tier).toBe("excellent");
    expect(potionQuality(-2).tier).toBe("standard");
  });
  it("świecka: +1 dawka dla dobrej, + PS dawek dla wybornej", () => {
    expect(potionQuality(3, { track: "mundane" }).bonusDoses).toBe(1);
    expect(potionQuality(5, { track: "mundane" }).bonusDoses).toBe(5);
    expect(potionQuality(0, { track: "mundane" }).bonusDoses).toBe(0);
  });
  it("magiczna wyborna: Więź −1 na dawkę, najmniej 1", () => {
    expect(potionQuality(4, { attunementCost: 3 }).tetherCost).toBe(2);
    expect(potionQuality(6, { attunementCost: 1 }).tetherCost).toBe(1);
    expect(potionQuality(3, { attunementCost: 3 }).tetherCost).toBe(3);
  });
});

describe("A6: premia Chamonu", () => {
  const chamon = { intBonus: 2, talents: [{ name: "Attuned to Chamon" }], memorized: [{ category: "college-chamon" }, { category: "college-aqshy" }] };
  it("zalecane: tylko darmowe receptury Chamonu", () => {
    const s = memoryState({ ...chamon, chamonMode: "freeRecipes" });
    expect(s.max).toBe(2);
    expect(s.used).toBe(1);
  });
  it("dawna zasada: +5 i darmowe receptury", () => {
    const s = memoryState({ ...chamon, chamonMode: "both" });
    expect(s.max).toBe(7);
    expect(s.used).toBe(1);
  });
  it("tylko +5 miejsc", () => {
    const s = memoryState({ ...chamon, chamonMode: "slots" });
    expect(s.max).toBe(7);
    expect(s.used).toBe(2);
  });
});

describe("mnożnik cen (scalePrice / scalePriceSS)", () => {
  it("mnożnik 1 nie zmienia ceny bazowej", () => {
    expect(scalePrice({ gc: 1, ss: 5, bp: 3 }, 1)).toEqual({ gc: 1, ss: 5, bp: 3 });
    expect(scalePriceSS(17, 1)).toBe(17);
  });
  it("skaluje ceny w górę i w dół z zachowaniem pensów (min. 1 p)", () => {
    expect(scalePrice({ gc: 0, ss: 2, bp: 0 }, 0.25)).toEqual({ gc: 0, ss: 0, bp: 6 });
    expect(scalePrice({ gc: 0, ss: 5, bp: 0 }, 0.5)).toEqual({ gc: 0, ss: 2, bp: 6 });
    expect(scalePrice({ gc: 1, ss: 10, bp: 0 }, 1.5)).toEqual({ gc: 2, ss: 5, bp: 0 });
    expect(scalePrice({ gc: 0, ss: 0, bp: 1 }, 0.25)).toEqual({ gc: 0, ss: 0, bp: 1 });
    expect(scalePrice({ gc: 0, ss: 0, bp: 0 }, 2)).toEqual({ gc: 0, ss: 0, bp: 0 });
  });
  it("skaluje cenę dawki w szylingach (min. 1 s) i ignoruje błędny mnożnik", () => {
    expect(scalePriceSS(20, 0.5)).toBe(10);
    expect(scalePriceSS(20, 1.5)).toBe(30);
    expect(scalePriceSS(1, 0.25)).toBe(1);
    expect(scalePriceSS(12, 0)).toBe(12);
    expect(scalePriceSS(12, NaN)).toBe(12);
  });
});

describe("formatowanie walut WFRP (gc / ss / bp)", () => {
  it("przelicza ułamkowe ZK na gc / ss / bp bez ułamków dziesiętnych", () => {
    expect(priceFromGC(0.9)).toEqual({ gc: 0, ss: 18, bp: 0 });
    expect(priceFromGC(1.5)).toEqual({ gc: 1, ss: 10, bp: 0 });
    expect(priceFromGC(0.025)).toEqual({ gc: 0, ss: 0, bp: 6 });
    expect(priceFromGC(0)).toEqual({ gc: 0, ss: 0, bp: 0 });
  });

  it("formatuje niezerowe nominały w EN i PL", () => {
    const pl = { gc: "zk", ss: "ss", bp: "bp" };
    expect(formatPrice(priceFromGC(0.9))).toBe("18 ss");
    expect(formatPrice(priceFromGC(0.9), pl)).toBe("18 ss");
    expect(formatPrice({ gc: 1, ss: 10, bp: 0 })).toBe("1 gc 10 ss");
    expect(formatPrice({ gc: 1, ss: 10, bp: 0 }, pl)).toBe("1 zk 10 ss");
    expect(formatPrice({ gc: 9, ss: 0, bp: 0 })).toBe("9 gc");
    expect(formatPrice({ gc: 0, ss: 2, bp: 6 }, pl)).toBe("2 ss 6 bp");
    expect(formatPrice({ gc: 0, ss: 0, bp: 0 })).toBe("0 bp");
  });
});
