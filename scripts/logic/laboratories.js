/**
 * Reguły posiadanych laboratoriów i aparatury alchemicznej:
 * odczyt poziomu (+PS / -PS), pojemności (liczba jednoczesnych warzeń / kotłów),
 * zajętości poszczególnych naczyń i naprawy/uszkodzeń przy pechu.
 * Czyste funkcje bez zależności od Foundry – testowalne jednostkowo.
 */

import { MODULE_ID } from '../config.js';

/** Czy przedmiot z ekwipunku jest alchemicznym laboratorium / aparaturą modułu. */
export function isLaboratoryItem(item) {
  return item?.type === 'trapping' && Boolean(item.flags?.[MODULE_ID]?.isLaboratory);
}

/** Odczytuje znormalizowane parametry posiadanego laboratorium / aparatury. */
export function readLaboratory(item) {
  const raw = item?.flags?.[MODULE_ID]?.laboratory || {};
  const slMod = Math.max(-5, Math.min(10, Math.trunc(Number(raw.slMod) || 0)));
  const unitCauldrons = Math.max(1, Math.min(20, Math.trunc(Number(raw.cauldrons) || 1)));
  const quantity = Math.max(0, Math.trunc(Number(item?.system?.quantity?.value ?? 1)));
  const cauldrons = unitCauldrons * Math.max(1, quantity);
  const icon = slMod > 0 ? 'ui-lab_fine' : slMod < 0 ? 'ui-lab_poor' : 'ui-lab_standard';
  return {
    id: item?.id ?? null,
    name: item?.name ?? '',
    img: item?.img ?? '',
    slMod,
    unitCauldrons,
    cauldrons,
    quantity,
    icon,
    item
  };
}

/** Zwraca wszystkie posiadane przez aktora laboratoria / aparatury (ilość > 0). */
export function getActorLaboratories(actor) {
  const items = actor?.itemTypes?.trapping ?? actor?.items ?? [];
  return items
    .filter((item) => isLaboratoryItem(item) && Number(item.system?.quantity?.value ?? 1) > 0)
    .map(readLaboratory)
    .sort((a, b) => (b.slMod - a.slMod) || String(a.name).localeCompare(String(b.name)));
}

/** Formatuje modyfikator PS ze znakiem (np. „+1”, „+0”, „-1”). */
export function formatSlMod(slMod) {
  const n = Math.trunc(Number(slMod) || 0);
  return n >= 0 ? `+${n}` : String(n);
}

/**
 * Przypisuje aktywne warzenia do posiadanych aparatur i liczy wolne stanowiska w każdej z nich.
 * Obsługuje też starsze wpisy bez `labItemId` (przypisuje do pierwszej aparatury) oraz osierocone
 * warzenia, których aparatura zniknęła z ekwipunku (nadal można je dokończyć lub anulować).
 */
export function labBrewUsage(labs = [], pendingBrews = []) {
  const list = labs.map((lab) => ({
    ...lab,
    used: 0,
    total: lab.cauldrons,
    free: lab.cauldrons,
    brews: []
  }));
  const byId = new Map(list.map((entry) => [entry.id, entry]));
  const orphanBrews = [];

  for (const brew of pendingBrews) {
    const target = brew?.labItemId
      ? byId.get(brew.labItemId)
      : (!brew?.labItemId && list.length ? list[0] : null);
    if (target) {
      target.brews.push(brew);
      target.used += 1;
    } else {
      orphanBrews.push(brew);
    }
  }

  let totalCapacity = 0;
  for (const entry of list) {
    entry.free = Math.max(0, entry.total - entry.used);
    totalCapacity += entry.total;
  }

  return {
    byId,
    list,
    totalUsed: pendingBrews.length,
    totalCapacity,
    orphanBrews
  };
}

/** Wybiera domyślną aparaturę: preferowaną (jeśli istnieje), inaczej pierwszą z wolnym kotłem, inaczej pierwszą. */
export function selectDefaultLabId(labsWithUsage = [], preferredLabId = null) {
  if (preferredLabId && labsWithUsage.some((l) => l.id === preferredLabId)) return preferredLabId;
  return labsWithUsage.find((l) => l.free > 0)?.id ?? labsWithUsage[0]?.id ?? null;
}

/** Nowy modyfikator PS po uszkodzeniu aparatury w katastrofie (nie schodzi poniżej minSlMod). */
export function damagedLabSlMod(slMod, minSlMod = -2) {
  const cur = Math.trunc(Number(slMod) || 0);
  return Math.max(minSlMod, cur - 1);
}
