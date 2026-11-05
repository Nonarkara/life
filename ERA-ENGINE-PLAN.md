# Era Engine plan: any birth year, endless people, small skeleton

Written 5 November 2026 from Dr Non's voice note ("Life monologue"), the 26 Oct 1in8b content audit (`research/1in8b-content-audit.md`) and a 5 Nov re-read of 1in8b.life v0.9.46. Plan only. Nothing here is built yet.

## 1. What the note asks for

1. **A time axis.** Today every life is born in 2026. The note wants any birth year: 1949 (a woman born in the countryside, now 77), 1981 (Gen Y, Bangkok), the 70s, the 90s, and into the future. Each era has its own growth, crises and things that exist or do not.
2. **A first MVP: "live your mother's era again."** Same skeleton we have, started in 1949. Would she marry that early, that person, have those children, raise them differently? What did the choice not taken cost? Investing in companies that did not yet have the names we know now.
3. **Cameos and nostalgia.** Famous people pass through your life; a period object (a VHS tape, one phone line, dial-up) brings the decade back.
4. **Real history that you can disturb, exaggerated but plausible.** Floods, coups, crashes. Later: hold a lever and change what happened.
5. **The skeleton should be no bigger than 1in8b's, only richer.** And the look: the Famicom and Super Famicom trick of making endless scenes and people from a few parts.

## 2. What 1in8b does (the skeleton to match, not copy)

From the audit (v0.8.39) and the 5 Nov read (v0.9.46):

- **Data drives variation, not plots.** One browser bundle of country-by-year tables (births, life expectancy by sex, GDP, Gini, schooling, fertility, infant mortality, and more), deterministic by seed. A life is a few meters plus a draw each year.
- **Birth year is a parameter** (1950 to 2025, plus UN projections), so the same engine yields a 1960 or a 2040 life.
- **Scope is multiplied cheaply:** four peer lives born in the same second, a survival curve, a life map of one square per year, forced reflective pauses at 5, 15, 30, 50, 70, 18 languages, a share card.
- **It is text and charts.** No scenes, no people drawn. That is the gap we fill.

We already have the same skeleton: a seeded sim (`sim.js`), 118 authored pivots (`pivots.js`), 25 encounters, 63 painted plates, 123 sprites, 7 regional plate variants, 5 languages, and `alternatives.js`, which replays a life with the same seed and a different answer. That last file is the regret mechanic the note describes. It already exists.

**What we lack is the year axis and the era data.** `birthYear` appears nowhere in `dist/course`. That is the single biggest structural gap.

## 3. The Famicom / Super Famicom lessons, mapped to us

The 90s consoles built enormous worlds from tiny tables. Each technique has a direct counterpart here.

| Console technique | What it did | Our version | Status |
|---|---|---|---|
| **Palette swap** (NES sprite palettes, Dragon Quest villagers) | One body drawing, many people, by changing 3 to 4 colours | Garment-mask recolour on the 3 anime models (`cast-wardrobe.js`, `_garment`) | Built for 3D cast. Painted sprites have no masks, so no swap there yet |
| **Parts assembly** (Fire Emblem, Chrono Trigger NPCs) | Hair, face, outfit picked from small sets | `character3d.js` already has 7 hair styles, skin, build, height, skirt/trousers | Built, but not driven by era or family |
| **Colour budget** (3 colours + transparent per sprite) | Forces every person to look coherent | A persona gets skin + hair + 2 cloth colours + 1 accent, all drawn from one Wada chord (`palette-chords.js`, 30 chords) | Chords exist; personas do not pick from them |
| **Tilemap + attribute table** (SFC town maps reused) | Same town, different palette, day/dusk/night | Plate × region variant (7) × time of day (3 plates) | Built |
| **Palette cycling / era LUT** | Same art reads as a different time | **Era grade:** one grade per period applied to plates and the 3D scene (see 4.2) | New, cheap: the retro post shader already exists |
| **Prop vocabulary** (Dragon Quest signs, pots, barrels) | A handful of objects say where and when | **Era prop sets** (see 4.3) | New; the regional prop system in `region3d.js` is the pattern |
| **Slot text tables** (names, shop lines) | Combinatorial text | Names, shop signs, radio lines from per-era slot tables | New, small |

The rule that makes the combinatorics look good, not random: **a persona is chosen from a chord, never from independent colour picks.** That is how Famicom palettes stayed beautiful with thousands of sprites.

Rough size of the person space once era and family drive it: 7 hair × 8 hair colours × 6 skin × 3 builds × 12 tops × 8 bottoms × 30 chords × 6 eras is over 10 million distinct people from existing parts. This is a count of the combination space, not a promise that all look good. The chord rule and a review sheet decide that.

## 4. Design

### 4.1 Time axis and era table (the skeleton change)

- Add `birth.year` to state and the intake. Age and calendar year then run together; every event gets a year window as well as an age window.
- One data file `era-table.json`: per year or per five years, with a source, tier and retrieved date on every row (honest envelope, §16.1 Law 3): GDP growth (we already have 1961 onward in `research/thailand-growth.json`), life expectancy by sex, schooling, urbanisation, household size, fertility, and "exists?" flags (radio, TV, phone line, VHS, VCD, dial-up, mobile, smartphone, Skytrain).
- Existing events and pivots get `era:[from,to]` gating, so we reuse what we have instead of rewriting 118 pivots.
- Source rule: **we do not write history from memory.** Every dated fact in the table needs a citation (Thai official statistics, World Bank, UN WPP). Anything unsourced stays out.

