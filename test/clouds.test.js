import { describe, expect, it } from "vitest";
import { cloudExpired, cloudExpiry, cloudRegionData, radiusPixels, shouldTriggerCloudForActor } from "../scripts/logic/clouds.js";
import { runDrinkSteps } from "../scripts/logic/potion-steps.js";
import { ALCHEMY_RECIPES } from "../scripts/data/recipes.js";

describe("Chmury z mikstur", () => {
  it("promień w pikselach z siatki sceny", () => {
    expect(radiusPixels(4, 1, 100)).toBe(400);
    expect(radiusPixels(6, 2, 100)).toBe(300);
  });

  it("w walce znika na początku rundy start + rzut, poza walką po rundach × 6 s", () => {
    const combat = { id: "c1", round: 3 };
    const inCombat = cloudExpiry({ rounds: 4, combat });
    expect(inCombat).toEqual({ combatId: "c1", endRound: 7, expiresAt: null });
    expect(cloudExpired(inCombat, { combat: { id: "c1", round: 6 }, combatIds: new Set(["c1"]) })).toBe(false);
    expect(cloudExpired(inCombat, { combat: { id: "c1", round: 7 }, combatIds: new Set(["c1"]) })).toBe(true);
    expect(cloudExpired(inCombat, { combatIds: new Set() })).toBe(true); // walka zakończona

    const outside = cloudExpiry({ rounds: 5, worldTime: 1000 });
    expect(outside.expiresAt).toBe(1030);
    expect(cloudExpired(outside, { worldTime: 1029 })).toBe(false);
    expect(cloudExpired(outside, { worldTime: 1030 })).toBe(true);
  });

  it("region: koło, jeden poziom, blokada widzenia tylko dla dymu i mgły", () => {
    const smoke = cloudRegionData({ name: "Dym", x: 10, y: 20, radiusPx: 400, level: "L0", cloud: { sight: true }, state: { recipeId: "potion-smoke-pellet" } });
    expect(smoke.shapes).toEqual([{ type: "circle", x: 10, y: 20, radius: 400 }]);
    expect(smoke.levels).toEqual(["L0"]);
    expect(smoke.restriction).toEqual({ enabled: true, type: "sight", priority: 0 });
    expect(smoke.flags["wfrp4e-alchemy"].cloud.recipeId).toBe("potion-smoke-pellet");
    const stink = cloudRegionData({ name: "Smród", x: 0, y: 0, radiusPx: 600, level: "L0", cloud: {}, state: {} });
    expect(stink.restriction.enabled).toBe(false);
  });

  it("receptury chmur mają promień, a trujące – skutki na początku tury", () => {
    const byId = (id) => ALCHEMY_RECIPES.find((r) => r.id === id);
    expect(byId("potion-smoke-pellet").cloud).toMatchObject({ radius: 3, sight: true, terrainDuration: true });
    expect(byId("potion-ulgu-shadow-mist").cloud.sight).toBe(true);
    expect(byId("potion-stinkpot").cloud).toMatchObject({ radius: 3, roundsFormula: "1d5", oncePerActor: true });
    expect(byId("potion-stinkpot").cloud.roundSteps[0]).toMatchObject({ test: "endurance", difficulty: "average" });
    expect(byId("potion-plague-vapour")).toBeUndefined();
  });

  it("oncePerActor: chmura testuje każdego aktora najwyżej raz", () => {
    const cloud = { oncePerActor: true };
    expect(shouldTriggerCloudForActor(cloud, { testedActors: [] }, "Actor.1")).toBe(true);
    expect(shouldTriggerCloudForActor(cloud, { testedActors: ["Actor.1"] }, "Actor.1")).toBe(false);
    expect(shouldTriggerCloudForActor(cloud, { testedActors: ["Actor.1"] }, "Actor.2")).toBe(true);
    expect(shouldTriggerCloudForActor({}, { testedActors: ["Actor.1"] }, "Actor.1")).toBe(true);
  });

  it("notka dla MG w krokach", async () => {
    const actor = { name: "Hans" };
    const lines = await runDrinkSteps([{ test: "endurance", fail: [{ note: "GOLD_ALCHEMY.Cloud.Disease" }] }], actor, {
      i18n: (key, data) => `${key.split(".").at(-1)}${data ? JSON.stringify(data) : ""}`,
      test: async () => ({ succeeded: false })
    });
    expect(lines.at(-1)).toBe('Disease{"target":"Hans"}');
  });
});
