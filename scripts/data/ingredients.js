/**
 * Baza Składników Alchemicznych - WFRP4e Alchemia Starego Świata
 * Każdy składnik jest pełnoprawnym obiektem przedmiotu (Item trapping / ingredient)
 */

import { MODULE_ID } from '../config.js';
import { resolveAlchemyImage } from './image-compatibility.js';

export const ALCHEMY_INGREDIENTS = [
  // ==========================================
  // 1. ODCZYNNIKI AETHYRYCZNE I UNIWERSALNA MAGIA
  // ==========================================
  {
    key: 'AethyrCrystal',
    name: 'GOLD_ALCHEMY.Ingredients.AethyrCrystal',
    category: 'magical',
    img: 'icons/commodities/gems/gem-rough-cushion-teal.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.AethyrCrystal',
    price: { gc: 5, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'WindStone',
    name: 'GOLD_ALCHEMY.Ingredients.WindStone',
    category: 'magical',
    img: 'icons/commodities/materials/bowl-powder-grey.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WindStone',
    price: { gc: 3, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'GriffinDown',
    name: 'GOLD_ALCHEMY.Ingredients.GriffinDown',
    category: 'magical',
    img: 'icons/commodities/biological/feather-soft-grey.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.GriffinDown',
    price: { gc: 4, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'FourLeafClover',
    name: 'GOLD_ALCHEMY.Ingredients.FourLeafClover',
    category: 'magical',
    img: 'icons/consumables/flora/leaf-clover-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.FourLeafClover',
    price: { gc: 2, ss: 10, bp: 0 },
    encumbrance: 0,
    availability: 'rare'
  },

  // ==========================================
  // 2. SKŁADNIKI CHAMONU (ZŁOTE KOLEGIUM / METAL)
  // ==========================================
  {
    key: 'GoldDust',
    name: 'GOLD_ALCHEMY.Ingredients.GoldDust',
    category: 'college-chamon',
    img: 'icons/commodities/materials/bowl-powder-gold.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.GoldDust',
    price: { gc: 5, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'IronFilings',
    name: 'GOLD_ALCHEMY.Ingredients.GoldIronFilings',
    category: 'college-chamon',
    img: 'icons/commodities/materials/powder-grey.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.GoldIronFilings',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'Mercury',
    name: 'GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver',
    category: 'college-chamon',
    img: 'icons/commodities/materials/metal-liquid.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.PurifiedQuicksilver',
    price: { gc: 3, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'AquaRegia',
    name: 'GOLD_ALCHEMY.Ingredients.DragonAcid',
    category: 'college-chamon',
    img: 'icons/commodities/materials/liquid-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.DragonAcid',
    price: { gc: 4, ss: 0, bp: 0 },
    encumbrance: 0.3,
    availability: 'rare'
  },
  {
    key: 'AquaVitae',
    name: 'GOLD_ALCHEMY.Ingredients.WhiteAlchemicalGold',
    category: 'college-chamon',
    img: 'icons/consumables/potions/bottle-corked-shimmering-blue.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WhiteAlchemicalGold',
    price: { gc: 3, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'LeadSediment',
    name: 'GOLD_ALCHEMY.Ingredients.LeadOxide',
    category: 'college-chamon',
    img: 'icons/commodities/materials/powder-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.LeadOxide',
    price: { gc: 1, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'common'
  },
  {
    key: 'MeteoricSilver',
    name: 'GOLD_ALCHEMY.Ingredients.MeteoricSilver',
    category: 'college-chamon',
    img: 'icons/commodities/metal/ingot-plain-silver.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.MeteoricSilver',
    price: { gc: 6, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'rare'
  },
  {
    key: 'MagneticNeedle',
    name: 'GOLD_ALCHEMY.Ingredients.MagneticNeedle',
    category: 'college-chamon',
    img: 'icons/tools/navigation/compass-brass.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.MagneticNeedle',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'CrystalPrism',
    name: 'GOLD_ALCHEMY.Ingredients.CrystalPrism',
    category: 'college-chamon',
    img: 'icons/commodities/gems/gem-rough-cushion-white.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.CrystalPrism',
    price: { gc: 4, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },

  // ==========================================
  // 3. SKŁADNIKI AQSHY (JASNY ZAKON / PŁOMIEŃ)
  // ==========================================
  {
    key: 'CinnabarDust',
    name: 'GOLD_ALCHEMY.Ingredients.CinnabarDust',
    category: 'college-aqshy',
    img: 'icons/commodities/materials/bowl-powder-red.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.CinnabarDust',
    price: { gc: 2, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'SalamanderEssence',
    name: 'GOLD_ALCHEMY.Ingredients.SalamanderEssence',
    category: 'college-aqshy',
    img: 'icons/commodities/biological/heart-glowing-red.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.SalamanderEssence',
    price: { gc: 4, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'rare'
  },

  // ==========================================
  // 4. SKŁADNIKI GHYRAN (NEFRYTOWY ZAKON / ŻYCIE)
  // ==========================================
  {
    key: 'SpringDew',
    name: 'GOLD_ALCHEMY.Ingredients.SpringDew',
    category: 'college-ghyran',
    img: 'icons/consumables/potions/vial-cork-empty-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.SpringDew',
    price: { gc: 3, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'OakSap',
    name: 'GOLD_ALCHEMY.Ingredients.OakSap',
    category: 'college-ghyran',
    img: 'icons/consumables/potions/bottle-bulb-corked-amber.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.OakSap',
    price: { gc: 1, ss: 10, bp: 0 },
    encumbrance: 0.2,
    availability: 'common'
  },
  {
    key: 'Ironbark',
    name: 'GOLD_ALCHEMY.Ingredients.Ironbark',
    category: 'college-ghyran',
    img: 'icons/commodities/wood/wood-pile-oak.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Ironbark',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.3,
    availability: 'scarce'
  },

  // ==========================================
  // 5. SKŁADNIKI GHUR (BURSZTYNOWY ZAKON / BESTIE)
  // ==========================================
  {
    key: 'WolfEye',
    name: 'GOLD_ALCHEMY.Ingredients.WolfEye',
    category: 'college-ghur',
    img: 'icons/commodities/biological/eye-amber.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WolfEye',
    price: { gc: 1, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'BearClaw',
    name: 'GOLD_ALCHEMY.Ingredients.BearClaw',
    category: 'college-ghur',
    img: 'icons/commodities/biological/claw-bear.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BearClaw',
    price: { gc: 2, ss: 5, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'BeastFangs',
    name: 'GOLD_ALCHEMY.Ingredients.BeastFangs',
    category: 'college-ghur',
    img: 'icons/commodities/biological/teeth-canine.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BeastFangs',
    price: { gc: 1, ss: 10, bp: 0 },
    encumbrance: 0.2,
    availability: 'common'
  },
  {
    key: 'BadgerFat',
    name: 'GOLD_ALCHEMY.Ingredients.BadgerFat',
    category: 'college-ghur',
    img: 'icons/consumables/food/jar-honey-amber.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BadgerFat',
    price: { gc: 0, ss: 12, bp: 0 },
    encumbrance: 0.2,
    availability: 'common'
  },

  // ==========================================
  // 6. SKŁADNIKI SHYISH (AMETYSTOWY ZAKON / ŚMIERĆ)
  // ==========================================
  {
    key: 'GraveDust',
    name: 'GOLD_ALCHEMY.Ingredients.GraveDust',
    category: 'college-shyish',
    img: 'icons/commodities/materials/powder-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.GraveDust',
    price: { gc: 1, ss: 5, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'HourglassSand',
    name: 'GOLD_ALCHEMY.Ingredients.HourglassSand',
    category: 'college-shyish',
    img: 'icons/tools/navigation/hourglass-wood-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.HourglassSand',
    price: { gc: 2, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },

  // ==========================================
  // 7. SKŁADNIKI ŚWIECKIE, MINERAŁY & CHEMIA BOJOWA
  // ==========================================
  {
    key: 'Sulfur',
    name: 'GOLD_ALCHEMY.Ingredients.Sulfur',
    category: 'mundane',
    img: 'icons/commodities/materials/bowl-powder-yellow.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Sulfur',
    price: { gc: 0, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'Saltpeter',
    name: 'GOLD_ALCHEMY.Ingredients.Saltpeter',
    category: 'mundane',
    img: 'icons/commodities/materials/bowl-powder-white.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Saltpeter',
    price: { gc: 0, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'WhitePhosphorus',
    name: 'GOLD_ALCHEMY.Ingredients.WhitePhosphorus',
    category: 'mundane',
    img: 'icons/commodities/materials/glass-chunk-glowing-yellow.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WhitePhosphorus',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'RockOil',
    name: 'GOLD_ALCHEMY.Ingredients.RockOil',
    category: 'mundane',
    img: 'icons/consumables/potions/bottle-conical-corked-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.RockOil',
    price: { gc: 0, ss: 18, bp: 0 },
    encumbrance: 0.3,
    availability: 'common'
  },
  {
    key: 'PureAlcohol',
    name: 'GOLD_ALCHEMY.Ingredients.PureAlcohol',
    category: 'mundane',
    img: 'icons/consumables/potions/bottle-corked-red.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.PureAlcohol',
    price: { gc: 1, ss: 5, bp: 0 },
    encumbrance: 0.3,
    availability: 'common'
  },
  {
    key: 'PureWater',
    name: 'GOLD_ALCHEMY.Ingredients.PureWater',
    category: 'mundane',
    img: 'icons/consumables/potions/bottle-round-corked-water.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.PureWater',
    price: { gc: 0, ss: 5, bp: 0 },
    encumbrance: 0.3,
    availability: 'plentiful'
  },
  {
    key: 'AmmoniaSalts',
    name: 'GOLD_ALCHEMY.Ingredients.AmmoniaSalts',
    category: 'mundane',
    img: 'icons/commodities/materials/bowl-powder-grey.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.AmmoniaSalts',
    price: { gc: 0, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'WillowCharcoal',
    name: 'GOLD_ALCHEMY.Ingredients.WillowCharcoal',
    category: 'mundane',
    img: 'icons/commodities/materials/powder-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WillowCharcoal',
    price: { gc: 0, ss: 4, bp: 0 },
    encumbrance: 0.1,
    availability: 'plentiful'
  },
  {
    key: 'ActivatedCharcoal',
    name: 'GOLD_ALCHEMY.Ingredients.ActivatedCharcoal',
    category: 'mundane',
    img: 'icons/commodities/materials/powder-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.ActivatedCharcoal',
    price: { gc: 0, ss: 8, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'PineResin',
    name: 'GOLD_ALCHEMY.Ingredients.PineResin',
    category: 'mundane',
    img: 'icons/consumables/potions/bottle-bulb-corked-amber.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.PineResin',
    price: { gc: 0, ss: 6, bp: 0 },
    encumbrance: 0.2,
    availability: 'plentiful'
  },
  {
    key: 'Beeswax',
    name: 'GOLD_ALCHEMY.Ingredients.Beeswax',
    category: 'mundane',
    img: 'icons/commodities/materials/wax-yellow.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Beeswax',
    price: { gc: 0, ss: 5, bp: 0 },
    encumbrance: 0.2,
    availability: 'plentiful'
  },

  // ==========================================
  // 8. ZIOŁA, EKSTRAKTY & MEDYCYNA NATURALNA
  // ==========================================
  {
    key: 'Comfrey',
    name: 'GOLD_ALCHEMY.Ingredients.Comfrey',
    category: 'herbal',
    img: 'icons/consumables/flora/leaf-herb-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Comfrey',
    price: { gc: 0, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'MandrakeRoot',
    name: 'GOLD_ALCHEMY.Ingredients.MandrakeRoot',
    category: 'herbal',
    img: 'icons/consumables/flora/root-mandrake.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.MandrakeRoot',
    price: { gc: 1, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'BlackLotusPetals',
    name: 'GOLD_ALCHEMY.Ingredients.BlackLotusPetals',
    category: 'herbal',
    img: 'icons/consumables/flora/flower-lotus-black.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BlackLotusPetals',
    price: { gc: 3, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'BullRoot',
    name: 'GOLD_ALCHEMY.Ingredients.BullRoot',
    category: 'herbal',
    img: 'icons/consumables/flora/root-fibrous-brown.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BullRoot',
    price: { gc: 1, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'SageLeaves',
    name: 'GOLD_ALCHEMY.Ingredients.SageLeaves',
    category: 'herbal',
    img: 'icons/consumables/flora/leaf-oval-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.SageLeaves',
    price: { gc: 0, ss: 8, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'MintOil',
    name: 'GOLD_ALCHEMY.Ingredients.MintOil',
    category: 'herbal',
    img: 'icons/consumables/potions/bottle-corked-translucent-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.MintOil',
    price: { gc: 0, ss: 12, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'LavenderOil',
    name: 'GOLD_ALCHEMY.Ingredients.LavenderOil',
    category: 'herbal',
    img: 'icons/consumables/potions/bottle-bulb-corked-purple.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.LavenderOil',
    price: { gc: 0, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'DaturaOil',
    name: 'GOLD_ALCHEMY.Ingredients.DaturaOil',
    category: 'herbal',
    img: 'icons/consumables/potions/bottle-conical-corked-purple.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.DaturaOil',
    price: { gc: 1, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'RosePetals',
    name: 'GOLD_ALCHEMY.Ingredients.RosePetals',
    category: 'apothecary',
    img: 'icons/consumables/flora/flower-rose-red.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.RosePetals',
    price: { gc: 0, ss: 8, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'RoseWater',
    name: 'GOLD_ALCHEMY.Ingredients.RoseWater',
    category: 'apothecary',
    img: 'icons/consumables/potions/bottle-round-corked-pink.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.RoseWater',
    price: { gc: 0, ss: 12, bp: 0 },
    encumbrance: 0.2,
    availability: 'common'
  },
  {
    key: 'VeracityRoot',
    name: 'GOLD_ALCHEMY.Ingredients.VeracityRoot',
    category: 'herbal',
    img: 'icons/consumables/flora/root-gnarled-white.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.VeracityRoot',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'AntidoteHerb',
    name: 'GOLD_ALCHEMY.Ingredients.AntidoteHerb',
    category: 'herbal',
    img: 'icons/consumables/flora/leaf-lobed-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.AntidoteHerb',
    price: { gc: 0, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'BoarGland',
    name: 'GOLD_ALCHEMY.Ingredients.BoarGland',
    category: 'herbal',
    img: 'icons/commodities/biological/organ-gland.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.BoarGland',
    price: { gc: 1, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'KavehBeans',
    name: 'GOLD_ALCHEMY.Ingredients.KavehBeans',
    category: 'apothecary',
    img: 'icons/consumables/food/beans-coffee.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.KavehBeans',
    price: { gc: 1, ss: 5, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'TrollRoot',
    name: 'GOLD_ALCHEMY.Ingredients.TrollRoot',
    category: 'herbal',
    img: 'icons/consumables/flora/root-troll.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.TrollRoot',
    price: { gc: 2, ss: 10, bp: 0 },
    encumbrance: 0.2,
    availability: 'rare'
  },
  {
    key: 'ManticoreSaliva',
    name: 'GOLD_ALCHEMY.Ingredients.ManticoreSaliva',
    category: 'herbal',
    img: 'icons/consumables/potions/vial-cork-empty-acid.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.ManticoreSaliva',
    price: { gc: 4, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'rare'
  },
  {
    key: 'LemonBalm',
    name: 'GOLD_ALCHEMY.Ingredients.LemonBalm',
    category: 'herbal',
    img: 'icons/consumables/flora/leaf-mint-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.LemonBalm',
    price: { gc: 0, ss: 6, bp: 0 },
    encumbrance: 0.1,
    availability: 'plentiful'
  },
  {
    key: 'HopCones',
    name: 'GOLD_ALCHEMY.Ingredients.HopCones',
    category: 'apothecary',
    img: 'icons/consumables/flora/hop-cones-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.HopCones',
    price: { gc: 0, ss: 5, bp: 0 },
    encumbrance: 0.1,
    availability: 'plentiful'
  },
  {
    key: 'NettleOil',
    name: 'GOLD_ALCHEMY.Ingredients.NettleOil',
    category: 'apothecary',
    img: 'icons/consumables/potions/bottle-corked-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.NettleOil',
    price: { gc: 0, ss: 8, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'ArtichokeLeaf',
    name: 'GOLD_ALCHEMY.Ingredients.ArtichokeLeaf',
    category: 'apothecary',
    img: 'icons/consumables/flora/leaf-thistle-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.ArtichokeLeaf',
    price: { gc: 0, ss: 7, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },

  // ==========================================
  // 9. ZAKAZANA ALCHEMIA (SPACZEŃ)
  // ==========================================
  {
    key: 'WarpstoneDust',
    name: 'GOLD_ALCHEMY.Ingredients.WarpstoneDust',
    category: 'forbidden',
    img: 'icons/commodities/materials/bowl-powder-green.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.WarpstoneDust',
    price: { gc: 10, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'SkavenBlood',
    name: 'GOLD_ALCHEMY.Ingredients.SkavenBlood',
    category: 'forbidden',
    img: 'icons/consumables/potions/bottle-corked-red.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.SkavenBlood',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.2,
    availability: 'scarce'
  },
  {
    key: 'GingersnapRoot',
    name: 'GOLD_ALCHEMY.Ingredients.GingersnapRoot',
    category: 'apothecary',
    sourceModule: 'wfrp4e-starter-set',
    img: 'icons/consumables/plants/root-ginger-tan.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.GingersnapRoot',
    price: { gc: 0, ss: 15, bp: 0 },
    encumbrance: 0.1,
    availability: 'common'
  },
  {
    key: 'SilverLotus',
    name: 'GOLD_ALCHEMY.Ingredients.SilverLotus',
    category: 'herbal',
    sourceModule: 'wfrp4e-starter-set',
    img: 'icons/consumables/plants/lotus-silver-white.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.SilverLotus',
    price: { gc: 1, ss: 10, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'EaglesEye',
    name: 'GOLD_ALCHEMY.Ingredients.EaglesEye',
    category: 'apothecary',
    sourceModule: 'wfrp4e-starter-set',
    img: 'icons/consumables/plants/flower-yellow-stem.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.EaglesEye',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  },
  {
    key: 'Valerian',
    name: 'GOLD_ALCHEMY.Ingredients.Valerian',
    category: 'herbal',
    img: 'icons/consumables/plants/plant-stem-purple.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Valerian',
    price: { gc: 1, ss: 5, bp: 0 },
    encumbrance: 0.1,
    availability: 'scarce'
  },
  {
    key: 'Nightshade',
    name: 'GOLD_ALCHEMY.Ingredients.Nightshade',
    category: 'herbal',
    img: 'icons/consumables/plants/plant-buds-black-purple.webp',
    description: 'GOLD_ALCHEMY.IngredientsDesc.Nightshade',
    price: { gc: 2, ss: 0, bp: 0 },
    encumbrance: 0.1,
    availability: 'rare'
  }
];

/**
 * Konwertuje definicję składnika na obiekt przedmiotu gotowego do dodania do compendium lub inwentarza
 * @param {object} ing
 * @param {number} quantity
 * @returns {object}
 */
export function createIngredientItemData(ing, quantity = 1) {
  const name = game.i18n ? game.i18n.localize(ing.name) : ing.key;
  const desc = game.i18n ? game.i18n.localize(ing.description) : '';

  return {
    name,
    type: 'trapping',
    img: resolveAlchemyImage(ing.img, 'ingredient'),
    system: {
      description: {
        value: `<p>${desc}</p>`
      },
      quantity: {
        value: quantity
      },
      encumbrance: {
        value: ing.encumbrance || 0.1
      },
      price: {
        gc: ing.price?.gc || 0,
        ss: ing.price?.ss || 0,
        bp: ing.price?.bp || 0
      },
      availability: {
        value: ing.availability || 'common'
      },
      trappingType: {
        value: 'ingredient'
      },
      qualities: {
        value: []
      },
      flaws: {
        value: []
      }
    },
    flags: {
      [MODULE_ID]: {
        isIngredient: true,
        ingredientKey: ing.key,
        category: ing.category
      }
    }
  };
}
