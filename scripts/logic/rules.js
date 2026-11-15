/**
 * Zasady Alchemii bez zależności od Foundry: Więź, pamięć receptur, modyfikatory warzenia, wynik testu,
 * psucie się i stan mikstury na Więzi. Silniki (capacity-engine, recipe-registry, brewing-engine,
 * spoilage-engine) zbierają dane z aktora i przedmiotów, a liczą tutaj, dzięki czemu reguły mają testy.
 */

import { ALCHEMY_CONFIG } from '../config.js';

/** Nazwa bez wielkości liter, polskich znaków i nadmiarowych spacji („Przyrządzanie” = „przyrzadzanie”). */
export const normalizeName = (value) => String(value ?? "")
  .replace(/ł/g, "l").replace(/Ł/g, "L")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/\s+/g, " ").trim();

/** Nazwa bazowa i specjalizacja: „Splatanie Magii (Chamon)” → ["splatanie magii", "chamon"]. */
export function splitName(item) {
  const name = normalizeName(item?.name);
  const match = /^(.*?)\s*\((.*)\)$/.exec(name);
  return match ? [match[1], match[2]] : [name, normalizeName(item?.system?.specification?.value)];
}

/** Nazwy talentów i umiejętności w obu językach (po normalizacji), porównywane w całości. */
export const ALIASES = {
  concoct: ["concoct", "przyrzadzanie mikstur"],
  aethyric: ["aethyric attunement", "zmysl aethyru"],
  magicalSense: ["magical sense", "percepcja magiczna"],
  channelling: ["channelling", "channeling", "splatanie magii"],
  /** Talent „Dostrojony do <wiatru>” – wiatr po przedrostku albo w nawiasie. */
  attunedPrefix: ["attuned to", "dostrojony do"],
  /** Umiejętności, które liczą się do pamięci receptur (fragment nazwy bazowej). */
  memorySkill: ["alchemi", "aptekar", "apothecar", "splatanie", "channel"]
};

/** Czy talent albo umiejętność ma daną nazwę (całą nazwę bazową, bez specjalizacji). */
export const isNamed = (item, kind) => ALIASES[kind].includes(splitName(item)[0]);

/** Wiatr talentu „Dostrojony do …” albo null, gdy to inny talent. */
export function attunedWind(item) {
  const [base, spec] = splitName(item);
  const prefix = ALIASES.attunedPrefix.find((p) => base === p || base.startsWith(`${p} `));
  if (!prefix) return null;
  return (base.slice(prefix.length).trim() || spec || "").replace(/^(the )/, "");
}

/** Talent o największej liczbie stopni spośród pasujących. */
const best = (talents, test) => talents.filter(test).reduce((top, t) => (!top || talentAdvances(t) > talentAdvances(top) ? t : top), null);

/** Liczba stopni talentu (brak pola = 1 stopień). */
export const talentAdvances = (talent) => Number(talent?.system?.advances?.value) || 1;

/**
 * Maksymalna Więź: BSW + BInt + stopnie Przyrządzania Mikstur + 2 × Dostrojony do wiatru + 2 × Zmysł Aethyru
 * + modyfikator MG. Kilka talentów tego samego rodzaju się nie sumuje: liczy się ten z największą liczbą stopni.
 */
export function tetherMax({ wpBonus = 0, intBonus = 0, talents = [], customMod = 0 }) {
  let max = wpBonus + intBonus;
  const concoct = best(talents, (t) => isNamed(t, "concoct"));
  if (concoct) max += talentAdvances(concoct);
  const attuned = best(talents, (t) => attunedWind(t) !== null);
  if (attuned) max += talentAdvances(attuned) * 2;
  const aethyric = best(talents, (t) => isNamed(t, "aethyric"));
  if (aethyric) max += talentAdvances(aethyric) * 2;
  return Math.max(0, max + (Number(customMod) || 0));
}

/** Czy postać ma talent danego rodzaju (np. Percepcja Magiczna). */
export const hasTalent = (talents, kind) => talents.some((t) => isNamed(t, kind));