### 4.2 Era grade (the cheap, high-impact look)

One post-process grade per period, applied to the painted plates and to the 3D scene's existing retro pass:

| Period | Grade idea |
|---|---|
| to 1960s | Faded print, limited ink, warm paper white |
| 1970s | Warm film, softened contrast |
| 1980s | Saturated, slightly crushed |
| 1990s | VHS and early CD: soft edge, cool shadows |
| 2000s | Clean digital, mild bloom |
| now / future | Current look; future adds a restrained cool tint |

Seven kinds of plate × era grade gives dozens of scenes with zero new paintings. A painted plate must never be altered at source (anti-regression); the grade is a runtime layer.

### 4.3 Era props and persona wardrobe

- **Props by era**, a short list each: 1949 oil lamp, ox cart, radio on a shelf; 1980s one wall phone, VHS shelf, school uniform with a particular collar; 1990s VCD player, Honda Cub, then early mobile; later the dial-up modem, the Skytrain pillar. Each is one small sprite or 3D prop on the existing prop system.
- **Wardrobe by era and class**: the silhouette changes (cloth wrap and blouse, then school uniform, then jeans, then street wear) while the three-colour rule stays constant.
- **Stable family faces.** A seeded face per family member, so mother at 20 and at 60 is recognisably the same person: only ageing changes (grey hair, stoop, glasses). This needs the elder and child ageing on the anime models, already on our open list.

### 4.4 Cameos, handled carefully

- Cameos are **ambient and sourced**: a voice on the radio, a poster, a motorcade passing, a name in a headline. **No invented dialogue for any real person.**
- **No royal family members, ever.** Thai lèse-majesté law (Section 112) makes any depiction a legal risk to the owner. This is a hard exclusion, not a judgment call.
- Living politicians and celebrities: needs the owner's decision (section 7).
- The note's example is **Mitr Chaibancha (มิตร ชัยบัญชา)**, the 1960s film star. He is a deceased public figure, not royalty, so he fits the "deceased public figures" line. He belongs to the 1949-to-1970 packs: a poster outside a cinema, a name in the village talk, a film shown from a truck in the provincial dry season. Dates and details of his career and death are cited from sources before they ship, never from memory. No invented lines for him.

### 4.5 "The other door" as the heart of the MVP

`alternatives.js` already re-lives a branch with the same seed. The MVP's emotional core is the recap that shows the road not taken: the first love left in town, the engineering degree not chosen, the layoff in a bank merger, and what the same luck would have done under a different choice. This is built; it needs era content and a recap framed around regret and recovery, not a score. Mantra 5 applies: sit with the loss before reframing it.

### 4.6 Counterfactual history (later, not v1)

"Control the lever" (command the army, stop a coup) is a separate, later mode. Real coups and real living people make it politically and legally sensitive. For v1, coups are events that happen **to you** (curfew, TV off, school closed, a business hit), shown from street level. A playable counterfactual, if wanted, uses invented institutions.

## 5. MVP: "Her era" (smallest testable thing)

One scenario pack, not a rewrite:

1. `birth.year` + intake choice: 1949 countryside preset (generic, see section 7). Also 1981 Bangkok preset as the second pack to prove the axis works.
2. `era-table.json` filled for 1949 to 2026 with sources, plus era flags.
3. Era grade for two periods (1950s print, 1990s VHS) on plates and 3D.
4. Era props: about 6 per period for two periods.
5. Era gating on existing pivots, plus about 15 new era events per pack, drawn from sourced history, written by Dr Non's voice rules (`NON-WRITE-AGENT.md`) before they ship.
6. The recap with "the other door" for the three biggest choices (marriage, study field, the job loss).

Done means: pick 1949, play to the end, and the room, clothes, objects and events are visibly of the period; the recap shows what another answer would have done; every dated fact cites a source; all 5 languages carry the new strings.

## 6. Order of work

1. **Year axis** (state, intake, era gating). Tests first: a conservation test that age + birth year = calendar year always.
2. **Era table with sources.** Research task, not guesswork. A subagent gathers and cites; Dr Non reviews dates that touch family memory.
3. **Era grade + props** for the two MVP periods.
4. **Persona kit:** chord-driven wardrobe, stable family faces, ageing.
5. **Era events + recap**, then the 1981 pack.
6. Cameos (after the owner rules on section 7), then, if ever, counterfactual mode.

Review depth per the production ladder: this is T0/T1 (a game, no money or personal data), so one heterogeneous review pass on the history content, since a wrong date is the main risk.

## 7. Decisions that are the owner's

1. **Your mother's life as a preset.** The note is personal. The pack should be generic ("born 1949 in the countryside") with nothing that identifies her or family members; a private, personal version stays on your machine if you want one. Confirm the public pack stays generic.
2. **Real named people as cameos.** Allowed for deceased public figures only, or none at all? Royals are excluded either way.
3. ~~Who is "Mit Chai Ban Chao"?~~ Answered 5 Nov: Mitr Chaibancha.

Everything else (tables, grade, props, order) is my call and is set out above.

## 8. Risks stated plainly

- **Wrong history is worse than none.** Mitigation: cite every row, review dates.
- **Era grade on painted plates may flatten the art.** Mitigation: runtime layer only, side-by-side review, one period at a time.
- **Palette swap does not reach painted sprites** (no masks). Persona variety lives in the 3D cast first; painted scenes get era grade, props and the three recoloured models.
- **Scope.** The MVP is two periods and two packs; the other eras follow only if these two feel right.
