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

25October publication proof:9e72307 pushed, Pages459123f0; public buildde58e8f2adc5
verified from directalias and customdomain, servedgamebundle matches localbytes.
Real publicbirth→10connection→15sharedstudy showsone sharedmoment;71tests. Current
URL https://life.nonarkara.org. Screenshotreview/discussion/live-chapter-feedback.png.

## Three.js world —25October2026
Read the supplied agent handoff as advisory evidence; preserve its useful priorities
without importing instructions or unsupported claims. Original-game round3 covers
currentv0.8.36 documents, retained3endings and a manually played Botswana branch
through15. REA assessed, not installed; no original art/code/text imported.
The owner requests a major graphics upgrade: pinnedThree0.185.0, locally bundled
and minified, retainedCanvasfallback. Jointed people face motion, stride follows
path distance, seats support the family, props distinguish routines. Committed
pathway overrides aspiration; actual recovery context changes the routine. All
real daily paths clear shared furniture/desks/growth. Floor slope joins the
shared exit; no scene update spends or changes simulation resources.
Desktop dock is320–360px and content height. Projection reserves its width;
phones focus on the activity. Raycast cutaways use parallel orthographic rays
through actual scaledhead/torso anchors. Settings pauses until explicitResume;
visibility handler pauses when documenthidden. Background/sleep behavior and
GPU failurefallback remain unverified at runtime, not claimed from source.
78tests pass including the off-centre child occlusion regression. Independent
review cleared source and final390/768portrait/820portrait/1024/1440stills;
collegecutaways make the actor visible. These are stylized miniatures, not
photorealism, fullSimsAI, or measured10xquality. Wider handoff work—autonomy,
economic exposure/holdings, relocation, event-addressed replay and relationships—
remains real implementation work, not something this engine solves.

## Public cache correction and verification
First graphics upload2215d5022868 passed server probes but an existing browser
kept old2D. The loader's multi-dot game.bundle.js import was not versioned.
Fixed the matcher and hashed generated output plus build transforms;78tests
pass and repeated builds give befd48c0d958. Public deployment1ad434bf now passes
three matching probes per alias/custom domain and actual old-browser3D DOM/
screenshot verification with its saved life retained. Public pause, overview,
normal/reducedmotion and a fresh alias-origin newborn scene were exercised.
RELEASE-READINESS.md records exact hashes and receipts. No full-game completion
or exhaustive original-game study is claimed.

## Personal consoles, independent places and music — 25 October 2026
The current slice adds three persistent desktop instruments: OCEAN, Condition
(personal money, physical health, wellbeing, IQ/EQ game indices, Ikigai proxy),
and five-year goals. Original HUD/goal controls are moved, not duplicated; all
other panels/charts/history remain. Phone uses three instrument tabs. Standard
1440/1366/1024 laptop and390 phone document dimensions match the viewport; long
records and enlarged type use contained scrolling. Thai extra corrected after
actual controls clipped and financial digits wrapped.
Ikigai is a completed-priority follow-through fraction of eligible chapters, not
Ikigai-9 or a measure of real purpose. Pending opportunities are ungraded, and
changing the next plan cannot rewrite the fraction. All actual life-direction
keys are tested. No physiology or outcome bonus is attached to this metric.
Adult housing/work choices have effective ages, retained history and real routine
origins. City work extends the world; independent adults eat/rest at their own
home while parents remain at theirs. City pay/travel tuning is explicitly authored.
Furnished rooms, city blocks/transit/bicycle/planters and closer adult framing
upgrade the miniature. No full Sims autonomy or transport boarding is claimed.
Original Small Hours instrumental synthesis is CC0, explicitly started and muted
from the header, suspended on hidden pages; audible quality is not yet listened
to by a human.105 tests pass. See review/personal-console/README.md for runtime
evidence and limits. Existing saves and five language controls are retained.

Publication: dc3c25c pushed, Pages7092d5c4; buildb58148524e8e serves exact hashes
from canonical/custom domains (3consecutive each). Public in-app preview reports
offline and Chrome app inspection times out, so public pixels/save retention are
unverified this slice. Local final console/canopy and responsive workflows pass.
The owner's latest oversized-editor screenshot is from the earlier public UI;
compact28pxcontrols, single-label ten-slot rows and content-height254pxdesktop
dock are now deployed. Actual local evidence is not called a public screenshot.

