# The three laws of Life2.0 (owner, 10 November 2026)

These outrank every plan in this repo. A change that breaks one is a defect, whatever else it adds.

1. **Better than the viral one.** Better graphics, a better story, or a deeper mirror; ideally all three. Every life is built as a story: it builds, a big twist drops it, and it comes back round to a reckoning before the end. Choices are the platform for what follows, so a decision must be able to send a life completely astray.
2. **No two lives alike.** Hundreds of players must never get the same life. One decision branches to a different route. Guard: `npm test` plays hundreds of lives and fails if any two match, if lives share too many scenes on average, or if any scene outside childhood reaches too many lives. Measure before claiming variety.
3. **No hallucination, spatial or factual.** Every screen has one place for the eye to start and a clear order after it. The verdict is the title; nothing competes with it. A page that does not know where to start also lies about its content, its economy and its use of the screen. Prove it on a rendered screenshot at 390 x 844 and 1440 x 900. Facts carry a source or are not stated.

# Life — permanent design constraints

**Read `THE-BOOK.md` first. It is canon.** Non's design scripture — MSH, anti-slop, glance path,
hierarchy, kinetic grids, spatial honesty and the ship gate. Load it before designing,
building, reviewing or shipping any interface, map, deck or visual; walk B1–B18 before you
merge and name an auditor who is not the builder. `STYLE.md` protects deliberate style and
never waives the ship basics.

Read `context.md` and `DESIGN-RULES.md` before changing any interface.
For work from another agent or checkout, read `INTEGRATION-STATUS.md` first.
Verify ancestry and actual diffs; historical handoff reports must not overwrite later repairs.
Apply the anti-slop-design skill. The owner's current direction preserves the
palette and mood; it rejects redundant information and invented spatial demand.

Treat the rules in DESIGN-RULES.md as release requirements, not suggestions.
Preserve the live world, charts, controls, saved lives and multilingual access.
Do not call a source scan, build or automated test a visual approval.

**Measure the tree that is actually served.** The build writes a new `out/` by
renaming, so a preview server already running on 4219 can keep serving the
previous build's directory, and a render or a probe then measures stale bytes.
After `npm run build`, restart the server and assert the subject exists before
measuring it. The build id in `build.json` is a content hash of the output:
compare it with the live `build.json` to prove which tree is deployed.
