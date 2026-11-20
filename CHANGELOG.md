# Changelog

## 1.10.0
- **80 new original recipes** (120 of the module's own in total, available without any sourcebook): 23 for the Colleges, each true to its Wind, 5 general magical, 14 mundane alchemy (thrown jars, tar and lime bombs, oils and pastes), 14 apothecary and 14 herbal remedies, and 10 forbidden brews. Mundane alchemy, apothecary and herbalism now work without the official modules.
- Remedies behave like Old World medicine: several have side effects (a festering wrap, a burning salve, addiction).
- Forbidden brews are either **illegal** (poisons and drugs: side effects and the law, no Corruption) or **heretical** (made with warpstone: they risk Corruption). Descriptions say who brews each potion and whether it is legal.
- **26 new ingredients** (common herbs, apothecary and workshop materials such as alum, and a few forbidden ones).
- New recipes describe their effects as data: healing, removing and adding Conditions, a resistance test of the drinker, Fortune, Resolve and Corruption, and for thrown potions Conditions and damage that grow with SL. Lasting effects use characteristic changes, test bonuses, armour and Condition immunity.
- The potions sheet shows each potion's fixed duration and a summary of what it does in play.
- Fixed: missing icons for Valerian and Deadly Nightshade.
- Fixed: Hollow Heart Elixir lost its 2 Fatigued Conditions at once; they now come when the elixir wears off.
- Fixed: Clarity Drops now remove Surprised, as their description says.
- Fixed: Wraithstep Draught lasts 1d10 rounds (it was always 10).
- Fixed: test bonuses for named skills no longer catch similar names ("Charm" no longer helps Charm Animal).
- Mundane potions no longer help Casting or Channelling: Lucidity Tonic, Focusing Philtre and Soul Balm skip spell tests.
- Draught of Forgetfulness describes the Cool Test it actually uses.
- **Potions that only promised something now do it:**
  - Hourglass Decoction keeps the drinker at 1 Wound the first time damage would drop them to 0, then it is spent.
  - Flaming Weapon Oil sets the target Ablaze on every melee hit.
  - Grave Oil makes melee weapons magical and adds +3 Damage against Undead.
  - Lead Fortitude gives +100 to Cool Tests against Fear and Terror; Aqshy War Blood gives the same against Fear.
  - Draught of the Pale Mask blocks Poisoned.
- **Conditions with a duration now end on time:**
  - Cordelia's side effect lasts as many minutes as the SL of failure.
  - Slumber Drops put the drinker to sleep for 1d10 hours.
  - A failed Mandrake Extract test brings drowsiness and then sleep (Unconscious) for 1d10+4 hours.
  - A short timer effect removes the Condition when time runs out, or when the GM deletes it.
- Fixed: potions that block a Condition (Greenward Draught, Furnace Blood, Dawnlight Tonic and others) no longer throw errors when that Condition is applied.
- The chat card says "Tether expired" instead of "Chamon Tether expired" for every College.

## 1.9.1
- **Sourcebook content only with its official module.** Recipes and ingredients from official books (Core Rulebook, Winds of Magic, Starter Set, The Horned Rat, Ubersreik Adventures I, Imperial Zoo) appear only while that book's official Foundry module is active. The *Strict Source Module Filtering* setting is gone (filtering is always on) and translation modules (`…-pl`) no longer stand in for the content module.
- Recipes from inactive books are hidden everywhere, not only in the workshop list: in books and scrolls they show as missing, the API's `recipes` lists only available ones, and the generated recipe books in the compendium leave them out (a book left empty is not created).
- Ingredients used only by recipes from inactive books are left out of the ingredients compendium and the recipe editor.
- Releases always ship empty compendium databases; the module fills them in the world.

## 1.9.0
- Polish letters in the workbench look: when Foundry runs in Polish, headings and titles use Grenze Gotisch and Almendra (shipped with Grimoires) instead of Nodesto Caps and Caslon Antique, which lack Polish letters.
- **Requires WFRP4e – Grimoires 0.8+.**
- **Alchemical books** are their own kind of book: they open in the same tome window as spellbooks (pages, contents, ribbons, Scriptorium), in an apothecary look with copper fittings and green ink, and recipe pages take the colour, sigil and marginalia of their College's wind. They hold recipes only, 12 by default (the GM sets any number in the book's edit mode). An alchemical book works straight from the inventory: it isn't held in the hands and can't be equipped. They have their own inventory section "Alchemical books", an entry in the Create Item dialog, and the workshop's "new book" button makes one.
- Books holding only recipes become alchemical books automatically when the world loads (once, by the GM), with their contents and no entry limit. Books with spells and recipes stay spellbooks. The generated recipe books in the compendium are rebuilt as alchemical books.
- Writing a recipe into a full book from the workshop shows why it doesn't fit.

