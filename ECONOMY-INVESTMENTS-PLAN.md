# Shared economy, owned investments, and crisis evidence

25 October 2026. Continues the owner's approved Life2.0 work: economic crises,
investment education from15, real exposure/trade-offs, and a compact console.
Existing approval and current Continue instruction authorize implementation/release.
This implements a requested system gap; it does not certify superiority by itself.

## Decisions and evidence
Preserve the existing cash budget and use Actual Budget's already-studied method:
assign money once and keep transfers distinct from spending. Current research
contracts in research/economic-crises.md and personal-finance-prior-art.md govern
historical provenance and ledger invariants. A researcher is checking portfolio
prior art before source edits. No third-party UI, prose, assets or code is copied.

Use the retained World Bank Thailand GDP series to sample contiguous historical
blocks for a fictional2030+ world. Keep complete contraction clusters, especially
1997–98; do not invent a regular crisis interval. Same seed/replay retains the
same world independently of choices. Only elapsed years appear in the UI.
GDP samples are historical observations; fund returns/wage response are explicitly
authored game rules, not historic stock/bond returns, probabilities or forecasts.
SEC asset-allocation/bond-risk material and BOT1997 lesson support educational
mechanisms, not the numeric response functions.

## Sacred items
- Preserve all world/canvas/graphs/HUD, original10-point rules, pace, CV and stories.
- Preserve current compact desktop and phone consoles, music, all5languages.
- No file shrink>30%, template cards or new permanent dashboard.
- Preserve old saves and receipts. Activate new economics only from a saved life's
  current review; past income/holdings/history must not change. New lives begin
  with the world at0, with no investments before15.
- Rendering, opening panels, planning and reloading never apply market returns.

## Proposed changes
NEW economy.js/data: deterministic immutable world definition and observed annual
scenario rows; documented GDP source/window, spell/block-boundary logic, authored
bond/equity returns and wage factor; no future series in visible panels.
NEW investments.js: actual fund account values/cost bases, funded buy/sell with
visible fees, proportional released basis, realized gains and mark-to-market
receipts from prior holdings. No leverage or automatic selling of investments.
MODIFY finance.js: net worth includes actual assets, retain independent liquid
cash/debt; apply annual market changes and shared wage factors exactly once per
completed period, preserve originalcash identity including market gains/losses.
MODIFY sim.js: defaultworld, legacyactivation, replay/previousworld preservation,
strict validators forworld/holdings/receipts/history, markers for actual shocks.
NEW investment-view.js + compactCSS: Money Budget/Invest subnavigation; common
cash summary once, fund value/cost basis table and attached trade input/actions,
fee preview and clear insufficient-funds feedback. Original budget/housing/shop
remain accessible. No giant sliders. UI actions disabled during pending events.
NEW economy-view.js: World shows an elapsed-only GDP sample chart and period
exposure facts, annual return rates (clearly game values), a sourced historical
parallel for contraction spells and limits. Keep society/environment records.
MODIFY events.js/event-graphics/ending consumers: actual market/work shocks appear
once on appropriate history tracks; whole net worth includes holdings everywhere.
MODIFY translations.js: translate every new visible label/explanation in5languages.
NEW focused tests: source spell grouping, sameworlddifferentchoices, legacy
activation/replay, funding bounds, fees/basis/realized/unrealized, no invented
positions, ledger identity, crisis losses/recovery, malformed saves and translations.

## Verification
Run full npm test/build, shrink/diff checks. Play funded trade→chapter→crisis→
response→recovery and reload via real browser; verify unheld assets cannot lose
money, cash and invested value differ, and future rates are hidden. Inspect
390/1024/1440 and enlarged Thai, new/sparse and mature/dense, preserve all3personal
consoles. Independent source/rendered review. Commit/push/Cloudflare release,
canonical alias then customdomain complete asset hashes and actual public UI.
If the preview/browser remains offline, record that precise limitation; do not
substitute local pixels for production evidence or claim complete goal success.

## Integration clarifications after source inspection
History's cash track still used the family buffer. Move the primary financial
track to actual personal net worth when an account exists, preserve the original
family chart in a disclosure, and make market markers report real market deltas.
Extend personality comparison to actual account wealth; suppress misleading
comparisons for legacy lives that joined economics later, and disclose that the
comparison paths keep cash rather than make investment trades. The engine's
block sampler is intentionally an authored biased scenario, not an empirical
crisis hazard; disclose that inside World as well as the research receipt.

## Cold-start dependency repair
Responsive cold navigation stayed on Opening with no script error while both
local stylesheets imported Google font CSS. CSS imports can block module startup.
Remove the two blocking imports and load the exact same font stylesheet URLs
through a small local async fonts.js with print media until loaded. Include it in
course/manual/intake HTML. No font family, weights, game state or layout tokens
change. Verify cold browser navigation, native scripts and a regression preventing
external CSS @imports in these entry stylesheets. This is necessary release work,
not an unrelated redesign or a claim that fonts are now offline/self-hosted.

Fonts finishing late invalidate cached3Dlabel text and request one repaint;
the renderer removes that listener on disposal. No time/resources change.
