/**
 * Konfiguracja i stałe dla modułu WFRP4e - Alchemia Starego Świata
 */

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
      name: 'GOLD_ALCHEMY.Lab.Poor',
      slMod: -1,
      costZK: 200
    },
    standard: {
      id: 'standard',
      name: 'GOLD_ALCHEMY.Lab.Standard',
      slMod: 0,
      costZK: 400
    },
    fine: {
      id: 'fine',
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
    STRICT_MODULE_FILTER: 'strictModuleFilter',
    CUSTOM_RECIPES: 'customRecipes',
    REQUIRE_DISCOVERY: 'requireDiscovery'
  }
};

/**
 * Sprawdza czy moduł źródłowy dla danej receptury/składnika jest aktywny w Foundry VTT.
 * Jeśli sourceModule jest niezdefiniowany lub 'wfrp4e-alchemy', zwraca true (zasób uniwersalny/podstawowy).
 * Sprawdza aktywność modułów źródłowych (zarówno wersji EN, jak i oficjalnych/społecznościowych PL).
 * Jeśli w opcjach wyłączono ścisłe filtrowanie podręczników, zwraca true.
 * @param {string|undefined|null} sourceModule
 * @returns {boolean}
 */
export function isSourceModuleActive(sourceModule) {
  if (!sourceModule || sourceModule === 'wfrp4e-alchemy') return true;
  if (typeof game === 'undefined' || !game.modules) return true;

  // Możliwość wyłączenia filtrowania podręczników w opcjach modułu przez MG
  try {
    if (game.settings && game.settings.settings?.has(`${MODULE_ID}.${ALCHEMY_CONFIG.SETTINGS.STRICT_MODULE_FILTER}`)) {
      if (game.settings.get(MODULE_ID, ALCHEMY_CONFIG.SETTINGS.STRICT_MODULE_FILTER) === false) {
        return true;
      }
    }
  } catch (_) {}

  // Weryfikacja podręcznika głównego (wersja oryginalna, PL lub robocza deweloperska)
  if (sourceModule === 'wfrp4e-core') {
    return Boolean(
      game.modules.get('wfrp4e-core')?.active ||
      game.modules.get('wfrp4e-core-pl')?.active ||
      game.modules.get('wfrp4e-core-pl-dev')?.active
    );
  }

  // Weryfikacja Wiatrów Magii
  if (sourceModule === 'wfrp4e-wom') {
    return Boolean(
      game.modules.get('wfrp4e-wom')?.active ||
      game.modules.get('wfrp4e-wom-pl')?.active
    );
  }

  // Weryfikacja Zestawu Startowego
  if (sourceModule === 'wfrp4e-starter-set') {
    return Boolean(
      game.modules.get('wfrp4e-starter-set')?.active ||
      game.modules.get('wfrp4e-starter-set-pl')?.active
    );
  }

  // Ogólna weryfikacja dla pozostałych podręczników (np. horned-rat, dotr, ua1, zoo)
  return Boolean(
    game.modules.get(sourceModule)?.active ||
    game.modules.get(`${sourceModule}-pl`)?.active
  );
}
