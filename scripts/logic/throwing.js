/**
 * Rzut miksturą: zasięg i obszar wybuchu. Czyste funkcje, bez Foundry – testowalne.
 *
 * Zasięg jak przy materiałach wybuchowych z podręcznika (Podpalacz, Bomba): Bonus Siły rzucającego.
 * Progi zasięgu i trudności jak w systemie (WeaponModel.computeRangeBands, WFRP4E.rangeModifiers).
 */

/** Trudności testu dla progów zasięgu (klucze WFRP4E.difficultyModifiers). */
export const RANGE_DIFFICULTY = {
  pb: 'easy',
  short: 'average',
  normal: 'challenging',
  long: 'difficult',
  extreme: 'vhard'
};

/**
 * Próg zasięgu dla odległości. Zwraca {band, difficulty} albo null, gdy cel jest poza zasięgiem (ponad 3× zasięg).
 * @param {number} distance – odległość do celu (jednostki sceny)
 * @param {number} range – zasięg (Bonus Siły)
 */
export function throwRangeBand(distance, range) {
  const r = Math.max(1, Number(range) || 1);
  const d = Math.max(0, Number(distance) || 0);
  let band;
  if (d <= Math.ceil(r / 10)) band = 'pb';
  else if (d <= Math.ceil(r / 2)) band = 'short';
  else if (d <= r) band = 'normal';
  else if (d <= r * 2) band = 'long';
  else if (d <= r * 3) band = 'extreme';
  else return null;
  return { band, difficulty: RANGE_DIFFICULTY[band] };
}

/**
 * Żetony trafione wybuchem: cel i każdy żeton w promieniu `blast` od celu (najwyżej `limit`).
 * Bez wybuchu – tylko cel.
 * @param {object} target – żeton celu
 * @param {object[]} tokens – żetony sceny
 * @param {number} blast – promień wybuchu (jednostki sceny), 0 = tylko cel
 * @param {(a: object, b: object) => number} measure – odległość między żetonami
 */
export function blastTargets(target, tokens, blast, measure, limit = 20) {
  if (!target) return [];
  const radius = Number(blast) || 0;
  if (radius <= 0) return [target];
  const hit = [target];
  for (const token of tokens) {
    if (token === target || hit.length >= limit) continue;
    if (measure(target, token) <= radius) hit.push(token);
  }
  return hit;
}
