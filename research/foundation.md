# Life game — research foundation

Research date: 23 October 2026. Preliminary behavioral study; no source-code reverse engineering or complete playthrough yet.

## Evidence

Read the supplied concept in full and The People article. Confirmed the original address through https://1in8b.life/en/about/; similarly named search results describe different products.

Browser sample: original v0.8.21 beta, default settings, Deepak Joshi, Delhi, born December 2026, income quintile 4, mechanic father and homemaker mother. Birth record → Begin this life → age-zero simulation. Observed time controls through 16×, next-decision control, health/happiness/knowledge/relationships, family record, pixel scene, chronological events, cohort comparisons, year grid and survival curve. Mobile viewport shows scene above repeated status bars and a long life record. No complete life or repeated-life comparison was performed.

Official documentation describes birth-weighted country sampling, annual focuses, conditional choices, yearly mortality and historical/future settings. These are developer claims, not independently validated statistical implementation. Source: https://1in8b.life/en/about/

REA reviewed at https://github.com/morluto/rea. It supports JavaScript and runtime investigation as well as native analysis. It was not installed or executed. Use if inspecting the public client becomes necessary; do not assume access to private server logic.

## Proposed foundation, pending the director's next concept instructions

Preserve birth lottery, unequal starting resources, decisions under uncertainty and reflection. Make time allocation the main playable system. Show consequences through a persistent Thai neighborhood that grows into school, work and city life.

Separate simulation state, researched event data, narrative and rendering. Every location, person, relationship and asset needs a persistent ID. Geometry, occupancy, movement and occlusion belong to the engine; generated prose must never invent authoritative spatial state. Seed randomness by subsystem and event so replaying one decision does not randomly replace every unrelated event.

Use an authored event pool with eligibility, costs, delayed consequences and competing obligations. Skip uneventful stretches. Decisions should change feasible actions and the visible world, not merely increment four meters.

Possible explicitly game-like mechanic: limited counterfactual branches after a life, comparing time budgets and consequences under the same external shocks. This is a proposal, not an approved design.

Historical scenarios must expose only indicators available at the decision date. Hide the era label if desired, but do not promise players cannot infer it. Keep observed data, estimated parameters and fictional outcomes distinct. Historical correlations do not validate individual health, wealth or happiness predictions.

Surviving to 80 can be a challenge mode. Disability should change constraints and available paths rather than automatically erase the possibility of a meaningful life. Happiness needs player-defined priorities and multiple dimensions; avoid a universal moral score.

## Rendering investigation

Provisional first candidate: authored 2D sprites in a small 3D/isometric scene. Compare one identical room-and-street slice in Godot and a browser renderer before committing. Assess phone startup, frame pacing, touch legibility, occlusion, Thai typography and asset workload.

Godot supports browser exports using WebAssembly/WebGL 2; mobile browser caveats require real-device testing. Source: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html

Unreal warrants a separate native visual prototype if cinematic realism becomes essential. Its documented Pixel Streaming route streams a server-rendered application to browsers, introducing hosting and network dependencies. Source: https://dev.epicgames.com/documentation/en-us/unreal-engine/pixel-streaming-in-unreal-engine

Apply existing anti-slop rules before UI work. Derive palette, type and composition from the owner's current design sources; golden-section proportions are optional compositional tools, not a reason to compromise readability. MoMA reference remains unspecified and must not be represented as a verified formal rule set.

## Remaining investigation

Complete multiple lives with contrasting choices; record decisions and timing. Inspect public client state transitions and save format. Validate probability implementation separately from promotional claims. Then choose the smallest playable slice after the next concept instructions. No game implementation, engine benchmark, deployment or source reuse has occurred.

## Resource histories and consequential adult choices — director update

Accepted direction, 23 October 2026: graphics must communicate changing resources across a life, not merely decorate choices. Treat early death as possible, with no guaranteed remaining-years counter. Allow divergent priorities including pleasure, intimacy, art, ambition, family and longevity; do not reduce meaningful life to survival or wealth.

Proposed visual grammar:
- Linked age-axis histories for physical function, emotional wellbeing and money, with event annotations and consistent units. Separate dimensions instead of a falsely precise universal health score.
- A stacked time budget for work, care, rest, learning and recreation; cash runway in months; small current values adjacent to their histories. Pies only for genuine part-to-whole snapshots, never trajectories or unrelated scores.
- On a contemplated choice, show costs and plausible consequence ranges separately from observed history. Show uncertainty without disclosing a predetermined death date. Missing evidence remains unknown.
- Life review compares branches under shared external shocks and distinguishes choice, circumstance and chance. A successful short life is possible; no moral leaderboard.

Model adult sexuality, substance use and illness through contextual state transitions, not automatic punishments or guaranteed creative bonuses. HIV exposure, infection, diagnosis, treatment and disease progression are distinct states. Risk depends on exposure and prevention; sex frequency alone is not an infection mechanism. Effective treatment can permit long healthy lives. Era, care availability, coverage, travel, lost work and out-of-pocket costs must be researched for Thailand before calibration. Do not assume every patient pays full drug prices.

Cocaine may be represented as an offered adult choice with uncertain acute effects, acute medical risks, dependence, sleep disruption, money and relationship consequences. Do not implement a verified creativity multiplier: subjective confidence or perceived inspiration is not evidence of improved creative output. Artistic achievement also depends on practice, opportunity, support and sustained work. Recovery and treatment must remain possible paths.

Biographies supply authored dilemmas and contextual narratives, not probability estimates. Avoid survivor bias by including ordinary lives, recovery and unrealized ambitions alongside famous artists. For each research item record source, date/place, observed experience, causal limits, proposed mechanic and calibration evidence. Distinguish documented facts, composite fictional characters and simulation assumptions.

Sources checked: https://www.who.int/news-room/fact-sheets/detail/hiv-aids ; https://www.unaids.org/en/frequently-asked-questions-about-hiv-and-aids ; https://nida.nih.gov/research-topics/cocaine . No medical probabilities have been implemented. The first UI remains rejected by the owner and unpublished; these requirements do not reinstate its visual approval.