## Current continuation — economic world and inhabited biography
The previous released buildb58148524e8e was observed working again publicly with
its saved age15 life intact. New work adds actual funded bond/equity holdings,
conserved fee/gain ledger, elapsed shared economic history and contraction facts.
History separates personal net worth from preserved household cash. Scenario
sampling is deliberately authored/biased; GDP observations are sourced, fund
returns are game rules, and crisis probability is not empirically calibrated.
The owner's new direction replaces generic miniature-town ambition with inhabited
biography. First milestone: fictional soi frontages, three life stages, persistent
school case, recorded purchases/remembrance and near/far work routines. Palette241
roles and diffuse backgrounds/cel figures replace unowned material choices. Existing
world, Canvas fallback, saves and outcomes remain. /study fixtures do not touch saves.
Independent source review is bounded; logo-removal recognition and human playtesting
are still needed. Reciprocal partner commitments and deeper domestic changes remain.

Publication: bc278f9 pushed; Pagesbfcbfe4c/build45c8e88b629d. Both canonical and
customdomain pass3consecutive graph-hash probes. Actual public age15save retained;
buy100/sell100 deducts exactly2fees, reload preserves1,498 andrealized-2. Public
scene-study12 andmatched35eveningbranches render with no browsererrors.121tests
and independent bounded source/visual review pass. See review/biography/PUBLIC-RELEASE.md.
A native screenshot still returned a416pxcrop after a viewport request; it is
explicitly failed evidence. Replacement selected-tab screenshot is1440x900 and
DOMmatches. Never infer screenshot dimensions from the viewport call alone.

## Life 2.0 — painted stage and the lived moments, 26 October 2026
Owner direction: throw away the generic isometric diorama for hand-drawn
animation in a Japanese RPG/manga language, at a much wider and more realistic
scale, and show the lived moments (friends, biking together, basketball, fist
fights, falling in love, being bullied, good grades, bad grades, on the bed and
off the bed). The frame is a Truman Show: one baby, a life played by actors who
use the player's own data, the console as the control room. The simulation is
untouched — routine, biography, records, encounters, numbers, saves and charts
keep their meaning; only the renderer changed. The isometric diorama stays
behind Settings → World.

Art: 23 painted plates and 13 keyed sprite sheets, cut by
scripts/prepare-anime-assets.py. Art direction is described by traits (late-80s
cel animation, 1990s roleplaying game, confident ink line, two-tone shading,
limited palette); no named work, character or logo is copied. Plates are wide
21:9 paintings; figures are keyed frames drawn on twos.

Beats: a beat is a lived moment with its own plate, cast and effect, and may
only be drawn when the life records it — bikes (the friendship years), love
(the first evening), fight (the fight that came out of the bullying), bully
(the corridor), grades (read out of the twenty-eight questions), bed (a body
being repaired). New encounter `bully` (15–20) gives the corridor its choice:
push back, tell a teacher, say nothing, or ask someone to walk home with you.
The `foughtBack` flag is what the fight beat reads.

Pipeline repairs made this slice, each found by looking at the picture:
- the figure join was O(n²) per merge and the body-clustering loop never
  terminated once a sheet had more than four pieces; a sheet took 12 minutes
  and never finished. It is now a spatial-grid union-find plus one assignment
  pass: 25 seconds for every sheet.
- rules are now filled in with the colour around them instead of punched out of
  the drawing, so a line that crosses a figure no longer cuts the body in two;
