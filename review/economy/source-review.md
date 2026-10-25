# Economy / investments source audit

Bounded source review, 25 October 2026. No UI/browser review or product edits. Engine files changing concurrently; this receipt describes inspected code, not final release approval.

Independently executed all six tests in tests/course/economy.test.mjs: pass. Reviewed economy/economy-data/investments/finance/sim integration. Normal funded buy/sell uses fees once, proportional released basis, realized gain net of selling fee, and marks only actual positions without automatically selling them for cash. Holdings contribute to net worth once. Period wage response is an arithmetic annual mean applied to that period's earned income, not persistent compounded wage growth; disclosures should match. Legacy activation starts at current age and replay restores same seed schedule; old records stay unchanged in covered tests.

## Required malformed-ledger correction

Market receipt identity and chronological order are not validated. Minimal executable reproduction: funded age20 account; trade equity buy2000; markHoldings20→25. Rename first market receipt ID to 'renamed'. validFinance returns true. Re-running markHoldings20→25 reapplies that year because its canonical ID is absent: net worth10450→10920, and validFinance still returns true. Separately changing buy receipt age20→24 while later array entries have market ages21–23 also validates. Enforce canonical market ID matching age, chronology, and relevant entry date constraints. No normal UI path to mutation observed; this is a concrete malformed-save defense failure under the requested strict ledger/replay contract.

## Sampling limitation requiring honest disclosure or revision

Uniformly choosing any historical starting index and truncating blocks at2025 yields nonuniform source-year weights. Across4000 seeds×81 years,1961 appears483 times,1962 968,1996 5296 and2025 5340. Contraction share6.89%, versus4/65=6.15% in the retained source. Backtracking a start at1998 to1997 further reweights the crisis cluster. Preserving contiguous spells is useful, but these are authored scenario samples, not unbiased empirical crisis probabilities. Do not imply empirical frequencies or neutral historical resampling; revise algorithm if that is the intended contract. End-of-life truncation also naturally cannot preserve an entire spell beyond age80.

No normal-play cash identity/basis double count demonstrated in this pass. Full suite, current UI, elapsed-only rendered disclosure, translated inputs/errors, and deployment remain outside this receipt. Both findings sent to root and mechanics agent with reproducible evidence.

## Hardened engine / consumer recheck

Independently reran seven current economy tests: all pass. Canonical market/trade IDs, monotonic ledger dates, same-age market ordering and world-derived source/delta verification close the previous reproduced malformed-ledger blocker. markHoldings now rejects a malformed ledger before applying returns. Sampler weighting remains unchanged but the World disclosure explicitly says it favors some years/crisis starts and does not reproduce measured Thai frequency; the statistical limitation is disclosed rather than silently claimed fixed.

Consumer finding requiring correction: cash markers are not scoped to the actual account. game.js builds household-chart rows with events:[] and economy:undefined, but eventsFor still derives work/commission/flood from row.event. Thus personal work interruption/commission paints on the unchanged household buffer, and household-only flood damage paints on Personal net worth. Add explicit account-aware event filtering; an empty recorded-events array does not suppress inferred prose markers. Preserve illness/bereavement events on their appropriate tracks.

Reviewed personal net worth conversion: available+reserve+held asset values−debt is used in current/history/ending/cohort; family buffer remains separately accessible. Legacy shared-world comparisons are suppressed when activeFrom>0. Current economy view takes rows only through state.age; response rates are identified as authored. No demonstrated double counting in inspected consumers. Investment inputs distinguish current value/basis and disclose fees, unrealized and realized results; draft/feedback remain English-source for localization observer.

Inspected early1280×720 trade35/world40 actual captures. Table columns and controls are coherent, no duplicate permanent metric console was added, and the three original bottom instruments remain. These early frames are not the final responsive/enlarged-language gate. In trade frame bottom “Your own money” is still a broad label for net worth: users must use the dedicated spendable-cash summary when judging buying power; retain that distinction in final UI.

## Account-marker correction / view-copy check

Reviewed exported eventsForAccount and actual game chart call site. Modern household markers now retain flood only; personal account excludes household flood; genuine legacy household work events remain accessible when no personal account existed. This closes the demonstrated wrong-account marker finding. Independently executed the current economy UI tests (including account scope), and re-executed all seven engine tests; results recorded in tool output.

Executed historicalParallel for1997/1998/2009/2020: each selects the intended explanatory paragraph and corresponding source label. Positive growth yields no contraction parallel; worst contraction drives a single contextual comparison. GDP sample/calendar and authored fund returns remain explicitly separate. Method array indexes currently select the correct sampling/holdings limitations. No new source blocker found in this bounded correction/copy pass. Final responsive investment/world/enlarged-language pixels are still pending; prior early1280 frames do not establish that gate.

## Startup dependency repair / preserved surface check

Inspected fonts.js, active course/settings CSS, course/manual/intake entry HTML, build copying/versioning and paired Money summary override. Independently ran tests/startup-fonts.test.mjs:1 pass. Local font loader is async; remote stylesheets start with media=print and switch to screen only after load. Active app CSS no longer imports the external service. Existing fallback stacks remain. Legacy dist/style.css still has an import, but build places that unrelated legacy entry under /legacy; it is not an active course/manual/intake dependency.

This removes the demonstrated startup dependency mechanism in source; test does not simulate actual slow/failed network, so real cold-start evidence remains root's browser verification. Loader preserves families/weights. Build copies the new file and versions local HTML script references normally.

Money summary's later economy.css override is now three paired label/value rows rather than three narrow value columns. Reserve transfer remains a named optional disclosure. Source retains Budget/Invest, purchases/housing, CV, World, History and separate household chart. No source blocker found in this repair; final rendered enlarged-number/layout gate still pending.

## Final responsive English captures

Independently inspected invest1440/1024/390 and world1440/1024/390 originals. No demonstrated overlap, clipped numeric values or gratuitous empty dashboard column in these captures. Invest keeps Spendable above its positions; Reserve/debt is optional, value/basis/fees are grouped with trading. Existing three condition/traits/goals instruments remain. World GDP chart earns its age35–55 extent and explicit percentage units, with contraction points visible rather than an empty future horizon.

Copy recommendation: Condition's “Your own money” now means net worth (6,161,201), while Spendable is4,393,686 in the same state. Use “Personal net worth” to make the nonliquid distinction persistent. These are different facts rather than duplicate values, but broad labels can obscure that distinction.

Phone Invest actions and World exposure are below the captured fold. Source uses the existing scrollpane and preserves controls; these six stills alone do not establish the scrolled interaction/reachability. Root must retain its real-browser scroll/action evidence. No additional geometry blocker found within supplied captured regions. Enlarged-language new economics proof and inhabited-biography scene work are separate gates; no approval inferred for unseen states.
