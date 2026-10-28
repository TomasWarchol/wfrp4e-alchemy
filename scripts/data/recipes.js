/**
 * Receptury Alchemiczne - WFRP4e Alchemia Starego Świata
 * Z pełnym wsparciem wielojęzycznym (PL / EN) i 8 Kolegiami Magii
 */

export const ALCHEMY_RECIPES = [
  {
    "id": "potion-draught-of-power",
    "key": "DraughtOfPower",
    "name": "GOLD_ALCHEMY.Recipes.DraughtOfPower.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii",
    "difficulty": -30,
    "shelfLifeDays": 90,
    "bonusDaysPerSL": 15,
    "img": "icons/consumables/potions/potion-tube-corked-shimmering-purple.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5.0
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.DraughtOfPower.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.DraughtOfPower.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.DraughtOfPower.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-shimmering-purple.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "prepareItem",
            "script": "if (args.item.type == \"spell\" && args.item.system.cn) args.item.system.cn.value = Math.max(1, Math.ceil(args.item.system.cn.value / 2));"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "2d10",
            "units": "rounds",
            "multiplier": 1,
            "minusTB": false
          }
        }
      }
    },
    "volatility": "extreme",
    "creationDifficultySL": -3
  },
  {
    "id": "potion-flight",
    "key": "Flight",
    "name": "GOLD_ALCHEMY.Recipes.Flight.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 90,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-winged-blue.webp",
    "ingredients": [
      {
        "key": "GriffinDown",
        "name": "GOLD_ALCHEMY.Ingredients.GriffinDown",
        "quantity": 1,
        "costZK": 4.0
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 2,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Flight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Flight.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.Flight.Name",
      "icon": "icons/consumables/potions/bottle-winged-blue.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.EO05HX7jql0g605A\", \"Flight\", \"trait\", 20, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 60
          }
        }
      }
    },
    "volatility": "extreme",
    "creationDifficultySL": -1
  },
  {
    "id": "potion-fortune",
    "key": "Fortune",
    "name": "GOLD_ALCHEMY.Recipes.Fortune.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii",
    "difficulty": -20,
    "shelfLifeDays": 90,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-clover-green.webp",
    "ingredients": [
      {
        "key": "FourLeafClover",
        "name": "GOLD_ALCHEMY.Ingredients.FourLeafClover",
        "quantity": 2,
        "costZK": 2.5
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Fortune.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Fortune.Effect",
    "instantEffect": "fortuneDraught",
    "volatility": "extreme",
    "creationDifficultySL": -2
  },
  {
    "id": "potion-invisibility",
    "key": "Invisibility",
    "name": "GOLD_ALCHEMY.Recipes.Invisibility.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii",
    "difficulty": -20,
    "shelfLifeDays": 90,
    "bonusDaysPerSL": 15,
    "img": "icons/consumables/potions/bottle-conical-corked-smoke-grey.webp",
    "ingredients": [
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 2,
        "costZK": 1.5
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3.0
      },
      {
        "key": "GriffinDown",
        "name": "GOLD_ALCHEMY.Ingredients.GriffinDown",
        "quantity": 1,
        "costZK": 4.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Invisibility.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Invisibility.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.Invisibility.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-smoke-grey.webp",
      "changes": [],
      "statuses": [
        "invisible"
      ],
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 60
          }
        }
      }
    },
    "volatility": "extreme",
    "creationDifficultySL": -2
  },
  {
    "id": "potion-nectar-vitality",
    "key": "NectarVitality",
    "name": "GOLD_ALCHEMY.Recipes.NectarVitality.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 90,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-round-corked-red.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "BoarGland",
        "name": "GOLD_ALCHEMY.Ingredients.BoarGland",
        "quantity": 1,
        "costZK": 1.0
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5.0
      },
      {
        "key": "SpringDew",
        "name": "GOLD_ALCHEMY.Ingredients.SpringDew",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.NectarVitality.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.NectarVitality.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.NectarVitality.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-red.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "startRound",
            "script": "const wounds = this.actor.system.status.wounds;\nif (wounds.value > 0 && wounds.value < wounds.max) await this.actor.modifyWounds(1);"
          },
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const inCombat = game.combat?.combatants?.some(c => c.actor?.id === this.actor.id);\nif (!inCombat) {\n  const wounds = this.actor.system.status.wounds;\n  const rounds = Math.round((Number(this.effect.duration?.value) || 60) / 6);\n  await this.actor.modifyWounds(Math.max(0, Math.min(wounds.max - wounds.value, rounds)));\n}"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 60
          }
        }
      }
    },
    "volatility": "extreme",
    "creationDifficultySL": -1
  },
  {
    "id": "potion-weave-essence",
    "sourceModule": "wfrp4e-alchemy",
    "key": "WeaveEssence",
    "name": "GOLD_ALCHEMY.Recipes.WeaveEssence.Name",
    "category": "magical",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-purple.webp",
    "ingredients": [
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WeaveEssence.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WeaveEssence.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WeaveEssence.Name",
      "icon": "icons/consumables/potions/flask-corked-purple.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "minor"
  },
  {
    "id": "potion-aqshy-liquid-fire",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AqshyLiquidFire",
    "name": "GOLD_ALCHEMY.Recipes.AqshyLiquidFire.Name",
    "category": "college-aqshy",
    "college": "aqshy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Aqshy)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-conical-corked-orange.webp",
    "ingredients": [
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "CinnabarDust",
        "name": "GOLD_ALCHEMY.Ingredients.CinnabarDust",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 1,
        "costZK": 0.9
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyLiquidFire.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyLiquidFire.Effect",
    "instantEffect": "liquidFireExplosion",
    "volatility": "moderate"
  },
  {
    "id": "potion-aqshy-blazing-heart",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AqshyBlazingHeart",
    "name": "GOLD_ALCHEMY.Recipes.AqshyBlazingHeart.Name",
    "category": "college-aqshy",
    "college": "aqshy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Aqshy)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-bulb-corked-fire.webp",
    "ingredients": [
      {
        "key": "CinnabarDust",
        "name": "GOLD_ALCHEMY.Ingredients.CinnabarDust",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "SalamanderEssence",
        "name": "GOLD_ALCHEMY.Ingredients.SalamanderEssence",
        "quantity": 1,
        "costZK": 4.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyBlazingHeart.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyBlazingHeart.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyBlazingHeart.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-fire.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.ws.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.characteristics.s.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.yRhhOlt18COq4e1q\", \"Frenzy\", \"trait\", null, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-aqshy-weapon-oil",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AqshyWeaponOil",
    "name": "GOLD_ALCHEMY.Recipes.AqshyWeaponOil.Name",
    "category": "college-aqshy",
    "college": "aqshy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Aqshy)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/vial-cork-empty-fire.webp",
    "ingredients": [
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "CinnabarDust",
        "name": "GOLD_ALCHEMY.Ingredients.CinnabarDust",
        "quantity": 1,
        "costZK": 2.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyWeaponOil.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyWeaponOil.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyWeaponOil.Name",
      "icon": "icons/consumables/potions/vial-cork-empty-fire.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "flags.wfrp4e-alchemy.flamingWeapon",
          "mode": 5,
          "value": "true"
        }
      ]
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-aqshy-war-blood",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AqshyWarBlood",
    "name": "GOLD_ALCHEMY.Recipes.AqshyWarBlood.Name",
    "category": "college-aqshy",
    "college": "aqshy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Aqshy)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-red.webp",
    "ingredients": [
      {
        "key": "BullRoot",
        "name": "GOLD_ALCHEMY.Ingredients.BullRoot",
        "quantity": 1,
        "costZK": 1.0
      },
      {
        "key": "CinnabarDust",
        "name": "GOLD_ALCHEMY.Ingredients.CinnabarDust",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyWarBlood.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyWarBlood.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyWarBlood.Name",
      "icon": "icons/consumables/potions/flask-corked-red.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-azyr-starlight",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AzyrStarlight",
    "name": "GOLD_ALCHEMY.Recipes.AzyrStarlight.Name",
    "category": "college-azyr",
    "college": "azyr",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Azyr)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-bulb-corked-glowing-blue.webp",
    "ingredients": [
      {
        "key": "MeteoricSilver",
        "name": "GOLD_ALCHEMY.Ingredients.MeteoricSilver",
        "quantity": 1,
        "costZK": 6.0
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrStarlight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrStarlight.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrStarlight.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-glowing-blue.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.x0WMGwuQzReXcQrs\", \"Night Vision\", \"talent\", null, \"\"], [\"Compendium.wfrp4e-core.items.OEjUvJKi0xmBwbS2\", \"Second Sight\", \"talent\", null, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-azyr-astromancer-sight",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AzyrAstromancerSight",
    "name": "GOLD_ALCHEMY.Recipes.AzyrAstromancerSight.Name",
    "category": "college-azyr",
    "college": "azyr",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Azyr)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-blue-glow.webp",
    "ingredients": [
      {
        "key": "FourLeafClover",
        "name": "GOLD_ALCHEMY.Ingredients.FourLeafClover",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrAstromancerSight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrAstromancerSight.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrAstromancerSight.Name",
      "icon": "icons/consumables/potions/flask-corked-blue-glow.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "if (this.actor.hasCondition(\"surprised\")) {\n  this.actor.removeCondition(\"surprised\");\n}"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-azyr-lightning-reflex",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AzyrLightningReflex",
    "name": "GOLD_ALCHEMY.Recipes.AzyrLightningReflex.Name",
    "category": "college-azyr",
    "college": "azyr",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Azyr)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-corked-lightning-blue.webp",
    "ingredients": [
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3.0
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrLightningReflex.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrLightningReflex.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrLightningReflex.Name",
      "icon": "icons/consumables/potions/bottle-corked-lightning-blue.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.details.move.value",
          "mode": 2,
          "value": "1"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-azyr-storm-tonic",
    "sourceModule": "wfrp4e-alchemy",
    "key": "AzyrStormTonic",
    "name": "GOLD_ALCHEMY.Recipes.AzyrStormTonic.Name",
    "category": "college-azyr",
    "college": "azyr",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Azyr)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-blue.webp",
    "ingredients": [
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrStormTonic.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrStormTonic.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrStormTonic.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-blue.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "minor"
  },
  {
    "id": "potion-iron-skin",
    "sourceModule": "wfrp4e-alchemy",
    "key": "IronSkin",
    "name": "GOLD_ALCHEMY.Recipes.IronSkin.Name",
    "category": "college-chamon",
    "college": "chamon",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 7,
    "img": "icons/consumables/potions/bottle-metal-yellow-gray.webp",
    "ingredients": [
      {
        "key": "IronFilings",
        "name": "GOLD_ALCHEMY.Ingredients.GoldIronFilings",
        "quantity": 1,
        "costZK": 2.0
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "LeadSediment",
        "name": "GOLD_ALCHEMY.Ingredients.LeadOxide",
        "quantity": 1,
        "costZK": 1.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.IronSkin.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.IronSkin.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.IronSkin.Name",
      "icon": "icons/consumables/potions/bottle-metal-yellow-gray.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "-10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "APCalc",
            "script": "for (const loc of [\"head\", \"body\", \"lArm\", \"rArm\", \"lLeg\", \"rLeg\"]) {\n  if (!args.AP[loc]) continue;\n  args.AP[loc].value += 2;\n  args.AP[loc].layers.push({ value: 2, source: { name: this.effect.name }, magical: true, metal: false, impenetrable: false, partial: false, weakpoints: false });\n}"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-liquid-gold",
    "sourceModule": "wfrp4e-alchemy",
    "key": "LiquidGold",
    "name": "GOLD_ALCHEMY.Recipes.LiquidGold.Name",
    "category": "college-chamon",
    "college": "chamon",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -10,
    "shelfLifeDays": 20,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-yellow-glow.webp",
    "ingredients": [
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5.0
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.LiquidGold.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.LiquidGold.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.LiquidGold.Name",
      "icon": "icons/consumables/potions/flask-corked-yellow-glow.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "20"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-quicksilver-speed",
    "sourceModule": "wfrp4e-alchemy",
    "key": "QuicksilverSpeed",
    "name": "GOLD_ALCHEMY.Recipes.QuicksilverSpeed.Name",
    "category": "college-chamon",
    "college": "chamon",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-bulb-corked-silver.webp",
    "ingredients": [
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3.0
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3.0
      },
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.QuicksilverSpeed.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.QuicksilverSpeed.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.QuicksilverSpeed.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-silver.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.details.move.value",
          "mode": 2,
          "value": "1"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-lead-fortitude",
    "sourceModule": "wfrp4e-alchemy",
    "key": "LeadFortitude",
    "name": "GOLD_ALCHEMY.Recipes.LeadFortitude.Name",
    "category": "college-chamon",
    "college": "chamon",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 20,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 7,
    "img": "icons/consumables/potions/bottle-conical-corked-grey.webp",
    "ingredients": [
      {
        "key": "LeadSediment",
        "name": "GOLD_ALCHEMY.Ingredients.LeadOxide",
        "quantity": 2,
        "costZK": 1.0
      },
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 2,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.LeadFortitude.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.LeadFortitude.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.LeadFortitude.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-grey.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-alkahest",
    "key": "Alkahest",
    "name": "GOLD_ALCHEMY.Recipes.Alkahest.Name",
    "category": "college-chamon",
    "college": "chamon",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -20,
    "shelfLifeDays": 120,
    "bonusDaysPerSL": 15,
    "img": "icons/consumables/potions/bottle-skull-corked-acid-green.webp",
    "ingredients": [
      {
        "key": "AquaRegia",
        "name": "GOLD_ALCHEMY.Ingredients.DragonAcid",
        "quantity": 2,
        "costZK": 4.0
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Alkahest.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Alkahest.Effect",
    "instantEffect": "alkahestAcid",
    "volatility": "major"
  },
  {
    "id": "potion-meteoric-compass",
    "key": "MeteoricCompass",
    "name": "GOLD_ALCHEMY.Recipes.MeteoricCompass.Name",
    "category": "college-chamon",
    "college": "chamon",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -10,
    "shelfLifeDays": 365,
    "bonusDaysPerSL": 30,
    "img": "icons/tools/navigation/compass-brass.webp",
    "ingredients": [
      {
        "key": "MeteoricSilver",
        "name": "GOLD_ALCHEMY.Ingredients.MeteoricSilver",
        "quantity": 1,
        "costZK": 6.0
      },
      {
        "key": "MagneticNeedle",
        "name": "GOLD_ALCHEMY.Ingredients.MagneticNeedle",
        "quantity": 1,
        "costZK": 2.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MeteoricCompass.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MeteoricCompass.Effect",
    "volatility": "moderate"
  },
  {
    "id": "potion-power-prism",
    "key": "PowerPrism",
    "name": "GOLD_ALCHEMY.Recipes.PowerPrism.Name",
    "category": "college-chamon",
    "college": "chamon",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 4,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -20,
    "shelfLifeDays": 365,
    "bonusDaysPerSL": 30,
    "img": "icons/commodities/gems/gem-faceted-diamond-faceted.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PowerPrism.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PowerPrism.Effect",
    "volatility": "extreme"
  },
  {
    "id": "potion-ghyran-spring-dew",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhyranSpringDew",
    "name": "GOLD_ALCHEMY.Recipes.GhyranSpringDew.Name",
    "category": "college-ghyran",
    "college": "ghyran",
    "attunementCost": 4,
    "testSkill": "Splatanie Magii (Ghyran)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-bulb-corked-green-glow.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "SpringDew",
        "name": "GOLD_ALCHEMY.Ingredients.SpringDew",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranSpringDew.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranSpringDew.Effect",
    "instantEffect": "ghyranSpringHeal",
    "volatility": "major"
  },
  {
    "id": "potion-ghyran-vital-sap",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhyranVitalSap",
    "name": "GOLD_ALCHEMY.Recipes.GhyranVitalSap.Name",
    "category": "college-ghyran",
    "college": "ghyran",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghyran)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-green.webp",
    "ingredients": [
      {
        "key": "OakSap",
        "name": "GOLD_ALCHEMY.Ingredients.OakSap",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranVitalSap.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranVitalSap.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhyranVitalSap.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "startRound",
            "script": "const wounds = this.actor.system.status.wounds;\nif (wounds.value > 0 && wounds.value < wounds.max) await this.actor.modifyWounds(1);"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ghyran-blood-purifier",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhyranBloodPurifier",
    "name": "GOLD_ALCHEMY.Recipes.GhyranBloodPurifier.Name",
    "category": "college-ghyran",
    "college": "ghyran",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ghyran)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/vial-cork-empty-teal.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "LemonBalm",
        "name": "GOLD_ALCHEMY.Ingredients.LemonBalm",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranBloodPurifier.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranBloodPurifier.Effect",
    "instantEffect": "ghyranPurify",
    "volatility": "minor"
  },
  {
    "id": "potion-ghyran-ironbark-salve",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhyranIronbarkSalve",
    "name": "GOLD_ALCHEMY.Recipes.GhyranIronbarkSalve.Name",
    "category": "college-ghyran",
    "college": "ghyran",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghyran)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-bulb-corked-brown.webp",
    "ingredients": [
      {
        "key": "Ironbark",
        "name": "GOLD_ALCHEMY.Ingredients.Ironbark",
        "quantity": 1,
        "costZK": 2.0
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "OakSap",
        "name": "GOLD_ALCHEMY.Ingredients.OakSap",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranIronbarkSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranIronbarkSalve.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhyranIronbarkSalve.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-brown.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "APCalc",
            "script": "for (const loc of [\"head\", \"body\", \"lArm\", \"rArm\", \"lLeg\", \"rLeg\"]) {\n  if (!args.AP[loc]) continue;\n  args.AP[loc].value += 1;\n  args.AP[loc].layers.push({ value: 1, source: { name: this.effect.name }, magical: true, metal: false, impenetrable: false, partial: false, weakpoints: false });\n}"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ghur-predator-sight",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhurPredatorSight",
    "name": "GOLD_ALCHEMY.Recipes.GhurPredatorSight.Name",
    "category": "college-ghur",
    "college": "ghur",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghur)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-amber.webp",
    "ingredients": [
      {
        "key": "WolfEye",
        "name": "GOLD_ALCHEMY.Ingredients.WolfEye",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurPredatorSight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurPredatorSight.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurPredatorSight.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-amber.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.x0WMGwuQzReXcQrs\", \"Night Vision\", \"talent\", null, \"\"], [\"Compendium.wfrp4e-core.items.9h82z72XGo9tfgQS\", \"Acute Sense\", \"talent\", null, \"Węch\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ghur-ursine-vigor",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhurUrsineVigor",
    "name": "GOLD_ALCHEMY.Recipes.GhurUrsineVigor.Name",
    "category": "college-ghur",
    "college": "ghur",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Ghur)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-corked-bear-brown.webp",
    "ingredients": [
      {
        "key": "BearClaw",
        "name": "GOLD_ALCHEMY.Ingredients.BearClaw",
        "quantity": 1,
        "costZK": 2.25
      },
      {
        "key": "BullRoot",
        "name": "GOLD_ALCHEMY.Ingredients.BullRoot",
        "quantity": 1,
        "costZK": 1.0
      },
      {
        "key": "BeastFangs",
        "name": "GOLD_ALCHEMY.Ingredients.BeastFangs",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurUrsineVigor.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurUrsineVigor.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurUrsineVigor.Name",
      "icon": "icons/consumables/potions/bottle-corked-bear-brown.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.s.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-ghur-primal-roar",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhurPrimalRoar",
    "name": "GOLD_ALCHEMY.Recipes.GhurPrimalRoar.Name",
    "category": "college-ghur",
    "college": "ghur",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghur)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-amber.webp",
    "ingredients": [
      {
        "key": "BeastFangs",
        "name": "GOLD_ALCHEMY.Ingredients.BeastFangs",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "BoarGland",
        "name": "GOLD_ALCHEMY.Ingredients.BoarGland",
        "quantity": 1,
        "costZK": 1.0
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurPrimalRoar.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurPrimalRoar.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurPrimalRoar.Name",
      "icon": "icons/consumables/potions/flask-corked-amber.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.ws.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.pTorrE0l3VybAbtn\", \"Fear\", \"trait\", 1, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ghur-savage-salve",
    "sourceModule": "wfrp4e-alchemy",
    "key": "GhurSavageSalve",
    "name": "GOLD_ALCHEMY.Recipes.GhurSavageSalve.Name",
    "category": "college-ghur",
    "college": "ghur",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ghur)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-bulb-corked-brown.webp",
    "ingredients": [
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurSavageSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurSavageSalve.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurSavageSalve.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-brown.webp",
      "duration": {
        "seconds": 14400
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "return [\"Animal Care\", \"Opieka nad Zwierzętami\", \"Charm Animal\", \"Zastraszanie Zwierząt\", \"Animal Training\", \"Tresura\", \"Ride\", \"Jeździectwo\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return ![\"Animal Care\", \"Opieka nad Zwierzętami\", \"Charm Animal\", \"Zastraszanie Zwierząt\", \"Animal Training\", \"Tresura\", \"Ride\", \"Jeździectwo\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-hysh-radiant-purity",
    "sourceModule": "wfrp4e-alchemy",
    "key": "HyshRadiantPurity",
    "name": "GOLD_ALCHEMY.Recipes.HyshRadiantPurity.Name",
    "category": "college-hysh",
    "college": "hysh",
    "attunementCost": 5,
    "testSkill": "Splatanie Magii (Hysh)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/flask-corked-white-glow.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5.0
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4.0
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshRadiantPurity.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshRadiantPurity.Effect",
    "instantEffect": "hyshPurity",
    "volatility": "extreme"
  },
  {
    "id": "potion-hysh-suns-wrath",
    "sourceModule": "wfrp4e-alchemy",
    "key": "HyshSunsWrath",
    "name": "GOLD_ALCHEMY.Recipes.HyshSunsWrath.Name",
    "category": "college-hysh",
    "college": "hysh",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Hysh)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-bulb-corked-white.webp",
    "ingredients": [
      {
        "key": "WhitePhosphorus",
        "name": "GOLD_ALCHEMY.Ingredients.WhitePhosphorus",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshSunsWrath.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshSunsWrath.Effect",
    "instantEffect": "hyshSunFlash",
    "volatility": "moderate"
  },
  {
    "id": "potion-hysh-lucidity-draught",
    "sourceModule": "wfrp4e-alchemy",
    "key": "HyshLucidityDraught",
    "name": "GOLD_ALCHEMY.Recipes.HyshLucidityDraught.Name",
    "category": "college-hysh",
    "college": "hysh",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Hysh)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-white.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshLucidityDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshLucidityDraught.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.HyshLucidityDraught.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-white.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "20"
        }
      ]
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-hysh-truth-drops",
    "sourceModule": "wfrp4e-alchemy",
    "key": "HyshTruthDrops",
    "name": "GOLD_ALCHEMY.Recipes.HyshTruthDrops.Name",
    "category": "college-hysh",
    "college": "hysh",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Hysh)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/vial-cork-empty-white.webp",
    "ingredients": [
      {
        "key": "VeracityRoot",
        "name": "GOLD_ALCHEMY.Ingredients.VeracityRoot",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshTruthDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshTruthDrops.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.HyshTruthDrops.Name",
      "icon": "icons/consumables/potions/vial-cork-empty-white.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return [\"Intuition\", \"Intuicja\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return ![\"Intuition\", \"Intuicja\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-shyish-pale-mask",
    "sourceModule": "wfrp4e-alchemy",
    "key": "ShyishPaleMask",
    "name": "GOLD_ALCHEMY.Recipes.ShyishPaleMask.Name",
    "category": "college-shyish",
    "college": "shyish",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Shyish)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-skull-corked-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "BlackLotusPetals",
        "name": "GOLD_ALCHEMY.Ingredients.BlackLotusPetals",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishPaleMask.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishPaleMask.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishPaleMask.Name",
      "icon": "icons/consumables/potions/bottle-skull-corked-purple.webp",
      "changes": [],
      "flags": {
        "wfrp4e-alchemy": {
          "feignDeath": true,
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-shyish-spirit-bane",
    "sourceModule": "wfrp4e-alchemy",
    "key": "ShyishSpiritBane",
    "name": "GOLD_ALCHEMY.Recipes.ShyishSpiritBane.Name",
    "category": "college-shyish",
    "college": "shyish",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Shyish)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-conical-corked-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishSpiritBane.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishSpiritBane.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishSpiritBane.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-purple.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "flags.wfrp4e-alchemy.ghostBaneOil",
          "mode": 5,
          "value": "true"
        }
      ]
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-shyish-hourglass",
    "sourceModule": "wfrp4e-alchemy",
    "key": "ShyishHourglass",
    "name": "GOLD_ALCHEMY.Recipes.ShyishHourglass.Name",
    "category": "college-shyish",
    "college": "shyish",
    "attunementCost": 4,
    "testSkill": "Splatanie Magii (Shyish)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-bulb-corked-purple.webp",
    "ingredients": [
      {
        "key": "HourglassSand",
        "name": "GOLD_ALCHEMY.Ingredients.HourglassSand",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishHourglass.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishHourglass.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishHourglass.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-purple.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "flags": {
        "wfrp4e-alchemy": {
          "deathWard": true
        }
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-shyish-shroud",
    "sourceModule": "wfrp4e-alchemy",
    "key": "ShyishShroud",
    "name": "GOLD_ALCHEMY.Recipes.ShyishShroud.Name",
    "category": "college-shyish",
    "college": "shyish",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Shyish)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "LeadSediment",
        "name": "GOLD_ALCHEMY.Ingredients.LeadOxide",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishShroud.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishShroud.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishShroud.Name",
      "icon": "icons/consumables/potions/flask-corked-purple.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.pTorrE0l3VybAbtn\", \"Fear\", \"trait\", 1, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ulgu-shadow-mist",
    "sourceModule": "wfrp4e-alchemy",
    "key": "UlguShadowMist",
    "name": "GOLD_ALCHEMY.Recipes.UlguShadowMist.Name",
    "category": "college-ulgu",
    "college": "ulgu",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ulgu)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 10,
    "img": "icons/consumables/potions/bottle-bulb-corked-smoke-grey.webp",
    "ingredients": [
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguShadowMist.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguShadowMist.Effect",
    "instantEffect": "ulguShadowMist",
    "volatility": "moderate"
  },
  {
    "id": "potion-ulgu-phantasmagoria",
    "sourceModule": "wfrp4e-alchemy",
    "key": "UlguPhantasmagoria",
    "name": "GOLD_ALCHEMY.Recipes.UlguPhantasmagoria.Name",
    "category": "college-ulgu",
    "college": "ulgu",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ulgu)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-smoke-grey.webp",
    "ingredients": [
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguPhantasmagoria.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguPhantasmagoria.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.UlguPhantasmagoria.Name",
      "icon": "icons/consumables/potions/flask-corked-smoke-grey.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return [\"Charm\", \"Charyzma\", \"Entertain\", \"Występy\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return ![\"Charm\", \"Charyzma\", \"Entertain\", \"Występy\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ulgu-stalker-oil",
    "sourceModule": "wfrp4e-alchemy",
    "key": "UlguStalkerOil",
    "name": "GOLD_ALCHEMY.Recipes.UlguStalkerOil.Name",
    "category": "college-ulgu",
    "college": "ulgu",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ulgu)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": 10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/vial-cork-empty-grey.webp",
    "ingredients": [
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguStalkerOil.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguStalkerOil.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.UlguStalkerOil.Name",
      "icon": "icons/consumables/potions/vial-cork-empty-grey.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "return [\"Stealth\", \"Skradanie\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return ![\"Stealth\", \"Skradanie\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-ulgu-wraithstep",
    "sourceModule": "wfrp4e-alchemy",
    "key": "UlguWraithstep",
    "name": "GOLD_ALCHEMY.Recipes.UlguWraithstep.Name",
    "category": "college-ulgu",
    "college": "ulgu",
    "attunementCost": 4,
    "testSkill": "Splatanie Magii (Ulgu)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-conical-corked-smoke-grey.webp",
    "ingredients": [
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguWraithstep.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguWraithstep.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.UlguWraithstep.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-smoke-grey.webp",
      "duration": {
        "rounds": 10
      },
      "changes": [
        {
          "key": "flags.wfrp4e-alchemy.wraithstep",
          "mode": 5,
          "value": "true"
        }
      ]
    },
    "volatility": "extreme"
  },
  {
    "id": "potion-leonardo-powder",
    "key": "LeonardoPowder",
    "name": "GOLD_ALCHEMY.Recipes.LeonardoPowder.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/commodities/materials/powder-grey.webp",
    "ingredients": [
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "IronFilings",
        "name": "GOLD_ALCHEMY.Ingredients.GoldIronFilings",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.LeonardoPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.LeonardoPowder.Effect",
    "volatility": "major",
    "creationTimeDays": 2
  },
  {
    "id": "potion-vitriol-acid",
    "sourceModule": "wfrp4e-wom",
    "key": "VitriolAcid",
    "name": "GOLD_ALCHEMY.Recipes.VitriolAcid.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 0,
    "shelfLifeDays": 365,
    "bonusDaysPerSL": 30,
    "img": "icons/consumables/potions/bottle-conical-corked-acid-green.webp",
    "ingredients": [
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 2,
        "costZK": 2
      },
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.VitriolAcid.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.VitriolAcid.Effect",
    "instantEffect": "acidDamage",
    "volatility": "moderate",
    "creationTimeDays": 2,
    "listPriceSS": 20,
    "availability": "scarce"
  },
  {
    "id": "potion-phosphor-fire",
    "sourceModule": "wfrp4e-wom",
    "key": "PhosphorFire",
    "name": "GOLD_ALCHEMY.Recipes.PhosphorFire.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 0,
    "shelfLifeDays": 120,
    "bonusDaysPerSL": 15,
    "img": "icons/consumables/potions/bottle-bulb-corked-fire.webp",
    "ingredients": [
      {
        "key": "WhitePhosphorus",
        "name": "GOLD_ALCHEMY.Ingredients.WhitePhosphorus",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PhosphorFire.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PhosphorFire.Effect",
    "instantEffect": "phosphorFireExplosion",
    "volatility": "moderate",
    "creationTimeDays": 2,
    "listPriceSS": 20,
    "availability": "scarce"
  },
  {
    "id": "potion-flash-powder",
    "sourceModule": "wfrp4e-wom",
    "key": "FlashPowder",
    "name": "GOLD_ALCHEMY.Recipes.FlashPowder.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/vial-cork-empty-yellow.webp",
    "ingredients": [
      {
        "key": "WhitePhosphorus",
        "name": "GOLD_ALCHEMY.Ingredients.WhitePhosphorus",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.FlashPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.FlashPowder.Effect",
    "instantEffect": "flashPowderBlast",
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-smoke-pellet",
    "sourceModule": "wfrp4e-alchemy",
    "key": "SmokePellet",
    "name": "GOLD_ALCHEMY.Recipes.SmokePellet.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/bottle-bulb-corked-smoke-grey.webp",
    "ingredients": [
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SmokePellet.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SmokePellet.Effect",
    "instantEffect": "smokePelletCloud",
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-smelling-salts",
    "sourceModule": "wfrp4e-alchemy",
    "key": "SmellingSalts",
    "name": "GOLD_ALCHEMY.Recipes.SmellingSalts.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 20,
    "shelfLifeDays": 365,
    "bonusDaysPerSL": 30,
    "img": "icons/consumables/potions/bottle-round-corked-white.webp",
    "ingredients": [
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SmellingSalts.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SmellingSalts.Effect",
    "instantEffect": "smellingSaltsRevive",
    "volatility": "minor",
    "creationTimeDays": 2,
    "listPriceSS": 12,
    "availability": "common"
  },
  {
    "id": "potion-quick-glue",
    "sourceModule": "wfrp4e-alchemy",
    "key": "QuickGlue",
    "name": "GOLD_ALCHEMY.Recipes.QuickGlue.Name",
    "category": "mundane",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": 10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/bottle-corked-amber.webp",
    "ingredients": [
      {
        "key": "PineResin",
        "name": "GOLD_ALCHEMY.Ingredients.PineResin",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.QuickGlue.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.QuickGlue.Effect",
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-potency-draught",
    "key": "PotencyDraught",
    "name": "GOLD_ALCHEMY.Recipes.PotencyDraught.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-bulb-corked-orange.webp",
    "ingredients": [
      {
        "key": "BullRoot",
        "name": "GOLD_ALCHEMY.Ingredients.BullRoot",
        "quantity": 6,
        "costZK": 1.0
      },
      {
        "key": "BearClaw",
        "name": "GOLD_ALCHEMY.Ingredients.BearClaw",
        "quantity": 2,
        "costZK": 2.25
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 2,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PotencyDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PotencyDraught.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.PotencyDraught.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-orange.webp",
      "changes": [
        {
          "key": "system.characteristics.s.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "20"
        }
      ],
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "minor",
    "creationDifficultySL": -1,
    "creationTimeDays": 28
  },
  {
    "id": "potion-lucidity-tonic",
    "key": "LucidityTonic",
    "name": "GOLD_ALCHEMY.Recipes.LucidityTonic.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-black.webp",
    "ingredients": [
      {
        "key": "KavehBeans",
        "name": "GOLD_ALCHEMY.Ingredients.KavehBeans",
        "quantity": 6,
        "costZK": 1.25
      },
      {
        "key": "SilverLotus",
        "name": "GOLD_ALCHEMY.Ingredients.SilverLotus",
        "quantity": 4,
        "costZK": 1.5
      },
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 4,
        "costZK": 0.6
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 3,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.LucidityTonic.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.LucidityTonic.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.LucidityTonic.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-black.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.slBonus += 1;",
            "options": {
              "activateScript": "return [\"int\", \"wp\"].includes(args.characteristic);",
              "hideScript": "return ![\"int\", \"wp\"].includes(args.characteristic);"
            }
          },
          {
            "label": "@effect.name",
            "trigger": "deleteEffect",
            "script": "this.actor.addCondition(\"fatigued\", 3);"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "3d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "major",
    "creationDifficultySL": -1,
    "creationTimeDays": 28
  },
  {
    "id": "potion-debauchs-friend",
    "key": "DebauchsFriend",
    "name": "GOLD_ALCHEMY.Recipes.DebauchsFriend.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-conical-corked-amber.webp",
    "ingredients": [
      {
        "key": "ArtichokeLeaf",
        "name": "GOLD_ALCHEMY.Ingredients.ArtichokeLeaf",
        "quantity": 10,
        "costZK": 0.35
      },
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 5,
        "costZK": 0.5
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 3,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.DebauchsFriend.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.DebauchsFriend.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.DebauchsFriend.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-amber.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 100;",
            "options": {
              "activateScript": "return [\"Consume Alcohol\", \"Mocna Głowa\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return ![\"Consume Alcohol\", \"Mocna Głowa\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-nectar-beauty",
    "key": "NectarBeauty",
    "name": "GOLD_ALCHEMY.Recipes.NectarBeauty.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-pink.webp",
    "ingredients": [
      {
        "key": "RosePetals",
        "name": "GOLD_ALCHEMY.Ingredients.RosePetals",
        "quantity": 6,
        "costZK": 0.4
      },
      {
        "key": "RoseWater",
        "name": "GOLD_ALCHEMY.Ingredients.RoseWater",
        "quantity": 6,
        "costZK": 0.6
      },
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 4,
        "costZK": 1.5
      },
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 4,
        "costZK": 0.75
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5.0
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.NectarBeauty.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.NectarBeauty.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.NectarBeauty.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-pink.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.slBonus += 1;",
            "options": {
              "activateScript": "return false;",
              "hideScript": "return ![\"fel\"].includes(args.characteristic);"
            }
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "3d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate",
    "creationDifficultySL": -1,
    "creationTimeDays": 14
  },
  {
    "id": "potion-nectar-veracity",
    "key": "NectarVeracity",
    "name": "GOLD_ALCHEMY.Recipes.NectarVeracity.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/vial-cork-empty-white.webp",
    "ingredients": [
      {
        "key": "VeracityRoot",
        "name": "GOLD_ALCHEMY.Ingredients.VeracityRoot",
        "quantity": 6,
        "costZK": 2.0
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 4,
        "costZK": 1.25
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 6,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.NectarVeracity.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.NectarVeracity.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.NectarVeracity.Name",
      "icon": "icons/consumables/potions/vial-cork-empty-white.webp",
      "changes": [],
      "flags": {
        "wfrp4e-alchemy": {
          "compelledTruth": true,
          "durationRoll": {
            "formula": "3d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate",
    "creationDifficultySL": -1,
    "creationTimeDays": 14
  },
  {
    "id": "potion-hair-tonic",
    "key": "HairTonic",
    "name": "GOLD_ALCHEMY.Recipes.HairTonic.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-corked-green.webp",
    "ingredients": [
      {
        "key": "NettleOil",
        "name": "GOLD_ALCHEMY.Ingredients.NettleOil",
        "quantity": 10,
        "costZK": 0.4
      },
      {
        "key": "HopCones",
        "name": "GOLD_ALCHEMY.Ingredients.HopCones",
        "quantity": 10,
        "costZK": 0.25
      },
      {
        "key": "BoarGland",
        "name": "GOLD_ALCHEMY.Ingredients.BoarGland",
        "quantity": 8,
        "costZK": 1.0
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 8,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HairTonic.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HairTonic.Effect",
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-forgetfulness",
    "key": "Forgetfulness",
    "name": "GOLD_ALCHEMY.Recipes.Forgetfulness.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-skull-corked-black.webp",
    "ingredients": [
      {
        "key": "BlackLotusPetals",
        "name": "GOLD_ALCHEMY.Ingredients.BlackLotusPetals",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "MandrakeRoot",
        "name": "GOLD_ALCHEMY.Ingredients.MandrakeRoot",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Forgetfulness.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Forgetfulness.Effect",
    "instantEffect": "forgetMemory",
    "volatility": "major",
    "creationTimeDays": 14
  },
  {
    "id": "potion-soothing-draught",
    "key": "SoothingDraught",
    "name": "GOLD_ALCHEMY.Recipes.SoothingDraught.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-starter-set",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-lavender.webp",
    "ingredients": [
      {
        "key": "LemonBalm",
        "name": "GOLD_ALCHEMY.Ingredients.LemonBalm",
        "quantity": 1,
        "costZK": 0.3
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SoothingDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SoothingDraught.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SoothingDraught.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-lavender.webp",
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "-10"
        },
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "-10"
        },
        {
          "key": "system.characteristics.int.modifier",
          "mode": 2,
          "value": "-10"
        }
      ],
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 600
          }
        }
      }
    },
    "volatility": "minor",
    "creationTimeDays": 7,
    "listPriceSS": 1,
    "availability": "common"
  },
  {
    "id": "potion-panacea-universalis",
    "key": "PanaceaUniversalis",
    "name": "GOLD_ALCHEMY.Recipes.PanaceaUniversalis.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Splatanie Magii",
    "difficulty": -20,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-round-corked-white-glow.webp",
    "ingredients": [
      {
        "key": "MandrakeRoot",
        "name": "GOLD_ALCHEMY.Ingredients.MandrakeRoot",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "BlackLotusPetals",
        "name": "GOLD_ALCHEMY.Ingredients.BlackLotusPetals",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PanaceaUniversalis.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PanaceaUniversalis.Effect",
    "instantEffect": "panaceaUniversalis",
    "volatility": "moderate",
    "creationDifficultySL": -2,
    "creationTimeDays": 28
  },
  {
    "id": "potion-healing-draught",
    "key": "HealingDraught",
    "name": "GOLD_ALCHEMY.Recipes.HealingDraught.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-round-corked-red.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HealingDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HealingDraught.Effect",
    "instantEffect": "healingDraught",
    "volatility": "minor",
    "creationTimeDays": 7,
    "listPriceSS": 10,
    "availability": "scarce"
  },
  {
    "id": "potion-masterwork-healing",
    "key": "MasterworkHealing",
    "name": "GOLD_ALCHEMY.Recipes.MasterworkHealing.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-starter-set",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-corked-glowing-red.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MasterworkHealing.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MasterworkHealing.Effect",
    "instantEffect": "marvelousMixture",
    "volatility": "minor",
    "creationTimeDays": 7,
    "listPriceSS": 8,
    "availability": "scarce"
  },
  {
    "id": "potion-vitality-draught",
    "key": "VitalityDraught",
    "name": "GOLD_ALCHEMY.Recipes.VitalityDraught.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-bulb-corked-yellow.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.VitalityDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.VitalityDraught.Effect",
    "instantEffect": "vitalityDraught",
    "volatility": "minor",
    "creationTimeDays": 7,
    "listPriceSS": 12,
    "availability": "scarce"
  },
  {
    "id": "potion-digestive-tonic",
    "key": "DigestiveTonic",
    "name": "GOLD_ALCHEMY.Recipes.DigestiveTonic.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 20,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-round-corked-green.webp",
    "ingredients": [
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.DigestiveTonic.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.DigestiveTonic.Effect",
    "volatility": "minor",
    "creationTimeDays": 7,
    "listPriceSS": 3,
    "availability": "common",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.DigestiveTonic.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-green.webp",
      "duration": {
        "seconds": 86400
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return false;",
              "hideScript": "return ![\"Endurance\", \"Odporność\"].some(n => (args.skill?.name || \"\").startsWith(n));"
            }
          }
        ]
      }
    }
  },
  {
    "id": "potion-mundane-panacea",
    "key": "MundanePanacea",
    "name": "GOLD_ALCHEMY.Recipes.MundanePanacea.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-bulb-corked-teal.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MundanePanacea.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MundanePanacea.Effect",
    "instantEffect": "mundanePanacea",
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 15,
    "availability": "scarce"
  },
  {
    "id": "potion-soul-balm",
    "key": "SoulBalm",
    "name": "GOLD_ALCHEMY.Recipes.SoulBalm.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-core",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-corked-purple.webp",
    "ingredients": [
      {
        "key": "ManticoreSaliva",
        "name": "GOLD_ALCHEMY.Ingredients.ManticoreSaliva",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SoulBalm.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SoulBalm.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SoulBalm.Name",
      "icon": "icons/consumables/potions/bottle-corked-purple.webp",
      "duration": {
        "seconds": 21600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return false;",
              "hideScript": "return ![\"wp\"].includes(args.characteristic);"
            }
          }
        ]
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-boars-musk",
    "key": "BoarsMusk",
    "name": "GOLD_ALCHEMY.Recipes.BoarsMusk.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-wom",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-corked-amber.webp",
    "ingredients": [
      {
        "key": "BoarGland",
        "name": "GOLD_ALCHEMY.Ingredients.BoarGland",
        "quantity": 10,
        "costZK": 1.0
      },
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 5,
        "costZK": 0.9
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 8,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.BoarsMusk.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.BoarsMusk.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.BoarsMusk.Name",
      "icon": "icons/consumables/potions/bottle-corked-amber.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.slBonus -= 2;",
            "options": {
              "activateScript": "return [\"fel\", \"dex\"].includes(args.characteristic);",
              "hideScript": "return ![\"fel\", \"dex\"].includes(args.characteristic);"
            }
          },
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.MVI0lXcg6vvtooAF\", \"Distracting\", \"trait\", null, \"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-morr-salve",
    "sourceModule": "wfrp4e-core",
    "key": "MorrSalve",
    "name": "GOLD_ALCHEMY.Recipes.MorrSalve.Name",
    "category": "herbal",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 20,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/jar-corked-salve-green.webp",
    "ingredients": [
      {
        "key": "BlackLotusPetals",
        "name": "GOLD_ALCHEMY.Ingredients.BlackLotusPetals",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MorrSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MorrSalve.Effect",
    "instantEffect": "morrSalveHeal",
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-mandrake-extract",
    "sourceModule": "wfrp4e-core",
    "key": "MandrakeExtract",
    "name": "GOLD_ALCHEMY.Recipes.MandrakeExtract.Name",
    "category": "herbal",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-bulb-corked-purple.webp",
    "ingredients": [
      {
        "key": "MandrakeRoot",
        "name": "GOLD_ALCHEMY.Ingredients.MandrakeRoot",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MandrakeExtract.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MandrakeExtract.Effect",
    "instantEffect": "mandrakeSleep",
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 60,
    "availability": "rare"
  },
  {
    "id": "potion-antitoxin-broad",
    "sourceModule": "wfrp4e-core",
    "key": "AntitoxinBroad",
    "name": "GOLD_ALCHEMY.Recipes.AntitoxinBroad.Name",
    "category": "herbal",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-conical-corked-white.webp",
    "ingredients": [
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 2,
        "costZK": 0.75
      },
      {
        "key": "MandrakeRoot",
        "name": "GOLD_ALCHEMY.Ingredients.MandrakeRoot",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "ActivatedCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.ActivatedCharcoal",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AntitoxinBroad.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AntitoxinBroad.Effect",
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 60,
    "availability": "rare",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AntitoxinBroad.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-white.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const poisoned = this.actor.hasCondition(\"poisoned\");\nif (poisoned) poisoned.delete();"
          }
        ]
      }
    }
  },
  {
    "id": "potion-clarity-drops",
    "sourceModule": "wfrp4e-core",
    "key": "ClarityDrops",
    "name": "GOLD_ALCHEMY.Recipes.ClarityDrops.Name",
    "category": "herbal",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/vial-cork-empty-blue.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ClarityDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ClarityDrops.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ClarityDrops.Name",
      "icon": "icons/consumables/potions/vial-cork-empty-blue.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-trollroot-tincture",
    "sourceModule": "wfrp4e-core",
    "key": "TrollrootTincture",
    "name": "GOLD_ALCHEMY.Recipes.TrollrootTincture.Name",
    "category": "herbal",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": -10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-bulb-corked-amber.webp",
    "ingredients": [
      {
        "key": "TrollRoot",
        "name": "GOLD_ALCHEMY.Ingredients.TrollRoot",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "AquaVitae",
        "name": "GOLD_ALCHEMY.Ingredients.WhiteAlchemicalGold",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.TrollrootTincture.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.TrollrootTincture.Effect",
    "instantEffect": "trollrootRegen",
    "volatility": "major",
    "creationTimeDays": 7
  },
  {
    "id": "potion-skaven-brew",
    "key": "SkavenBrew",
    "name": "GOLD_ALCHEMY.Recipes.SkavenBrew.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-horned-rat",
    "attunementCost": 0,
    "testSkill": "Wiedza (Spaczeń)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-skull-corked-acid-green.webp",
    "ingredients": [
      {
        "key": "WarpstoneDust",
        "name": "GOLD_ALCHEMY.Ingredients.WarpstoneDust",
        "quantity": 1,
        "costZK": 10
      },
      {
        "key": "SkavenBlood",
        "name": "GOLD_ALCHEMY.Ingredients.SkavenBlood",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SkavenBrew.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SkavenBrew.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SkavenBrew.Name",
      "icon": "icons/consumables/potions/bottle-skull-corked-acid-green.webp",
      "changes": [
        {
          "key": "system.characteristics.s.modifier",
          "mode": 2,
          "value": "30"
        },
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "30"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "deleteEffect",
            "script": "const test = await this.actor.setupSkill(game.i18n.localize(\"NAME.Endurance\"), { appendTitle: ` – ${this.effect.name}`, skipTargets: true });\nif (!test) return;\nawait test.roll();\nif (test.failed) {\n  await this.actor.addCondition(\"poisoned\");\n  await this.actor.addCondition(\"bleeding\");\n  if (Number(test.result.SL) <= -6) await this.actor.addCondition(\"ablaze\");\n}"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "2d10",
            "units": "rounds",
            "multiplier": 1,
            "minusTB": true
          }
        }
      }
    },
    "volatility": "extreme",
    "creationTimeDays": 7
  }
,
  {
    "id": "potion-reactionary-restorative",
    "key": "ReactionaryRestorative",
    "name": "GOLD_ALCHEMY.Recipes.ReactionaryRestorative.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-starter-set",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-flask-stoppered-orange.webp",
    "ingredients": [
      {
        "key": "GingersnapRoot",
        "name": "GOLD_ALCHEMY.Ingredients.GingersnapRoot",
        "quantity": 2,
        "costZK": 0.75
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ReactionaryRestorative.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ReactionaryRestorative.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ReactionaryRestorative.Name",
      "icon": "icons/consumables/potions/bottle-flask-stoppered-orange.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "if (this.actor.hasCondition(\"surprised\")) {\n  this.actor.removeCondition(\"surprised\");\n}"
          },
          {
            "label": "@effect.name",
            "trigger": "deleteEffect",
            "script": "this.actor.addCondition(\"fatigued\", 1);"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 20,
    "availability": "scarce"
  }
,
  {
    "id": "potion-focusing-philtre",
    "key": "FocusingPhiltre",
    "name": "GOLD_ALCHEMY.Recipes.FocusingPhiltre.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-starter-set",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-bulb-corked-blue.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.FocusingPhiltre.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.FocusingPhiltre.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.FocusingPhiltre.Name",
      "icon": "icons/consumables/potions/bottle-bulb-corked-blue.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return args.characteristic == \"int\" || [\"Endurance\", \"Odporność\"].some(n => (args.skill?.name || \"\").startsWith(n));",
              "hideScript": "return !(args.characteristic == \"int\" || [\"Endurance\", \"Odporność\"].some(n => (args.skill?.name || \"\").startsWith(n)));"
            }
          },
          {
            "label": "@effect.name",
            "trigger": "deleteEffect",
            "script": "this.actor.addCondition(\"fatigued\", 1);"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 3600
          }
        }
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 5,
    "availability": "scarce"
  }
,
  {
    "id": "potion-tonic-sight",
    "key": "TonicSight",
    "name": "GOLD_ALCHEMY.Recipes.TonicSight.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-starter-set",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-bottle-corked-glowing-yellow.webp",
    "ingredients": [
      {
        "key": "EaglesEye",
        "name": "GOLD_ALCHEMY.Ingredients.EaglesEye",
        "quantity": 1,
        "costZK": 2.0
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.TonicSight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.TonicSight.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.TonicSight.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-glowing-yellow.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "immediate",
            "script": "const pick = async uuid => { const s = await fromUuid(uuid); if (!s) return null; const d = s.toObject(); delete d._id; return d; };\nconst roll = (await new Roll(\"1d10\").roll()).total;\nconst all = [\"Compendium.wfrp4e-core.items.9h82z72XGo9tfgQS\", \"Compendium.wfrp4e-core.items.Nj3tC8A5fZ3zEdMR\", \"Compendium.wfrp4e-core.items.6w30u0VPsAicrqb5\", \"Compendium.wfrp4e-core.items.OEjUvJKi0xmBwbS2\"];\nconst chosen = roll >= 9 ? all : [all[Math.floor((roll - 1) / 2)]];\nconst items = (await Promise.all(chosen.map(pick))).filter(Boolean);\nif (items[0] && chosen[0] === all[0]) items[0].name += \" (Wzrok)\";\nthis.script.message(`Tonik: wynik ${roll} – ${items.map(i => i.name).join(\", \") || \"brak kompendium core\"}`);\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      },
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "seconds",
            "multiplier": 60
          }
        }
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 10,
    "availability": "scarce"
  }
,
  {
    "id": "potion-cordelia-restorative",
    "key": "CordeliaRestorative",
    "name": "GOLD_ALCHEMY.Recipes.CordeliaRestorative.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-ua1",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 7,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-teal.webp",
    "ingredients": [
      {
        "key": "Valerian",
        "name": "GOLD_ALCHEMY.Ingredients.Valerian",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.CordeliaRestorative.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.CordeliaRestorative.Effect",
    "instantEffect": "cordeliaHeal",
    "volatility": "major",
    "creationTimeDays": 7,
    "listPriceSS": 15,
    "availability": "scarce"
  }
,
  {
    "id": "potion-troll-acid",
    "key": "TrollAcid",
    "name": "GOLD_ALCHEMY.Recipes.TrollAcid.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-zoo",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 120,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/bottle-flask-stoppered-frothing-green.webp",
    "ingredients": [
      {
        "key": "AquaRegia",
        "name": "GOLD_ALCHEMY.Ingredients.DragonAcid",
        "quantity": 2,
        "costZK": 4
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Brimstone",
        "quantity": 2,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.TrollAcid.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.TrollAcid.Effect",
    "instantEffect": "trollAcidSplash",
    "volatility": "major",
    "creationTimeDays": 2,
    "listPriceSS": 60,
    "availability": "rare"
  }
,
  {
    "id": "potion-vein-powder",
    "key": "VeinPowder",
    "name": "GOLD_ALCHEMY.Recipes.VeinPowder.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-zoo",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 1,
    "bonusDaysPerSL": 0,
    "img": "icons/consumables/potions/bottle-flask-corked-purple.webp",
    "ingredients": [
      {
        "key": "ActivatedCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.ActivatedCharcoal",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.VeinPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.VeinPowder.Effect",
    "volatility": "moderate",
    "creationTimeDays": 7,
    "listPriceSS": 20,
    "availability": "rare",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.VeinPowder.Name",
      "icon": "icons/consumables/potions/bottle-flask-corked-purple.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "endRound",
            "script": "this.actor.removeCondition(\"bleeding\");"
          }
        ]
      }
    }
  },
  {
    "id": "potion-chamon-quicksilver-mind",
    "sourceModule": "wfrp4e-alchemy",
    "key": "QuicksilverMind",
    "name": "GOLD_ALCHEMY.Recipes.QuicksilverMind.Name",
    "category": "college-chamon",
    "college": "chamon",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Chamon)",
    "fallbackSkill": "Rzemiosło (Alchemik)",
    "volatility": "moderate",
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-yellow.webp",
    "ingredients": [
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3.0
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.QuicksilverMind.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.QuicksilverMind.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.QuicksilverMind.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-yellow.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.slBonus += 1;",
            "options": {
              "activateScript": "return [\"int\"].includes(args.characteristic);",
              "hideScript": "return ![\"int\"].includes(args.characteristic);"
            }
          }
        ]
      }
    }
  }
];
