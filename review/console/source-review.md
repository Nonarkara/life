# Independent personal finance/CV source audit

Read CONSOLE-FINANCE-PLAN, finance.js, cv.js, integration and existing finance tests. No UI/browser review requested or performed.

## Concrete corrections

1. validFinance accepts a class purchase without any matching purchase receipt/debit (independently reproduced). buildCV then claims Short class attended from that unbacked purchase. Match each purchase to its receipt and cost, reject orphan purchase receipts, and enforce the8-hour per-age aggregate in validation. UI prevents duplicates/time overflow, but loaded records currently bypass these invariants.
2. moveReserve changes current wallet/reserve without updating current history.finance. Net worth conserves, but historical latest snapshot disagrees with live account. Update the current snapshot consistently, as buy() already does.
3. Define and test opening-month transitions. If15 school support1500 is paid before selecting vocational work, current flow retains that school month and adds59×5000 vocational income, but charges60×1200 vocational essentials. Under a one-month-school policy, only59 months of vocational essentials belong; under an immediate-replacement policy income must offset the actual opening grant. Current treatment mixes the two. Same issue applies changing school to independent work at15. This is boundary accounting, not a claim that a particular wage is realistic.

## Checked properties

Normal buy flow debits only personal available cash, rejects repeated same-age purchases and >8h, leaves initial attributes/household cash unchanged, and stores acquired skills separately. Period receipt arithmetic conserves personal net worth including reserve/debt; fun/learning are actual expenses, saving is an internal allocation. Budget edits do not spend. Legacy absent accounts accepted, ended legacy life not retrospectively opened. CV route spans come from completed history and do not claim degrees; event milestones filter accepted choices. No UI layout/translation approval is implied.

Remaining tests should target route switches after opening support, receipt/purchase correspondence, loaded time-budget overflow, and latest-snapshot consistency after reserve moves. No public release verdict given.

## Corrective finance re-audit

All three prior findings closed in source: first supported month now excludes both income and essential costs from the subsequent route; exact purchase/receipt correspondence and per-age8h cap validated; CV classes require paid receipts; reserve transfers update current history snapshot. Personal and household accounting now separate from15, with only family flood damage reducing household buffer. Encounter costs check owned wallet+reserve before resolution, including upfront uncertain-project funding; free alternatives remain available. Replay retains previous story/finance ledger.

Independently ran finance and CV tests: all12 pass, including changed-route opening month, unpaid class rejection, reserve snapshot, replay and acquired-skill wage premium. Starting attributes remain unchanged by learning/purchases; additive financeSkills are retained in capacity history.

One remaining concrete narrative mismatch: work interruption still says it reduces the household buffer, although the revised ledger charges personal finance and leaves household buffer unchanged. Update to personal income/buffer, including translation coverage. No new demonstrated arithmetic blocker in inspected normal flows. Save validation is structural/accounting integrity, not cryptographic proof of arbitrary local-file provenance.

No UI or translated console composition verdict provided; this remains a scoped source audit.
