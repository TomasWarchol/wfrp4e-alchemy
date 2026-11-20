import { describe, expect, it } from "vitest";
import { blastTargets, throwRangeBand } from "../scripts/logic/throwing.js";
import { applyHighestBonus, highestTestBonusScript } from "../scripts/logic/effect-data.js";
import { runThrownSteps } from "../scripts/logic/potion-steps.js";
import { addictionEffectData, craving, dayIndex, doseModifier, morningResult, pendingMornings, recentDoses } from "../scripts/logic/addiction.js";
import { ALCHEMY_RECIPES } from "../scripts/data/recipes.js";

const DAY = 86400;

describe("Rzut miksturą – zasięg i wybuch", () => {
  it("progi zasięgu jak w systemie, zasięg = Bonus Siły", () => {
    expect(throwRangeBand(0, 4)).toEqual({ band: "pb", difficulty: "easy" });
    expect(throwRangeBand(2, 4).band).toBe("short");
    expect(throwRangeBand(4, 4).band).toBe("normal");
    expect(throwRangeBand(8, 4)).toEqual({ band: "long", difficulty: "difficult" });
    expect(throwRangeBand(12, 4)).toEqual({ band: "extreme", difficulty: "vhard" });
    expect(throwRangeBand(13, 4)).toBeNull();
  });

  it("wybuch trafia cel i żetony w promieniu, bez wybuchu – tylko cel", () => {
    const target = { x: 0 }, near = { x: 2 }, far = { x: 5 };
    const measure = (a, b) => Math.abs(a.x - b.x);
    expect(blastTargets(target, [target, near, far], 2, measure)).toEqual([target, near]);
    expect(blastTargets(target, [target, near, far], 0, measure)).toEqual([target]);
    expect(blastTargets(null, [near], 2, measure)).toEqual([]);
  });

  it("receptury: ogień jak Podpalacz, testy obronne przy stanach z proszków i trucizn", () => {
    const byId = (id) => ALCHEMY_RECIPES.find((r) => r.id === id);
    expect(byId("potion-phosphor-fire").blast).toBe(4);
    expect(byId("potion-miners-powder").blast).toBe(5);
    expect(byId("potion-black-vial").blast).toBeUndefined();
    expect(byId("potion-black-vial").thrownSteps[0].resist).toEqual({ test: "endurance", difficulty: "challenging" });
    expect(byId("potion-nightmare-dust").thrownSteps[0].resist.test).toBe("cool");
    expect(byId("potion-tar-bomb").thrownSteps[0].resist).toBeUndefined();
  });
});

describe("Test obronny celu", () => {
  const actor = () => {
    const a = { name: "Cel", conds: {}, damage: [] };
    a.addCondition = async (key, n) => { a.conds[key] = (a.conds[key] || 0) + n; };
    a.applyBasicDamage = async (n) => { a.damage.push(n); return ""; };
    return a;
  };
  const ctx = (succeeded) => ({
    i18n: (key) => key.split(".").at(-1),
    conditionLabel: (key) => key,
    damageTypes: { NORMAL: 0, IGNORE_AP: 1 },
    resist: async () => ({ succeeded })
  });
  const steps = [{ damage: 4, perSL: true, ignoreAP: true }, { add: "blinded", value: 1, perSL: true, resist: { test: "dodge" } }];

  it("sukces chroni przed stanem, ale nie przed obrażeniami", async () => {
    const target = actor();
    const lines = await runThrownSteps(steps, target, 2, ctx(true));
    expect(target.conds).toEqual({});
    expect(target.damage).toEqual([6]);
    expect(lines.at(-1)).toBe("ThrownResisted");
  });

  it("porażka – stan rośnie z PS rzutu", async () => {
    const target = actor();
    await runThrownSteps(steps, target, 2, ctx(false));
    expect(target.conds.blinded).toBe(3);
  });
});

