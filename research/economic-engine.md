# Shared economic scenario and owned funds

25 October 2026. This implementation is an authored teaching scenario, not a forecast or an investment return database.

## Historical observations

`economy-data.js` pins all 65 retained Thailand observations, 1961–2025, from the [World Bank real GDP growth API](https://api.worldbank.org/v2/country/THA/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=100), retrieved 23 October 2026. The source receipt is `research/thailand-growth.json`; values are unchanged. The indicator is annual real GDP growth, not inflation, an equity return, or a complete banking-crisis definition. 1997–98 is one consecutive contraction spell; 2009 and 2020 are other negative years in this window.

The [Bank of Thailand's 1997 lessons](https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html) motivate explicit exposure and liquidity. They do not calibrate this game's household wage or fund-return rules. [SEC bond guidance](https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds) distinguishes credit and interest-rate risks; the game's bond fund does not promise principal repayment at maturity. [SEC stock guidance](https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks) distinguishes appreciation/dividends and risk. No real investment product or advice is offered.

## Reproducible world

The saved definition stores version 1, seed, fictional startYear 2030 and activeFrom only. Its deterministic world path has ages 0–80. A private cache is an optimization; deleting it leaves results unchanged. Panels request elapsed rows only.

Each source block starts from a seed-selected observation and has an authored 8–15 year target length. A start inside a negative-growth spell rewinds to that spell's beginning; an end inside it extends through the remaining consecutive negative observations. Blocks resample at their ends. This preserves the 1997–98 cluster and avoids a fixed crisis interval. Uniform block starts with truncated tails and contraction rewinds give unequal observation frequencies: late source years and spell starts can be overrepresented. This is an authored scenario distribution, not an empirical hazard or an unbiased bootstrap estimator, calibrated recurrence model, or claim that historical conditions literally repeat in 2030. A finite horizon can end during an episode; no future year is displayed to finish it.

GDP observations are historical. Returns are separate authored seed streams. Negative-growth years receive equity returns between −35% and −12%; other years between −8% and 20%. Bond-fund returns range −3.5% to 6.5%. These numeric ranges are game tuning, not historical estimates, expected returns or guarantees. GDP does not equal asset performance. Wage factors use `max(.75,1+growth/35)` in contractions and `1+min(growth,10)/200` otherwise. Only work income changes; allowances and pensions do not. No CPI series or real purchasing-power claim is added.

## Actual exposure and accounting

Cash available, reserve and debt remain separate. Optional holdings contain bond/equity fund market values and cost bases in whole game baht; absent holdings mean zero exposure. Net worth adds actual holdings values once. No fund units, live prices, leverage, tax or automatic liquidation are modeled.

Trades occur only at review from 15, outside pending events. Buying gross value requires value plus fee in available cash. Selling removes gross value and returns it less fee. Fee is 0.5%, rounded to whole baht, minimum 1. Buy basis includes its fee; sales release proportional basis, with the final sale clearing rounding residue. Realized gain equals net sale proceeds minus released basis. A trade changes net worth only by its fee. The ledger keeps the gross transfer separately from income/expense.

Only positions held before a completed period receive its annual valuation. Each year has one market receipt; repeated application skips an existing identity. Zero-held assets produce zero asset change. Saving during the period does not acquire funds retroactively. Market changes preserve basis and liquidity and add the actual held-value delta to net worth. Insufficient liquid money uses the existing cash/reserve/debt rules; funds are never silently sold.

Legacy saves preview a world definition without mutating state. First trade or next committed chapter activates economics from the current review. Prior income/records remain unchanged. Replay starts the same seed's full scenario at birth while preserving the previous life's activation and records.

## Prior art and limits

[Ghostfolio's order schema](https://github.com/ghostfolio/ghostfolio/blob/main/prisma/schema.prisma) separates date/type/quantity/unitPrice/fee from holdings. This informed the conceptual separation of transaction and valuation; no code was copied. Ghostfolio is [AGPLv3](https://github.com/ghostfolio/ghostfolio/blob/main/LICENSE). Actual Budget's previously studied MIT implementation supplies the general conservation pattern. Life's implementation is original.

Tests cover cluster boundaries across seeds, elapsed visibility, shared-world reproducibility, funded trades/fees/basis, held-only valuation, annual idempotency, ledger identity, legacy activation/reload and replay. These are source/model checks; they do not establish improved real-world investing or substitute for real UI crisis/response/recovery testing.

The receipt validator accepts up to 1,000 bounded entries. New trades stop at 900 to reserve room for later chapters; they do not block ordinary dense play. The dense-life regression attempts all shop choices and twelve buy/sell pairs per review and reaches age 80 with more than 200 receipts.

Save validation enforces canonical annual market identities, chronological receipt dates and source-year/rate consistency with the saved world. A renamed market receipt cannot earn the same year twice; buy dates cannot follow market years already processed. Shader/rendering and panel opening never apply these rules as mutations.
