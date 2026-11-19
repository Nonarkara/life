# Ink schoolyard review

## Verdict

Borrow the motion solver for reproducible flat vignettes. Do not replace the diorama or declare the new drawing a finished art direction. The trial demonstrates a reusable person, not an image generator, a complete animation system, or a solved 3D cast.

Source: [JDhruv14/line-art-animation](https://github.com/JDhruv14/line-art-animation), inspected at `c43d698913cf0ad44f984c7ae14c5348010594d3`; MIT notice retained in `dist/course/line-art/LICENSE`. Life already contained this vendored solver before this review. The library's pose math is useful; it does not supply Thai characters, period clothing, seated poses, prop contact, turn-corner projection or AI story generation.

## What the existing prototype actually did

Neon's `de15187` added a second implementation in ink-gait.js and a per-illustration RAF. It regenerated SVG markup each frame, inferred sex from seed parity, jumped between its initial position and first animated frame, wrapped the actor across the scene and ignored Life's pause ownership. Its test checked early stance ankle travel, not the rotating shoe sole or swing entry.

There are currently **zero** `ENCOUNTERS` with `art === 'walk'`. The illustration renderer is an untriggered capability, not evidence of a new animation in ordinary play. Existing ring/wall/tape motifs remain. The result panel holds Life's clock; hardening that driver does not mean a result animation plays while paused.

Independent review also found an upstream defect: at swing entry the ankle returned to its unrotated height while the shoe retained heel-off pitch. The toe penetrated the floor by about 1.03 rig units. Life's documented local adaptation preserves the pitch pivot through swing entry; tests now cover all toes, not stance alone.

## Bounded implementation

- One stable SVG node tree, explicit person identity and a deterministic pose sequence: walk in, turn toward the reader, wave, stop. The same profile is inspected at ages 10 and 35.
- One existing authored schoolyard; same floor/crop on both sides. The painted comparison uses existing pose images and is clearly labelled as pose cuts. It does not reproduce the whole painted renderer.
- No filters, asset-generation requests, private person RAFs or random redrawing. The review route plays only on a button press. Seeking, age changes, hidden page, settings and reduced motion stop playback.
- Legacy illustration helpers remain. The optional live ink motif takes recorded appearance/outfit and Life's clock, removes completed work and retains the existing static elder/cane until its contact is tested.
- `school.webp` is illustrative stage artwork, not geographically sourced architecture or a claim of a real accessible entrance.

## Weight and limits

Measured source bytes: gait.js 3,871; ink-gait.js 10,013 (includes preserved legacy helpers); ink-sequence.js 2,265. Separate gzip sizes total 6,238 bytes. Study controller adds 5,123 raw / 2,131 gzip. These are file measurements, not visitor transfer totals.

The existing schoolyard is 151,412 bytes. The comparison still loads painted images. Existing sprite inventory is 123 WebPs / 2,636,166 bytes; this is an inventory, not a page-load measurement or a demonstrated saving. No asset deletion is justified by this trial.

The ink figure is intentionally abstract but remains a rough drawing. A flat turn toward the reader is not walking around a 3D corner. Depth occlusion, furniture contact, sitting, multiple cast members, elderly movement, detailed clothing and actual low-end-phone performance remain separate acceptance tests. No claim that this resolves the whole game's spatial defects or entertainment problems.

## Next decision

Judge the moving trial in its actual phone composition. If its drawing is worth developing, commission/refine one coherent cast sheet before scaling production. Next integration should be one real routine in the 3D world with ground/depth anchors and an actual obstructing prop. Validate that scene before converting the remaining cast. Keep snapshots reproducible from identity + age + outfit + action + time; generate variety through meaningful scenes and relationships, not a fresh image per frame.

## Existing game audit caveat

The local full-game product audit reports 0 high, 1 medium and 8 low findings. The medium is measured initial view weight (24 requests / 3,703 kB); callback frame pacing returned zero and is unmeasured. This is not a full-site PASS, and the new route does not fix that game-view payload. The scoped comparison must be assessed on its own pixels and lifecycle. See game-audit.md/json for the exact receipt.

Static Non-Slop scans: HTML 0 points; CSS 2 points for Jost allegedly not loaded. This is explained by the existing asynchronous fonts.js loader in the HTML (the single-file CSS scanner cannot see it). It is not a visual acceptance test.

## Validation receipt

Final build `3e01a3a45309`; 603/603 tests passed. Independent reviewer `/root/album_archive_review` approved publication of the labelled study only. See independent-review.md for actual SVG contact, stable-node/lifecycle and EN/TH viewport checks, their exact build hashes and limits. Captures are retained in screenshots/. The full-game audit caveat above remains open.
