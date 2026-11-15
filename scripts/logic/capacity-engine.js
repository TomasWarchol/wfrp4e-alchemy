/**
 * Więź alchemika (Punkty Podtrzymania): limit, mikstury, które ją trzymają, zerwanie i wygaśnięcie.
 *
 * Mikstury na Więzi nie są skanowane przy każdym renderze: indeks (twórca → mikstury) powstaje raz,
 * przy pierwszym użyciu, a hooki przedmiotów aktualizują go na bieżąco. Zmiany żetonów, aktorów
 * i scen unieważniają indeks, więc następne użycie zbuduje go od nowa.
 */

import { MODULE_ID } from '../config.js';
import { AlchemyQueries } from '../queries.js';
import { CalendarIntegration } from '../calendar-integration.js';
import { tetherMax, tetherState, tetherUsed } from './rules.js';
import { getPendingBrews, reservedTether } from './pending-brews.js';

const FLAG = 'alchemyData';

export class CapacityEngine {
  /** @type {Map<string, Set<Item>>|null} identyfikator twórcy → mikstury z kosztem Więzi */
  static #index = null;

  /**
   * Maksymalna Więź aktora (BSW + BInt + talenty + modyfikator MG), patrz rules.tetherMax.
   * @param {Actor} actor
   * @returns {number}
   */
  static getMaxCapacity(actor) {
    if (!actor) return 0;
    const chars = actor.system?.characteristics ?? {};
    const value = (c) => c?.value ?? ((c?.initial || 0) + (c?.advances || 0));
    return tetherMax({
      wpBonus: chars.wp?.bonus ?? Math.floor(value(chars.wp) / 10),
      intBonus: chars.int?.bonus ?? Math.floor(value(chars.int) / 10),
      talents: actor.itemTypes?.talent ?? [],
      customMod: actor.getFlag(MODULE_ID, 'customCapacityMod')
    });
  }

  /* ---------- Indeks mikstur ---------- */

