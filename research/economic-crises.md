# Shared economic shocks: evidence and implementation contract

23 October 2026. Research in progress; not yet a calibrated runtime model.

## Evidence retained

- World Bank annual real GDP growth for Thailand: research/thailand-growth.json, 65 non-null observations, retrieved from the official API. Negative growth appears in 1997, 1998, 2009 and 2020. Consecutive 1997–98 observations describe one contraction spell, not two independent crises. GDP contraction is neither a complete banking-crisis definition nor a household outcome. Do not turn four negative years into a universal hazard or fixed recurrence interval.
- Bank of Thailand, Lessons learnt from the Asian Financial Crisis: https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html . The 1997 episode involved foreign capital, property lending, currency exposure and short borrowing against longer investments. A currency fall could worsen foreign-currency liabilities. This supports an exposure mechanism, not a stock-picking recipe or an individual-level effect size.
- Laeven and Valencia, Systemic Banking Crises Revisited (2018): https://www.imf.org/en/publications/wp/issues/2018/09/14/systemic-banking-crises-revisited-46232 . Catalogues banking episodes and distinguishes currency/debt crises. Latest 2026 update was located but its underlying data have not yet been extracted or validated. Do not silently blend versions.
- Federal Reserve, 2023 household survey: https://www.federalreserve.gov/publications/2024-economic-well-being-of-us-households-in-2023-expenses.htm . Financial cushions and household means differ; some respondents report borrowing or selling possessions to meet an emergency. This is US descriptive survey evidence, not Thai causal evidence or a universal emergency-fund threshold.

## Mechanics to implement

The world owns calendar-year shocks independently of player effort/personality. Same-world replay keeps the shock schedule. Household consequences depend on the resources and exposures actually accumulated before the shock. No personality trait causes a macroeconomic crash.

1. Retain provenance, country, definition, observation window and missing years for each historical series. Show distinct contraction spells, not a misleading smooth cycle.
2. Historical mode replays documented years. Fictional future mode must identify any sampling as a scenario generator, preserve multi-year clusters, and never label its events as predictions. No arbitrary periodic crash or probability described as academically calibrated.
3. Add auditable holdings and obligations before asset-specific losses: liquid savings, debt/currency, income sector and concentrated versus diversified assets. Current single cash buffer cannot represent all of these. Do not infer stock holdings from the security goal.
4. Each event presents a short sourced fact, the current household's actual exposure, cash-flow consequences and available choices. No automatic buy-the-dip winner; liquidity constraints can make selling necessary.
5. Record losses and responses once in the cash ledger and event graph. Delayed employment, debt and care consequences persist beyond the initial choice.
6. Reflection separates observed protections, authored simulation assumptions and fortunate starting conditions. Include counterexamples and people still harmed despite prudent preparation; avoid survivor-only investment stories.

## Proof required before release

- Episode grouping and missing-data tests against the retained source.
- Same seed/world timeline under different household choices.
- Ledger identity with no double losses; no impossible sale or invented asset.
- Distinct impact for cash-constrained and liquid households without guaranteed immunity.
- Browser play through a complete crisis and recovery, all five language coverage, sparse/dense chart review.

Current encounter release does not implement these crisis mechanics. This document prevents substituting a generic random cash penalty for the requested shared economic world.