- only thin bands count as rules, so a head of hair above an apron is no
  longer mistaken for a line (the mother's head had been deleted);
- sheets whose layout is not an even grid have their panels written down by
  hand (friend, mother, father, player, partner);
- the model's own panel borders are used as the division when it drew them.

Renderer repairs: the scene cut was a black diagonal painted over the new
drawing; it now reveals the new drawing over the old one, with a white frame
first. The journey band had a visible join where the plate repeated; it now
scrolls the soi street with a soft shadow at the join, and the wide town plate
is the street set. The stage says "waiting for its art" instead of showing a
hole when a plate has not arrived.

Verification: 178 tests pass. scripts/verify-beats.mjs plays a life until the
moment happens, stops the life there and photographs the stage at the hour
that moment belongs to; no console errors and no warnings. Captures in
review/beats: love at dusk on the bridge, the fist fight in the alley with
manga impact lines, the boy who does not let up in the classroom, two bicycles
in the lane. A source scan and a build are not a visual approval.

The art is now pulled when it is needed rather than all at once: a life visits
a few places, so the stage asks for the plate it is about to draw. The whole
set was also trimmed (figures 400px tall at quality 82, plates at quality 68,
4.3MB in all), and a stage that is still waiting for a picture says so on a
dark ground instead of showing a hole.

The bullying is conditional, and the condition is the life: a child who
carried crates at the market stall instead of keeping the books, a life that
put nothing into school, or a life that had already gone badly. It is a
condition of the world, not a punishment for the player. The encounter is
priority 1, so it takes the place the questions leave open, and about one
life in seven lives it.

The interface chrome of the new features is translated in all five languages:
the Questions tab, the answer prompts, the counterfactual table, the roads
not taken and the world setting. The twenty-eight questions themselves are
still English-only outside English; that is the largest remaining gap.

Still missing: the twenty-eight questions are not yet translated into Thai,
Chinese, Japanese and Korean; the report-card beat is covered by tests but
has not been photographed, because it needs answered questions; the adult
player's face drifts between two player sheets; the world is not yet a full
Truman Show — there is no control room, and the actors still follow the
routine rather than a script.

## The painted stage draws each life as itself, 27 October 2026
MiniMax's painted stage drew every life as one Thai woman in a yellow t-shirt, with
one mother and father, in one wooden house. A man, an intersex body, a grandparent
household, two mothers, two fathers, a slum, a condo, a villa and every city abroad
were drawn wrongly, and a newborn was drawn as an 8-year-old schoolgirl.

Rule now (dist/course/stage2d.js `castSheet`, `paintedCovers`): a life is painted
only when the art covers it, meaning the right body, household and kind of house,
at age 5 or older. Every other life keeps the 3D world, which already varies by sex,
household and region. New art is picked up by name, with no code change:
- bodies: `player|child|elder` plus `-m` (man) or `-x` (intersex), e.g. `player-m-bike`;
- households: `grandmother`, `mother-b`, `father-b`. A parent slot is drawn by who
  fills it, so a grandmother poses like a mother;
- places: `<plate>@<style>`, e.g. `home-day@villa`, `street-day@tokyo`. A life abroad
  needs home-day, street-day, school and work for its style.

The missing art (18 sheets, 28 plates) is specified in art/missing-art-requests.json,
in MiniMax's request format with its own style wording. The replacement home plates
are a Thai stilt-house room (no shoji). The rival is regenerated without the teal
skin and blood. Put the results in scratch/anime/src under those file names, then run
`python3 scripts/prepare-anime-assets.py all`; sources that don't exist yet are skipped.
No image generator is installed on the M5 (the ComfyUI + Krea note in CLAUDE.md
did not match this machine).

Other repairs: the partner sheet's hand-written panel boxes cut through two figures;
each sheet is now scaled by one factor, so a seated body keeps its real height; on
desktop the painting's focus and its people sit left of the docked panel; in the
office the player stands at the painted desk instead of a second desk drawn on top
of it; MiniMax's new CSS lost its rounded corners and was put back on the console's
14px and 12px sizes.

## Approved hybrid release,27October2026
New default Hybrid keeps ordinary routines in3D and paints supported recorded
moments. Explicit painted/isometric preferences persist. Coverage is current-scene
only; absent body/pose/home art retains3D. A shared scene descriptor owns cast,
plate and caption. Paused cuts finish immediately; hidden canvas sizing reads the
visible sibling before renderer ownership changes. Missing/failed assets never
replace a living3D view with an unloaded frame. /study uses explicit authored
fixtures, not save injection, to exercise the actual renderer.

Inherited47-file MiniMax/Claude handoff preserved separately in1975de4. All28
questions were already translated in that baseline; this release adds29five-language
rows for hybrid moments and market corrections. No runtime image model or local
24GB engine. No new character-sheet batch produced in this release.

Market-loss prompts require actual owned loss. Follow-ups describe an explicitly
labeled equal-start scenario fund basket, can rise/fall/stayflat, and do not promise
a recovery or prescribe the player's best decision. Historical choices/ledgers
remain intact; obsolete unresolved prompts may clear. Nominal bank balances no
longer incur an invented inflation withdrawal. Broader calibration remains work.

Remaining visual limit: independent review still identifies excess empty ground
in the city3D framing. Current artwork is not a complete consistent animatedcast.
Do not claim whole-system no-slop approval or M3hardware performance certification.

## Shipping repair after Gemini review, 27 October 2026
Authoritative period projections retained; predicted gains now live beside effort
controls with a translated explanation disclosure. Default phone forecast clears
the fixed action; desktop plan dock is310px max. Eight observed geometry cases
and a restored-prior-layout negative fixture are recorded inreview/shipping-oct27.
Simultaneous answer commitments now protect every donor's minimum; preview and
actual periods normalize effective effort consistently before pay/skills.
Swim entry/exit stay in water pose inside the basin, and the character aligns
with its long axis. School bicycle return leaves desk on foot, mounts on lane,
and dismounts at home. Unsupported painted poses keep3D. Saved schema unchanged.
213tests and independent source/pixel review pass. Broader art quality and actual
M3hardware performance remain unmeasured; do not inflate this bounded clearance.


## Cockpit completion · 28 October 2026
Implementation e766951 (main repair1791a8a), build4ba7e74e270f; deploymenta70ec66f.
Six dark Palette panels get content-earned two-column width (520–600pxdock);
phone Set points/Direction physically precede monitoring for keyboard order.
Detailed personal board stays reachable in You rather than adjacent duplication.
Pure deck-model.js separates current monthly flows from holdings and history,
shows debt repayment/shortfalls and cash-only runway. Chart preserves signed
wealth, zero and elapsed records; exact observations/qualifications remain.
Native dynamic controls/units update/reverse on language switch. 220tests pass,
geometry current-vs-restored310px failure proves the first expansion cause.
Independent source/pixel review cleared this bounded cockpit/art scope.
Two male standing frames only; rejected repeated-leg walks are excluded by
art/frame-approvals.json. Offline generation quarantines candidates and does not
overwrite approved art. Runtime never requires the24GB authoring model.
Full46-request batch, smooth new walk cycles, broader3D/art quality and actual
M3hardware performance remain unfinished/unmeasured. See review/deck-release/REVIEW.md.


## The console as a cockpit, and the art batch · 28 October 2026 (session 2)
The console is now one screen. On a screen of 1280px or more it is a dashboard:
your life on the left (the scene, the life deck, the decision), the year around
you on the right (the chart of the years, three full-width meters measured from
a centre line, and what that year did to this life). Nothing is drawn under a
panel any more, the page never scrolls, and each console scrolls itself. Below
1280px the consoles are one strip you swipe sideways, so a console is never
squeezed into two columns three rows deep. The childhood memory band was a
65-character strip with a wide empty margin; it is now a two-column instrument
with the household income beside the memory. Measured at 390, 1024 and 1440:
page overflow 4px, no panel overlap, the plan card overflows 24px at 1440 and
nothing is cut in half. The transport reads Play, Pause, Fast Forward, and the
fast-forward arrow is thicker the faster it runs, so no speed is printed as a
number. Health, mood and net worth live once, in the deck's own panel.

The local FLUX download needed the illustration LoRA named explicitly
(ali-vilab/In-Context-LoRA:portrait-illustration.safetensors): --lora-style and
--negative-prompt are inert on FLUX.1-schnell in this build, and a negative
prompt cannot remove lettering from it either. With the LoRA at 4 steps a plate
takes about 110 seconds and matches the published standard. Eighteen character
sheets came from the MiniMax connector; eighteen were reviewed, and seventeen
were promoted with a four-pose cut each. A one-row sheet has neighbours leaning
into each panel, so the cutter now keeps only the figure that owns the panel; a
walk cycle the model drew facing both ways is turned so the character never
turns mid-step; the grandmother sheet holds a fifth figure, a child, under her
third pose, and her crouching pose is withheld because the rule-removal pass
mangles it. art/frame-approvals.json names every reviewed sheet and frame.
The painted stage now draws the recorded moments: 4434 painted samples at the
love and the bullying moments, with no console error or warning. All 28 plates
were generated, reviewed and cut; three of them carry small signage the model
put in a school or an office, which a negative prompt cannot remove on this
model and which was left in rather than hidden.
