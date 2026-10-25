# Life prototype
Design read: a small Thai neighborhood is a stage on which scarce time becomes visible.
Reference: EarthBound (1994) for legible miniature places; MoMA collection pages for artwork-first hierarchy.
Dominant element: the isometric world; second: current decision; third: household ledger.
Register: game stage with quiet light reading controls. Amber is reserved for player agency. Scene materials use neutral warm tones; no interface gradients, radii or shadows. Two type families maximum, Jost and Prompt. World object edges carry geometric depth; UI boundaries separate functional regions only.
Conservation law: stall + study + friends = 12 hours per week. Four weekly turns demonstrate one month; childhood skips are explicit chapter transitions.
All game values are authored, simulated rules dated 23 October 2026, not demographic or financial predictions. No external data or AI services.
Plan: implement pure deterministic state transitions; author a consistent isometric scene; keyboard-operable time controls; compare two branches with the same rain event; test budgets, replay, save validation and responsive rendered geometry; independent review; publish privately.
Engine decision remains provisional. This dependency-free Canvas slice tests the loop before investing in an engine port. Godot is not installed here.

## Owner rejection, 23 October 2026
Owner rejected first preview as design slop and spatial hallucination. The source/geometry review measured absence of clipping, not quality. Do not publish this version. Named defects: empty canvas acreage; scene too small; large label-to-control gulf; generic form beside a diagram; weak game identity. Rework before another release verdict. Independent report is superseded by owner feedback.

## Course version — owner request, 23 October 2026
New implementation lives in dist/course; original rejected implementation remains intact for comparison and preservation. Design read: an illustrated route through a Thai life, with five-year stations and a compact character sheet. Reference: owner's supplied retro COURSE MAP image for a legible receding course and named districts; EarthBound for place silhouettes. No borrowed game assets.
Dominant element: illustrated course map; second: current five-year choice; third: linked resource history. Scene crops to actual landscape bounds instead of surrounding it with empty canvas.
Named load-bearing palette exception: landscape uses water, vegetation, terracotta roofs and concrete as distinct scene materials; UI retains amber for player agency, neutral planned path and neutral data series. Material colours identify places and surfaces, not decorative accents.
Invariant: starting attributes and each five-year effort allocation sum to 10 integer points; resources derive only from committed periods. Birth lottery controls background and temperament; five-year profiles begin at 10; relationship values after 15 (first five-year station is 20); adult smoking/drinking after 20. User may choose 9 physique/1 IQ/0 EQ, but IQ/EQ are game attributes, not test scores or biological conservation laws. Traits can develop independently of the starting allocation.
Scope: playable life-course study through up to 80, editable five-year profile, visible radar, physical function/wellbeing/cash histories, fixed-seed external events, conditional mortality, end recap and same-world replay. All effect sizes are authored game tuning, not validated health, financial or demographic estimates. No medically specific disease odds. HIV and cocaine are research backlog, not arbitrary implemented bonuses or disease clocks.
Release: tests, screenshot at 390/1024/1440, independent review explicitly required to judge composition and game feel rather than only clipping; owner rejection supersedes any previous pass. Publish current course version only after this gate passes. No request to wait for another approval.

## Camera clarification — latest owner steering
Birth opens close on baby and surrounding family; no choices until 10. Childhood plays continuously with 2x/3x/10x/20x controls. Persistent coordinates; camera pulls back as awareness expands to neighborhood, school and work. Percentages are framing/focal-area targets, not giant-body proportions. By adulthood keep character legible; wider institutions are explicitly metaphorical. Course-map reference now governs life overview/recap, not the opening camera. Simulation time and animation share one time controller; pause at five-year decisions. No autonomous motion when reduced-motion is requested.

## Owner correction — controls and daily behavior
Preserve palette. Repeated outlined rectangle controls are rejected, even when bounding boxes technically fit. Use label-sized text controls, selected underlines, compact adjacent ± adjustments, and an understated primary action; keep keyboard focus and usable hit areas. No filler panels or expanded controls.
Replace continuous rectangular parent loops with a shared sixty-second day: morning at home, journeys, stationary care/school/work/training/art/garden activities, return, seated evening rest. Articulated arms/knees and activity props make the action readable. One simulation-time controller owns motion and pause; camera follows the player gently after age6. Shared routes are checked over a complete day against furniture. This improves prototype movement; it is not an implementation of The Sims engine or its full behavior model.

## Palette restudy — 23 October 2026
Read remote Palette cc80399, including new DESIGN-STYLES, spatial narrative composition, STYLE, REMEDIES and design brief guidance. Fetched without merging into Palette's dirty working tree. Game-specific Core/Tension/Styles/Break/Ground and protected choices are recorded in STYLE.md. The study reinforces world-first composition and purposeful motion; it does not justify a cosmetic reskin. Responsive stills and routine logic received independent review; independent live motion verification timed out, so publication remains held for that visual gate.

