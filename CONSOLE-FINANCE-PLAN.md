# Life2.0: money, CV and one-screen console

## Alignment and decisions
Implements owner's current direct request and continuing authorization to build.
Preserve animation and charts; desktop console fits viewport at normal reading
size. Phone reserves a stable animation area above section navigation and the
selected reading panel. Enlarged text may scroll within its panel rather than
clip content. No blanket document overflow:hidden that hides unreachable content.
Tabs Plan / Money / CV / World / History remain visible. Only the selected reading
task is shown; one fact has one primary home. Ending retains its graph-first view.

Personal cash is separate from the household safety buffer already simulated.
At15, eligible school support grants one initial monthly allowance, exactly once.
Budget percentages apply to income after essential costs; default20% reserve,
10% enjoyment,10% learning, remainder spendable. They are editable, not financial
recommendations. First-month support is excluded from the later period total.
Adult recurring obligations include food, chosen rent and commute; family/study
support, earnings and retirement have distinct sources. Plans are not receipts.
No actual securities return is introduced until asset exposures and shared-world
shocks exist; age15 tutorial starts with cash saving, opportunity cost and risk.
The later investment/credit/crisis engine remains required, not declared finished.

## Sacred items
- Keep world, motion controller, childhood, course overview, graphs, replay and
  event records; move into deliberate sections rather than deleting them.
- Preserve old saves and historical household amounts; no retrospective personal
  portfolio fabricated for an ended legacy life.
- Keep EN/TH/zh-CN/JA/KO, text sizes, focus, keyboard controls and reduced motion.
- Starting attributes never rewritten by spending; learning affects acquired skills.
- No file shrinks30%; no fabricated CV degrees, social titles or dopamine levels.

## Changes
- NEW course/finance.js: optional versioned personal account, one-time support,
  bounded budget, essential-cost/rent/commute flow, once-per-period purchases,
  auditable cash conservation and validation. Authored tuning clearly labelled.
- MODIFY sim.js: initialize account when reaching15, apply complete financial
  period once, retain optional account/history snapshots and legacy compatibility.
- MODIFY encounters/personality only where needed to keep effects and history
  additive; finance learning stored separately from encounter skills.
- NEW course/cv.js: completed education/work spans, actual projects/milestones,
  source-age provenance. Plans never presented as accomplishments.
- NEW course/console.js + console.css: persistent stage, compact navigation,
  selected content; money tutorial/plan/purchases, CV, recorded world context.
- MODIFY game.js/index/build/imports: attach console without replacing earned
  elements; invalidate only changed data, preserve active section after edits.
- MODIFY translations/settings: full phrases for new UI and responsive scripts.
- NEW tests finance/cv/console plus real browser walkthrough and independent review.

## Verification
Conservation: personal net worth after = before + income - essentials - enjoyment
- learning - purchases. Transfers between reserve and wallet do not create wealth.
No duplicate first allowance, period receipt, purchase or effect. Negative input,
NaN, malformed plans/receipts rejected; no spending unowned money.
Old saves load; same-world replay resets personal decisions without changing
outside-event seed; capacity history matches actual acquired skills.
CV claims only completed records and displays interruptions, never assumed degrees.
Desktop1440x900 and1024x768: document fits, world remains visible, every panel and
control reachable. Phone390x844: animation and section switching stable, inner
scroll explicit; enlarged Thai/CJK reachable rather than clipped.
End-to-end15 allowance→book/comics choice→budget→work income→rent change→CV→ending,
plus independently reviewed sparse/dense screenshots, then commit/push/deploy.

## Prior art
research/personal-finance-prior-art.md; original-study receipt. Borrow funded
category accounting and separated CV sections, not code, assets or source prose.

## Latest direction: study and relationships
School-age relationships use friendships, crushes, dating, boundaries and limited
attention. Adult intimacy remains separate. Model study/social/rest opportunities
without a deterministic penalty for romance or a claim that studying causes poor
communication. Admissions and social development must use actual participation,
resources, support and uncertainty; no sex-count eligibility rule or dopamine
measurement. This remains required next work beyond the personal-account slice.

## Owner visual correction, 24 October
The half-screen reading column is rejected. Desktop reading width now follows a
340–440px content measure; scene receives the remainder. Preserve phone split.
Reduce skyline dominance and give buildings pitched roof profiles, retaining all
landmarks, material chords and actor routes. Validate through rendered screenshots;
this is a bounded refinement, not a claim of a new 3D engine.
