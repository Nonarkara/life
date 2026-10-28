# Reconciliation with the MiniMax handoff audit · 28 October 2026

This follows `2026-10-28-minimax-handoff.md` (audit commit `d5a5297`). That audit
rejected one candidate, `scratch/anime/candidates/sheet-player-m-b.png`, at
SHA256 `c38575fd099c53800b26e17c13fd6639d9368a57d42714e3e6bf74c45acf04a2`,
modified 00:35, for four defects: the upper-left reading body had no head, an
isolated shoe sat separately, the easel pose had no painter, and the gardening
figure switched to grey.

## The file that was rejected is not the file that was published

The 46-request batch was run again after the audit, at 04:15–04:19, and the
MiniMax connector rewrote all eighteen character sheets. The published sheet
hashes:

    art/sources/sheet-player-m-b.png   864c7fa0d135dbe95d9082bce73caff35d3ccf32ba4c64910cba224357dbce45

which is not the rejected `c38575fd…`. The defects the audit recorded were
checked against the published frames and none of them is present:

- the reading body has its head attached, and the shoe is worn, not separate;
- the easel pose has its painter, brush and palette;
- all four poses wear the same mustard shirt and olive trousers.

Evidence: `2026-10-28-player-b-frames.jpg`.

**One thing is lost and is recorded here rather than glossed:** the batch
overwrote the rejected candidate, so the file with hash `c38575fd…` no longer
exists on disk and its defects can no longer be re-examined. The audit's
written record stands as the only evidence for it. The candidate path is under
`scratch/`, which is ignored, so the rejected file was never tracked and cannot
be restored from the repository.

## What was published, and how it was checked

Eighteen character sheets were promoted after review, cut into thirty-one
sprite sheets, and named frame by frame in `art/frame-approvals.json`. Every
promoted sheet was checked at frame scale, not at contact-sheet scale, because
a small thumbnail cannot show a missing head:

- `2026-10-28-promoted-sheets.jpg` — the eighteen sheets as a whole.
- `2026-10-28-player-b-frames.jpg` — the four player-b poses, male and female.
- `2026-10-28-bike-and-child-frames.jpg` — the four cycling and child poses.
- `2026-10-28-punch-and-elder-frames.jpg` — the punch, dodge, cheer, lie and
  the four elder poses.

One frame is withheld on purpose: the grandmother's crouching pose, which the
rule-removal pass mangles. She is published with the three poses that cut
cleanly, and a life that needs the fourth keeps its 3D fallback.

## Test count

The audit reported 220 tests. That is the whole suite. `tests/course/*.test.mjs`
alone is 215; the other three files (`tests/model.test.mjs`,
`tests/asset-versions.test.mjs`, `tests/startup-fonts.test.mjs`) hold five
more. The full suite now passes 220 of 220.
