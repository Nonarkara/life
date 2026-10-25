# Ikigai and three persistent consoles — research/design recommendation

25October2026. Read current prototype/AGENTS.md, context.md and DESIGN-RULES. Recalled at most three relevant memory results through brain recall; current project rules take precedence. Read current personality.js, motivations.js and records. Research/design only: no product source or browser changes.

## Evidence and limits

The original2012 Imai/Osada/Nishimura paper develops Ikigai-9, a specific questionnaire rather than a formula derived from money or skills. It cannot validate a different game index merely by citation. [Original publication](https://www.jstage.jst.go.jp/article/jph/59/7/59_433/_article/-char/en).

The developer’s official site describes a subjective construct involving present-life feelings, future orientation and meaning in relation to others. Ikigai-9 is nine self-report items, scored9–45, and is not diagnostic. Product/app inclusion or modification requires prior contact with the developer. Do not copy/adapt questionnaire items or present our0–100 calculation as its score. This project can instead author a clearly distinct observational proxy. [Developer-maintained instrument site](https://sites.google.com/view/ikigai9/).

The2009 original study examined retirees over60, using exploratory and confirmatory samples. It found partial overlap with subjective wellbeing, while distinguishing the constructs. That population and research method do not support using a videogame rule across every age/culture. Keep wellbeing and the new metric separate; do not rename wellbeing as Ikigai. [Original gerontology study](https://www.jstage.jst.go.jp/article/rousha/31/3/31_366/_article/-char/en).

These primary sources motivate caution, not model coefficients. No health/longevity causal bonus follows from our index. No claim that a four-circle career diagram is a validated measure is warranted by these sources. Avoid such a diagram here; money, paid employment and prestigious occupation must not be prerequisites for a meaningful life.

## Recommended product semantics

Visible name: **Ikigai · game proxy**. Accessible/expanded explanation: **Recorded follow-through toward what mattered in the completed chapter. Not a measure of your real purpose or an Ikigai-9 score.**

This is deliberately narrower than subjective ikigai. Existing event records cannot reveal whether a person experienced life as worth living. If the owner later wants that subjective perspective, offer a separate optional player-authored reflection, not inferred sentiment or a simulated clinical questionnaire.

Keep three separate layers:

- **Intentions:** editable life direction(profile.aim), current chapter priority(profile.focus), effort/pathway/budget for the upcoming period. Editing these never rewrites a completed index.
- **Completed evidence:** the previous row’s frozen profile/effort/pathway plus actual acquired skills, finance snapshots and resolved encounters within(from,to]. Pending choices count as unresolved, never successful follow-through.
- **Interpretation:** authored, versioned game proxy and a short explanation linking each contribution to its exact record. Current resources/personality remain separate.

## Minimal useful metric, not a new latent psychology engine

Prefer a compact **evidence count** over invented precision: **2/3 recorded** plus last completed age range. Each of three *explicitly authored evidence checks* is yes/no/unavailable. If a conventional0–100 index is required, derive round(100*met/available), show met/available nearby, and label the endpoints as evidence coverage, not life fulfillment. No decimals, population percentile or diagnostic red/green band.

Suggested checks for the completed selected focus:

1. **Relevant practice was recorded:** acquired practice/time related to the selected priority, not simply selecting its label. Use actual row effort plus pathwayLearning, financeSkills and storySkills; annotate that some “practice” is an authored allocation proxy rather than observed hours.
2. **A relevant choice was resolved:** an actual matching story.seen record with a specific accepted option. Give relationship/care choices credit without requiring marriage, parenthood or payment. A phone call and private creative practice can qualify. A declined invitation is recorded honestly; do not infer that absence proves no social life.
3. **A relevant outcome was recorded:** explicit effect/finance change or completed work/study/project record consistent with that priority. Selecting a future goal is not an outcome; a planned course is not a degree. Avoid counting the same event twice as both practice and outcome unless that double contribution is explicit and justified; safer to require independent evidence records.

This is a design proposal, not validated scoring. **Do not silently ship universal thresholds.** Define a small per-focus contract with eligible evidence types, provenance and opportunity rules, then test it. Existing focusEvidence already contains much of the mapping but returns presentation strings; expose typed evidence rather than parse text.

Examples of honest handling:

- Growth: acquired reasoning/creative practice, a paid class actually attended or completed study span. Do not reduce growth to IQ or cash spent.
- Connection: actual resolved shared/contact/care choices, without adult romance flags for school-age crush. Reciprocity is currently incompletely simulated; do not claim it is measured.
- Contribution: recorded mentoring/helping/listening; no wealth or parenthood requirement.
- Recognition: public sharing can be an observable action, but recognition by others needs an actual external response. Do not treat an exhibition alone as acclaim.
- Variety: actual route change/new activity; compare completed routes, not the newly edited future selection.
- Security: actual comparable personal net-worth/debt/buffer records, while describing shocks and constraints. Financial gain is not personal worth; an unavoidable flood does not mean a failed person.

A check with no modeled eligible opportunity is **unavailable**, not failure. For old saves with no selected focus, missing finance or insufficient independent evidence show **— / Not recorded**, never fabricate a neutral50 or backfill historical goals. For no eligible checks, index=null. A low value means few matching records in this limited model, not lack of human purpose. At birth/childhood before chosen goals, show Not yet assessed; no infant “meaning deficit”.

Do not add this number to mortality, mental-health, wage or trait formulas. It summarizes existing records and may help reflection; it must not reward optimizing a happiness meter. Preserve full outcomes and source records on demand.

## Reuse current systems

- personality(state): retain authored initial/current OCEAN values. Display O,C,E,A,N in order, with current bars and optional original thin marks. N is currently Emotional sensitivity; do not silently invert it into emotional stability or imply a validated BFI-2 result.
- capacities(state)/capacityHistory: reuse reasoning and emotional-skills game indices. Preserve innate attributes versus learned skills distinction and history consistency.
- finance netWorth: use personal wallet+reserve−debt; keep household safety buffer explicitly separate. Explain units once. Finance balance is actual modeled baht, not a score comparable to OCEAN.
- state.history and story.seen: provenance for completed goals/evidence. Reuse focusEvidence semantics, with typed values/references added by root if approved.
- Existing saves: prefer a pure derived view first, no required persisted field/migration. If historical formula comparability matters, store modelVersion and explicit evidence references separately; never rewrite original profile snapshots.

## Three compact persistent laptop consoles

1. **OCEAN:** five aligned rows, one label set, same0–100 scale, modest original/current key. No radar beside duplicate editors. If labels abbreviate, full names remain accessible.
2. **Resources and condition:** personal money, health, reasoning/emotional skills, wellbeing and Ikigai proxy; each value belongs with its unit/status. Ikigai’s completed-period age range is visible, unlike live balances. No duplicate HUD elsewhere.
3. **Five-year direction:** upcoming period, direction/focus, current effort/pathway and necessary advance action; completed evidence clearly separated. Existing Money/CV/World/History controls remain reachable without opening another full dashboard.

Do not assign arbitrary equal heights. Measure actual labels/controls at1024×768 and1440×900, then use content-height groups with stable scene safe rectangles and a clear inner-scroll fallback. “Always readable” means no essential console hidden behind a tab at normal laptop size; “no document overflow” must not mean clipped content or inaccessible enlarged text. Keep phone/portrait-specific arrangement and explicit scrolling, not three microscopic desktop panels. Respect the current owner’s circle decrement/angular increment rule. World stays primary; nothing may hide the protagonist or activity target.

## Acceptance invariants for implementation

- Editing aim/focus/effort/budget does not change the completed proxy, historical values or OCEAN.
- Selecting a focus alone yields no score/effect; pending encounter produces no completed credit.
- Repeated rendering/load/resize/language changes cannot mutate resources or duplicate evidence.
- Typed evidence links resolve to actual records at correct age; no unpaid CV/class, no invented degree or recognition.
- Null/missing/legacy states remain valid and visible as unavailable, not zero/default50.
- Formula version/threshold explanation transparent; equal evidence gives equal result regardless of sex label, language, render speed or wealth unrelated to that check.
- Future periods and different focus checks are not presented as scientifically comparable standardized tests.
- EN/TH/Chinese/Japanese/Korean reversible localisation; enlarged text and keyboard focus remain reachable.
- Current laptop captures + interaction verify all three consoles/world/advance without document overflow. Source/test green is not visual approval.

## Recommendation to root

Implement typed completed-evidence first and a visibly limited proxy; do not retrofit a clinical Ikigai score or copy licensed instrument items. The compact count-with-provenance is the most honest first version. If the owner requires a single100-point number, retain the evidence fraction and null behavior, document authored per-focus thresholds, and obtain a dedicated independent model/UI review before public publication.

## Implemented v1 contract

The shipped candidate uses one observable check per eligible completed chapter,
then displays the count of chapters with evidence out of eligible chapters. It
never adds the index to health, money, personality or mortality. Pending chapters
wait for their encounter to resolve; missing focus/opportunities remain ungraded.
Growth checks recorded practice in the completed life direction (physical practice
for sport, craft for art, emotional practice for connection, reasoning/drive for
security, a broad practice set for balance), including acquired extra skills.
Security recognizes an actual reserve contribution or debt repayment when the
period had resources beyond essentials. Variety checks a completed route change
or resolved project start. Connection, contribution and public sharing use actual
resolved matching opportunities. No opportunity is not a failed person.
This is an authored follow-through contract, not a validated model of meaning;
its provenance remains the actual chapter and selected focus. The visible count
is preferred to a precision-looking percentage. Tests cover future-plan immunity,
pending choices, unavailable records, physical/emotional growth and debt repayment.