/** Powinowactwo Chamonu: talent „Dostrojony do Chamonu” albo umiejętność Splatanie Magii (Chamon). */
export const hasChamonAffinity = (talents = [], skills = []) =>
  talents.some((t) => (attunedWind(t) ?? "").startsWith("chamon"))
  || skills.some((s) => isNamed(s, "channelling") && splitName(s)[1].startsWith("chamon"));

/**
 * Pamięć receptur: BInt + (rozwinięcia Alchemii/Splatania/Aptekarstwa ÷ 10) + 2 × stopnie Przyrządzania
 * + premia Chamonu (zależnie od trybu) + modyfikator MG.
 * @param {{intBonus:number, skills:Array, talents:Array, customMod:number, memorized:Array<{category:string}|null>, chamonMode:string}} data
 */
export function memoryState({ intBonus = 0, skills = [], talents = [], customMod = 0, memorized = [], chamonMode = "both" }) {
  const skillAdvances = skills
    .filter((s) => ALIASES.memorySkill.some((part) => splitName(s)[0].includes(part)))
    .reduce((top, s) => Math.max(top, Number(s?.system?.advances?.value) || 0), 0);
  const skillBonus = Math.floor(skillAdvances / 10);
  const concoctBonus = talents
    .filter((t) => isNamed(t, "concoct"))
    .reduce((sum, t) => sum + talentAdvances(t), 0) * 2;
  const hasChamonBonus = hasChamonAffinity(talents, skills);
  const slotsBonus = chamonMode !== "freeRecipes";
  const freeRecipes = chamonMode !== "slots";
  const chamonBonus = hasChamonBonus && slotsBonus ? 5 : 0;
  const baseMax = intBonus + skillBonus + concoctBonus + chamonBonus;
  const max = Math.max(0, baseMax + (Number(customMod) || 0));
  const used = memorized.filter((r) => !(hasChamonBonus && freeRecipes && isChamonRecipe(r))).length;
  return {
    max, baseMax, customMod: Number(customMod) || 0, used, available: Math.max(0, max - used),
    hasChamonBonus, chamonFreeRecipes: hasChamonBonus && freeRecipes, chamonBonus, memorizedCount: memorized.length, bInt: intBonus, skillBonus, concoctBonus
  };
}

export const isChamonRecipe = (recipe) => recipe?.category === "college-chamon" || recipe?.category === "chamon";

/** Trudność warzenia według toru (magia, alchemia, apteka, zielarstwo) i lotności: ALCHEMY_CONFIG.BREWING_DIFFICULTY. */
export const BREWING_DIFFICULTY = ALCHEMY_CONFIG.BREWING_DIFFICULTY;

export function brewingApproach(category = "") {
  if (category === "herbal") return "herbalism";
  if (category === "apothecary") return "apothecary";
  if (category === "mundane" || category === "forbidden") return "alchemy";
  return "magic";
}

/**
 * Modyfikatory testu warzenia: trudność z toru i lotności, PS z laboratorium, Percepcji Magicznej (+1),
 * wadliwego odpisu receptury (−1) i trudności receptury.
 */
export function brewingModifiers(recipe, { labSlMod = 0, magicalSense = false, flawed = false } = {}) {
  const approach = brewingApproach(recipe?.category || "");
  const difficultyMod = BREWING_DIFFICULTY[approach]?.[recipe?.volatility] ?? 0;
  const slBonus = labSlMod + (magicalSense ? 1 : 0) + (flawed ? -1 : 0) + (Number(recipe?.creationDifficultySL) || 0);
  return { approach, difficultyMod, slBonus };
}

/** Wynik testu WFRP4e: `outcome` z systemu, a gdy go brak – rzut względem progu (01–05 zawsze, 96–00 nigdy). */
export function isTestSuccess(res) {
  if (res?.outcome) return res.outcome === "success";
  const roll = Number(res?.roll);
  const target = Number(res?.target);
  if (Number.isFinite(roll) && Number.isFinite(target)) return roll <= 5 || (roll <= target && roll <= 95);
  return String(res?.SL ?? "").trim() !== "-0" && Number(res?.SL) >= 0;
}

