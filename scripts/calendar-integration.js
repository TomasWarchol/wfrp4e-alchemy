/**
 * Integracja z czasem świata (Simple Calendar / kalendarz Foundry) przez wfrp4e-companion-lib
 */

import { time } from '../../wfrp4e-companion-lib/scripts/companion-lib.mjs';

export class CalendarIntegration {
  static getCurrentTimestamp() {
    return time.now();
  }

  static formatDate(timestamp) {
    const dayLabel = game.i18n ? game.i18n.localize('GOLD_ALCHEMY.Day') : 'Day';
    return time.format(timestamp, { dayLabel });
  }

  static addDays(timestamp, days) {
    return time.addDays(timestamp, days);
  }

  static isExpired(expiryTimestamp) {
    if (!expiryTimestamp) return false;
    const now = this.getCurrentTimestamp();
    return now > expiryTimestamp;
  }

  static getDaysRemaining(expiryTimestamp) {
    if (!expiryTimestamp) {
      return { days: 999, isExpired: false, text: game.i18n ? game.i18n.localize('GOLD_ALCHEMY.Spoilage.Fresh') : 'Fresh' };
    }

    const now = this.getCurrentTimestamp();
    const diffSeconds = expiryTimestamp - now;
    const days = Math.ceil(diffSeconds / time.secondsPerDay());
    const daysWord = game.i18n ? game.i18n.localize('GOLD_ALCHEMY.Days') : 'days';

    if (days <= 0) {
      return { days: 0, isExpired: true, text: game.i18n ? game.i18n.localize('GOLD_ALCHEMY.Spoilage.Expired') : 'Expired' };
    }

    return { days, isExpired: false, text: `${days} ${daysWord}` };
  }
}