## 1.8.0
- **Alchemical ingredients get their own inventory section** (after the system’s Ingredient section), like the tomes from Grimoires. New entries: **Alchemical ingredient** in the Create Item dialog and **Make into alchemical ingredient** in a trapping’s sheet header (an item named like a built-in ingredient is linked to it, so brewing finds it). The section’s **+** opens the ingredients compendium. Without the module they stay ordinary trappings.
- **Laboratory set by the GM** (world setting, on by default): each character's laboratory (poor, standard, fine) is set by the GM in the workshop and used for every brew; players see it but can't change it. When off, the player picks it per brew as before.
- **Brewing reserves ingredients and tether** (world setting, on by default): lighting the furnace puts the ingredients into the cauldron at once and holds the tether points until the brew is finished, so they can't be sold or spent meanwhile. The GM's cancel returns the ingredients.
- **Potion quality from SL** (world setting, on by default): 2–3 SL make a good potion (mundane: +1 dose), 4+ SL an excellent one (mundane: extra doses equal to the SL; magical: 1 tether point less per dose, at least 1). The chat card shows the quality.
- **Chamon memory bonus** (world setting): by default the Gold Order's affinity makes Chamon recipes free in memory, without the extra +5 slots; the old rule (+5 and free recipes) and "+5 only" can be chosen.
- **Brewing disasters take effect** (world setting, on by default): wounds from burns and blasts, an Endurance test against fumes (Poisoned on a failure) and, with the laboratory set by the GM, a blast or fire lowers the laboratory by one step.
- **Cauldrons**: a fine laboratory has two cauldrons, so two different recipes can brew at the same time (poor and standard laboratories keep one). The workbench shows the cauldrons in use, the tether reservations add up, and the GM cancels the brew of the selected recipe.
- **Talents recognised by their full name**: Concoct, Aethyric Attunement, Magical Sense, Attuned to … and Channelling (Chamon) are matched by the whole name in English or Polish, with or without Polish letters and with the specialisation in brackets or in the item's specification field; of several talents of one kind the one with the most advances counts.
- Fixed: the recipe editor showed built-in recipe names and descriptions as raw translation keys and picked the wrong category for general magical recipes; an unchanged translated text is saved back as the translation key.
- Fixed: saving the GM's character settings from the workbench drawer.
- **Workbench look** for the Alchemy Workshop (new client setting "Workshop look", on by default; the classic look stays available): a dark wooden frame with brass fittings, the recipe book on the left with tradition tabs, the eight wind sigils (shared with Grimoires) and knowledge filters, and the workbench on the right with a vessel for the tradition (alembic, retort, mortar, herb pot, forbidden flask) tinted in the wind's colour, volatility as flames, time, shelf life, doses, price and tether cost as icons, ingredients as jars on a shelf (full or cracked and empty) and a "Light the furnace" button. The header shows the tether as a gold chain (one link per point) with the potions that hold it, and recipe memory as a shelf of scrolls. GM tools move into a drawer. Recipe rows work from the keyboard.
- Chat cards in the workbench look: a brewed potion as an apothecary label with the tradition's sigil and a seal, a failed brew scorched, a severed or faded tether with a broken link. The recipe editor gets the parchment look.
- 77 original SVG assets (interface icons, ingredient and vessel icons, workshop ornaments, five vessel vignettes) with a sprite and validator in `assets/ui/` and `tools/build-ui-assets.mjs`; concept and art bible in `docs/ui/`.
- **Expired magical potions release the tether.** When a magical potion's time runs out, its magic fades: the alchemist gets the tether points back, the potion is marked as depleted and a chat message says so. The active GM checks this whenever world time passes and when the world loads. Until then expired potions no longer count against the tether.
- **Faster tether.** The workshop no longer scans every actor and token in the world on each render: potions on the tether are indexed once and kept up to date as items change (about 0.02 ms instead of 4 ms per check in a world with 1375 actors).
- Severing a tether refunds and reports the points for the whole stack (cost × quantity).
- Brewing, memory, tether and spoilage rules live in `scripts/logic/rules.js` and have unit tests (`npm test`, Vitest). The release zip leaves out the test and development files.

## 1.7.1
- Recipe books have no entry limit, so the 4-entry limit of new Grimoires spellbooks does not apply to them.

## 1.7.0
- **Requires WFRP4e – Grimoires 0.6+.**
- Recipes can be copied between books, also by players. Copying a spell or a magical recipe uses the new **Alchemical Ink**, one per page (world setting).
- A recipe known only from a flawed copy brews at -1 SL.
- Recipes take up pages in books with a limit: magical 2, others 1. Ciphered and forbidden pages unlock their recipes only once they are read.

## 1.6.0
- **Recipe books use the book engine** from *WFRP4e – Grimoires*: the same open-book window, inventory section and reading requirements as spellbooks. One book can hold spells and recipes together.
- **Requires WFRP4e – Grimoires 0.5+, Foundry v14 and WFRP4e 10.0+.**
- Recipe scrolls open in a scroll window: **Memorise and use up** takes a memory slot and consumes the scroll.
- Requirements are set per book in its edit mode. The *Require equipped recipe books* setting is gone; its value was carried over to existing books.
- The Workshop's book panel opens books and lets the GM add recipes by dragging. Books are no longer guessed from their names: use **Make into tome** in the item sheet header.
- Existing recipe books and scrolls are converted once when the GM loads the world, and generated compendium entries are rewritten.
- Fixed: dragging a potion onto a character sheet no longer memorises its recipe.

## 1.5.0
- English name: **WFRP4e – Old World Alchemy**. Full English and Polish interface; other languages fall back to English.
- Compendia (ingredients, potions, recipes) are rebuilt in the world's language when it changes.
- Compendium labels and effect labels are translated.
- Requires **WFRP4e – Companion Library** (`wfrp4e-companion-lib`), installed automatically.

## 1.4.0
- Rebalanced potions: magical draughts brewed quickly and sustained by the tether; mundane alchemy closer to the official rules (creation time, ingredient cost, list price).
- New Chamon potion (Quicksilver Mind Elixir) replacing the old healing panacea.

## 1.3.0
- Fixed brewing test modifiers and results, thrown combat potions, armour effects, inactive effects and removing all condition levels.
