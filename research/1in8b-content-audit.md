# 1in8b.life content audit

26 October 2026. Static, read-only count of the public client. Version found: **v0.8.39 beta** (`CONFIG.version` in the bundle, footer of `/en/`). Earlier notes recorded v0.8.21, v0.8.22 and v0.8.36; the project is shipping several builds a day.

## Method

- Downloaded `https://1in8b.life/en/` (253 KB), its only script `/a/en.d8f5afae09.js` (4.05 MB, minified, one bundle), the lazily loaded `/era.js` (549 KB), and `/en/notes.json` (261 KB, the update-notes feed the client fetches). Nothing was executed. Files were parsed as text with a small bracket-matching script that counts the top-level items of each literal table (`DEC={…}`, `EVENTS=[…]` and so on).
- No browser play this pass. Two earlier play receipts (`foundation.md`, `original-round-three.md`) already cover the UI; this pass counts what is behind it.
- No authentication, no server probing. The `/api/*` routes found in the bundle were listed, not called.

**The main finding on architecture.** The whole life simulation runs in the browser. Events, decisions, illnesses, jobs, country statistics and all English text ship in the one bundle. The server only handles social and persistence features: memorials, reactions, community posts, keepsakes ("keep"), home rooms, save-transfer codes ("move") and analytics (`/api/e`). So the counts below cover the full simulation content, not a sample of it.

**How the text is stored.** The source language is Korean. Every player-facing string is written as ``L`…` `` (14,824 call sites). The English build swaps each one through a hashed dictionary `I18N_T`, which has **13,394 entries and about 136,000 English words**. 3,292 of those entries have placeholders such as names, ages or places. The word count is the best single measure of how much hand-written content there is.

## Counts

| Dimension | Count | Evidence (file · identifier) | Authored or data-driven | Confidence |
|---|---|---|---|---|
| Countries / birth places | **172** playable (173 in the era and city tables) | bundle `COUNTRIES=[…]` (fields: births, population, life expectancy, under-5 mortality, PPP income, Gini, fertility, maternal mortality, urban share, religion mix, sports); `CITIES` 173 | Data (UN/World Bank style indicators) | High |
| Birth weighting | births or population, by country and year | `TOTAL_BIRTHS`, `share()` with mode `pop`; `era.js` per-country yearly births | Data | High |
| Income band at birth | 5 within-country quintiles | `QTXT`, `S.q` | Data-scaled multipliers | High |
| Historical / future settings | 1950–2100 by year; past lives 1950–2025 | `era.js` `ERA {y0:1950,y1:2100}`, 173 countries × 13 series (UN WPP 2024, Maddison 2020, WUP 2018, Lee-Lee 2016) | Data | High |
| World-history moments | **194** | `HIST=[…]` (e.g. id `sputnik`, `moon`); scoped to `*` (global) or one of at least 91 country codes; dated 1957–2026 | Authored text, dated, probabilistic | High |
| Wars / crises / economic shocks | 166 war spans, 56 national crises, 49 economic shocks | `ERA_WAR`, `ERA_CRISIS` (e.g. famines), `ERA_ECON` (e.g. oil shocks) | Data rows feeding authored text | High |
| Random life events (main pool) | **195** (194 unique ids) | `EVENTS=[…]`, each with an age window `a:[lo,hi]`, condition `c`, weight `w`; 73 repeatable (`rep:1`) | Authored, conditionally weighted | High |
| By life stage (an event can fall in several) | 0–5: 37 · 6–17: 113 · 18–39: 125 · 40–64: 127 · 65+: 107 | age windows in `EVENTS` | — | Medium (windows overlap) |
| Other event pools | 29 warm moments, 19 traditional/regional, 15 small everyday, 13 old-age joys, 8 human-kindness, 12 rare "eggs" (Nobel, Oscar, comet, dinosaur find…), 28 scene vignettes | `WARM`, `TRAD_EV`, `SMALL`, `OLD_JOYS`, `HUM`, `EGGS`, `BX_EP` | Authored | High |
| Decisions (choice cards) | **150** | `DEC={…}`, each with `build()` returning `title/body/fact/choices` and `apply(k)` | Authored | High |
| Options per decision | **561** distinct option keys; median 4, mean 3.7, max 15 (`bizop`) | distinct `k:"…"` per `DEC` entry | Authored; some option lists are built at runtime, so the true count is a bit higher | Medium |
| Annual focuses | 15 | `FOCUS` (study, play, help, sport, hobby, work, balance, family, health, learn, faith, rest, mind, part-time, career) | Authored | High |
| Spending / living actions | 63 | `SHOP=[…]` (dinner, trip, tutor, ged, night uni, remodel, sell house, rental…) | Authored | High |
| Jobs | **72** occupations, 50 with promotion ladders | `JOBS` (farm…astronaut, idol, pro gamer, haenyeo, prison, child work); `LADDER`; 15 business types `BIZ_K` | Authored labels, data-driven wage bands (`lo/hi`) | High |
| Education stages | 7 (primary, lower secondary, upper secondary, vocational, university, graduate, PhD) + 19 majors; 140-country study-abroad table | `EDU_NOW`, `MAJORS`, `STUDY_TO` | Data-driven entry probability (`eduProbs`), authored text | High |
| Meters | 4 shown stats + money | `S.st.{h,hl,sm,so}` (happiness, health, knowledge, relationships); `eff({…,money})` | Formula | High |
| Death causes | **33** | `CAUSE` (neonatal, pneumonia, diarrhoea, malaria, TB, HIV, heart disease, stroke, cancer, COPD, diabetes, kidney, dementia, cirrhosis, road, homicide, war, drowning, falls, fire, overdose, maternal, genocide, disaster, COVID, epidemic, political, suicide…); 12 "sudden" (`END_SUDDEN`), 7 long illnesses (`LONG_ILL`) | Data-weighted by country/age (GBD-style), authored endings | High |
| Non-fatal illness episodes | 11 | `ILLS` (appendicitis, gallstones, disc, fracture, pneumonia, malaria, typhoid, TB, dengue, kidney stone, hernia) | Authored, age/sex-weighted | High |
| Disability | 3 kinds (hearing, mobility, sight) + intellectual / autism-like text paths | `S.dis.k`, `dis_*` events (14) | Authored | Medium |
| Ethnic / minority groups | 52 | `ETH_G` (e.g. `us_black`, `nz_maori`, `mm_roh`, `za_col`) with pay, hiring and education multipliers | Data-ish multipliers, authored text | High |
| Religions | 9 codes | `rel:"M99,N1"` mix per country | Data | High |
| Name pools | 96 | `NAMES` | Data | High |
| Household / family | Not one table. Mother/father present or absent, raised by grandparents, siblings, step-family, adoption (24 origin countries), custody, polygamy (`cowife`, `wife2`), parent in prison (`pk_*`, `pr_*`), refugee camp, street child, shelter | `S.fam.*` (19 fields), `ADOPT_I`, decisions `stepin/stepkids/custody/cowife` | Flags plus authored branches | Medium (combinatorial, no single enum) |
| Relationship states | dating, cohabiting, married, multiple marriages, widowed, divorced, same-sex marriage where legal, affair, pregnancy while dating | `S.fam.{dating,married,marriages,widowed,partner}`, `SSM`, decisions `cmarry/partner/wedtalk/cohabwed/datepreg/sswed/affair/divtalk` | Authored | Medium |
| Home / keepsake objects | 131 | `HOME_ITEMS` (wallpapers, floors, window views, furniture, earned life objects `l_*`) | Authored assets | High |
| State flags | about 970 distinct `S.flags.*` | grep | Code | Medium |
| Release cadence | 341 releases, 1,191 change items, 6–25 Oct 2026 (v0.4.41 → v0.8.39) | `notes.json` | — | High |