  /** Aktorzy, którzy mogą trzymać mikstury: aktorzy świata i niepołączone żetony na scenach. */
  static #holders() {
    const holders = new Set(game.actors ?? []);
    for (const scene of game.scenes ?? []) {
      for (const token of scene.tokens ?? []) {
        if (token.actor) holders.add(token.actor);
      }
    }
    return holders;
  }

  static #add(item) {
    const flag = item?.getFlag?.(MODULE_ID, FLAG);
    if (!flag?.creatorId || !(Number(flag.attunementCost) > 0) || flag.isDead) return;
    if (!this.#index.has(flag.creatorId)) this.#index.set(flag.creatorId, new Set());
    this.#index.get(flag.creatorId).add(item);
  }

  static #remove(item) {
    for (const set of this.#index.values()) set.delete(item);
  }

  static #ensureIndex() {
    if (this.#index) return this.#index;
    this.#index = new Map();
    for (const actor of this.#holders()) {
      for (const item of actor.items ?? []) this.#add(item);
    }
    return this.#index;
  }

  /** Unieważnia indeks (następne użycie zbuduje go od nowa). */
  static invalidate() {
    this.#index = null;
  }

  /** Hooki utrzymujące indeks i wygaszanie przeterminowanych mikstur – wołać w "init". */
  static registerHooks() {
    Hooks.on('createItem', (item) => { if (this.#index) this.#add(item); });
    Hooks.on('updateItem', (item) => {
      if (!this.#index) return;
      this.#remove(item);
      this.#add(item);
    });
    Hooks.on('deleteItem', (item) => { if (this.#index) this.#remove(item); });
    // Żetony niepołączone mają własne kopie przedmiotów – przy zmianach żetonów i aktorów budujemy od nowa
    for (const hook of ['createToken', 'updateToken', 'deleteToken', 'createActor', 'deleteActor', 'deleteScene', 'canvasReady']) {
      Hooks.on(hook, () => this.invalidate());
    }
    Hooks.once('ready', () => this.expireTethers());
    Hooks.on('updateWorldTime', () => this.expireTethers());
  }

  /* ---------- Stan Więzi ---------- */

  /** Mikstury twórcy z kosztem Więzi wraz ze stanem (aktywna albo przeterminowana). */
  static #potionsOf(actorId) {
    const now = CalendarIntegration.getCurrentTimestamp();
    const result = [];
    for (const item of this.#ensureIndex().get(actorId) ?? []) {
      const flag = item.getFlag(MODULE_ID, FLAG);
      const quantity = Number(item.system?.quantity?.value) || 1;
      const state = tetherState(flag, quantity, now);
      if (state === 'none') continue;
      const cost = Number(flag.attunementCost) || 0;
      result.push({
        item,
        holder: item.actor,
        state,
        cost,
        quantity,
        totalCost: cost * quantity,
        expiryDate: flag.expiryDateFormatted || flag.expiryDate || '-',
        recipeName: item.name
      });
    }
    return result;
  }

  /**
   * Mikstury, które trzymają Więź aktora (bez przeterminowanych: ich moc wygasła).
   * @param {Actor} actor
   */
  static getTetheredPotions(actor) {
    if (!actor) return [];
    return this.#potionsOf(actor.id).filter((p) => p.state === 'active');
  }

  /**
   * Stan Więzi aktora.
   * @param {Actor} actor
   * @returns {{max: number, used: number, available: number, tethered: Array}}
   */
  static getCapacityState(actor) {
    const max = this.getMaxCapacity(actor);
    const tethered = this.getTetheredPotions(actor);
    // A4: Więź zarezerwowana przez warzenie w toku jest zajęta do jego końca
    const reserved = reservedTether(getPendingBrews(actor));
    const used = tetherUsed(tethered) + reserved;
    return { max, used, reserved, available: Math.max(0, max - used), tethered };
  }

  /* ---------- Zerwanie i wygaśnięcie ---------- */

  /** Gasi miksturę: koniec Więzi, zwrot punktów, wpis na czacie. */
  static async #extinguish(item, alchemist, { messageKey, noteKey }) {
    const holder = item.actor;
    const flag = item.getFlag(MODULE_ID, FLAG);
    const cost = Number(flag?.attunementCost) || 0;
    const quantity = Number(item.system?.quantity?.value) || 1;
    const depletedLabel = game.i18n.localize('GOLD_ALCHEMY.Depleted');
    const cleanName = item.name.replace(/\s*\(.*?\)$/, '');

    await item.update({
      name: `${cleanName} ${depletedLabel}`,
      [`flags.${MODULE_ID}.${FLAG}.attunementCost`]: 0,
      [`flags.${MODULE_ID}.${FLAG}.isDead`]: true,
      'system.description.value': `${item.system?.description?.value || ''}<p><em>${game.i18n.localize(noteKey)}</em></p>`
    });

    const msg = game.i18n.format(messageKey, {
      alchemist: alchemist?.name || '',
      potion: cleanName,
      holder: holder?.name || '',
      points: cost * quantity
    });
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: alchemist }),
      content: `<div class="wfrp4e chat-card gold-alchemy-card al-card is-tether"><div class="card-content"><span class="al-chat-mark" data-al-glyph="orn-chain_link_broken"></span>${msg}</div></div>`
    });

    if (alchemist?.id && cost > 0) {
      await AlchemyQueries.refundCapacity(alchemist.id, cleanName, cost * quantity, holder?.name || '');
    }
  }

  /**
   * Zrywa więź z miksturą (zdalna neutralizacja).
   * @param {string} itemUuid
   * @param {Actor} alchemist
   */
  static async severTether(itemUuid, alchemist) {
    const item = await fromUuid(itemUuid);
    if (!item) return;

    // Jeżeli użytkownik nie jest MG i nie jest właścicielem przedmiotu, poproś aktywnego MG przez zapytanie
    if (!game.user.isGM && !item.isOwner) {
      await AlchemyQueries.severTether(itemUuid, alchemist?.id);
      return;
    }

    const flag = item.getFlag(MODULE_ID, FLAG);
    const creator = flag?.creatorId ? game.actors.get(flag.creatorId) : null;
    if (!flag || !creator || creator.id !== alchemist?.id || Number(flag.attunementCost) <= 0 || flag.isDead) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.InvalidPotion'));
      return;
    }
    if (!game.user.isGM && !creator.testUserPermission(game.user, 'OWNER')) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NotYourPotion'));
      return;
    }
    await this.#extinguish(item, alchemist, {
      messageKey: 'GOLD_ALCHEMY.Chat.TetherSevered',
      noteKey: 'GOLD_ALCHEMY.Chat.TetherSeveredDesc'
    });
  }

  /**
   * Wygasza przeterminowane mikstury magiczne: ich moc zgasła, więc Więź wraca do alchemika.
   * Wykonuje tylko aktywny MG (zapisuje przedmioty wszystkich graczy).
   */
  static async expireTethers() {
    if (!game.users?.activeGM?.isSelf) return;
    const now = CalendarIntegration.getCurrentTimestamp();
    for (const [creatorId, items] of this.#ensureIndex()) {
      const alchemist = game.actors.get(creatorId);
      for (const item of [...items]) {
        const flag = item.getFlag(MODULE_ID, FLAG);
        if (tetherState(flag, Number(item.system?.quantity?.value) || 1, now) !== 'expired') continue;
        await this.#extinguish(item, alchemist, {
          messageKey: 'GOLD_ALCHEMY.Chat.TetherFaded',
          noteKey: 'GOLD_ALCHEMY.Chat.TetherFadedDesc'
        });
      }
    }
  }
}
