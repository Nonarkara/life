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