## Why its lives feel varied

Observation from code structure, plus inference:

1. **The real driver is conditions, not the size of the pools.** About 1,100 `chance()` calls and 127 `yearRoll()` gates check country statistics, income band, sex, urban or rural, era, disability, ethnicity and family state. A 195-event pool feels larger because each life only reaches the subset its circumstances allow.
2. **Data tables do the variation; text does the texture.** Country rows, about 970 flags and per-year era series change the odds. The roughly 136k words of authored text then describe the result in a specific way.
3. **Facts are shown on the card.** About 199 `fact:` lines and 140 `f:` footnotes cite UN, WHO, GBD, UNDP and similar sources, for example the country's expected years of schooling. This makes the chance outcomes read as believable.
4. **Local depth is uneven.** Hard-coded country branches cluster on Korea (67 comparisons), China (35) and North Korea (27). After those come Japan, Mongolia, the USA and South Africa (single digits each). Most of the 172 countries get only their statistics plus generic text.

## Where it repeats (inference)

- Once the conditions are set, most surface text comes from about 237 event objects and 150 decisions. After several lives in the same country and income band, the same cards come back. 73 events are explicitly repeatable.
- The only meters are four 0–100 stats plus money. Decisions mostly move those numbers (for example `eff({so:4})`), so many choices end in similar small stat changes.
- Choices average 3.7 options and are mostly binary or ternary. Outcomes resolve immediately, with few delayed consequences beyond flags.
- Illness is shallow: 11 episode types, against 33 death causes.

## Ways a game could exceed it

1. **Depth in one place, not 172 shallow countries.** Thailand alone could get more region, province and era-specific branches than its whole non-Korean set. Use real Thai data such as NSO, the HDC health data centre and NESDC, with sources shown on the card.
2. **Delayed consequences as a first-class mechanic.** Events are scheduled years after the choice that caused them, with the same event identity shown in the ledger, the scene and the life review. In its code, most effects resolve immediately.
3. **More than four meters.** Track time budget, cash runway, skills, physical function and emotional wellbeing as separate, named measures. Choices then change what is feasible next, not just a score.
4. **A health model with stages.** Exposure, infection, diagnosis, treatment and chronic course as distinct states, with access and cost tied to era and coverage. Its model is 11 episodes plus a death-cause roll.
5. **Persistent people.** Named neighbours, classmates and co-workers who carry over across decades and can return later. Its other people are mostly family fields and one-off friend events.
6. **Same-world replay.** Re-run a life under identical external shocks and compare the branches. It does not do this; it compares against four peers born at the same moment.
7. **Wider choices with explicit costs.** Fewer binary cards; more choices that show their opportunity cost in time and money, with consequence ranges and missing evidence marked as unknown.
8. **Authored density per life stage.** Its 0–5 pool has 37 events. A richer early childhood and old age (caregiving, retirement, widowhood, frailty) is an obvious gap.

## Limits

- Counts are of client tables. Runtime-built option lists and inline `log()` narration outside these tables are counted only through the I18N word total.
- Age-band counts overlap by design.
- "Household types" and "relationship states" are reconstructed from field and decision names, not from a single list.
- Their statistical calibration was not audited.
- No text or assets were copied into this file beyond short identifiers. Downloads are kept outside the project in the session scratchpad.