/**
 * Tabela szans zepsucia z Wiatrów Magii: wiersz = PS warzenia (0–6), kolumna = wiek w sezonach
 * (1, 2, 3–4, 5–8, 9–16, 17+). Para [całkowicie zepsuta, zepsuta lecz działająca].
 */
export const SPOILAGE_TABLE = [
  [[11, 22], [22, 44], [33, 66], [45, 88], [50, 95], [65, 95]],
  [[10, 20], [20, 40], [30, 60], [40, 80], [50, 95], [50, 95]],
  [[9, 18], [18, 36], [27, 54], [36, 72], [45, 90], [50, 95]],
  [[8, 16], [16, 32], [24, 48], [32, 64], [40, 80], [50, 95]],
  [[7, 14], [13, 28], [21, 42], [28, 56], [35, 70], [42, 84]],
  [[6, 12], [13, 24], [18, 36], [24, 48], [30, 60], [36, 72]],
  [[5, 10], [10, 20], [15, 30], [20, 40], [25, 50], [30, 60]]
];

export function spoilageChances(seasons, sl) {
  const row = SPOILAGE_TABLE[Math.max(0, Math.min(6, Number(sl) || 0))];
  const column = seasons <= 1 ? 0 : seasons === 2 ? 1 : seasons <= 4 ? 2 : seasons <= 8 ? 3 : seasons <= 16 ? 4 : 5;
  const [spoilChance, partialChance] = row[column];
  return { spoilChance, partialChance };
}

/** Wiek w sezonach od uwarzenia (pierwszy sezon to 1; sezon = 91 dni). */
export const seasonsSince = (elapsedSeconds) => Math.floor(Math.max(0, elapsedSeconds) / 86400 / 91) + 1;

/**
 * Stan mikstury wobec Więzi alchemika:
 *   "none"    – nie trzyma Więzi (świecka, zerwana, zużyta albo bez kosztu),
 *   "expired" – magiczna po terminie: jej moc wygasła i Więź wraca do alchemika,
 *   "active"  – trzyma Więź.
 * @param {object} flag      flags["wfrp4e-alchemy"].alchemyData
 * @param {number} quantity  liczba sztuk
 * @param {number} now       bieżący czas świata (sekundy)
 */
export function tetherState(flag, quantity, now) {
  if (!flag || flag.isDead || !(Number(flag.attunementCost) > 0) || !(Number(quantity) > 0)) return "none";
  if (flag.expiryTimestamp && Number.isFinite(now) && now > flag.expiryTimestamp) return "expired";
  return "active";
}

/** Zajęta Więź z listy mikstur aktywnych. */
export const tetherUsed = (potions) => potions.reduce((sum, p) => sum + (Number(p.cost) || 0) * (Number(p.quantity) || 0), 0);

/**
 * A5: jakość mikstury z PS testu warzenia.
 *   0–1 PS  zwykła,
 *   2–3 PS  dobra   (świecka: +1 dawka; magiczna: bez zmian kosztu),
 *   4+ PS   wyborna (świecka: + dawki równe PS; magiczna: koszt Więzi −1 na dawkę, najmniej 1).
 * @returns {{tier: "standard"|"good"|"excellent", bonusDoses: number, tetherCost: number}}
 */
export function potionQuality(sl, { track = "magical", attunementCost = 0 } = {}) {
  const value = Number(sl) || 0;
  const tier = value >= 4 ? "excellent" : value >= 2 ? "good" : "standard";
  const cost = Number(attunementCost) || 0;
  if (track === "mundane") {
    return { tier, bonusDoses: tier === "excellent" ? value : tier === "good" ? 1 : 0, tetherCost: cost };
  }
  return { tier, bonusDoses: 0, tetherCost: tier === "excellent" && cost > 1 ? cost - 1 : cost };
}

/**
 * A6: jak działa premia Chamonu w pamięci receptur.
 *   "both"        – +5 miejsc i receptury Chamonu za darmo (dawne zasady),
 *   "freeRecipes" – tylko receptury Chamonu za darmo (zalecane),
 *   "slots"       – tylko +5 miejsc.
 */
export const CHAMON_MODES = ["freeRecipes", "both", "slots"];
