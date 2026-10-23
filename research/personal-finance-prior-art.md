# Life — personal-finance prior art and narrow rules

Research-only receipt, 23 October 2026. No game source changed; no browser control or real financial transaction performed. “Observed” below means read in public source code, documentation, or the existing gameplay receipt. Proposed Life behavior is inference, not a claim those projects implement our simulator.

## Preserve the wheel already studied

[Original-game receipt](../review/expansion/original-study.md) records two completed 1in8b lives. It directly observed spending by purpose, price/credit state, an annual cash ledger, interrupted employment, mortgage/debt, retirement followed by work, and end-of-life records. Most later choices used Auto; neither run exhausts branches. Keep purpose-based spending and an explained cash bridge. REA is a research tool, not the original game's source or a license to its text/art. No need to reverse-engineer a binary to implement a four-category allowance budget.

## Two implementation references

### Actual Budget: money already available, assigned once

Observed: [repository](https://github.com/actualbudget/actual) links its [envelope-budgeting method](https://actualbudget.org/docs/getting-started/envelope-budgeting/). Categories separate allocation, spending and remaining balances; fixed obligations also count. [Budget actions](https://github.com/actualbudget/actual/blob/master/packages/loot-core/src/server/budget/actions.ts) include explicit category transfers. `transferAvailable` limits an assignment to nonnegative available funds. [Its tests](https://github.com/actualbudget/actual/blob/master/packages/loot-core/src/server/budget/actions.test.ts) cover amounts exceeding available funds, negative inputs and nonpositive available balances. This was source inspection, not execution of Actual.

Life adaptation: at 15, expose allowance as a flow and personal cash as a stock. Let players assign that allowance among saving, entertainment, books and classes. Editing a plan moves allocation; it does not immediately spend cash. Applying a period produces transaction records. Permit an explicit unassigned remainder or require a balanced commit; do not silently steal money from another category. Either behavior must be visible and consistently enforced.

Use boundary: [MIT license](https://github.com/actualbudget/actual/blob/master/LICENSE.txt). Method-level inspiration needs no imported dependency. If substantial code is later copied, retain required copyright/permission notices and inspect the precise pinned revision and dependencies. Do not reproduce its interface, tutorial prose or sample budgets as Life content.

### JSON Resume: structured career facts separated from presentation

Observed: [archived schema repository](https://github.com/jsonresume/resume-schema) documents its move to [the JSON Resume monorepo](https://github.com/jsonresume/jsonresume.org). The [readable schema](https://github.com/jsonresume/resume-schema/blob/master/schema.json) separates work, education, skills and projects, with dates and accomplishment fields. The archived repository shows an [MIT license](https://github.com/jsonresume/resume-schema/blob/master/LICENSE.md). The active monorepo package was not fully inspected; pin and inspect its current package/license before importing it.

Life adaptation: derive a fictional CV from completed education, employment intervals, finished projects and demonstrated achievements. Maintain internal `eventId`, completion date and evidence type for each claim; provenance is our requirement, not something this schema validates. Enrollment is not graduation; buying a class is not a qualification; five years assigned to creativity is not an exhibition. An application can show requirements met, gaps, cost and schedule without inventing accomplishments.

Use boundary: schema compatibility is useful without adopting a résumé-builder stack. Validate an export separately if offered. Do not copy sample identities or achievements, and keep game characters clearly fictional.

## What youth education evidence supports

- [Bruhn and colleagues, 2016 randomized Brazilian high-school evaluation](https://www.aeaweb.org/articles?id=10.1257/app.20150149): 892 schools and roughly 25,000 students. Knowledge improved, and savings/budgeting improved, but short-term expensive-credit use also increased. Teaching a product is not evidence that every use of it benefits the learner.
- [The authors' long-term working paper](https://documents1.worldbank.org/curated/en/099739107262230025/pdf/IDU09132deef0979104f800a9dc04d3ca45dc713.pdf) follows around 16,000 participants with administrative data for nine years. It reports less expensive borrowing and fewer late loans later. This is a specific intervention/context, not a measured effect of Life or proof of improved wealth.
- [CFPB's developmental framework](https://www.consumerfinance.gov/consumer-tools/educator-tool/youth-financial-education/learn/) joins planning skills, habits/norms and financial knowledge. Adolescence 13–21 is a broad developmental band with individual and opportunity differences. Starting the allowance mechanic at 15 is an authored pacing choice, not a biological threshold.

Design inference: practice allocating, explain a bill, meet an unexpected expense, then revise the plan. A later investment lesson should contrast liquidity, fees, diversification and possible loss with a deposit/saving goal. Do not reward merely opening the investment panel with wealth. Evaluate comprehension and later decisions, rather than assume more investing means more financial capability. Evidence above does not calibrate Thai prices, allowance amounts, investment returns or mental-health effects.

## Narrow invariants for the next slice

1. Money uses integer minor units. Every transfer conserves total money; saving is not an expense and cannot also count as spendable cash. Household support and personal allowance remain distinct to prevent double-counting.
2. A budget is a plan for a named period. Nonnegative categories plus unassigned funds equal available allowance. An applied period has one identity; replay, reload and rendering cannot apply it again. Changes affect future transactions, never rewrite the record.
3. A five-year review can set a recurring policy, but its cash projection must use the correct number of allowance periods and stop/change at employment or other interruptions. A weekly amount is never silently treated as monthly or annual.
4. Books/classes consume both money and available time. Progress depends on participation and completion. Entertainment may provide rest, experience or relationships; zero entertainment does not automatically diagnose depression. No dopamine proxy.
5. Later housing options compare rent, transport cost, commute minutes, usable time and one-off moving costs on the same period. “Cheaper” rent cannot hide travel expense. A longer commute has a time cost; it does not automatically generate a clinical illness.
6. Investment holdings, liquid cash, realized gains, unrealized changes, fees and liabilities are distinguishable. Purchases cannot exceed available funding; never guarantee returns. For v1, authored scenarios are explicitly simulated. Historical scenarios must name dataset, dates and limits and use a comparable benchmark.
7. The CV is a projection of verified game records. Every qualification/accomplishment resolves to an existing event; no future event, uncompleted course or personality slider can satisfy it. Rebuilding the CV cannot alter simulation state.
8. On desktop, preserve the world while switching one detail section between budget, learning/work, housing, investments and records. The same state backs every section. One-screen composition is a layout hypothesis requiring rendered verification; these sources do not certify it. Large-text and small-screen views may need reading scroll to preserve legibility.

Useful acceptance examples: moving ฿100 from entertainment to saving leaves total funds unchanged; a class purchase appears once; insufficient funds leaves the plan untouched with a readable explanation; changing tabs does not advance time; a completed project appears on the CV with its event; enrollment alone does not. A player can explain both the forgone activity and the money cost after a decision. None of this establishes real-world financial advice or validated learning outcomes.
