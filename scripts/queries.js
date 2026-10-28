/**
 * Komunikacja między klientami przez zapytania Foundry (CONFIG.queries).
 * Nadawcę zapytania ustala serwer, więc gracz nie może podszyć się pod innego użytkownika.
 */

import { MODULE_ID } from './config.js';
import { registerQuery, queryGM, notifyUsers } from '../../wfrp4e-companion-lib/scripts/companion-lib.mjs';

const REFUND_NOTIFY = `${MODULE_ID}.refundNotify`;
const SEVER_TETHER = `${MODULE_ID}.severTether`;
const APPLY_THROWN = `${MODULE_ID}.applyThrown`;

export class AlchemyQueries {
  /** Rejestracja handlerów – wołać w hooku "init". */
  static init() {
    registerQuery(REFUND_NOTIFY, data => this._onRefundNotify(data));
    registerQuery(SEVER_TETHER, (data, { user }) => this._onSeverTether(data, user));
    registerQuery(APPLY_THROWN, (data, { user }) => this._onApplyThrown(data, user));
  }

  /**
   * Nakłada skutki rzuconej mikstury na cele. Cele zwykle należą do MG, więc gracz prosi aktywnego MG.
   * @returns {Promise<string[]>} linie do karty czatu
   */
  static async applyThrownEffect(data) {
    if (game.user.isGM) return this._onApplyThrown(data, game.user);
    return (await queryGM(APPLY_THROWN, data)) || [];
  }

  /** Wykonywane u MG: rzucający musi należeć do pytającego użytkownika. */
  static async _onApplyThrown({ effectId, sl = 0, throwerUuid, targetUuids } = {}, requester) {
    if (!game.user.isGM) return [];
    const { PotionConsumer } = await import('./logic/potion-consumer.js');
    if (!PotionConsumer.THROWN_EFFECTS.has(effectId)) return [];
    const thrower = await fromUuid(throwerUuid);
    if (!requester || !thrower || (!requester.isGM && !thrower.testUserPermission(requester, 'OWNER'))) return [];

    const lines = [];
    for (const uuid of (targetUuids || []).slice(0, 20)) {
      const doc = await fromUuid(uuid);
      const actor = doc?.actor ?? (doc?.documentName === 'Actor' ? doc : null);
      if (actor) lines.push(await PotionConsumer.applyThrownToActor(effectId, actor, Math.min(6, Math.max(0, Number(sl) || 0))));
    }
    return lines.filter(Boolean);
  }

  /**
   * Powiadamia właścicieli alchemika o zwrocie Punktów Podtrzymania.
   */
  static async refundCapacity(creatorId, potionName, points, drinkerName) {
    const creator = game.actors.get(creatorId);
    if (!creator) return;
    const owners = game.users.filter(user => creator.testUserPermission(user, 'OWNER'));
    notifyUsers(owners, REFUND_NOTIFY, { creatorId, potionName, points, drinkerName });
  }

  /**
   * Prosi MG o zerwanie Więzi mikstury (zmiana przedmiotu może należeć do innego gracza).
   */
  static async severTether(itemUuid, alchemistId) {
    await queryGM(SEVER_TETHER, { itemUuid, alchemistId });
  }

  static _onRefundNotify(data) {
    const creator = game.actors.get(data.creatorId);
    if (!creator?.isOwner) return;

    ui.notifications.info(game.i18n.format('GOLD_ALCHEMY.Notifications.TetherRefundNotify', {
      drinker: data.drinkerName,
      potion: data.potionName,
      points: data.points
    }));

    // Odświeżenie otwartego Warsztatu twórcy
    const workshop = foundry.applications.instances.get('alchemy-workshop-app');
    if (workshop && workshop.actor?.id === creator.id) {
      workshop.render();
    }
  }

  /**
   * Wykonywane u MG. requester pochodzi z serwera, nie z danych zapytania.
   */
  static async _onSeverTether(data, requester) {
    if (!game.user.isGM) return;
    const item = await fromUuid(data.itemUuid);
    if (!item) return;

    const flag = item.getFlag(MODULE_ID, 'alchemyData');
    const alchemist = game.actors.get(data.alchemistId);
    if (!flag || !alchemist || flag.creatorId !== alchemist.id || Number(flag.attunementCost) <= 0 || flag.isDead) return;
    if (!requester || (!requester.isGM && !alchemist.testUserPermission(requester, 'OWNER'))) return;

    const holder = item.actor;
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
      alchemist: alchemist.name || 'Alchemik',
      potion: cleanName,
      holder: holder?.name || 'Posiadacz',
      points: cost
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: alchemist }),
      content: `<div class="wfrp4e chat-card gold-alchemy-card"><div class="card-content">${msg}</div></div>`
    });

    if (cost > 0) {
      await this.refundCapacity(alchemist.id, cleanName, cost, holder?.name || '');
    }
  }
}
