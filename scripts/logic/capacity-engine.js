/**
 * Zarządzanie Punktami Podtrzymania (Złotą Osnową) Maga Chamonu
 */

import { MODULE_ID } from '../config.js';
import { AlchemyQueries } from '../queries.js';

export class CapacityEngine {
  /**
   * Oblicza maksymalną pojemność alchemiczną dla danego Aktora (BSW + BInt + Talenty)
   * @param {Actor} actor
   * @returns {number}
   */
  static getMaxCapacity(actor) {
    if (!actor) return 0;

    const wpVal = actor.system.characteristics?.wp?.value ?? (
      (actor.system.characteristics?.wp?.initial || 0) + 
      (actor.system.characteristics?.wp?.advances || 0)
    );
    const intVal = actor.system.characteristics?.int?.value ?? (
      (actor.system.characteristics?.int?.initial || 0) + 
      (actor.system.characteristics?.int?.advances || 0)
    );

    const bwp = actor.system.characteristics?.wp?.bonus ?? Math.floor(wpVal / 10);
    const bint = actor.system.characteristics?.int?.bonus ?? Math.floor(intVal / 10);

    let max = bwp + bint;

    // Bonus za talent Przyrządzanie Mikstur (Concoct)
    const concoctTalent = actor.itemTypes?.talent?.find(t => {
      const n = (t.name || '').toLowerCase();
      return n.includes('przyrządzanie mikstur') || n.includes('concoct');
    });
    if (concoctTalent) {
      const advances = Number(concoctTalent.system?.advances?.value) || 1;
      max += advances;
    }

    // Bonus za talent Dostrojony do Wiatru (dowolnego z 8 Kolegiów / Aethyru)
    const attunedTalent = actor.itemTypes?.talent?.find(t => {
      const n = (t.name || '').toLowerCase();
      return n.includes('dostrojony do') || n.includes('attuned to');
    });
    if (attunedTalent) {
      const advances = Number(attunedTalent.system?.advances?.value) || 1;
      max += advances * 2;
    }

    // Bonus za talent Zmysł Aethyru (Aethyric Attunement)
    const aethyrTalent = actor.itemTypes?.talent?.find(t => {
      const n = (t.name || '').toLowerCase();
      return n.includes('zmysł aethyru') || n.includes('aethyric attunement');
    });
    if (aethyrTalent) {
      const advances = Number(aethyrTalent.system?.advances?.value) || 1;
      max += advances * 2;
    }

    // Opcjonalny ręczny modyfikator we flagach aktora
    const customMod = Number(actor.getFlag(MODULE_ID, 'customCapacityMod')) || 0;
    max += customMod;

    return Math.max(0, max);
  }

  /**
   * Zwraca listę wszystkich aktywnych mikstur stworzonych przez tego aktora na świecie
   * @param {Actor} actor
   * @returns {Array<{item: Item, holder: Actor, cost: number, quantity: number, totalCost: number, expiryDate: string, recipeName: string}>}
   */
  static getTetheredPotions(actor) {
    if (!actor) return [];

    const actorId = actor.id;
    const tethered = [];
    const holders = new Set(game.actors || []);
    for (const scene of game.scenes || []) {
      for (const token of scene.tokens || []) {
        const tokenActor = token.actor;
        if (tokenActor) holders.add(tokenActor);
      }
    }

    for (const otherActor of holders) {
      const trappings = otherActor.itemTypes?.trapping || [];
      for (const item of trappings) {
        const flag = item.getFlag(MODULE_ID, 'alchemyData');
        if (flag && flag.creatorId === actorId && Number(flag.attunementCost) > 0 && !flag.isDead) {
          const qty = Number(item.system?.quantity?.value) || 1;
          if (qty <= 0) continue;
          const costPerUnit = Number(flag.attunementCost) || 0;
          tethered.push({
            item,
            holder: otherActor,
            cost: costPerUnit,
            quantity: qty,
            totalCost: costPerUnit * qty,
            expiryDate: flag.expiryDateFormatted || flag.expiryDate || '-',
            recipeName: item.name
          });
        }
      }
    }

    return tethered;
  }

  /**
   * Zwraca aktualny stan pojemności aktora
   * @param {Actor} actor
   * @returns {{max: number, used: number, available: number, tethered: Array}}
   */
  static getCapacityState(actor) {
    const max = this.getMaxCapacity(actor);
    const tethered = this.getTetheredPotions(actor);
    const used = tethered.reduce((sum, t) => sum + t.totalCost, 0);
    const available = Math.max(0, max - used);

    return {
      max,
      used,
      available,
      tethered
    };
  }

  /**
   * Zrywa więź z miksturą (zdalna neutralizacja)
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

    const holder = item.actor;
    const flag = item.getFlag(MODULE_ID, 'alchemyData');
    const creator = flag?.creatorId ? game.actors.get(flag.creatorId) : null;
    if (!flag || !creator || creator.id !== alchemist?.id || Number(flag.attunementCost) <= 0 || flag.isDead) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.InvalidPotion'));
      return;
    }
    if (!game.user.isGM && !creator.testUserPermission(game.user, 'OWNER')) {
      ui.notifications.warn(game.i18n.localize('GOLD_ALCHEMY.Errors.NotYourPotion'));
      return;
    }
    const cost = Number(flag?.attunementCost) || 0;

    const depletedLabel = game.i18n.localize('GOLD_ALCHEMY.Depleted');
    const cleanName = item.name.replace(/\s*\(.*?\)$/, '');
    const descNote = game.i18n.localize('GOLD_ALCHEMY.Chat.TetherSeveredDesc');

    await item.update({
      name: `${cleanName} ${depletedLabel}`,
      [`flags.${MODULE_ID}.alchemyData.attunementCost`]: 0,
      [`flags.${MODULE_ID}.alchemyData.isDead`]: true,
      'system.description.value': `${item.system?.description?.value || ''}<p><em>${descNote}</em></p>`
    });

    const msg = game.i18n.format('GOLD_ALCHEMY.Chat.TetherSevered', {
      alchemist: alchemist?.name || '',
      potion: cleanName,
      holder: holder?.name || '',
      points: cost
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: alchemist }),
      content: `<div class="wfrp4e chat-card gold-alchemy-card"><div class="card-content">${msg}</div></div>`
    });

    if (alchemist?.id && cost > 0) {
      await AlchemyQueries.refundCapacity(alchemist.id, cleanName, cost, holder?.name || '');
    }
  }
}
