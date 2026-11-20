/**
 * Chmury z rzuconych mikstur (Bomba Dymna, Mgła Cienia, Smrodzielnik, Opar Zarazy) jako regiony sceny.
 *
 * Receptura ma `cloud: { radius, color, sight, roundSteps }`:
 *  - radius – promień w jednostkach sceny (jardy),
 *  - sight – region blokuje widzenie (ograniczenie regionu typu "sight"),
 *  - roundSteps – kroki jak przy wypiciu, na początku tury każdego żetonu w chmurze (testy bez okna).
 * Chmura trwa 1k10 rund: w walce do początku rundy (start + rundy), poza walką rundy × 6 s czasu świata.
 * Regiony tworzy i usuwa aktywny MG (gracz prosi przez zapytanie).
 */

import { MODULE_ID } from '../config.js';
import { runDrinkSteps } from './potion-steps.js';

const SECONDS_PER_ROUND = 6;

/** Promień w pikselach sceny. */
export function radiusPixels(radius, gridDistance, gridSize) {
  return Math.max(1, (Number(radius) || 1) / (Number(gridDistance) || 1) * (Number(gridSize) || 100));
}

/** Kiedy chmura znika: w walce numer rundy, poza walką czas świata. */
export function cloudExpiry({ rounds, combat = null, worldTime = 0 }) {
  if (combat) return { combatId: combat.id, endRound: Number(combat.round || 0) + rounds, expiresAt: null };
  return { combatId: null, endRound: null, expiresAt: worldTime + rounds * SECONDS_PER_ROUND };
}

/** Czy chmura już wygasła. */
export function cloudExpired(state, { combat = null, worldTime = 0, combatIds = null } = {}) {
  if (!state) return false;
  if (state.combatId) {
    if (combatIds && !combatIds.has(state.combatId)) return true; // walka zakończona
    if (combat?.id === state.combatId) return Number(combat.round) >= Number(state.endRound);
    return false;
  }
  return state.expiresAt !== null && worldTime >= Number(state.expiresAt);
}

/** Dane regionu chmury. */
export function cloudRegionData({ name, x, y, radiusPx, level, cloud, state }) {
  return {
    name,
    color: cloud.color || '#8a8a8a',
    shapes: [{ type: 'circle', x, y, radius: radiusPx }],
    levels: level ? [level] : [],
    restriction: { enabled: !!cloud.sight && !!level, type: 'sight', priority: 0 },
    visibility: 2, // CONST.REGION_VISIBILITY.ALWAYS
    highlightMode: 'coverage',
    displayMeasurements: false,
    flags: { [MODULE_ID]: { cloud: state } }
  };
}

export class CloudEngine {
  static init() {
    Hooks.on('updateCombat', (combat, changes) => this._onCombat(combat, changes));
    Hooks.on('deleteCombat', () => this._expire());
    Hooks.on('updateWorldTime', () => this._expire());
  }

  static _gm() {
    return !!game.users.activeGM?.isSelf;
  }

  static _clouds(scene) {
    return (scene?.regions?.contents || []).filter(region => region.getFlag(MODULE_ID, 'cloud'));
  }

  /**
   * Tworzy chmurę (u MG). Zwraca liczbę rund albo 0.
   * @param {{scene: Scene, recipe: object, name: string, x: number, y: number, level?: string}} options
   */
  static async create({ scene, recipe, name, x, y, level }) {
    const cloud = recipe?.cloud;
    if (!scene || !cloud) return 0;
    const rounds = (await (new Roll('1d10')).evaluate()).total;
    const combat = game.combats.find(c => c.active && c.scene?.id === scene.id) ?? null;
    const state = { recipeId: recipe.id, rounds, ...cloudExpiry({ rounds, combat, worldTime: game.time.worldTime }) };
    const radiusPx = radiusPixels(cloud.radius, scene.grid.distance, scene.grid.size);
    const data = cloudRegionData({ name, x, y, radiusPx, level: level || scene._source.initialLevel, cloud, state });
    await RegionDocument.create(data, { parent: scene });
    return rounds;
  }

  /** Usuwa wygasłe chmury na wszystkich scenach (u MG). */
  static async _expire() {
    if (!this._gm()) return;
    const combatIds = new Set(game.combats.map(c => c.id));
    for (const scene of game.scenes) {
      const combat = game.combats.find(c => c.scene?.id === scene.id && c.active) ?? null;
      const expired = this._clouds(scene)
        .filter(region => cloudExpired(region.getFlag(MODULE_ID, 'cloud'), { combat: game.combats.get(region.getFlag(MODULE_ID, 'cloud')?.combatId) ?? combat, worldTime: game.time.worldTime, combatIds }))
        .map(region => region.id);
      if (expired.length) await scene.deleteEmbeddedDocuments('Region', expired);
    }
  }

  /** Zmiana tury: wygaszanie chmur i skutki na początku tury żetonu w chmurze (u MG). */
  static async _onCombat(combat, changes) {
    if (!this._gm()) return;
    if (!('turn' in changes) && !('round' in changes)) return;
    await this._expire();
    const token = combat.combatant?.token;
    const scene = combat.scene;
    if (!token?.actor || !scene) return;
    const center = token.object?.center ?? { x: token.x + (token.width * scene.grid.size) / 2, y: token.y + (token.height * scene.grid.size) / 2 };
    const point = { ...center, elevation: token.elevation ?? 0 };

    const { RecipeRegistry } = await import('./recipe-registry.js');
    const { PotionConsumer } = await import('./potion-consumer.js');
    for (const region of this._clouds(scene)) {
      if (!region.testPoint(point)) continue;
      const recipe = RecipeRegistry.getRecipeById(region.getFlag(MODULE_ID, 'cloud')?.recipeId, { includeUnavailable: true });
      const steps = recipe?.cloud?.roundSteps;
      if (!steps?.length) continue;
      const ctx = { ...PotionConsumer._stepContext(), test: (actor, key, difficulty) => PotionConsumer._targetTest(actor, key, difficulty) };
      const lines = await runDrinkSteps(steps, token.actor, ctx);
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ token }),
        content: `<div class="wfrp4e chat-card gold-alchemy-card"><div class="card-header"><h3><i class="fas fa-smog"></i> ${region.name}</h3></div>`
          + `<div class="card-content">${lines.map(line => `<p>${line}</p>`).join('')}</div></div>`
      });
    }
  }
}
