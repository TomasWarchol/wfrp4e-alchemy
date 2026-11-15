# Art bible: "The Alchemist's Workshop" UI assets

Brief for every asset maker. Read all of sections 1 and 2, then only your group in section 3.

## 1. Style

**Look:** early-modern woodcut and copper-engraving illustrations from 16th–17th century alchemy, distilling and herbal books (think distillation manuals and apothecary broadsheets): bold black silhouettes, carved negative-space cuts, slightly irregular hand-cut edges. Practical laboratory gear, grim and workmanlike, never cute or cartoonish, no glossy vector look. This set belongs to the same series as the module's grimoire and company-ledger icons, so keep the same weight and carving.

**Originality (hard rule):** every asset is original work. Do not reproduce or imitate any Games Workshop / Warhammer / Cubicle 7 logo, emblem or insignia: no Colleges of Magic symbols, no eight-pointed Chaos star, no god symbols, no twin-tailed comet, no skull-with-wings logos, no text or lettering, no real-world religious symbols. Generic alchemical marks (circle, triangle, crescent, cross as plain geometry) are fine only as small decoration, never as the main subject.

### Technical rules for icons (sections 3.1–3.2)

- File: `<id>.svg`, exactly the ids listed in your group.
- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">`. No `width`/`height`, no `<style>`, no `class`, no `id`, no `<defs>` unless needed for a single clipPath/mask (then give it a unique id prefixed `al-`), no external references, no `<text>`, no raster images, no comments.
- Colour: only `fill="currentColor"`. No other colours, no gradients, no opacity except `fill-opacity="0.35"` for at most one secondary shape (e.g. liquid inside glass).
- Shape: filled silhouettes; use `fill-rule="evenodd"` to carve interior detail (2–4 cuts). No visible feature thinner than 2.5 units. Strokes only if needed: `stroke="currentColor"`, `stroke-width` 3–5, `stroke-linecap="round"`, `fill="none"`.
- Composition: subject centred, about 4 units padding, similar optical weight across the set. Readable at 20 px and at 64 px.
- Size: under 3 KB per file. Round coordinates to 1 decimal.
- Prefer a clear simple silhouette over a detailed but muddy one. Avoid hands and faces.

### Technical rules for ornaments and vessels (sections 3.3–3.4)

- Same root rules, but `viewBox` exactly as given per asset. `fill="currentColor"`; `fill-opacity` 0.25–0.6 allowed for depth (at most two levels). No `<text>`, no external references.
- Tiles must tile seamlessly where stated.
- Under 8 KB per file (vessels under 12 KB).

## 2. Delivery and checking

- Write only into your output folder: `wfrp4e-alchemy/assets/ui/<group>/`.
- Also write `assets/ui/<group>/manifest.json`: an array of `{ "id", "file", "subject" }` in the listed order.
- Do not edit any other file in the repository. Do not download anything, do not use the network.
- **Look at your work.** You cannot see an SVG by reading it. Render a contact sheet with `python` (not `python -I`; cairosvg is installed), e.g.
  `python -c "import cairosvg,sys; cairosvg.svg2png(url=sys.argv[1], write_to=sys.argv[2], output_width=512)" in.svg out.png`,
  and view the PNG with your Read tool. Put every icon in a grid at 96 px and 20 px, dark ink `#2b1f15` on parchment `#f1ebd9`. Write temporary files only into the scratch folder given in your task. Do at least two full review rounds and fix anything muddy or unreadable at 20 px.
- Validate with `node tools/build-ui-assets.mjs` from the `wfrp4e-alchemy` folder: 0 errors for your group before you report.
- Report: file list, final contact sheet path, ids you found hard and how you solved them.

## 3. Asset lists

### 3.1 Interface — `assets/ui/interface/` (40 icons)

| id | subject |
|---|---|
| tab_colleges | tall alembic with a small star-burst above the neck |
| tab_alchemy | retort flask with a curved neck dripping into a small cup |
| tab_apothecary | mortar with a pestle |
| tab_herbal | bundle of herbs tied with string, leaves up |
| tab_forbidden | narrow black vial with a skull-shaped stopper |
| know_memory | head silhouette in profile with a small flask inside it |
| know_book | closed book with a flask on the cover |
| know_all | three stacked recipe slips |
| know_unknown | padlock on a small scroll |
| know_flawed | ink blot over a recipe slip |
| state_ready | wax seal with a check-like notch |
| state_missing | empty jar with a crack |
| state_brewing | flask over a flame with rising bubbles |
| state_done | stoppered flask with a small star-burst |
| stat_volatility | single flame |
| stat_time | hourglass |
| stat_shelf | calendar leaf with a corner fold |
| stat_doses | three small vials side by side |
| stat_price | stack of three coins |
| stat_tether | two interlocked chain links |
| stat_memory | rolled scroll on a small shelf bracket |
| stat_skill | pair of tongs crossed with a stirring rod |
| lab_poor | rickety stool with a single cracked pot |
| lab_standard | plain workbench with one flask |
| lab_fine | workbench with alembic and two flasks |
| act_brew | flame under a cauldron |
| act_complete | ladle pouring into a vial |
| act_cancel | cauldron with a cross over it |
| act_memorise | lit candle beside a recipe slip |
| act_forget | eraser-like knife scraping a slip |
| act_award | recipe slip with a ribbon and a wax seal attached |
| act_sever | open shears cutting a chain link |
| act_drink | tilted vial with drops leaving the neck |
| act_throw | round flask with motion lines behind it |
| act_open_ingredients | open crate with jars |
| act_open_potions | rack with three vials |
| act_open_recipes | open book with a flask on the left page |
| act_add_recipe | recipe slip with a small plus-shaped star-burst |
| act_world_mode | eye above an open book |
| act_gm_drawer | drawer pulled half out of a cabinet |

