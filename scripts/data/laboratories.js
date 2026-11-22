/**
 * Startowe przedmioty aparatur i laboratoriów alchemicznych do kompendium.
 * Każda ma konfigurowalny modyfikator PS (poziom) oraz liczbę jednoczesnych warzeń (kotłów).
 */

import { MODULE_ID, getPriceMultiplier } from '../config.js';
import { resolveAlchemyImage } from './image-compatibility.js';
import { scalePrice } from '../logic/rules.js';

export const ALCHEMY_LABORATORIES = [
  {
    key: 'FieldAlembic',
    name: 'GOLD_ALCHEMY.LabItem.FieldAlembic',
    description: 'GOLD_ALCHEMY.LabItem.FieldAlembicDesc',
    img: 'icons/consumables/potions/bottle-conical-corked-cyan.webp',
    price: { gc: 50, ss: 0, bp: 0 },
    encumbrance: 2,
    availability: 'scarce',
    slMod: -1,
    cauldrons: 1
  },
  {
    key: 'PoorLaboratory',
    name: 'GOLD_ALCHEMY.LabItem.PoorLab',
    description: 'GOLD_ALCHEMY.LabItem.PoorLabDesc',
    img: 'icons/commodities/materials/pottery-jug.webp',
    price: { gc: 200, ss: 0, bp: 0 },
    encumbrance: 6,
    availability: 'scarce',
    slMod: -1,
    cauldrons: 1
  },
  {
    key: 'StandardLaboratory',
    name: 'GOLD_ALCHEMY.LabItem.StandardLab',
    description: 'GOLD_ALCHEMY.LabItem.StandardLabDesc',
    img: 'icons/consumables/potions/potion-flask-capped-yellow-green.webp',
    price: { gc: 400, ss: 0, bp: 0 },
    encumbrance: 10,
    availability: 'rare',
    slMod: 0,
    cauldrons: 1
  },
  {
    key: 'FineLaboratory',
    name: 'GOLD_ALCHEMY.LabItem.FineLab',
    description: 'GOLD_ALCHEMY.LabItem.FineLabDesc',
    img: 'icons/consumables/potions/bottle-pear-corked-labeled-ornamental-purple.webp',
    price: { gc: 800, ss: 0, bp: 0 },
    encumbrance: 16,
    availability: 'exotic',
    slMod: 1,
    cauldrons: 2
  }
];

/**
 * Tworzy obiekt przedmiotu Foundry (trapping) dla aparatury / laboratorium alchemicznego.
 */
export function createLaboratoryItemData(lab) {
  const name = game.i18n ? game.i18n.localize(lab.name) : lab.key;
  const desc = game.i18n ? game.i18n.localize(lab.description) : '';

  return {
    name,
    type: 'trapping',
    img: resolveAlchemyImage(lab.img, 'potion'),
    system: {
      description: {
        value: `<p>${desc}</p>`
      },
      quantity: { value: 1 },
      encumbrance: { value: lab.encumbrance ?? 5 },
      price: scalePrice(lab.price, getPriceMultiplier()),
      availability: { value: lab.availability || 'rare' },
      trappingType: { value: 'toolsAndKits' },
      qualities: { value: [] },
      flaws: { value: [] }
    },
    flags: {
      [MODULE_ID]: {
        isLaboratory: true,
        labKey: lab.key,
        laboratory: {
          slMod: lab.slMod ?? 0,
          cauldrons: lab.cauldrons ?? 1
        }
      }
    }
  };
}
