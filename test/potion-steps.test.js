import { describe, expect, it } from "vitest";
import { runDrinkSteps, runThrownSteps, stepsHeal, timedConditionEffect } from "../scripts/logic/potion-steps.js";

function fakeActor({ wounds = 5, max = 12, tb = 3, conditions = {}, fortune = 1, fate = 2, corruption = 0 } = {}) {
  const actor = {
    name: "Hans",
    conds: { ...conditions },
    damage: [],
    system: {
      characteristics: { t: { bonus: tb } },
      status: { wounds: { value: wounds, max }, fortune: { value: fortune }, fate: { value: fate }, resolve: { value: 0 }, resilience: { value: 1 }, corruption: { value: corruption } }
    },
    hasCondition: (key) => (actor.conds[key] ? { conditionValue: actor.conds[key] } : null),
    removeCondition: async (key, n) => { actor.conds[key] = Math.max(0, actor.conds[key] - n); if (!actor.conds[key]) delete actor.conds[key]; },
    addCondition: async (key, n) => { actor.conds[key] = (actor.conds[key] || 0) + n; },
    applyBasicDamage: async (n, opts) => { actor.damage.push([n, opts.damageType]); return ""; },
    update: async (data) => {
      for (const [path, value] of Object.entries(data)) {
        const keys = path.split(".");
        keys.slice(0, -1).reduce((o, k) => o[k], actor)[keys.at(-1)] = value;
      }
    }
  };
  return actor;
}

const ctx = (testResult = { succeeded: true }) => ({
  i18n: (key, data) => `${key.split(".").at(-1)}${data ? JSON.stringify(data) : ""}`,
  roll: async (formula) => (formula === "1d10" ? 4 : 1),
  test: async () => testResult,
  conditionLabel: (key) => key,
  damageTypes: { NORMAL: 0, IGNORE_AP: 1 }
});

describe("Kroki mikstury – wypicie", () => {
  it("leczy wielokrotność BWt i formułę, nie ponad maksimum", async () => {
    const actor = fakeActor({ wounds: 5, max: 12, tb: 3 });
    await runDrinkSteps([{ heal: "2tb" }], actor, ctx());
    expect(actor.system.status.wounds.value).toBe(11);
    const lines = await runDrinkSteps([{ heal: "1d10" }], actor, ctx());
    expect(actor.system.status.wounds.value).toBe(12);
    expect(lines[0]).toContain('"wounds":1');
  });

  it("zdejmuje i nakłada stany", async () => {
    const actor = fakeActor({ conditions: { poisoned: 3, bleeding: 2 } });
    await runDrinkSteps([{ remove: "poisoned", value: "all" }, { remove: "bleeding", value: 1 }, { add: "fatigued", value: 2 }, { remove: "stunned" }], actor, ctx());
    expect(actor.conds).toEqual({ bleeding: 1, fatigued: 2 });
  });

  it("Szczęście najwyżej do Przeznaczenia, Zepsucie się dodaje", async () => {
    const actor = fakeActor({ fortune: 1, fate: 2 });
    await runDrinkSteps([{ fortune: 1 }, { fortune: 1 }, { corruption: 1 }], actor, ctx());
    expect(actor.system.status.fortune.value).toBe(2);
    expect(actor.system.status.corruption.value).toBe(1);
  });

  it("test pijącego wybiera gałąź; anulowany test nie ma skutków", async () => {
    const step = { test: "endurance", difficulty: "hard", pass: [{ remove: "poisoned", value: "all" }], fail: [{ add: "poisoned", value: 1 }] };
    const failed = fakeActor({ conditions: { poisoned: 1 } });
    await runDrinkSteps([step], failed, ctx({ succeeded: false }));
    expect(failed.conds.poisoned).toBe(2);
    const passed = fakeActor({ conditions: { poisoned: 1 } });
    await runDrinkSteps([step], passed, ctx({ succeeded: true }));
    expect(passed.conds.poisoned).toBeUndefined();
    const cancelled = fakeActor({ conditions: { poisoned: 1 } });
    await runDrinkSteps([step], cancelled, ctx(null));
    expect(cancelled.conds.poisoned).toBe(1);
  });

  it("stan z czasem tworzy efekt-licznik, który go potem zdejmuje", async () => {
    const actor = fakeActor();
    actor.effects = [];
    actor.createEmbeddedDocuments = async (type, data) => { actor.effects.push(...data); };
    const lines = await runDrinkSteps([{ add: "unconscious", duration: { formula: "1d10", units: "hours" } }], actor, ctx());
    expect(actor.conds.unconscious).toBe(1);
    expect(actor.effects).toHaveLength(1);
    const [timer] = actor.effects;
    expect(timer.duration).toEqual({ value: 4 * 3600, units: "seconds" });
    expect(timer.system.scriptData[0].trigger).toBe("deleteEffect");
    expect(timer.system.scriptData[0].script).toContain('removeCondition("unconscious", 1)');
    expect(lines.at(-1)).toContain("TimedFor");
    // Bez czasu – bez efektu-licznika
    await runDrinkSteps([{ add: "fatigued", value: 1 }], actor, ctx());
    expect(actor.effects).toHaveLength(1);
  });

  it("efekt-licznik ma co najmniej 1 sekundę i domyślną ikonę", () => {
    const data = timedConditionEffect({ name: "Oślepienie (na czas)", key: "blinded", value: 3, seconds: 0.2 });
    expect(data.duration.value).toBe(1);
    expect(data.img).toBeTruthy();
    expect(data.system.scriptData[0].script).toContain('removeCondition("blinded", 3)');
  });

  it("rozpoznaje leczenie także w gałęziach testu", () => {
    expect(stepsHeal([{ remove: "bleeding" }])).toBe(false);
    expect(stepsHeal([{ test: "endurance", pass: [{ heal: "tb" }] }])).toBe(true);
  });
});

describe("Kroki mikstury – rzut", () => {
  it("stan i obrażenia rosną z PS", async () => {
    const actor = fakeActor();
    await runThrownSteps([{ add: "entangled", value: 1, perSL: true }, { damage: 4, perSL: true, ignoreAP: true }, { damage: 2 }], actor, 2, ctx());
    expect(actor.conds.entangled).toBe(3);
    expect(actor.damage).toEqual([[6, 1], [2, 0]]);
  });
});
