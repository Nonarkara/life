# Life2.0 chapter and replay audit

21 November 2026. Baseline `07eb6f4`, public build `f1f77ae6ff3d`. The renderer, inks, chapters, albums and route reachability work began before this change. The independent audit walked the public baseline from intake to the end and reviewed this interaction at 390, 1024 and 1440 pixels.

## Where play broke down

| Player task | Baseline finding | Change |
| --- | --- | --- |
| Start a life | Manual, intake and birth card precede the first decision. The birth film and family years can take almost a minute with default motion and no skip. | The existing skip still reaches the first decision. A replay from the ending starts there directly. |
| Decide how to spend the next five years | Seven or eight planning tabs competed with an advance button that ran without a choice. Existing life paths and previous promises had little presence at the point of decision. | Three age-appropriate plans spend the same ten effort points. They change the actual engine's effort and priority and preserve commitments. The original planner remains available for custom choices. |
| Play through an outcome | Ages 10–80 ordinarily imply about 140 seconds of passive playback at 2× before reading. The travel narrative could reveal completed income or health before a mid-period event. | Advance directly to the next playable moment in chronological order. Watching the years is an explicit option. Completed outcomes sit in the next chapter's receipt and completed financial ledger. |
| Come back after an interruption | A player who set aside an adult encounter could loop on the same age. A journey saved while travelling had no reliable discoverable way to get to the next moment. | Return reopens the unresolved decision. A committed journey can advance with Next moment, including after reload. A saved chapter choice retains its enabled action. |
| Read the result | Per-answer aggregate mortality could look like a prediction. A heart attack at 65 could still produce a title insisting the player had a safe life. Opening an account at 15 could be misread as a financial drop. | Choice rows show recorded simulation popularity only. Risk aggregates sit with the numbers. The ending names a turn in the record or the age reached. A change of accounts cannot itself create a turn. |
| Learn by returning | A player could replay the same birth or load a bookmark. Finding the exact earlier play among menus took work. The comparison ignored childhood, devotion and education/work decisions. | Replay the childhood directly from the ending or replay the latest completed chapter through the planner. The game recalls a former answer and recorded consequences when the same decision returns. It compares childhood, choices and career paths using the prior ledger. |
| Understand what childhood gave or cost | Small gains in childhood were visible. The route consequences were mostly invisible. Many youth-to-adult effects remain authored one-offs. | The existing constrained-household school decision now includes asking a teacher what else is possible. The previous answer and recorded study/work outcome can accompany the same childhood decision on a replay. |

## Proof of a playable difference

Two browser runs from the same shared birth reached different endings. A school, exams and career run reached 65. A play, band and travel-oriented run reached 40 and met a different set of scenes. The runs changed incident responses as well as plans. The controlled test fixes the birth and changes just the age-15 plan. The band plan opens the office-singer route in a case where exams do not.

The education test fixes a 1975 birth and the later effort and apprenticeship settings. At nine, accepting that a cousin goes on to school excludes the college-funding question at twenty in that route. Asking a teacher leaves that question and the provincial scholarship option available. The player still has to choose the exam, and the branch still respects the existing eligibility and budget rules. This is game behavior in a specified scenario.

The first chapter action fits without scrolling in the audited standard-width layouts. Independent checks covered keyboard Space and Enter, restoring a choice after reload, watching and stepping, setting aside and reopening a decision, and returning to childhood with the earlier choice. Large Thai text keeps the primary action visible. The supplementary actions can require scrolling in that panel.

## Remaining gaps

- Replay compares one prior ledger against the current run. It does not yet offer a branch tree of every abandoned timeline or branching inside a year beyond recorded turning points.
- The encounter deck evaluates some events inside the next five years. The header can show the age at the start of the review while the decision names a later historical year. That timeline presentation needs its own review.
- The model distinguishes household circumstances and individual effort. It still models most learning through skill points and scene-specific flags. It does not broadly represent access to information, trust in advice, reasoning under pressure or how adults relearn.
- Some random draws depend on the state as well as the seed. The same birth is a shared starting point. A difference between two full lives can come from several decisions, constraints and draws.
- Browser simulations establish reachability and interaction. They cannot establish whether players recognise their own history, feel a loss from a previous life, or transfer a lesson outside the game.