## Owner correction — duplicated priorities, 23 October 2026
The side-by-side labelled radar and labelled editor failed semantic grouping despite prior responsive review. One aligned five-row editor now leads; the preserved radar is explicitly optional starting-shape comparison with a solid/dashed key. Total belongs to the editor heading, transfer instruction sits directly below rows, and redundant priorities effect copy is suppressed. Owner screenshot supersedes the prior composition pass.

## Languages, manual and history graphics
Added shared EN/TH/zh-CN/JA/KO settings, text scale and reduced motion; original two-page manual at /start and built root, with Sims/1in8b credits and research limits. Histories supply accessible event glyphs and a clickable ledger; named disease/family markers exist but ungenerated events are never fabricated. Mood chords derive from Palette/Wada121/122 relationships as authored screen reconstructions.24tests pass; independent review covers layouts and source fixes, not native editorial certification. Local preview moved to127.0.0.1:4219 because another project bound4187/4188IPv4 while Life held4187IPv6, causing mixed files. No other project process touched. Earlier-origin saves remain stored in that browser origin. New isolated preview verified manual→settings→game. Source original study completed one91-year run, still not exhaustive.

## Owner correction — 23 October, information and space
Read DESIGN-RULES.md before interface work. Palette/mood approved in direction;
composition remains under review. One visible home per fact, graphics sized for
data density, explicit reading groups, compact controls distinct from values.
Do not treat a sparse chart stretched across a track as useful detail. Preserve
world animation and earned records. Current changes remove repeated review prose,
use elapsed-life chart domains, keep values and references beside histories, and
use restrained circle/square decrement/increment affordances. No visual pass or
public release is claimed from automated tests.

## Womb and childhood — latest owner direction
Quiet black opening with original fetal illustration and visible 3–2–1. At default
2×, one childhood year takes ten seconds; faster controls shorten it. Birth starts
at zero; walking figure appears at one. Family chapters explain care, school and
authored annual household income. Earlier-year viewing freezes childhood time and
changes no saved outcome; return resumes. No player allocation before ten.
Education/work choices open at fifteen; college at twenty. Route support, costs,
income uncertainty and learning are authored tuning, explicitly not forecasts.
Partial route history remains compatible with older saves; malformed named routes
are rejected. Reduced-motion childhood still updates annual text without motion.
Browser module loading failed intermittently with a multi-file dynamic graph;
bundling the game produced a verified fresh startup, countdown and childhood.
The local preview serves no-store and the build versions asset references.
34 tests passed before final copy changes; actual childhood images in review/v1.
Not yet the full requested public release or exhaustive original-game research.

## Persistent encounters and economic-world research
Fourteen authored contextual encounters now retain named people, projects and family commitments. Resolution changes only the current snapshot, charges once, and preserves other event markers. Legacy saves remain valid; relationship flags and pending choices are validated.44 tests pass; a browser life followed friendship15, project20/exhibition35, dating25, shared flood response30, friend care40, marriage45, parenthood50 and remembrance55, ending unexpectedly60. Independent tablet review approved compact full-width history band. Ending duplicate last-event text is hidden; future age20 no longer claims school departure independently of route. Historical saves preserve their original prose.
Research/economic-crises.md and the retained World Bank Thailand growth series define the next shared-world work. No calibrated crisis simulation or asset portfolio exists yet. Two original lives completed (91 and32); branches remain. Domain registration awaits DNS access through user-opened dashboard.

## Ending reading hierarchy
Recap now leads with consequential remembered moments, omitting routine boilerplate in that reading view only. Every original five-year record remains in an expandable disclosure; no saved outcomes are rewritten. Responsive two-column ending places the course/graphs beside the memory timeline; phone follows chronological reading order. Removed nested clipped recap scrolling. Reviewer found course cropping under max-height/cover, then tiny phone legend after contain: corrected full aspect ratio, moved key/explanation to HTML, and enlarged major phone age anchors. Actual 390/1024/1440 and Thai extra captures in review/recap; independent review cleared this bounded change. Browser expanded full record and verified ten retained rows.46 tests; this is not full-game approval.

