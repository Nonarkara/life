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
