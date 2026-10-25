# Original-system study, round three

25 October 2026. Read-only public-source pass alongside the lead agent's separate gameplay pass. No browser UI control, installation, posting, payment, code extraction or source mutation was performed here. Read the [two-life receipt](../review/expansion/original-study.md) first to avoid treating previously observed features as discoveries.

## What was actually accessible

- [Official English page](https://1in8b.life/en/) currently identifies itself as v0.8.36 beta; the earlier receipt studied v0.8.22. Read its rendered text and controls. This verifies declarations, not underlying algorithms or calibrated event frequencies.
- [Official About](https://1in8b.life/en/about/) explains intended progression, sampling, mortality and storage. These remain operator descriptions.
- [Terms effective 24 October](https://1in8b.life/en/terms/) explain copyright, fiction, keepsakes and storage. Its explicit distinction between general ideas and its protected code/text/pictures supports an independent implementation of patterns.
- The main page links Developer API at `/en/api/`; the linked destination returned 404 through the web tool. `/api/` and `/api/docs` were inaccessible. Update notes appears as a button, with no readable linked changelog; a guessed changelog route was inaccessible. A direct HTML request returned 403. No bypass was attempted. We did not obtain API contracts, update-note contents or verify any internal formula.
- Read [REA README](https://github.com/morluto/rea) and [CLI/evidence guide](https://github.com/morluto/rea/blob/main/docs/cli.md), not its execution. It supports static JavaScript analysis of local artifacts and evidence with explicit coverage/limitations. Setup modifies agent registrations, so it was not run. REA is optional tooling, not the original game's source or permission to redistribute it. Its own code is MIT; third-party terms remain separate.

## Useful distinctions beyond the earlier receipt

| Primary-source declaration | Reusable idea | Difference from current Life source |
| --- | --- | --- |
| Main page offers duration choices and compares sampling by annual births versus existing population. | Explain exactly what randomness samples. Separate viewing pace from simulation conditions. | Life uses a Thai setting and optional authored intake conditions. It should not imply worldwide representative sampling. |
| Main page declares four peer lives born simultaneously and reflections at 5/15/30/50/70. | Parallel context and reflection can make a run meaningful without ranking it. | Life's same-world replay isolates the player's branch more directly. Keep that distinctive comparison; a new cohort needs its own documented generator. |
| Main-page status descriptions describe indirect effects and a diminishing return to knowledge. | A displayed score should name its uses and limits. Repeated investment need not improve everything indefinitely. | Life has authored effort/learning effects. Make those effects inspectable; do not import the original's unverified threshold or present game scores as psychological tests. |
| About describes yearly focus, event choices, automatic play and year-by-year mortality, with death not fixed at average life expectancy. | Recurring priorities can coexist with exceptional interruptions. Average survival is not a promised endpoint. | Life reviews five-year periods and offers contextual encounters; a meaningful interruption could pause within a period. Doing so requires a time-model change, not merely another button. |
| About describes local records and transfer between browsers. | A long simulation benefits from portable, recoverable records. | Life already saves locally. Export/import can preserve ownership; validate version/schema before accepting a transferred life. |
| Terms describe keepsakes generated after a finished life and rooms holding things that person actually had. | An earned-object memory gallery can make consequences tangible. | Life has record/recap evidence. An original room/gallery can project those records without copying assets or adding paid memorial mechanics. |

The source's statistical-fidelity statements were not independently audited. No fetched source proves disease odds, country calibration, or replay retention. The current pass does not establish which declarations were added between versions; it only establishes their current presence.

## Strongest next pattern: animate the outcome that actually happened

Source-verified Life gap: [routines.js](../dist/course/routines.js) receives only actor, age, clock and goal. [world.js](../dist/course/world.js) passes the latest aspiration. The player therefore goes to school by age, to sport/art by aspiration, otherwise to work; parents disappear at fixed player ages. Meanwhile pathways, health setbacks and encounter outcomes exist elsewhere. A person can finish a costly study/work choice while the scene continues its unrelated daily cycle. This is a semantic disconnect, not a palette problem.

Recommended independent design: derive a small visual routine state from committed life records. It should name current occupation/education status, household membership, a current activity and any recorded recovery restriction. The routine engine uses that state to choose a destination and pose. The event ledger, caption and animation must resolve the same event identity. Examples are proposed Life behavior, not observations of the original's renderer:

1. A committed college pathway sends the person to study with a book; enrollment alone never creates a diploma.
2. A completed paid project adds its work prop/memory object; an uncompleted ambition adds none.
3. An actual recovery interval interrupts the existing destination and shows rest or a visit. Low cash or low wellbeing alone never invents an illness.
4. Marriage/parenthood can add a named person only when recorded. A family member's absence needs the relevant event; the renderer must not manufacture death at an age cutoff.

Keep movement pure: drawing cannot spend cash, award skills, trigger events or advance time. Preserve existing routes and collision checks. An unknown/legacy status uses a clearly generic routine, not a fabricated career. Record-derived routines should survive pause, speed changes, reload and language changes without changing the underlying outcome.

Verification should compare two otherwise identical states with different committed pathways and confirm distinct destinations/props, then reload each and see the same routine. Also test an aspiration without its achievement, an unresolved choice, a health score without a medical event, and a legacy save. Finally watch the real animation: passing source tests does not prove that a viewer can identify the activity or person.

## Scope and use boundary

This pass extends public documentation research; it does not replace the lead's actual play receipt or claim exhaustive reverse engineering. Borrow state/outcome relationships, sampling explanations and earned-memory patterns. Independently author formulas, text, graphics and animation. Keep explicit attribution to The Sims and 1in8b.life while preserving Life's own Thai world, constrained choices and same-world replay.

## Additional browser observations —25October
Current browser shelf retained three lives:91India,32Pakistan and46Nigeria.
Nigeria life Olumide's age46 malaria ending was inspected today; its intervening
choices ran outside observation, with Auto still enabled when a newlife began.
Do not count that as a fully manually played research run. Its ending has a useful
internal mismatch: prose calls him an officeworker, last-job field saysdriver.
Our CV/scene must use the same authoritative work record rather than regenerate it.

A fourth life Farai, Gaborone/Botswana2026, quintile2, was actively played. Disabled
inheritedAuto, usedNextdecision, personally chose closeobservation at2, football7,
piggybank8. Named siblingbirth, friend, familycare and school incidents accumulate
between cards. Childhoodchoice returns in a later descriptive record. Age7hobby
cardshowscompactdirectional effects, but no quantified timeopportunitycost. At8,
Spend&invest pauses the world andshowsownedmoney0, unaffordabledinner/lessons disabled;
not an invitation to adultinvestment. This is verifiedUI behavior, not validation
of rates or psychologicalclaims. No payment, memorialpost or externalsharing used.

Useful: card→visibleconsequence→latermemory; separateongoingannualfocus; affordability
andpausewhilebudgeting. Improve: keep scene/caption/CV on one actualstate, explicit
units and finite time, matureactivities and proportions. Avoid importing fixed
personality-from-childhood determinism or interpreting populationrates as personal
predictions. The original's breadth is still not exhaustively tested.

### Further manual observations
Farai continued school at the age12 and age15 decision cards; both attempts
resulted in enrollment in this particular run. Fees, transport and family means
were explained before the attempt. This does not establish the admission formula.
At15 he owned244 in the game's US-terms currency after recorded holiday work.
The spending sheet exposed a recommended-now subset, optional additional items,
and disabled unaffordable lessons. Expanding its living-policy section exposed
bank/bond/balanced/index/self-directed allocations and optional recurring spending.
It disclosed a default bank allocation and a reserve threshold for automatic
purchases. Those are useful patterns: progressive disclosure, explicit defaults,
affordability and automation with a liquidity constraint. Its quoted returns
are not imported as Life2.0 investment assumptions. No investment or real-money
transaction was executed. This run remains incomplete at15; research coverage
is deliberately narrower than the original's full branch space.
