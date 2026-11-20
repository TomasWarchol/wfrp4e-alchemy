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
        "costZK": 5
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5
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
        "costZK": 4
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 2,
        "costZK": 3
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
        "costZK": 5
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
        "costZK": 3
      },
      {
        "key": "GriffinDown",
        "name": "GOLD_ALCHEMY.Ingredients.GriffinDown",
        "quantity": 1,
        "costZK": 4
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
        "costZK": 1
      },
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
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
        "costZK": 3
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
    "volatility": "moderate",
    "blast": 4
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
        "costZK": 4
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
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "applyDamage",
            "script": "if (args.sourceItem?.type != \"weapon\" || !args.sourceItem.system.isMelee) return;\nawait args.actor.addCondition(\"ablaze\");\nargs.extraMessages.push(`<strong>${this.effect.name}</strong>: ${game.i18n.localize(\"GOLD_ALCHEMY.Effects.FlamingWeaponHit\")}`);"
          }
        ]
      }
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
        "costZK": 1
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
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 100;",
            "options": {
              "activateScript": "return !!args.extendedTest?.flags?.wfrp4e?.fear;",
              "hideScript": "return !args.extendedTest?.flags?.wfrp4e?.fear;"
            }
          }
        ]
      }
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
        "costZK": 6
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
        "costZK": 3
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
            "script": "const condition = this.actor.hasCondition(\"surprised\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
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
        "costZK": 3
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3
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
        "costZK": 3
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
        "costZK": 2
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
        "costZK": 1
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
        "costZK": 5
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.PurifiedQuicksilver",
        "quantity": 1,
        "costZK": 3
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
        "costZK": 3
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3
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
        "costZK": 1
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
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 100;",
            "options": {
              "activateScript": "return !!(args.context?.terror || args.extendedTest?.flags?.wfrp4e?.fear);",
              "hideScript": "return !(args.context?.terror || args.extendedTest?.flags?.wfrp4e?.fear);"
            }
          }
        ]
      }
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
        "costZK": 4
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
    "volatility": "major",
    "blast": 2
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
        "costZK": 6
      },
      {
        "key": "MagneticNeedle",
        "name": "GOLD_ALCHEMY.Ingredients.MagneticNeedle",
        "quantity": 1,
        "costZK": 2
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
        "costZK": 2
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
        "costZK": 1
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
        "costZK": 1
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
              "activateScript": "return [\"Animal Care\", \"Opieka nad Zwierzętami\", \"Charm Animal\", \"Zastraszanie Zwierząt\", \"Animal Training\", \"Tresura\", \"Ride\", \"Jeździectwo\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "return ![\"Animal Care\", \"Opieka nad Zwierzętami\", \"Charm Animal\", \"Zastraszanie Zwierząt\", \"Animal Training\", \"Tresura\", \"Ride\", \"Jeździectwo\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
        "costZK": 5
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
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
    "volatility": "moderate",
    "blast": 3
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
              "activateScript": "return [\"Intuition\", \"Intuicja\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "return ![\"Intuition\", \"Intuicja\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
      },
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"poisoned\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
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
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "prePrepareItem",
            "script": "if (args.item.type == \"weapon\" && args.item.system.isMelee && !args.item.system.qualities.value.some(q => q.name == \"magical\")) args.item.system.qualities.value.push({ name: \"magical\" });"
          },
          {
            "label": "@effect.name",
            "trigger": "preApplyDamage",
            "script": "if (args.sourceItem?.type != \"weapon\" || !args.sourceItem.system.isMelee) return;\nif (!args.actor.has(game.i18n.localize(\"NAME.Undead\"))) return;\nargs.damage += 3;\nargs.extraMessages.push(`<strong>${this.effect.name}</strong>: ${game.i18n.localize(\"GOLD_ALCHEMY.Effects.GraveOilHit\")}`);"
          }
        ]
      }
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
      },
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "takeDamage",
            "script": "const wounds = Number(args.actor.system.status.wounds.value) || 0;\nif (wounds > 0 && args.totalWoundLoss >= wounds) {\n  args.totalWoundLoss = wounds - 1;\n  args.extraMessages.push(`<strong>${this.effect.name}</strong>: ${game.i18n.localize(\"GOLD_ALCHEMY.Effects.DeathWardSaved\")}`);\n  this.effect.delete();\n}"
          }
        ]
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
              "activateScript": "return [\"Charm\", \"Charyzma\", \"Entertain\", \"Występy\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "return ![\"Charm\", \"Charyzma\", \"Entertain\", \"Występy\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
              "activateScript": "return [\"Stealth\", \"Skradanie\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "return ![\"Stealth\", \"Skradanie\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
      "changes": [
        {
          "key": "flags.wfrp4e-alchemy.wraithstep",
          "mode": 5,
          "value": "true"
        }
      ],
      "flags": {
        "wfrp4e-alchemy": {
          "durationRoll": {
            "formula": "1d10",
            "units": "rounds",
            "multiplier": 1
          }
        }
      }
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
    "availability": "scarce",
    "blast": 2
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
    "availability": "scarce",
    "blast": 4
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
    "creationTimeDays": 2,
    "blast": 3
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
        "costZK": 1
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
              "activateScript": "const m = !!args.spell || [\"Channelling\", \"Splatanie Magii\", \"Language (Magick)\", \"Język (Magiczny)\", \"Język (Magii)\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }); return !m && [\"int\", \"wp\"].includes(args.characteristic);",
              "hideScript": "const m = !!args.spell || [\"Channelling\", \"Splatanie Magii\", \"Language (Magick)\", \"Język (Magiczny)\", \"Język (Magii)\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }); return m || ![\"int\", \"wp\"].includes(args.characteristic);"
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
              "activateScript": "return [\"Consume Alcohol\", \"Mocna Głowa\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "return ![\"Consume Alcohol\", \"Mocna Głowa\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
        "costZK": 5
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
        "costZK": 2
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
        "costZK": 1
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
              "hideScript": "return ![\"Endurance\", \"Odporność\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });"
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
              "hideScript": "const m = !!args.spell || [\"Channelling\", \"Splatanie Magii\", \"Language (Magick)\", \"Język (Magiczny)\", \"Język (Magii)\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }); return m || ![\"wp\"].includes(args.characteristic);"
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
        "costZK": 1
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
            "script": "const condition = this.actor.hasCondition(\"poisoned\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
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
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "surprised",
        "value": "all"
      }
    ],
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
    "creationTimeDays": 7,
    "addictive": {
      "difficulty": "hard"
    }
  },
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
            "script": "const condition = this.actor.hasCondition(\"surprised\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
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
  },
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
              "activateScript": "const m = !!args.spell || [\"Channelling\", \"Splatanie Magii\", \"Language (Magick)\", \"Język (Magiczny)\", \"Język (Magii)\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }); return !m && args.characteristic == \"int\" || [\"Endurance\", \"Odporność\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); });",
              "hideScript": "const m = !!args.spell || [\"Channelling\", \"Splatanie Magii\", \"Language (Magick)\", \"Język (Magiczny)\", \"Język (Magii)\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }); return !(!m && args.characteristic == \"int\" || [\"Endurance\", \"Odporność\"].some(n => { const s = args.skill?.name || \"\"; return s === n || s.startsWith(n + \" (\"); }));"
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
  },
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
        "costZK": 2
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
  },
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
  },
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
  },
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
        "costZK": 3
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
  },
  {
    "id": "potion-aqshy-hearthfire",
    "key": "AqshyHearthfire",
    "name": "GOLD_ALCHEMY.Recipes.AqshyHearthfire.Name",
    "category": "college-aqshy",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Aqshy)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-orange.webp",
    "ingredients": [
      {
        "key": "CinnabarDust",
        "name": "GOLD_ALCHEMY.Ingredients.CinnabarDust",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "PineResin",
        "name": "GOLD_ALCHEMY.Ingredients.PineResin",
        "quantity": 1,
        "costZK": 0.3
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyHearthfire.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyHearthfire.Effect",
    "college": "aqshy",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyHearthfire.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-orange.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 1
      }
    ],
    "volatility": "minor"
  },
  {
    "id": "potion-aqshy-flame-of-courage",
    "key": "AqshyFlameOfCourage",
    "name": "GOLD_ALCHEMY.Recipes.AqshyFlameOfCourage.Name",
    "category": "college-aqshy",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Aqshy)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
    "ingredients": [
      {
        "key": "SalamanderEssence",
        "name": "GOLD_ALCHEMY.Ingredients.SalamanderEssence",
        "quantity": 1,
        "costZK": 4
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
    "description": "GOLD_ALCHEMY.Recipes.AqshyFlameOfCourage.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyFlameOfCourage.Effect",
    "college": "aqshy",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyFlameOfCourage.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Cool\",\"Opanowanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Cool\",\"Opanowanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "broken",
        "value": "all"
      }
    ],
    "volatility": "moderate"
  },
  {
    "id": "potion-aqshy-furnace-blood",
    "key": "AqshyFurnaceBlood",
    "name": "GOLD_ALCHEMY.Recipes.AqshyFurnaceBlood.Name",
    "category": "college-aqshy",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Aqshy)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-red-glow.webp",
    "ingredients": [
      {
        "key": "SalamanderEssence",
        "name": "GOLD_ALCHEMY.Ingredients.SalamanderEssence",
        "quantity": 2,
        "costZK": 4
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "IronFilings",
        "name": "GOLD_ALCHEMY.Ingredients.IronFilings",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AqshyFurnaceBlood.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AqshyFurnaceBlood.Effect",
    "college": "aqshy",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AqshyFurnaceBlood.Name",
      "icon": "icons/consumables/potions/flask-corked-red-glow.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.s.modifier",
          "mode": 2,
          "value": "10"
        },
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
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"ablaze\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-azyr-skyward-eye",
    "key": "AzyrSkywardEye",
    "name": "GOLD_ALCHEMY.Recipes.AzyrSkywardEye.Name",
    "category": "college-azyr",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Azyr)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flask-corked-cyan.webp",
    "ingredients": [
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "MeteoricSilver",
        "name": "GOLD_ALCHEMY.Ingredients.MeteoricSilver",
        "quantity": 1,
        "costZK": 6
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrSkywardEye.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrSkywardEye.Effect",
    "college": "azyr",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrSkywardEye.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-cyan.webp",
      "changes": [
        {
          "key": "system.characteristics.bs.modifier",
          "mode": 2,
          "value": "10"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      },
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
    "volatility": "moderate"
  },
  {
    "id": "potion-azyr-augury",
    "key": "AzyrAugury",
    "name": "GOLD_ALCHEMY.Recipes.AzyrAugury.Name",
    "category": "college-azyr",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Azyr)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-faceted-corked-blue.webp",
    "ingredients": [
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrAugury.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrAugury.Effect",
    "college": "azyr",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrAugury.Name",
      "icon": "icons/consumables/potions/potion-faceted-corked-blue.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Perception\",\"Percepcja\",\"Intuition\",\"Intuicja\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Perception\",\"Percepcja\",\"Intuition\",\"Intuicja\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-azyr-star-compass",
    "key": "AzyrStarCompass",
    "name": "GOLD_ALCHEMY.Recipes.AzyrStarCompass.Name",
    "category": "college-azyr",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Azyr)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-conical-corked-tied-blue.webp",
    "ingredients": [
      {
        "key": "MagneticNeedle",
        "name": "GOLD_ALCHEMY.Ingredients.MagneticNeedle",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AzyrStarCompass.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AzyrStarCompass.Effect",
    "college": "azyr",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AzyrStarCompass.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-tied-blue.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Navigation\",\"Nawigacja\",\"Outdoor Survival\",\"Sztuka Przetrwania\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Navigation\",\"Nawigacja\",\"Outdoor Survival\",\"Sztuka Przetrwania\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-chamon-assayers-eye",
    "key": "ChamonAssayersEye",
    "name": "GOLD_ALCHEMY.Recipes.ChamonAssayersEye.Name",
    "category": "college-chamon",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Chamon)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-bottle-corked-stopper-ornate-yellow.webp",
    "ingredients": [
      {
        "key": "GoldDust",
        "name": "GOLD_ALCHEMY.Ingredients.GoldDust",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "Mercury",
        "name": "GOLD_ALCHEMY.Ingredients.Mercury",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ChamonAssayersEye.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ChamonAssayersEye.Effect",
    "college": "chamon",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ChamonAssayersEye.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-stopper-ornate-yellow.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 30;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Evaluate\",\"Wycena\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Evaluate\",\"Wycena\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-chamon-leaden-ward",
    "key": "ChamonLeadenWard",
    "name": "GOLD_ALCHEMY.Recipes.ChamonLeadenWard.Name",
    "category": "college-chamon",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Chamon)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-metal-yellow-gray.webp",
    "ingredients": [
      {
        "key": "LeadSediment",
        "name": "GOLD_ALCHEMY.Ingredients.LeadSediment",
        "quantity": 2,
        "costZK": 1
      },
      {
        "key": "IronFilings",
        "name": "GOLD_ALCHEMY.Ingredients.IronFilings",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "AquaRegia",
        "name": "GOLD_ALCHEMY.Ingredients.AquaRegia",
        "quantity": 1,
        "costZK": 4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ChamonLeadenWard.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ChamonLeadenWard.Effect",
    "college": "chamon",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ChamonLeadenWard.Name",
      "icon": "icons/consumables/potions/bottle-metal-yellow-gray.webp",
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
            "trigger": "APCalc",
            "script": "for (const loc of [\"head\", \"body\", \"lArm\", \"rArm\", \"lLeg\", \"rLeg\"]) {\n  if (!args.AP[loc]) continue;\n  args.AP[loc].value += 1;\n  args.AP[loc].layers.push({ value: 1, source: { name: this.effect.name }, magical: true, metal: false, impenetrable: false, partial: false, weakpoints: false });\n}"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-ghyran-bloom-balm",
    "key": "GhyranBloomBalm",
    "name": "GOLD_ALCHEMY.Recipes.GhyranBloomBalm.Name",
    "category": "college-ghyran",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghyran)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-jar-corked-green.webp",
    "ingredients": [
      {
        "key": "SpringDew",
        "name": "GOLD_ALCHEMY.Ingredients.SpringDew",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "OakSap",
        "name": "GOLD_ALCHEMY.Ingredients.OakSap",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranBloomBalm.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranBloomBalm.Effect",
    "college": "ghyran",
    "fallbackSkill": "Splatanie Magii",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "heal": "2tb"
      },
      {
        "remove": "bleeding",
        "value": 1
      }
    ],
    "volatility": "moderate"
  },
  {
    "id": "potion-ghyran-greenward",
    "key": "GhyranGreenward",
    "name": "GOLD_ALCHEMY.Recipes.GhyranGreenward.Name",
    "category": "college-ghyran",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ghyran)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-label-cork-green.webp",
    "ingredients": [
      {
        "key": "SpringDew",
        "name": "GOLD_ALCHEMY.Ingredients.SpringDew",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranGreenward.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranGreenward.Effect",
    "college": "ghyran",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhyranGreenward.Name",
      "icon": "icons/consumables/potions/bottle-round-label-cork-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"poisoned\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-ghyran-oaks-patience",
    "key": "GhyranOaksPatience",
    "name": "GOLD_ALCHEMY.Recipes.GhyranOaksPatience.Name",
    "category": "college-ghyran",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Ghyran)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flask-corked-capped-green.webp",
    "ingredients": [
      {
        "key": "Ironbark",
        "name": "GOLD_ALCHEMY.Ingredients.Ironbark",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "OakSap",
        "name": "GOLD_ALCHEMY.Ingredients.OakSap",
        "quantity": 2,
        "costZK": 1.5
      },
      {
        "key": "SpringDew",
        "name": "GOLD_ALCHEMY.Ingredients.SpringDew",
        "quantity": 1,
        "costZK": 3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhyranOaksPatience.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhyranOaksPatience.Effect",
    "college": "ghyran",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhyranOaksPatience.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-capped-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "volatility": "major"
  },
  {
    "id": "potion-ghur-stag-leap",
    "key": "GhurStagLeap",
    "name": "GOLD_ALCHEMY.Recipes.GhurStagLeap.Name",
    "category": "college-ghur",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ghur)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-corked-red.webp",
    "ingredients": [
      {
        "key": "BeastFangs",
        "name": "GOLD_ALCHEMY.Ingredients.BeastFangs",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "WolfEye",
        "name": "GOLD_ALCHEMY.Ingredients.WolfEye",
        "quantity": 1,
        "costZK": 1.75
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurStagLeap.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurStagLeap.Effect",
    "college": "ghur",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurStagLeap.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-red.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Athletics\",\"Atletyka\",\"Climb\",\"Wspinaczka\",\"Swim\",\"Pływanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Athletics\",\"Atletyka\",\"Climb\",\"Wspinaczka\",\"Swim\",\"Pływanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ghur-boarhide",
    "key": "GhurBoarhide",
    "name": "GOLD_ALCHEMY.Recipes.GhurBoarhide.Name",
    "category": "college-ghur",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Ghur)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-jug-corked-skull-poison-brown-green.webp",
    "ingredients": [
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      },
      {
        "key": "BearClaw",
        "name": "GOLD_ALCHEMY.Ingredients.BearClaw",
        "quantity": 1,
        "costZK": 2.25
      },
      {
        "key": "BeastFangs",
        "name": "GOLD_ALCHEMY.Ingredients.BeastFangs",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurBoarhide.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurBoarhide.Effect",
    "college": "ghur",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurBoarhide.Name",
      "icon": "icons/consumables/potions/potion-jug-corked-skull-poison-brown-green.webp",
      "duration": {
        "seconds": 600
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
            "trigger": "APCalc",
            "script": "for (const loc of [\"head\", \"body\", \"lArm\", \"rArm\", \"lLeg\", \"rLeg\"]) {\n  if (!args.AP[loc]) continue;\n  args.AP[loc].value += 1;\n  args.AP[loc].layers.push({ value: 1, source: { name: this.effect.name }, magical: true, metal: false, impenetrable: false, partial: false, weakpoints: false });\n}"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-ghur-pack-howl",
    "key": "GhurPackHowl",
    "name": "GOLD_ALCHEMY.Recipes.GhurPackHowl.Name",
    "category": "college-ghur",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ghur)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-round-label-cork-red.webp",
    "ingredients": [
      {
        "key": "WolfEye",
        "name": "GOLD_ALCHEMY.Ingredients.WolfEye",
        "quantity": 1,
        "costZK": 1.75
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GhurPackHowl.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GhurPackHowl.Effect",
    "college": "ghur",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GhurPackHowl.Name",
      "icon": "icons/consumables/potions/bottle-round-label-cork-red.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Intimidate\",\"Zastraszanie\",\"Charm Animal\",\"Oswajanie\",\"Zastraszanie Zwierząt\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Intimidate\",\"Zastraszanie\",\"Charm Animal\",\"Oswajanie\",\"Zastraszanie Zwierząt\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-hysh-dawnlight",
    "key": "HyshDawnlight",
    "name": "GOLD_ALCHEMY.Recipes.HyshDawnlight.Name",
    "category": "college-hysh",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Hysh)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-bottle-corked-white.webp",
    "ingredients": [
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshDawnlight.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshDawnlight.Effect",
    "college": "hysh",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.HyshDawnlight.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-white.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"blinded\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "blinded",
        "value": "all"
      }
    ],
    "volatility": "minor"
  },
  {
    "id": "potion-hysh-lantern-eyes",
    "key": "HyshLanternEyes",
    "name": "GOLD_ALCHEMY.Recipes.HyshLanternEyes.Name",
    "category": "college-hysh",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Hysh)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flask-corked-yellow.webp",
    "ingredients": [
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "RoseWater",
        "name": "GOLD_ALCHEMY.Ingredients.RoseWater",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshLanternEyes.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshLanternEyes.Effect",
    "college": "hysh",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.HyshLanternEyes.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-yellow.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-hysh-banishing-phial",
    "key": "HyshBanishingPhial",
    "name": "GOLD_ALCHEMY.Recipes.HyshBanishingPhial.Name",
    "category": "college-hysh",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Hysh)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flash-open-blue.webp",
    "ingredients": [
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "WhitePhosphorus",
        "name": "GOLD_ALCHEMY.Ingredients.WhitePhosphorus",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HyshBanishingPhial.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HyshBanishingPhial.Effect",
    "college": "hysh",
    "fallbackSkill": "Splatanie Magii",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "damage": 4,
        "perSL": true,
        "ignoreAP": true
      },
      {
        "add": "blinded",
        "value": 1,
        "resist": {
          "test": "dodge",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "major"
  },
  {
    "id": "potion-shyish-morrs-quiet",
    "key": "ShyishMorrsQuiet",
    "name": "GOLD_ALCHEMY.Recipes.ShyishMorrsQuiet.Name",
    "category": "college-shyish",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Shyish)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-bottle-labeled-stopped-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "HourglassSand",
        "name": "GOLD_ALCHEMY.Ingredients.HourglassSand",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishMorrsQuiet.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishMorrsQuiet.Effect",
    "college": "shyish",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishMorrsQuiet.Name",
      "icon": "icons/consumables/potions/potion-bottle-labeled-stopped-purple.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"stunned\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "stunned",
        "value": "all"
      }
    ],
    "volatility": "moderate"
  },
  {
    "id": "potion-shyish-memento-mori",
    "key": "ShyishMementoMori",
    "name": "GOLD_ALCHEMY.Recipes.ShyishMementoMori.Name",
    "category": "college-shyish",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Shyish)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-ornate-bat-teal.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "HourglassSand",
        "name": "GOLD_ALCHEMY.Ingredients.HourglassSand",
        "quantity": 2,
        "costZK": 2.5
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishMementoMori.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishMementoMori.Effect",
    "college": "shyish",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishMementoMori.Name",
      "icon": "icons/consumables/potions/bottle-ornate-bat-teal.webp",
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
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"broken\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "volatility": "major"
  },
  {
    "id": "potion-shyish-soul-lantern",
    "key": "ShyishSoulLantern",
    "name": "GOLD_ALCHEMY.Recipes.ShyishSoulLantern.Name",
    "category": "college-shyish",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Shyish)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-tube-corked-labeled-cyan.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "CrystalPrism",
        "name": "GOLD_ALCHEMY.Ingredients.CrystalPrism",
        "quantity": 1,
        "costZK": 4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ShyishSoulLantern.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ShyishSoulLantern.Effect",
    "college": "shyish",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ShyishSoulLantern.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-labeled-cyan.webp",
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
              "activateScript": "return [\"wp\"].includes(args.characteristic);",
              "hideScript": "return ![\"wp\"].includes(args.characteristic);"
            }
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-ulgu-thiefs-fingers",
    "key": "UlguThiefsFingers",
    "name": "GOLD_ALCHEMY.Recipes.UlguThiefsFingers.Name",
    "category": "college-ulgu",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii (Ulgu)",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-conical-corked-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguThiefsFingers.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguThiefsFingers.Effect",
    "college": "ulgu",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.UlguThiefsFingers.Name",
      "icon": "icons/consumables/potions/bottle-conical-corked-purple.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Sleight of Hand\",\"Zwinne Palce\",\"Pick Lock\",\"Otwieranie Zamków\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Sleight of Hand\",\"Zwinne Palce\",\"Pick Lock\",\"Otwieranie Zamków\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-ulgu-shadowcloak",
    "key": "UlguShadowcloak",
    "name": "GOLD_ALCHEMY.Recipes.UlguShadowcloak.Name",
    "category": "college-ulgu",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 3,
    "testSkill": "Splatanie Magii (Ulgu)",
    "difficulty": -20,
    "shelfLifeDays": 60,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-corked-purple-glow.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "Lampblack",
        "name": "GOLD_ALCHEMY.Ingredients.Lampblack",
        "quantity": 1,
        "costZK": 0.15
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguShadowcloak.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguShadowcloak.Effect",
    "college": "ulgu",
    "fallbackSkill": "Splatanie Magii",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.UlguShadowcloak.Name",
      "icon": "icons/consumables/potions/flask-corked-purple-glow.webp",
      "changes": [
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
            "trigger": "dialog",
            "script": "args.fields.modifier += 30;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      },
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
    "volatility": "major"
  },
  {
    "id": "potion-ulgu-bewildering-dust",
    "key": "UlguBewilderingDust",
    "name": "GOLD_ALCHEMY.Recipes.UlguBewilderingDust.Name",
    "category": "college-ulgu",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii (Ulgu)",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/weapons/thrown/bomb-gas-grey-purple.webp",
    "ingredients": [
      {
        "key": "GraveDust",
        "name": "GOLD_ALCHEMY.Ingredients.GraveDust",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.UlguBewilderingDust.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.UlguBewilderingDust.Effect",
    "college": "ulgu",
    "fallbackSkill": "Splatanie Magii",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "stunned",
        "value": 1,
        "resist": {
          "test": "endurance",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "moderate",
    "blast": 2
  },
  {
    "id": "potion-aethyric-salts",
    "key": "AethyricSalts",
    "name": "GOLD_ALCHEMY.Recipes.AethyricSalts.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-conical-bubbling-blue.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "AmmoniaSalts",
        "name": "GOLD_ALCHEMY.Ingredients.AmmoniaSalts",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AethyricSalts.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AethyricSalts.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AethyricSalts.Name",
      "icon": "icons/consumables/potions/bottle-conical-bubbling-blue.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Channelling\",\"Splatanie Magii\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Channelling\",\"Splatanie Magii\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-warding-draught",
    "key": "WardingDraught",
    "name": "GOLD_ALCHEMY.Recipes.WardingDraught.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "FourLeafClover",
        "name": "GOLD_ALCHEMY.Ingredients.FourLeafClover",
        "quantity": 1,
        "costZK": 2.5
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WardingDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WardingDraught.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WardingDraught.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "return [\"wp\"].includes(args.characteristic);",
              "hideScript": "return ![\"wp\"].includes(args.characteristic);"
            }
          }
        ]
      }
    },
    "volatility": "moderate"
  },
  {
    "id": "potion-quietmind-elixir",
    "key": "QuietmindElixir",
    "name": "GOLD_ALCHEMY.Recipes.QuietmindElixir.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/bottle-pear-corked-blue.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.QuietmindElixir.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.QuietmindElixir.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.QuietmindElixir.Name",
      "icon": "icons/consumables/potions/bottle-pear-corked-blue.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Language (Magick)\",\"Język (Magiczny)\",\"Język (Magii)\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Language (Magick)\",\"Język (Magiczny)\",\"Język (Magii)\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-aethyric-steadiness",
    "key": "AethyricSteadiness",
    "name": "GOLD_ALCHEMY.Recipes.AethyricSteadiness.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 2,
    "testSkill": "Splatanie Magii",
    "difficulty": -10,
    "shelfLifeDays": 45,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-jar-corked-glowing-blue.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "WindStone",
        "name": "GOLD_ALCHEMY.Ingredients.WindStone",
        "quantity": 1,
        "costZK": 3
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.AethyricSteadiness.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.AethyricSteadiness.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.AethyricSteadiness.Name",
      "icon": "icons/consumables/potions/potion-jar-corked-glowing-blue.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"fatigued\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": "all"
      }
    ],
    "volatility": "moderate"
  },
  {
    "id": "potion-wisp-phial",
    "key": "WispPhial",
    "name": "GOLD_ALCHEMY.Recipes.WispPhial.Name",
    "category": "magical",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 1,
    "testSkill": "Splatanie Magii",
    "difficulty": 0,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-round-corked-glowing-green.webp",
    "ingredients": [
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      },
      {
        "key": "WhitePhosphorus",
        "name": "GOLD_ALCHEMY.Ingredients.WhitePhosphorus",
        "quantity": 1,
        "costZK": 2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WispPhial.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WispPhial.Effect",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WispPhial.Name",
      "icon": "icons/consumables/potions/potion-round-corked-glowing-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += -30;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor"
  },
  {
    "id": "potion-thunder-jar",
    "key": "ThunderJar",
    "name": "GOLD_ALCHEMY.Recipes.ThunderJar.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/bomb-fuse-brown.webp",
    "ingredients": [
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 2,
        "costZK": 0.75
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ThunderJar.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ThunderJar.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "deafened",
        "value": 1,
        "perSL": true,
        "resist": {
          "test": "endurance",
          "difficulty": "challenging"
        }
      },
      {
        "damage": 2
      }
    ],
    "volatility": "major",
    "creationTimeDays": 2,
    "blast": 3
  },
  {
    "id": "potion-tar-bomb",
    "key": "TarBomb",
    "name": "GOLD_ALCHEMY.Recipes.TarBomb.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/bomb-fuse-black.webp",
    "ingredients": [
      {
        "key": "WoodTar",
        "name": "GOLD_ALCHEMY.Ingredients.WoodTar",
        "quantity": 2,
        "costZK": 0.4
      },
      {
        "key": "PineResin",
        "name": "GOLD_ALCHEMY.Ingredients.PineResin",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.TarBomb.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.TarBomb.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "entangled",
        "value": 1,
        "perSL": true
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-quicklime-pouch",
    "key": "QuicklimePouch",
    "name": "GOLD_ALCHEMY.Recipes.QuicklimePouch.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/bomb-fuse-cloth-pink.webp",
    "ingredients": [
      {
        "key": "Quicklime",
        "name": "GOLD_ALCHEMY.Ingredients.Quicklime",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "WillowCharcoal",
        "name": "GOLD_ALCHEMY.Ingredients.WillowCharcoal",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.QuicklimePouch.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.QuicklimePouch.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "blinded",
        "value": 1,
        "perSL": true,
        "resist": {
          "test": "dodge",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 2,
    "blast": 2
  },
  {
    "id": "potion-stinkpot",
    "key": "Stinkpot",
    "name": "GOLD_ALCHEMY.Recipes.Stinkpot.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/grenade-chemical-gas.webp",
    "ingredients": [
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 2,
        "costZK": 0.5
      },
      {
        "key": "Garlic",
        "name": "GOLD_ALCHEMY.Ingredients.Garlic",
        "quantity": 2,
        "costZK": 0.1
      },
      {
        "key": "WineVinegar",
        "name": "GOLD_ALCHEMY.Ingredients.WineVinegar",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Stinkpot.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Stinkpot.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeCloud",
    "volatility": "moderate",
    "creationTimeDays": 2
  },
  {
    "id": "potion-nightblack",
    "key": "Nightblack",
    "name": "GOLD_ALCHEMY.Recipes.Nightblack.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-bottle-corked-blue.webp",
    "ingredients": [
      {
        "key": "Lampblack",
        "name": "GOLD_ALCHEMY.Ingredients.Lampblack",
        "quantity": 2,
        "costZK": 0.15
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Nightblack.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Nightblack.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.Nightblack.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-blue.webp",
      "duration": {
        "seconds": 14400
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Stealth\",\"Skradanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-keen-edge-oil",
    "key": "KeenEdgeOil",
    "name": "GOLD_ALCHEMY.Recipes.KeenEdgeOil.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/bottle-round-label-cork-yellow.webp",
    "ingredients": [
      {
        "key": "RockOil",
        "name": "GOLD_ALCHEMY.Ingredients.RockOil",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.KeenEdgeOil.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.KeenEdgeOil.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.KeenEdgeOil.Name",
      "icon": "icons/consumables/potions/bottle-round-label-cork-yellow.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Melee\",\"Broń Biała\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Melee\",\"Broń Biała\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-steadyhand-drops",
    "key": "SteadyhandDrops",
    "name": "GOLD_ALCHEMY.Recipes.SteadyhandDrops.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-tube-corked-blue.webp",
    "ingredients": [
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "KavehBeans",
        "name": "GOLD_ALCHEMY.Ingredients.KavehBeans",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SteadyhandDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SteadyhandDrops.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SteadyhandDrops.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-blue.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.bs.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.characteristics.fel.modifier",
          "mode": 2,
          "value": "-5"
        }
      ]
    },
    "volatility": "moderate",
    "creationTimeDays": 2
  },
  {
    "id": "potion-fireproof-salve",
    "key": "FireproofSalve",
    "name": "GOLD_ALCHEMY.Recipes.FireproofSalve.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-jar-corked-orange.webp",
    "ingredients": [
      {
        "key": "Alum",
        "name": "GOLD_ALCHEMY.Ingredients.Alum",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.FireproofSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.FireproofSalve.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.FireproofSalve.Name",
      "icon": "icons/consumables/potions/potion-jar-corked-orange.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "startRound",
            "script": "if (this.actor.hasCondition(\"ablaze\")) await this.actor.removeCondition(\"ablaze\", 1);"
          }
        ]
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 2
  },
  {
    "id": "potion-miners-powder",
    "key": "MinersPowder",
    "name": "GOLD_ALCHEMY.Recipes.MinersPowder.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/dynamite-simple-brown.webp",
    "ingredients": [
      {
        "key": "Saltpeter",
        "name": "GOLD_ALCHEMY.Ingredients.Saltpeter",
        "quantity": 2,
        "costZK": 0.75
      },
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
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MinersPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MinersPowder.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "damage": 6,
        "perSL": true
      },
      {
        "add": "prone",
        "value": 1
      }
    ],
    "volatility": "extreme",
    "creationTimeDays": 2,
    "blast": 5
  },
  {
    "id": "potion-glowworm-phial",
    "key": "GlowwormPhial",
    "name": "GOLD_ALCHEMY.Recipes.GlowwormPhial.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-tube-corked-bubbling-green.webp",
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
        "costZK": 0.9
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GlowwormPhial.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GlowwormPhial.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-etching-acid",
    "key": "EtchingAcid",
    "name": "GOLD_ALCHEMY.Recipes.EtchingAcid.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -10,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/bottle-conical-corked-labeled-skull-poison-green.webp",
    "ingredients": [
      {
        "key": "WineVinegar",
        "name": "GOLD_ALCHEMY.Ingredients.WineVinegar",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "AquaRegia",
        "name": "GOLD_ALCHEMY.Ingredients.AquaRegia",
        "quantity": 1,
        "costZK": 4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.EtchingAcid.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.EtchingAcid.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "damage": 3,
        "perSL": true,
        "ignoreAP": true
      }
    ],
    "volatility": "moderate",
    "creationTimeDays": 2
  },
  {
    "id": "potion-climbers-resin",
    "key": "ClimbersResin",
    "name": "GOLD_ALCHEMY.Recipes.ClimbersResin.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-jar-capped-teal.webp",
    "ingredients": [
      {
        "key": "PineResin",
        "name": "GOLD_ALCHEMY.Ingredients.PineResin",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ClimbersResin.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ClimbersResin.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ClimbersResin.Name",
      "icon": "icons/consumables/potions/potion-jar-capped-teal.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Climb\",\"Wspinaczka\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Climb\",\"Wspinaczka\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-sneezing-powder",
    "key": "SneezingPowder",
    "name": "GOLD_ALCHEMY.Recipes.SneezingPowder.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/weapons/thrown/bomb-fuse-pink.webp",
    "ingredients": [
      {
        "key": "MustardSeed",
        "name": "GOLD_ALCHEMY.Ingredients.MustardSeed",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "Quicklime",
        "name": "GOLD_ALCHEMY.Ingredients.Quicklime",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SneezingPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SneezingPowder.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "stunned",
        "value": 1,
        "resist": {
          "test": "endurance",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 2,
    "blast": 2
  },
  {
    "id": "potion-sympathetic-ink",
    "key": "SympatheticInk",
    "name": "GOLD_ALCHEMY.Recipes.SympatheticInk.Name",
    "category": "mundane",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": 0,
    "shelfLifeDays": 180,
    "bonusDaysPerSL": 20,
    "img": "icons/consumables/potions/potion-bottle-corked-white.webp",
    "ingredients": [
      {
        "key": "WineVinegar",
        "name": "GOLD_ALCHEMY.Ingredients.WineVinegar",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "Lampblack",
        "name": "GOLD_ALCHEMY.Ingredients.Lampblack",
        "quantity": 1,
        "costZK": 0.15
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SympatheticInk.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SympatheticInk.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "volatility": "minor",
    "creationTimeDays": 2
  },
  {
    "id": "potion-willowbark-powder",
    "key": "WillowbarkPowder",
    "name": "GOLD_ALCHEMY.Recipes.WillowbarkPowder.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-bottle-labeled-medicine-capped-red-black.webp",
    "ingredients": [
      {
        "key": "WillowBark",
        "name": "GOLD_ALCHEMY.Ingredients.WillowBark",
        "quantity": 2,
        "costZK": 0.25
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WillowbarkPowder.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WillowbarkPowder.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 1
      },
      {
        "test": "endurance",
        "difficulty": "easy",
        "fail": [
          {
            "add": "poisoned",
            "value": 1
          }
        ]
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-yarrow-poultice",
    "key": "YarrowPoultice",
    "name": "GOLD_ALCHEMY.Recipes.YarrowPoultice.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-jar-corked-labeled-red.webp",
    "ingredients": [
      {
        "key": "Yarrow",
        "name": "GOLD_ALCHEMY.Ingredients.Yarrow",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.YarrowPoultice.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.YarrowPoultice.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "bleeding",
        "value": 2
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-feverbreaker",
    "key": "Feverbreaker",
    "name": "GOLD_ALCHEMY.Recipes.Feverbreaker.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/bottle-round-label-cork-blue.webp",
    "ingredients": [
      {
        "key": "WillowBark",
        "name": "GOLD_ALCHEMY.Ingredients.WillowBark",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "ElderFlower",
        "name": "GOLD_ALCHEMY.Ingredients.ElderFlower",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.Feverbreaker.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Feverbreaker.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.Feverbreaker.Name",
      "icon": "icons/consumables/potions/bottle-round-label-cork-blue.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-wakeroot-tea",
    "key": "WakerootTea",
    "name": "GOLD_ALCHEMY.Recipes.WakerootTea.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/bottle-round-corked-yellow.webp",
    "ingredients": [
      {
        "key": "KavehBeans",
        "name": "GOLD_ALCHEMY.Ingredients.KavehBeans",
        "quantity": 2,
        "costZK": 1.25
      },
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WakerootTea.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WakerootTea.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WakerootTea.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-yellow.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [
        {
          "key": "system.characteristics.fel.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-chamomile-calmative",
    "key": "ChamomileCalmative",
    "name": "GOLD_ALCHEMY.Recipes.ChamomileCalmative.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/bottle-pear-corked-labeled-green.webp",
    "ingredients": [
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 2,
        "costZK": 0.2
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ChamomileCalmative.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ChamomileCalmative.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ChamomileCalmative.Name",
      "icon": "icons/consumables/potions/bottle-pear-corked-labeled-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.i.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "broken",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-steady-scalpel",
    "key": "SteadyScalpel",
    "name": "GOLD_ALCHEMY.Recipes.SteadyScalpel.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-flask-stopped-labeled-yellow.webp",
    "ingredients": [
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "LemonBalm",
        "name": "GOLD_ALCHEMY.Ingredients.LemonBalm",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SteadyScalpel.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SteadyScalpel.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SteadyScalpel.Name",
      "icon": "icons/consumables/potions/potion-flask-stopped-labeled-yellow.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Heal\",\"Leczenie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Heal\",\"Leczenie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-coltsfoot-syrup",
    "key": "ColtsfootSyrup",
    "name": "GOLD_ALCHEMY.Recipes.ColtsfootSyrup.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-flask-corked-labeled-pink.webp",
    "ingredients": [
      {
        "key": "Coltsfoot",
        "name": "GOLD_ALCHEMY.Ingredients.Coltsfoot",
        "quantity": 2,
        "costZK": 0.25
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ColtsfootSyrup.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ColtsfootSyrup.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "poisoned",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-slumber-drops",
    "key": "SlumberDrops",
    "name": "GOLD_ALCHEMY.Recipes.SlumberDrops.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-labeled-poison-white.webp",
    "ingredients": [
      {
        "key": "PoppyMilk",
        "name": "GOLD_ALCHEMY.Ingredients.PoppyMilk",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SlumberDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SlumberDrops.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "hard",
        "pass": [
          {
            "add": "fatigued",
            "value": 1
          }
        ],
        "fail": [
          {
            "add": "unconscious",
            "value": 1,
            "duration": {
              "formula": "1d10",
              "units": "hours"
            }
          }
        ]
      }
    ],
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-eyebright-wash",
    "key": "EyebrightWash",
    "name": "GOLD_ALCHEMY.Recipes.EyebrightWash.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-flask-corked-teal.webp",
    "ingredients": [
      {
        "key": "Eyebright",
        "name": "GOLD_ALCHEMY.Ingredients.Eyebright",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "RoseWater",
        "name": "GOLD_ALCHEMY.Ingredients.RoseWater",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.EyebrightWash.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.EyebrightWash.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.EyebrightWash.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-teal.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Perception\",\"Percepcja\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "blinded",
        "value": "all"
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-boneknit-salve",
    "key": "BoneknitSalve",
    "name": "GOLD_ALCHEMY.Recipes.BoneknitSalve.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -10,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-jar-corked-labeled-purple-pink.webp",
    "ingredients": [
      {
        "key": "Comfrey",
        "name": "GOLD_ALCHEMY.Ingredients.Comfrey",
        "quantity": 2,
        "costZK": 0.75
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      },
      {
        "key": "Yarrow",
        "name": "GOLD_ALCHEMY.Ingredients.Yarrow",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.BoneknitSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.BoneknitSalve.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "heal": "1d10"
      },
      {
        "test": "endurance",
        "difficulty": "average",
        "fail": [
          {
            "add": "fatigued",
            "value": 1
          }
        ]
      }
    ],
    "volatility": "moderate",
    "creationTimeDays": 7
  },
  {
    "id": "potion-garlic-tincture",
    "key": "GarlicTincture",
    "name": "GOLD_ALCHEMY.Recipes.GarlicTincture.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/bottle-corked-green.webp",
    "ingredients": [
      {
        "key": "Garlic",
        "name": "GOLD_ALCHEMY.Ingredients.Garlic",
        "quantity": 2,
        "costZK": 0.1
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.GarlicTincture.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.GarlicTincture.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.GarlicTincture.Name",
      "icon": "icons/consumables/potions/bottle-corked-green.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.slBonus += 1;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-poppy-tincture",
    "key": "PoppyTincture",
    "name": "GOLD_ALCHEMY.Recipes.PoppyTincture.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": -20,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-bottle-stopped-labeled-red.webp",
    "ingredients": [
      {
        "key": "PoppyMilk",
        "name": "GOLD_ALCHEMY.Ingredients.PoppyMilk",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PoppyTincture.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PoppyTincture.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.PoppyTincture.Name",
      "icon": "icons/consumables/potions/potion-bottle-stopped-labeled-red.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [
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
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 2
      }
    ],
    "volatility": "major",
    "creationTimeDays": 7,
    "addictive": {
      "difficulty": "challenging"
    }
  },
  {
    "id": "potion-mustard-plaster",
    "key": "MustardPlaster",
    "name": "GOLD_ALCHEMY.Recipes.MustardPlaster.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-jar-corked-orange.webp",
    "ingredients": [
      {
        "key": "MustardSeed",
        "name": "GOLD_ALCHEMY.Ingredients.MustardSeed",
        "quantity": 2,
        "costZK": 0.2
      },
      {
        "key": "WineVinegar",
        "name": "GOLD_ALCHEMY.Ingredients.WineVinegar",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MustardPlaster.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MustardPlaster.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.MustardPlaster.Name",
      "icon": "icons/consumables/potions/potion-jar-corked-orange.webp",
      "duration": {
        "seconds": 14400
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-calming-oil",
    "key": "CalmingOil",
    "name": "GOLD_ALCHEMY.Recipes.CalmingOil.Name",
    "category": "apothecary",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Aptekarstwo)",
    "difficulty": 0,
    "shelfLifeDays": 14,
    "bonusDaysPerSL": 2,
    "img": "icons/consumables/potions/potion-bottle-corked-fancy-orange.webp",
    "ingredients": [
      {
        "key": "LavenderOil",
        "name": "GOLD_ALCHEMY.Ingredients.LavenderOil",
        "quantity": 1,
        "costZK": 0.75
      },
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.CalmingOil.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.CalmingOil.Effect",
    "fallbackSkill": "Rzemiosło (Zielarz)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.CalmingOil.Name",
      "icon": "icons/consumables/potions/potion-bottle-corked-fancy-orange.webp",
      "duration": {
        "seconds": 7200
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Cool\",\"Opanowanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Cool\",\"Opanowanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 7
  },
  {
    "id": "potion-wayfarers-tea",
    "key": "WayfarersTea",
    "name": "GOLD_ALCHEMY.Recipes.WayfarersTea.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-green.webp",
    "ingredients": [
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "JuniperBerries",
        "name": "GOLD_ALCHEMY.Ingredients.JuniperBerries",
        "quantity": 1,
        "costZK": 0.3
      },
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WayfarersTea.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WayfarersTea.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WayfarersTea.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-green.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Outdoor Survival\",\"Sztuka Przetrwania\",\"Track\",\"Tropienie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Outdoor Survival\",\"Sztuka Przetrwania\",\"Track\",\"Tropienie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-nettle-wrap",
    "key": "NettleWrap",
    "name": "GOLD_ALCHEMY.Recipes.NettleWrap.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-jar-corked-green.webp",
    "ingredients": [
      {
        "key": "NettleOil",
        "name": "GOLD_ALCHEMY.Ingredients.NettleOil",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "Plantain",
        "name": "GOLD_ALCHEMY.Ingredients.Plantain",
        "quantity": 1,
        "costZK": 0.15
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.NettleWrap.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.NettleWrap.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "bleeding",
        "value": 1
      },
      {
        "test": "endurance",
        "difficulty": "easy",
        "fail": [
          {
            "add": "poisoned",
            "value": 1
          }
        ]
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-mint-breath",
    "key": "MintBreath",
    "name": "GOLD_ALCHEMY.Recipes.MintBreath.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-pear-corked-pink.webp",
    "ingredients": [
      {
        "key": "MintOil",
        "name": "GOLD_ALCHEMY.Ingredients.MintOil",
        "quantity": 1,
        "costZK": 0.6
      },
      {
        "key": "LemonBalm",
        "name": "GOLD_ALCHEMY.Ingredients.LemonBalm",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MintBreath.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MintBreath.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.MintBreath.Name",
      "icon": "icons/consumables/potions/bottle-pear-corked-pink.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Charm\",\"Charyzma\",\"Gossip\",\"Plotkowanie\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Charm\",\"Charyzma\",\"Gossip\",\"Plotkowanie\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-wormwood-bitters",
    "key": "WormwoodBitters",
    "name": "GOLD_ALCHEMY.Recipes.WormwoodBitters.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/flask-measuring-green.webp",
    "ingredients": [
      {
        "key": "Wormwood",
        "name": "GOLD_ALCHEMY.Ingredients.Wormwood",
        "quantity": 2,
        "costZK": 0.4
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WormwoodBitters.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WormwoodBitters.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WormwoodBitters.Name",
      "icon": "icons/consumables/potions/flask-measuring-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.fel.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "poisoned",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-elderflower-syrup",
    "key": "ElderflowerSyrup",
    "name": "GOLD_ALCHEMY.Recipes.ElderflowerSyrup.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-flask-corked-yellow.webp",
    "ingredients": [
      {
        "key": "ElderFlower",
        "name": "GOLD_ALCHEMY.Ingredients.ElderFlower",
        "quantity": 2,
        "costZK": 0.25
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ElderflowerSyrup.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ElderflowerSyrup.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ElderflowerSyrup.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-yellow.webp",
      "duration": {
        "seconds": 86400
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "5"
        }
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-juniper-smudge",
    "key": "JuniperSmudge",
    "name": "GOLD_ALCHEMY.Recipes.JuniperSmudge.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-flask-fumes-purple.webp",
    "ingredients": [
      {
        "key": "JuniperBerries",
        "name": "GOLD_ALCHEMY.Ingredients.JuniperBerries",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "SageLeaves",
        "name": "GOLD_ALCHEMY.Ingredients.SageLeaves",
        "quantity": 1,
        "costZK": 0.4
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.JuniperSmudge.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.JuniperSmudge.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.JuniperSmudge.Name",
      "icon": "icons/consumables/potions/bottle-round-flask-fumes-purple.webp",
      "duration": {
        "seconds": 86400
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Endurance\",\"Odporność\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-sunwort-draught",
    "key": "SunwortDraught",
    "name": "GOLD_ALCHEMY.Recipes.SunwortDraught.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-flask-corked-orange.webp",
    "ingredients": [
      {
        "key": "Hypericum",
        "name": "GOLD_ALCHEMY.Ingredients.Hypericum",
        "quantity": 2,
        "costZK": 0.4
      },
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SunwortDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SunwortDraught.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.SunwortDraught.Name",
      "icon": "icons/consumables/potions/potion-flask-corked-orange.webp",
      "duration": {
        "seconds": 14400
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "10"
        }
      ]
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "broken",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-mugwort-dream-tea",
    "key": "MugwortDreamTea",
    "name": "GOLD_ALCHEMY.Recipes.MugwortDreamTea.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-bottle-labeled-stopped-purple.webp",
    "ingredients": [
      {
        "key": "Mugwort",
        "name": "GOLD_ALCHEMY.Ingredients.Mugwort",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.MugwortDreamTea.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.MugwortDreamTea.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.MugwortDreamTea.Name",
      "icon": "icons/consumables/potions/potion-bottle-labeled-stopped-purple.webp",
      "duration": {
        "seconds": 28800
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 10;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Intuition\",\"Intuicja\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Intuition\",\"Intuicja\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-foxglove-drops",
    "key": "FoxgloveDrops",
    "name": "GOLD_ALCHEMY.Recipes.FoxgloveDrops.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": -20,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/conical-mushroom-poison-red.webp",
    "ingredients": [
      {
        "key": "Foxglove",
        "name": "GOLD_ALCHEMY.Ingredients.Foxglove",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.FoxgloveDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.FoxgloveDrops.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "hard",
        "pass": [
          {
            "remove": "unconscious",
            "value": "all"
          },
          {
            "remove": "stunned",
            "value": 1
          }
        ],
        "fail": [
          {
            "add": "poisoned",
            "value": 2
          }
        ]
      }
    ],
    "volatility": "major",
    "creationTimeDays": 1
  },
  {
    "id": "potion-honey-salve",
    "key": "HoneySalve",
    "name": "GOLD_ALCHEMY.Recipes.HoneySalve.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/food/preserves-jam-jelly-jar-brown-red.webp",
    "ingredients": [
      {
        "key": "WildHoney",
        "name": "GOLD_ALCHEMY.Ingredients.WildHoney",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "Plantain",
        "name": "GOLD_ALCHEMY.Ingredients.Plantain",
        "quantity": 1,
        "costZK": 0.15
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HoneySalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HoneySalve.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "heal": "1d5"
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-thistle-draught",
    "key": "ThistleDraught",
    "name": "GOLD_ALCHEMY.Recipes.ThistleDraught.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-circular-corked-labeled-green.webp",
    "ingredients": [
      {
        "key": "MilkThistle",
        "name": "GOLD_ALCHEMY.Ingredients.MilkThistle",
        "quantity": 2,
        "costZK": 0.3
      },
      {
        "key": "PureWater",
        "name": "GOLD_ALCHEMY.Ingredients.PureWater",
        "quantity": 1,
        "costZK": 0.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ThistleDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ThistleDraught.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ThistleDraught.Name",
      "icon": "icons/consumables/potions/bottle-circular-corked-labeled-green.webp",
      "duration": {
        "seconds": 14400
      },
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 20;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Consume Alcohol\",\"Mocna Głowa\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Consume Alcohol\",\"Mocna Głowa\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-sleepwell-tea",
    "key": "SleepwellTea",
    "name": "GOLD_ALCHEMY.Recipes.SleepwellTea.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-label-cork-purple.webp",
    "ingredients": [
      {
        "key": "Chamomile",
        "name": "GOLD_ALCHEMY.Ingredients.Chamomile",
        "quantity": 1,
        "costZK": 0.2
      },
      {
        "key": "Valerian",
        "name": "GOLD_ALCHEMY.Ingredients.Valerian",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "LemonBalm",
        "name": "GOLD_ALCHEMY.Ingredients.LemonBalm",
        "quantity": 1,
        "costZK": 0.3
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SleepwellTea.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SleepwellTea.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "remove": "fatigued",
        "value": 1
      }
    ],
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-plantain-poultice",
    "key": "PlantainPoultice",
    "name": "GOLD_ALCHEMY.Recipes.PlantainPoultice.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": -10,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/potion-jar-capped-teal.webp",
    "ingredients": [
      {
        "key": "Plantain",
        "name": "GOLD_ALCHEMY.Ingredients.Plantain",
        "quantity": 2,
        "costZK": 0.15
      },
      {
        "key": "AntidoteHerb",
        "name": "GOLD_ALCHEMY.Ingredients.AntidoteHerb",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PlantainPoultice.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PlantainPoultice.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "average",
        "pass": [
          {
            "remove": "poisoned",
            "value": "all"
          }
        ],
        "fail": [
          {
            "remove": "poisoned",
            "value": 1
          }
        ]
      }
    ],
    "volatility": "moderate",
    "creationTimeDays": 1
  },
  {
    "id": "potion-thornbark-rub",
    "key": "ThornbarkRub",
    "name": "GOLD_ALCHEMY.Recipes.ThornbarkRub.Name",
    "category": "herbal",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Zielarz)",
    "difficulty": 0,
    "shelfLifeDays": 3,
    "bonusDaysPerSL": 1,
    "img": "icons/consumables/potions/bottle-round-corked-orante-red.webp",
    "ingredients": [
      {
        "key": "Ironbark",
        "name": "GOLD_ALCHEMY.Ingredients.Ironbark",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "NettleOil",
        "name": "GOLD_ALCHEMY.Ingredients.NettleOil",
        "quantity": 1,
        "costZK": 0.4
      },
      {
        "key": "BadgerFat",
        "name": "GOLD_ALCHEMY.Ingredients.BadgerFat",
        "quantity": 1,
        "costZK": 0.6
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.ThornbarkRub.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.ThornbarkRub.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.ThornbarkRub.Name",
      "icon": "icons/consumables/potions/bottle-round-corked-orante-red.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "10"
        },
        {
          "key": "system.characteristics.ag.modifier",
          "mode": 2,
          "value": "-10"
        }
      ]
    },
    "volatility": "minor",
    "creationTimeDays": 1
  },
  {
    "id": "potion-bloodrage-draught",
    "key": "BloodrageDraught",
    "name": "GOLD_ALCHEMY.Recipes.BloodrageDraught.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-tube-corked-bat-gold-red.webp",
    "ingredients": [
      {
        "key": "Henbane",
        "name": "GOLD_ALCHEMY.Ingredients.Henbane",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "BeastFangs",
        "name": "GOLD_ALCHEMY.Ingredients.BeastFangs",
        "quantity": 1,
        "costZK": 1.5
      },
      {
        "key": "PureAlcohol",
        "name": "GOLD_ALCHEMY.Ingredients.PureAlcohol",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.BloodrageDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.BloodrageDraught.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.BloodrageDraught.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-bat-gold-red.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.ws.modifier",
          "mode": 2,
          "value": "20"
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
            "script": "const specs = [[\"Compendium.wfrp4e-core.items.yRhhOlt18COq4e1q\",\"Frenzy\",\"trait\",null,\"\"]];\nconst items = [];\nfor (const [uuid, name, type, spec, suffix] of specs) {\n  const source = await fromUuid(uuid);\n  const data = source ? source.toObject() : { name, type, system: {} };\n  delete data._id;\n  if (spec !== null) foundry.utils.setProperty(data, \"system.specification.value\", spec);\n  if (suffix) data.name += ` (${suffix})`;\n  items.push(data);\n}\nawait this.actor.createEmbeddedDocuments(\"Item\", items, { fromEffect: this.effect.id });"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "difficult",
        "fail": [
          {
            "add": "fatigued",
            "value": 2
          }
        ]
      }
    ],
    "volatility": "extreme",
    "creationTimeDays": 7,
    "availability": "rare",
    "addictive": {
      "difficulty": "difficult"
    }
  },
  {
    "id": "potion-gravewine",
    "key": "Gravewine",
    "name": "GOLD_ALCHEMY.Recipes.Gravewine.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/flask-ornate-skull-green.webp",
    "ingredients": [
      {
        "key": "GraveMoss",
        "name": "GOLD_ALCHEMY.Ingredients.GraveMoss",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "BoneAsh",
        "name": "GOLD_ALCHEMY.Ingredients.BoneAsh",
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
    "description": "GOLD_ALCHEMY.Recipes.Gravewine.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.Gravewine.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.Gravewine.Name",
      "icon": "icons/consumables/potions/flask-ornate-skull-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "20"
        },
        {
          "key": "system.characteristics.fel.modifier",
          "mode": 2,
          "value": "-20"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"fatigued\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "challenging",
        "fail": [
          {
            "add": "poisoned",
            "value": 1
          }
        ]
      }
    ],
    "volatility": "major",
    "creationTimeDays": 7,
    "availability": "rare",
    "addictive": {
      "difficulty": "challenging"
    }
  },
  {
    "id": "potion-black-vial",
    "key": "BlackVial",
    "name": "GOLD_ALCHEMY.Recipes.BlackVial.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-bottle-skull-label-poison-teal.webp",
    "ingredients": [
      {
        "key": "Nightshade",
        "name": "GOLD_ALCHEMY.Ingredients.Nightshade",
        "quantity": 1,
        "costZK": 2
      },
      {
        "key": "Henbane",
        "name": "GOLD_ALCHEMY.Ingredients.Henbane",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "WineVinegar",
        "name": "GOLD_ALCHEMY.Ingredients.WineVinegar",
        "quantity": 1,
        "costZK": 0.2
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.BlackVial.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.BlackVial.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "poisoned",
        "value": 1,
        "perSL": true,
        "resist": {
          "test": "endurance",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "major",
    "creationTimeDays": 7,
    "availability": "rare"
  },
  {
    "id": "potion-willbreaker-draught",
    "key": "WillbreakerDraught",
    "name": "GOLD_ALCHEMY.Recipes.WillbreakerDraught.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-jar-corked-labeled-poison-skull-green.webp",
    "ingredients": [
      {
        "key": "Henbane",
        "name": "GOLD_ALCHEMY.Ingredients.Henbane",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "PoppyMilk",
        "name": "GOLD_ALCHEMY.Ingredients.PoppyMilk",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WillbreakerDraught.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WillbreakerDraught.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WillbreakerDraught.Name",
      "icon": "icons/consumables/potions/potion-jar-corked-labeled-poison-skull-green.webp",
      "duration": {
        "seconds": 3600
      },
      "changes": [
        {
          "key": "system.characteristics.wp.modifier",
          "mode": 2,
          "value": "-20"
        }
      ]
    },
    "volatility": "major",
    "creationTimeDays": 7,
    "availability": "rare"
  },
  {
    "id": "potion-witch-eye-drops",
    "key": "WitchEyeDrops",
    "name": "GOLD_ALCHEMY.Recipes.WitchEyeDrops.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
    "ingredients": [
      {
        "key": "WarpstoneDust",
        "name": "GOLD_ALCHEMY.Ingredients.WarpstoneDust",
        "quantity": 1,
        "costZK": 10
      },
      {
        "key": "BatWing",
        "name": "GOLD_ALCHEMY.Ingredients.BatWing",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.WitchEyeDrops.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.WitchEyeDrops.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.WitchEyeDrops.Name",
      "icon": "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
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
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Channelling\",\"Splatanie Magii\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Channelling\",\"Splatanie Magii\"].some(x => n === x || n.startsWith(x + \" (\")));"
            }
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "hard",
        "fail": [
          {
            "corruption": 1
          }
        ]
      }
    ],
    "volatility": "extreme",
    "creationTimeDays": 7,
    "availability": "rare",
    "addictive": {
      "difficulty": "difficult"
    }
  },
  {
    "id": "potion-nightmare-dust",
    "key": "NightmareDust",
    "name": "GOLD_ALCHEMY.Recipes.NightmareDust.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/weapons/thrown/bomb-purple.webp",
    "ingredients": [
      {
        "key": "BatWing",
        "name": "GOLD_ALCHEMY.Ingredients.BatWing",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "GraveMoss",
        "name": "GOLD_ALCHEMY.Ingredients.GraveMoss",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Henbane",
        "name": "GOLD_ALCHEMY.Ingredients.Henbane",
        "quantity": 1,
        "costZK": 1.25
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.NightmareDust.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.NightmareDust.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeThrown",
    "thrownSteps": [
      {
        "add": "broken",
        "value": 1,
        "perSL": true,
        "resist": {
          "test": "cool",
          "difficulty": "challenging"
        }
      }
    ],
    "volatility": "major",
    "creationTimeDays": 7,
    "availability": "rare",
    "blast": 2
  },
  {
    "id": "potion-turncoat-salve",
    "key": "TurncoatSalve",
    "name": "GOLD_ALCHEMY.Recipes.TurncoatSalve.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -20,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flask-corled-pink-red.webp",
    "ingredients": [
      {
        "key": "WarpstoneDust",
        "name": "GOLD_ALCHEMY.Ingredients.WarpstoneDust",
        "quantity": 1,
        "costZK": 10
      },
      {
        "key": "Beeswax",
        "name": "GOLD_ALCHEMY.Ingredients.Beeswax",
        "quantity": 1,
        "costZK": 0.25
      },
      {
        "key": "DaturaOil",
        "name": "GOLD_ALCHEMY.Ingredients.DaturaOil",
        "quantity": 1,
        "costZK": 1.5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.TurncoatSalve.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.TurncoatSalve.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.TurncoatSalve.Name",
      "icon": "icons/consumables/potions/potion-flask-corled-pink-red.webp",
      "changes": [],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "dialog",
            "script": "args.fields.modifier += 30;",
            "options": {
              "activateScript": "const n = args.skill?.name || \"\"; return [\"Entertain\",\"Występy\",\"Charm\",\"Charyzma\"].some(x => n === x || n.startsWith(x + \" (\"));",
              "hideScript": "const n = args.skill?.name || \"\"; return !([\"Entertain\",\"Występy\",\"Charm\",\"Charyzma\"].some(x => n === x || n.startsWith(x + \" (\")));"
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
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "challenging",
        "fail": [
          {
            "corruption": 1
          }
        ]
      }
    ],
    "volatility": "major",
    "creationTimeDays": 7,
    "availability": "rare"
  },
  {
    "id": "potion-hollow-heart",
    "key": "HollowHeart",
    "name": "GOLD_ALCHEMY.Recipes.HollowHeart.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-flask-stopped-red.webp",
    "ingredients": [
      {
        "key": "GraveMoss",
        "name": "GOLD_ALCHEMY.Ingredients.GraveMoss",
        "quantity": 1,
        "costZK": 1
      },
      {
        "key": "Foxglove",
        "name": "GOLD_ALCHEMY.Ingredients.Foxglove",
        "quantity": 1,
        "costZK": 0.9
      },
      {
        "key": "PoppyMilk",
        "name": "GOLD_ALCHEMY.Ingredients.PoppyMilk",
        "quantity": 1,
        "costZK": 1
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.HollowHeart.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.HollowHeart.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "activeEffect": {
      "name": "GOLD_ALCHEMY.Recipes.HollowHeart.Name",
      "icon": "icons/consumables/potions/potion-flask-stopped-red.webp",
      "duration": {
        "seconds": 600
      },
      "changes": [
        {
          "key": "system.characteristics.t.modifier",
          "mode": 2,
          "value": "20"
        }
      ],
      "system": {
        "scriptData": [
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"broken\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          },
          {
            "label": "@effect.name",
            "trigger": "update",
            "script": "const condition = this.actor.hasCondition(\"fatigued\");\nconst busy = (this.effect._alchemyBlocking ??= new Set());\nif (!condition || busy.has(condition.id)) return;\nbusy.add(condition.id);\ncondition.delete().catch(() => {}).finally(() => busy.delete(condition.id));"
          },
          {
            "label": "@effect.name",
            "trigger": "deleteEffect",
            "script": "this.actor.addCondition(\"fatigued\", 2);"
          }
        ]
      }
    },
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "test": "endurance",
        "difficulty": "hard",
        "fail": [
          {
            "add": "poisoned",
            "value": 2
          }
        ]
      }
    ],
    "volatility": "extreme",
    "creationTimeDays": 7,
    "availability": "rare"
  },
  {
    "id": "potion-plague-vapour",
    "key": "PlagueVapour",
    "name": "GOLD_ALCHEMY.Recipes.PlagueVapour.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/weapons/thrown/grenade-chemical.webp",
    "ingredients": [
      {
        "key": "GraveMoss",
        "name": "GOLD_ALCHEMY.Ingredients.GraveMoss",
        "quantity": 2,
        "costZK": 1
      },
      {
        "key": "Sulfur",
        "name": "GOLD_ALCHEMY.Ingredients.Sulfur",
        "quantity": 1,
        "costZK": 0.5
      },
      {
        "key": "BoneAsh",
        "name": "GOLD_ALCHEMY.Ingredients.BoneAsh",
        "quantity": 1,
        "costZK": 0.75
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.PlagueVapour.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.PlagueVapour.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipeCloud",
    "volatility": "extreme",
    "creationTimeDays": 7,
    "availability": "rare"
  },
  {
    "id": "potion-soulburn-tonic",
    "key": "SoulburnTonic",
    "name": "GOLD_ALCHEMY.Recipes.SoulburnTonic.Name",
    "category": "forbidden",
    "sourceModule": "wfrp4e-alchemy",
    "attunementCost": 0,
    "testSkill": "Rzemiosło (Alchemia)",
    "difficulty": -30,
    "shelfLifeDays": 30,
    "bonusDaysPerSL": 5,
    "img": "icons/consumables/potions/potion-tube-corked-glowing-red.webp",
    "ingredients": [
      {
        "key": "WarpstoneDust",
        "name": "GOLD_ALCHEMY.Ingredients.WarpstoneDust",
        "quantity": 1,
        "costZK": 10
      },
      {
        "key": "Henbane",
        "name": "GOLD_ALCHEMY.Ingredients.Henbane",
        "quantity": 1,
        "costZK": 1.25
      },
      {
        "key": "AethyrCrystal",
        "name": "GOLD_ALCHEMY.Ingredients.AethyrCrystal",
        "quantity": 1,
        "costZK": 5
      }
    ],
    "description": "GOLD_ALCHEMY.Recipes.SoulburnTonic.Desc",
    "effectDescription": "GOLD_ALCHEMY.Recipes.SoulburnTonic.Effect",
    "fallbackSkill": "Rzemiosło (Aptekarstwo)",
    "instantEffect": "recipe",
    "instantSteps": [
      {
        "resolve": 1
      },
      {
        "corruption": 1
      }
    ],
    "volatility": "extreme",
    "creationTimeDays": 7,
    "availability": "rare",
    "addictive": {
      "difficulty": "hard"
    }
  }
];