## Life2.0 — owner rejects diagonal/prose recap
The owner's 23:23/23:24 screenshots supersede the previous recap visual pass. Default ending now uses three aligned actual-unit tracks over age, selected-age values and one contextual event. Cash uses baht, health/wellbeing use their own 0–100 scales; no cross-unit progress score. It highlights the fastest recorded cash-growth interval (change per elapsed year), simultaneous health change and the specific slower following interval. This is descriptive, not a causal analysis or fitted universal S-curve. Complete decisions, comparisons and world remain accessible through explicit controls. Hidden ended-world animation no longer performs redundant scene updates.
New ending graphs reviewed at390/1024/1440 and Thai extra text; currency/rounding and text-size regression fixed. Translation templates now prefer more-specific literal patterns, preventing the older generic health-change template from swallowing the word 'about'.49 tests pass, native age selector and point35 verified actual values, existing views open/close correctly. Review/ending-graphs contains current evidence; review/recap is superseded for design direction.
Owner's name and motto: Life2.0 — What if you could live your life all over again? Updated manual, intake, game, browser titles and hosting display name. Local save identifiers deliberately unchanged to retain lives. Original-game research and economic-crisis engine remain unfinished; custom-domain DNS still pending.

## Personal money, CV and owner-rejected sidebar — 24 October
Personal account starts at15, separate from the family buffer. Editable after-cost
budget, funded books/comics/classes, reserve transfers, rent/commute and personal
ledger added. Paid encounters draw owned personal funds; household wages are no
longer double-counted. Opening month excluded once; CV derives completed spans,
projects and paid class receipts, without invented degrees. Replay retains ledger.
School-age afternoon choices add shared study or a crush with specific acquired
practice, no automatic academic failure or adult dating flag.62tests pass.
Owner rejected half-screen sidebar. Superseded by desktop content-height dock,
320–400px wide; world continues underneath short tasks. Phone retains split view;
advance action now has its own footer rather than hiding below scroll or covering
text. Native phone/tablet scrolling and enlarged Thai money reading exercised.
World skyline lowered and roofs given pitched profiles; not a new 3D engine.
Research/inherited-opportunity-design.md records generalized inherited security,
network and aspiration mechanisms; private family narrative is excluded from
published content. Those richer systems remain future work, as do calibrated
crises, investment assets, admissions/scholarships and native editorial validation.

## Public release — 24 October 2026 (Claude)
Hosting moved from the never-live OpenAI Sites binding to Cloudflare Pages project
`life` (https://life-5wz.pages.dev), repo github.com/Nonarkara/life (public).
Custom domain https://life.nonarkara.org is live (CNAME life → life-5wz.pages.dev,
proxied); a full phone life on it reached the ending with no errors. Verified: four full headless lives
(390/1024/1440/Thai extra-large) plus one on the live URL reach the ending with no
errors or horizontal overflow; 63 tests. Independent review blockers fixed: phone HUD
clipping, student allowance banking (students now pay 70% for school meals/travel),
Family savings / Your own money labels. Open: decision panel overlaps world on
desktop, place labels occluded, world static after 20, flat retirement cash, live
motion not watched, native-language review, crisis/investment/inheritance systems.

## World and retirement fixes — 24 October 2026 (Claude)
Owner asked to fix four reviewer findings. Desktop/tablet reader is now a 320–400px
column beside the world, not an overlay (owner's earlier "world continues underneath"
dock is superseded by this request); stats sit at its foot. Place names render on the
final canvas at 11 CSS px with a paper backing, above all objects, clamped inside the
canvas. Camera widens 20→~58; town adds houses at 25/35/45/55 (layout.js townGrowth,
route-tested, mutation-checked). Pension = max(฿3,000, 40% of age-59 pay) replacing a
flat ฿7,000 equal to retirement costs. Two independent screenshot checks; second
found labels unreadable, fixed and re-verified. 65 tests. Deployed build 188a3a9f2a65
to life.nonarkara.org; full lives on the live domain at 1440 and 390 reach the ending
with no errors. Open: empty space mid-column on desktop, edge cropping, sparse intake.

## Discussion feedback — 25 October 2026
Read the owner-supplied24October meeting summary and transcript; raw recording text
remains outside repository. DISCUSSION-IMPROVEMENTS.md separates product decisions
from unverified claims and future systems. First slice: optional six-needs chapter
priority, independent of life direction, with evidence from the completed period.
Robbins is credited as a coaching lens, not a diagnostic test. Selecting a label
changes no resources/skills/personality. Past focus persists when next focus changes;
legacy profiles remain valid. All new phrases mapped toTH/zh-CN/JA/KO.
71tests pass. Real UI20growth→25→decline invitation→12reasoningpracticepoints;
nextfocus changed and reloaded without rewriting priorgrowth. Thai editing→English
switch verified after independent reviewer caught pretranslated-source bug. Phone
reader scroll reaches lower controls while scene/nav/advance remain visible.
Screenshots review/discussion, independent source/visual review review/motivations.
No silent timed defaults, relocation, portfolio, crisis or medical causal rules added.
Current production hosting is Cloudflare Pages life, not the superseded Sites binding.
