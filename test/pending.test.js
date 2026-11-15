import { describe, expect, it } from "vitest";
import { cauldronCount, pendingFromFlags, reservedTether } from "../scripts/logic/pending-brews.js";

describe("kotły i warzenia w toku", () => {
  it("dawna pojedyncza flaga jest czytana jako lista", () => {
    expect(pendingFromFlags({ pendingBrew: { recipeId: "a" } })).toEqual([{ recipeId: "a" }]);
    expect(pendingFromFlags({})).toEqual([]);
  });
  it("nowa lista ma pierwszeństwo i pomija puste wpisy", () => {
    expect(pendingFromFlags({ pendingBrews: [{ recipeId: "a" }, null, {}], pendingBrew: { recipeId: "b" } })).toEqual([{ recipeId: "a" }]);
  });
  it("kotły według laboratorium: słabe i zwykłe 1, dobre 2", () => {
    expect(cauldronCount("poor")).toBe(1);
    expect(cauldronCount("standard")).toBe(1);
    expect(cauldronCount("fine")).toBe(2);
    expect(cauldronCount("nieznane")).toBe(1);
  });
  it("rezerwacje Więzi sumują się po kotłach", () => {
    expect(reservedTether([{ reserved: true, attunementReserved: 2 }, { reserved: true, attunementReserved: 3 }, { reserved: false, attunementReserved: 9 }])).toBe(5);
  });
});
