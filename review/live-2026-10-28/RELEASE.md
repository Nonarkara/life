# Release record · 28 October 2026

Build `4f50b23ea92c` is live at <https://life.nonarkara.org/course/>.

## What shipped

The console became one screen. At 1280px and wider it is a dashboard: your
life on the left (scene, life deck, decision, commit), the year around you on
the right (the chart of the years, three full-width meters measured from a
centre line, what that year did to you). Below 1280px the consoles are one
strip you swipe sideways. The transport reads Play, Pause and Fast Forward,
and the fast-forward arrow is thicker the faster it runs. Health, mood and net
worth live once, in the deck's own panel. The childhood memory band is a
two-column instrument instead of a 65-character strip with an empty margin.

The 46-request art catalogue is a batch: 28 painted plates from the local FLUX
model and 18 character sheets, reviewed frame by frame and named in
`art/frame-approvals.json`.

## Audit before the release

| Gate | Result |
| --- | --- |
| `npm test` (220 tests) | 220 pass, 0 fail |
| `scripts/audit-anime-assets.py` | 172 manifest images, every path present, 8.4 MB of image files |
| `scripts/check-deck-geometry.mjs` | 5 viewport and text cases, 4 language cases, restored failure verified |
| `scripts/check-shipping-geometry.mjs` | 8 observed cases pass, the prior failure is rejected |
| `scripts/verify-stage.mjs` | 390 / 1024 / 1440: page overflow 4px, no panel overlap, no console error |
| `scripts/verify-beats.mjs` | 4434 painted samples at the love and bullying moments |

## The deployed site, measured on the deployment itself

The verifiers now take a base, so the same measurement runs against the live
site rather than only against a local preview:

    LIFE_BASE=https://life.nonarkara.org LIFE_REVIEW=review/live-2026-10-28 \
      node scripts/verify-stage.mjs
    LIFE_BASE=https://life.nonarkara.org LIFE_REVIEW=review/live-2026-10-28 \
      node scripts/verify-beats.mjs
    LIFE_BASE=https://life.nonarkara.org node scripts/measure-live-weight.mjs

- `build.json` on the live origin and in `out/` both report `4f50b23ea92c`, and
  the live `boot.js` imports `game.bundle.js?v=4f50b23ea92c`: the bytes that
  arrived are the bytes that were built.
- Live layout at 390, 1024 and 1440 matches the local measurement exactly:
  page overflow 4px, no panel overlap, the plan card overflowing 24px at
  1440, and the three transport keys present.
- Live beats paint 4434 samples with no console error and no warning.
- One ordinary review view costs **13 requests and 741 kB**: the art is
  fetched on demand, so the larger catalogue does not make the first view
  heavier.
- The saved-life schema is unchanged, so a life saved before this release
  still opens.

## What is not claimed

Ordinary routines still draw in 3D; only the recorded moments are painted, and
that is the hybrid setting, not a rollback. The grandmother's crouching pose
has no published frame and keeps its 3D fallback. Three plates carry small
signage the model drew. Actual M3 hardware performance is still unmeasured.
