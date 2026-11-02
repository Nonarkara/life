# Class, scene and console audit · 3 November 2026

Baseline `a733ec6` (implementation `21bc4cf`), already on origin/main. No competing trees were merged over later repairs. The existing dirty prototype and detached ship checkout were preserved. The release checkout began clean and fast-forwarded to current main.

## Findings and repairs

The reported nine failures were reproduced: 315 passed, nine failed. Six failures shared genuine model defects: projection mutated story flags; every low-class life received a crisis at 15 because a nonadult roll was zero; those unrecorded flags failed strict save validation. The high-class event invented family deaths, could replace narrative with a full stop, and described wealth loss against the wrong account. These were implementation defects, not merely test sequence changes.

- Six Thai backgrounds and their cash differences remain. Support, allowance and pay rules now read one background mapping. Ability points are drawn independently of household class. New intake wording states that resources and pressures do not determine intelligence or destiny.
- Six contextual choices use the existing encounter engine. Personal debt is required for the debt choice; a work route is required for overtime. Choices pause time, use actual affordability/account flows, record results once and replay consistently. No class-specific hidden death hazard, phantom relatives, fabricated house/pension assets or unvalidated flags remain.
- Both birth-code formats work. Historical birth/save fixtures were generated from `21bc4cf^`, retaining exact birth identity, daily date, foreign-place records and original inheritance amounts. New intake stays Thai; existing foreign lives are not discarded.
- Remaining stale tests were repaired by restoring their actual preconditions: the unaffordable-house case uses its historical starting resources; marriage is reached through real prior choices instead of forged flags; partial painted coverage retains a historical foreign-life case. The estate test now validates every period, including early deaths, instead of an unreachable condition.

## Spatial diagnosis and repair

The renderer previously lifted and shrank figures above the overlapping dock without moving the painted floor. This produced floating desks and people. The desktop dock now owns a separate row; all cast coordinates share the scenery's camera. Per-frame dock DOM queries were removed. The office plate was visually inspected: its foreground desk occupies the centre, while the door aisle is at x=.68. The standing person now uses that aisle and a scale calibrated against the door. The former scale fails the new doorway regression test.

The sparse editor is constrained to 360px; units sit beside/below the selected number; the active channel value is not repeated in the roster. Channels wrap at their label width, including Thai extra-large text, rather than expanding into full-width slabs. Redundant difficulty/interaction badges are removed; the category and choice symbols remain. Childhood supporting records are available through a native disclosure.

Phone planning and dilemmas use one reserved strip: one third of portrait height, one fifth of landscape. Landscape navigation shares a row, keeping the selected value, units, forecast and advance action in the first view. Supporting records/other channels remain available through internal reading. No claim is made that every control is simultaneously visible.

Measured cases are actual browser viewport sizes, asserted before acceptance:

| Case | Painted canvas height | Dock height | World/dock overlap |
|---|---:|---:|---:|
| Previous 1280×720 | 629.5px | 230px | 242px |
| Repaired 1280×720 | 421.5px | 208px | 0 |
| Sparse 1440×900 | 601.5px | 208px | 0 |
| Adult 1440×900 | 566.9px | 242.6px | 0 |
| 1024×768 | 521.9px | 153.6px | 0 |
| 390×844 | 441.7px | 281.3px | 0 |
| Thai extra-large 390×844 | 406.5px | 281.3px | 0 |
| Landscape 844×390 | 219.5px | 78px | 0 |

At1280 the continuously unobstructed painting above the old overlapping dock was387.5px; it is now421.5px. The displayed canvas's former large rectangle did not mean it was all usable. The gate in `scripts/check-class-geometry.py` passes seven repaired cases and rejects the recorded old overlap with the same rule. Unit/value association and actual pixel quality were reviewed separately; geometry alone is not visual approval.

## Build and art pipeline

The runtime remains a static browser game, with no inference service or always-on Mac required. The build no longer copies the entire game/art tree twice. Output fell from31MB to19MB; the verified `/course/` copy, root manual/global icons/OG assets, legacy route and all curated runtime art remain. This is output size, not a browser RAM/FPS measurement.

The existing local FLUX.1-schnell + explicit illustration LoRA pipeline generated one2016×864 candidate in135seconds. `flux-rejected.png` is retained as evidence: invented lettering and background figures violate the brief. It was not promoted or substituted for approved art. More available generation does not equal more approved assets; no new model download/server/engine was introduced.

## Verification

-333 automated tests pass. Nine new tests cover exact historical birth/save/replay identity, support versus intrinsic ability, projection purity, class decisions/ledger/idempotency, legacy inheritance and office scale. Strict validators remain active. Independent reviewer reran seven class tests and found no remaining scoped source blocker.
- Independent pixel reviewer closed the orphan unit, stretched action/editor, Thai roster and office grounding findings. Seven geometry cases passed independently. The played phone view shows the central child above a separate question pane.
- Actual isolated candidate play: began a low-resource birth, passed through four child choices with explicit outcomes, reached age10 and its first planning questions, reloaded the same saved pending question, reached the lower scholarship option through dialog scrolling, received the actual +฿7,000 and IQ+1 outcome, and opened decision2of3. No page overflow at390×844; no warnings/errors observed. Production player saves were not advanced/reset.
- Historical daily invitation `yaga83-fct-20323&day=2026-10-30` opens with its original father/grandmother, birthplace, sex and upbringing. No Begin action was taken for that invitation.

## Limits

This is a bounded repair, not certification of the whole game. The outdoor school desk, generic3D fallbacks, missing/uneven art frames and sparse miniature history presentation still need art direction. The1024/844 action aside retains inherited spare space. Lower phone records require internal reading. Gameplay appeal/retention and physical touch/performance need player/device testing. No recipient messaging or native share delivery was tested here. No claim of superiority over1in8b is supported by this audit.

Final production deployment/byte verification is recorded after publication.

## Production-discovered camera follow-up

The initial live check (`production-scene.png`) exposed a portrait crop issue:
the office floor anchor was correct at x=.68, but a centred narrow crop cut the
person off at the right edge. `anchoredPlateFrame` now pans the painting and cast
together toward that authored anchor, clamped to the finite image. Default.5
framing and wide coverage remain unchanged. `office-phone-pan.png` is the actual
390×844 candidate check: complete figure and floor contact visible in the aisle.
The new camera regression tests390/844/1440 and rejects the former centred crop.
Independent reviewer inspected the before/after and reran five hybrid tests; no
blocking issue found. The full suite is333passing tests. This does not certify
all scenes or overall art quality.

The shared-memory bridge disconnected during closeout (`Transport closed` on
write/read). No successful vault write is claimed. Verified decisions and open
limits remain recorded here and in context.md/DESIGN-RULES.md; retry the bridge
handoff when that external service is available. No human-owned canon was edited.