describe("Kumulacja premii z mikstur", () => {
  it("dodatnie premie do cech idą do flagi z skryptem najwyższej, kary zostają zmianami", () => {
    const data = applyHighestBonus({
      name: "Okład",
      system: { changes: [
        { key: "system.characteristics.t.modifier", type: "add", value: 10 },
        { key: "system.characteristics.ag.modifier", type: "add", value: -10 },
        { key: "flags.wfrp4e-alchemy.x", type: "override", value: true }
      ] }
    });
    expect(data.flags["wfrp4e-alchemy"].bonus).toEqual({ t: 10 });
    expect(data.system.changes.map((c) => c.key)).toEqual(["system.characteristics.ag.modifier", "flags.wfrp4e-alchemy.x"]);
    expect(data.system.scriptData.at(-1).trigger).toBe("prePrepareItems");
  });

  it("premie do testów: liczy się najwyższa, kary się sumują", () => {
    const run = (scripts) => {
      const args = { fields: { modifier: 0, slBonus: 0 }, flags: {} };
      for (const s of scripts) new Function("args", s)(args);
      return args.fields;
    };
    const plus20 = applyHighestBonus({ name: "a", system: { scriptData: [{ trigger: "dialog", script: "args.fields.modifier += 20;" }] } }).system.scriptData[0].script;
    const plus10 = highestTestBonusScript("modifier", 10);
    expect(run([plus10, plus20]).modifier).toBe(20);
    expect(run([plus20, plus10]).modifier).toBe(20);
    expect(run([plus20, "args.fields.modifier += -30;"]).modifier).toBe(-10);
    expect(run([highestTestBonusScript("slBonus", 1), highestTestBonusScript("slBonus", 1), plus10]).slBonus).toBe(1);
  });

  it("przerobienie jest idempotentne (drugi raz nic nie zmienia)", () => {
    const once = applyHighestBonus({ name: "a", system: { changes: [{ key: "system.characteristics.s.modifier", type: "add", value: 20 }], scriptData: [] } });
    const twice = applyHighestBonus(structuredClone(once));
    expect(twice.system.scriptData).toHaveLength(once.system.scriptData.length);
    expect(twice.flags["wfrp4e-alchemy"].bonus).toEqual({ s: 20 });
  });
});

describe("Nałóg", () => {
  it("kara za dawki z ostatnich 7 dni", () => {
    const now = 30 * DAY;
    expect(recentDoses([now - 8 * DAY, now - 6 * DAY, now - DAY], now)).toHaveLength(2);
    expect(doseModifier(2)).toBe(-20);
    expect(doseModifier(0)).toBe(-0);
  });

  it("głód po dobie bez dawki, poranne testy od dnia po głodzie", () => {
    const lastDose = 10 * DAY + 3600;
    expect(craving(lastDose, lastDose + DAY)).toBe(false);
    expect(craving(lastDose, lastDose + DAY + 1)).toBe(true);
    // Następny ranek (dzień 11) jest mniej niż dobę po dawce – nie liczy się; dni 12 i 13 tak
    expect(pendingMornings(dayIndex(lastDose), lastDose, 13 * DAY + 100)).toEqual([12, 13]);
    expect(pendingMornings(13, lastDose, 13 * DAY + 5000)).toEqual([]);
    expect(pendingMornings(0, 0, 100 * DAY)).toHaveLength(7);
  });

  it("trzy udane poranki z rzędu kończą nałóg, porażka zeruje serię", () => {
    expect(morningResult(1, true)).toEqual({ streak: 2, recovered: false });
    expect(morningResult(2, true)).toEqual({ streak: 3, recovered: true });
    expect(morningResult(2, false)).toEqual({ streak: 0, recovered: false });
  });

  it("efekt nałogu: kara −10 tylko w czasie głodu", () => {
    const data = addictionEffectData({ name: "Nałóg", recipeId: "potion-poppy-tincture", now: 5 * DAY });
    const script = data.system.scriptData[0];
    const effect = { flags: data.flags };
    globalThis.game = { time: { worldTime: 5 * DAY + 3600 } };
    const activate = new Function("args", script.options.activateScript).bind({ effect });
    const hide = new Function("args", script.options.hideScript).bind({ effect });
    expect(activate({})).toBe(false);
    expect(hide({})).toBe(true);
    globalThis.game.time.worldTime = 7 * DAY;
    expect(activate({})).toBe(true);
    expect(hide({})).toBe(false);
    delete globalThis.game;
  });

  it("uzależniające receptury mają trudność testu", () => {
    const addictive = ALCHEMY_RECIPES.filter((r) => r.addictive).map((r) => r.id).sort();
    expect(addictive).toEqual(["potion-bloodrage-draught", "potion-gravewine", "potion-poppy-tincture", "potion-skaven-brew", "potion-soulburn-tonic", "potion-witch-eye-drops"]);
  });
});
