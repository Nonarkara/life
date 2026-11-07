# Rebuild strategy: from slide deck to a drawn life (8 Nov 2026)

## What is broken, with numbers
- The spine was 4 childhood questions plus 31 fixed pivots, identical for every life. (Measured: 1 distinct sequence. After the seeded-pivot fix, 300 of 300, but only from re-ordering the same 31.)
- The side deck is 94 scenes. Two (friend, runway) appear in about 82% of lives.
- About 79% of five-year chapters read "An ordinary five years".
- Pivots ignore who you are: a royal-associated household in a walled house is asked to sign the market stall's paperwork.
- Reference (1in8b.life, our own audit in `research/1in8b-content-audit.md`): about 195 events, 150 decisions, 72 jobs, 136k words, every card gated by country, income band, sex, era, family state and about 970 flags. Variety comes from conditions, text gives texture.

## The one idea
A life is a **draw from a real joint distribution** (when, where, which class, sex, religion, household), then every scene is a **row with a condition and a weight**, drawn against that life. No scene is mandatory. Plot points (flood, a parent's death) are rows with very high weight under their condition.

Scene row: `{id, ages:[lo,hi], when:{class,region,sex,birthYear:[a,b],flags,not}, weight, repeat, prompt, options:[{label,cost,effects,flags,echo}], source:'bbc|rajadhon|book:<id>|inferred'}`.

## Order of work (each step ships on its own)
0. **Guard first.** `tests/course/variety.test.mjs`: distinct sequences, no scene above a share ceiling, none shown more than twice in ten lives. Ceilings only go down.
1. **One pool.** Convert pivots and encounters into scene rows; add the `when` conditions. Pivot content stays; it gains the missing class and region gates.
2. **Data tables.** Thailand by birth year: births, region, class, religion mix (Buddhist, Muslim south, Christian, Chinese temple), household, schooling, work, cause-of-death by era. Public sources only (UN WPP, World Bank, NSO), every number tagged `{source, year}`.
3. **Content waves**, 40 rows per wave, by life stage, from the scenario bank (`ERA-SCENARIO-BANK.md`), the literature notes and the events spine. Each wave: written by one agent, checked by a different one for sources, tells and the monarchy rule. Target: 150 decisions, 200 events before calling it "a game".
4. **Everyday density.** Replace "An ordinary five years" with a drawn small thing (weather, a meal, a neighbour) so no chapter is empty.
5. **World staging.** People doing something where they would be, not a lineup. Own pass, after the deck.
6. **MSH fixes** from the audit (dead band under the scene on desktop, 44 px nav boxes, modal dimming the whole world).

## Not negotiable
- No scene without a source tag; `inferred` rows cannot state a fact.
- No royals, no named perpetrators, no private people (`ERA-EVENTS-AND-BUDDHISM.md` section 4).
- Every step ends with a measured before and after, a different agent reading it, and a live deploy checked by bytes.

## What only the owner can supply
1. Real Thai life stories he is happy to see turned into scenes (his own, family, friends, with the people's consent). Even three paragraphs each.
2. More literature or oral history he loves, as files.
3. A yes or no on the household and region mix: cover the south (Muslim Malay) and the north and Isan from the start, not later.
Everything else (statistics, history) I fetch from public sources myself.
