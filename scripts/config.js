/**
 * Konfiguracja i stałe dla modułu WFRP4e - Alchemia Starego Świata
 */

import { sourceAvailable } from './logic/sources.js';

export const MODULE_ID = 'wfrp4e-alchemy';

export const ALCHEMY_CONFIG = {
  FLAG_NAME: 'wfrp4e-alchemy',

  CATEGORIES: {
    MAGICAL: 'magical',
    COLLEGE_AQSHY: 'college-aqshy',
    COLLEGE_AZYR: 'college-azyr',
    COLLEGE_CHAMON: 'college-chamon',
    COLLEGE_GHYRAN: 'college-ghyran',
    COLLEGE_GHUR: 'college-ghur',
    COLLEGE_HYSH: 'college-hysh',
    COLLEGE_SHYISH: 'college-shyish',
    COLLEGE_ULGU: 'college-ulgu',
    MUNDANE: 'mundane',
    APOTHECARY: 'apothecary',
    HERBAL: 'herbal',
    FORBIDDEN: 'forbidden',
    // Kompatybilność wsteczna:
    CHAMON: 'college-chamon'
  },

  COLLEGES: {
    aqshy: { id: 'aqshy', name: 'GOLD_ALCHEMY.Colleges.Aqshy', color: '#d32f2f', wind: 'Aqshy' },
    azyr: { id: 'azyr', name: 'GOLD_ALCHEMY.Colleges.Azyr', color: '#1976d2', wind: 'Azyr' },
    chamon: { id: 'chamon', name: 'GOLD_ALCHEMY.Colleges.Chamon', color: '#d4af37', wind: 'Chamon' },
    ghyran: { id: 'ghyran', name: 'GOLD_ALCHEMY.Colleges.Ghyran', color: '#2e7d32', wind: 'Ghyran' },
    ghur: { id: 'ghur', name: 'GOLD_ALCHEMY.Colleges.Ghur', color: '#8d6e63', wind: 'Ghur' },
    hysh: { id: 'hysh', name: 'GOLD_ALCHEMY.Colleges.Hysh', color: '#fbc02d', wind: 'Hysh' },
    shyish: { id: 'shyish', name: 'GOLD_ALCHEMY.Colleges.Shyish', color: '#7b1fa2', wind: 'Shyish' },
    ulgu: { id: 'ulgu', name: 'GOLD_ALCHEMY.Colleges.Ulgu', color: '#607d8b', wind: 'Ulgu' }
  },

  LAB_TIERS: {
    poor: {
      id: 'poor',
      cauldrons: 1,
      name: 'GOLD_ALCHEMY.Lab.Poor',
      slMod: -1,
      costZK: 200
    },
    standard: {
      id: 'standard',
      cauldrons: 1,
      name: 'GOLD_ALCHEMY.Lab.Standard',
      slMod: 0,
      costZK: 400
    },
    fine: {
      id: 'fine',
      cauldrons: 2,
      name: 'GOLD_ALCHEMY.Lab.Fine',
      slMod: 1,
      costZK: 800
    }
  },

  BREWING_DIFFICULTY: {
    magic: { minor: 40, moderate: 20, major: 0, extreme: -10 },
    alchemy: { minor: 0, moderate: 0, major: -10, extreme: -10 },
    apothecary: { minor: 20, moderate: 0, major: -10, extreme: -20 },
    herbalism: { minor: 0, moderate: -10, major: -20, extreme: -30 }
  },

  KNOWLEDGE_STATES: {
    MEMORIZED: 'memorized',
    GRIMOIRE: 'grimoire',
    UNKNOWN: 'unknown'
  },

  SETTINGS: {
    CUSTOM_RECIPES: 'customRecipes',
    REQUIRE_DISCOVERY: 'requireDiscovery'
  }
};

/**
 * Czy treść z podręcznika `sourceModule` może się pokazać: tylko przy włączonym oficjalnym module
 * tego podręcznika. Własne treści (brak źródła albo 'wfrp4e-alchemy') są dostępne zawsze.
 * Bez wyłącznika w ustawieniach i bez zamienników (moduł tłumaczenia nie zastępuje modułu z treścią).
 * @param {string|undefined|null} sourceModule
 * @returns {boolean}
 */
export function isSourceModuleActive(sourceModule) {
  return sourceAvailable(sourceModule, (id) => game.modules.get(id)?.active === true);
}
