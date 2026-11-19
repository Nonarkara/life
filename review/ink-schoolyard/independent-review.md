---
updated: 2026-11-19
drafted_by: codex/independent-review
reviewed: false
---

# Independent review — bounded ink schoolyard study

Reviewer: `/root/album_archive_review`, separate from the implementation author. Verdict: **ready to publish as a labelled, reversible flat-stage study**. This is not owner approval of the drawing, a recommendation to replace the 3D world, or clearance of the whole game.

Final source/build: `3e01a3a45309`. Complete EN/TH matrices were rendered on `11c4cef82362`; the subsequent single-view-only CSS change was independently rerun on the final build at 1440 EN and 1024 TH. All cases used freshly served output, Chrome headless, and the actual route. Final single view keeps Play/seek on the first desktop screen instead of expanding one image to the width of both comparison panels.

## Evidence and falsifiers

`tests/fixtures/ink-study-probe.mjs` covers 390×844, 1024×900, 1440×900, and enlarged 390×844 in English and Thai. Body text actually grows from 16px to 22.4px. Controls and isolated header anchors measure at least44px high; Thai Replay is explicitly checked. No page errors or horizontal overflow occurred.

The browser samples actual shoe path outlines and their SVG screen matrices at501 sequence positions for each age. This is stronger than checking a finite ankle coordinate. The sampled contact drift stayed below0.00006 CSSpx, and sampled floor penetration below0.00004 CSSpx (numerical rounding, not a hardware-accuracy claim). Each age includes45–49 heel-off stance samples. Both stance and swing are covered. The final actor retains24 nodes, with no child-list mutations during updates, and backwards seeking returns exactly the same SVG markup. The explicit female identity, skin/wardrobe profile and person ID remain stable at10 and35.

The initial implementation did fail an additional independent falsifier: swing entry reset the ankle while retaining heel-off pitch, putting the toe about1.03 rig units below the floor. The documented solver correction preserves the pivot through swing; the updated tests and rendered samples pass. Completed future-motif work is removed from its clock registry rather than redrawn indefinitely.

Explicit playback starts only on a user action. Pause freezes time and actor markup; seeking and age changes stop playback; the pagehide handler stops playback; the one-shot stops naturally and stays stopped. Reduced-motion disables playback while leaving manual inspection usable. Visibility handling was source-reviewed; the probe's pagehide event is a handler test, not a physical mobile-background/battery test.

Screenshots viewed include `/tmp/ink-study-en-1440-adult.png`, `/tmp/ink-study-en-1024-wave.png`, `/tmp/ink-study-th-390-extra-wave.png`, and the final single-view captures. Walk, turn, wave, child/adult proportions, neck connection, wardrobe and shoe placement are visually inspectable. The schoolyard floor is an authored illustration anchor, not evidence of real architecture or a walkable geographical location.

## B1–B18 walk

| Gate | Scoped finding |
|---|---|
| B1 First-screen task | Scene then phase/Play/seek; normal phone and desktop task visible. Single-view expansion was corrected and retested. Enlarged text earns additional scrolling. |
| B2 Chrome | One thin header; no stacked HUD or fixed footer. |
| B3 Box fit | Content-sized buttons, labelled range and age control; touch height has a job. |
| B4 Void | Comparison uses two actual scenes; single view is bounded and centred rather than a wide empty canvas. |
| B5 Scroll | Extra content is comparison, real controls or an optional limitations/source explanation. |
| B6 Symbols | Checkbox state, age and time use conventional controls; no emoji or decorative badges. |
| B7 Hierarchy | Schoolyard/actor is the entry, action state and playback are its exit; one amber Play action. |
| B8 Proximity | Age, seek, replay and contact inspection stay attached to the scene. |
| B9 Map/data | Not a geographic map. No invented pins, building heights or access claims. |
| B10 Logos | Plain linked Life2.0 wordmark; no logo container. |
| B11 Alignment | Scene/captions/heading/controls share edges in phone and wide captures. |
| B12 Language | EN/TH captures, document language and real text reflow checked; no claim of native editorial certification in every language. |
| B13 Access | Labelled controls, visible focus style, header/play/age targets44px+, reduced motion and seek available; no clipping in tested layouts. |
| B14 Preservation | Default diorama, old artwork and legacy helpers retained. |
| B15 Specificity | Pass for an inspection route using the actual Life schoolyard and person; not approval of a finished visual identity or cast sheet. |
| B16 Direction | Warm paper/dark ink/amber retained. Motion is confined to the requested scene. The drawing remains rough. |
| B17 Motion/grid | Scene-first column/comparison grid; bounded clock, deterministic seek, explicit playback and static reduced-motion path. |
| B18 Product | No renamed product, erased lives, fabricated biography, default renderer switch or asset deletion. |

## Limits that must remain in the ship report

- The ink actor is a flat, deliberately abstract drawing without finished cloth, depth or shadow integration. Its control is promising; its art direction is still a prototype. A frontal turn is not a demonstrated 3D corner.
- The painted side is clearly labelled existing pose cuts. Its child/adult images do not match every candidate wardrobe/identity property. It is not the complete painted renderer and cannot establish an apples-to-apples quality or performance victory.
- There are currently zero authored encounters using the `walk` motif. The lifecycle/identity changes harden a future API path; they do not demonstrate a new animated action during ordinary play. Held result scenes remain paused.
- Elder/cane poses, prop contact, seating, occlusion, multiple actors, full 3D integration, real low-end-phone performance and overall game entertainment remain unverified.