### 3.2 Craft — `assets/ui/craft/` (16 icons)

Ingredient categories and traditions used on ingredient jars and chat labels.

| id | subject |
|---|---|
| ing_herb | sprig with three leaves |
| ing_root | gnarled root with hair roots |
| ing_mushroom | cluster of two mushrooms |
| ing_mineral | faceted crystal cluster |
| ing_metal | small ingot bar |
| ing_powder | heap of powder with a scoop |
| ing_liquid | corked bottle half full (liquid as the one fill-opacity shape) |
| ing_animal | bone and a feather crossed |
| ing_venom | dripping fang |
| ing_aethyr | glowing shard with radiating short rays (not eight rays) |
| ing_salt | salt cellar with a heap on top |
| ing_oil | oil lamp |
| vessel_vial | slim vial |
| vessel_jar | apothecary jar with a lid |
| vessel_flask | round-bottomed flask |
| vessel_cauldron | three-legged cauldron |

### 3.3 Ornaments — `assets/ui/ornaments/` (16 pieces)

| id | viewBox | subject and use |
|---|---|---|
| frame_corner | 0 0 96 96 | brass corner bracket for a dark wooden frame, with rivets and a small flask-shaped cut-out; top-left, mirrored in CSS |
| wood_tile | 0 0 120 60 | tileable wood grain for the workshop frame, low contrast (fill-opacity 0.25–0.4); seamless both ways |
| shelf | 0 0 400 40 | wooden shelf plank with two brackets underneath, tileable horizontally (plank only repeats) |
| jar_full | 0 0 48 64 | apothecary jar, filled (liquid band as fill-opacity), lid on, blank label area |
| jar_empty | 0 0 48 64 | the same jar empty, with a crack line |
| chain_link | 0 0 24 32 | one chain link seen face on (a Więź point), to repeat in a row |
| chain_link_broken | 0 0 24 32 | the same link cut through |
| vial_hanging | 0 0 32 64 | small vial hanging from a hook (a potion on the tether chain) |
| scroll_slot | 0 0 32 48 | rolled scroll standing upright (a memory slot) |
| scroll_slot_empty | 0 0 32 48 | dashed outline of the same scroll (a free memory slot) |
| flame_meter | 0 0 24 32 | one flame (repeat 1–4 times for volatility) |
| label_frame | 0 0 320 160 | apothecary label: decorative double border with cut corners and a blank centre (chat card for a brewed potion) |
| label_scorched | 0 0 320 160 | the same label with burned, ragged edges and scorch marks (failed brew) |
| wax_seal | 0 0 96 96 | blank wax seal with irregular edge and inner ring |
| bubbles | 0 0 80 120 | rising bubbles column for the brewing animation (several circles of different sizes) |
| divider | 0 0 480 24 | rule with a small flask at the centre and leaf ends |

### 3.4 Vessels — `assets/ui/vessels/` (5 vignettes)

Large illustrations on the workbench, `viewBox="0 0 200 240"`. The liquid inside is a separate shape with `fill-opacity` 0.35–0.5 so CSS can tint it with the tradition colour (the whole file is `currentColor`; the tint comes from a CSS colour behind or a second layer, keep the liquid as one clearly separate path). Leave the bottom 30 units for a flame/heat source where it fits.

| id | subject |
|---|---|
| alembic | copper alembic: pot still with a long beaked head and a receiver flask, over a small brazier (magical potions) |
| retort | glass retort on a stand over a flame, neck leading into a receiver (mundane alchemy) |
| mortar | large stone mortar with pestle, a few loose seeds and a small jar beside it (apothecary) |
| herbal | bunch of herbs hanging from a rod above a simmering pot (herbalism) |
| forbidden | black squat flask with a chained stopper and dripping residue (forbidden, GM only) |
