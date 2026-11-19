# Ship receipt · 19 November 2026

- Implementation: `f8ef352`, fast-forwarded and pushed to main.
- Deployed build: `996228607e73`; custom domain build.json matches out/build.json.
- Trial: https://life.nonarkara.org/course/ink-study (the .html URL redirects normally).
- Cloudflare Pages deployment: https://c16d91c4.life-5wz.pages.dev
- Ten critical HTML/JS/CSS/license/background files match local output byte for byte at the custom domain, using published version references and normal redirects.
- 603/603 unit/simulation tests pass. Independent scoped visual verdict is in independent-review.md.
- Live browser probe: eight cases pass across EN/TH, 390/1024/1440 and enlarged 390; no page errors, overflow, identity changes or child-node churn. Actual rendered sole outline and screen-transform checks pass at both ages. JSONL receipts are retained beside this note.

The release rebuild differs from the reviewed build `3e01a3a45309` because the existing SpriteCast receipts record generatedAt and a random temporary outputDir. All 477 output files were compared after normalizing only those receipt fields, the build version and content-identical renamed bundle references: no code/asset/content differences remain. This is an existing build reproducibility issue; it was not patched in the visual review.

The first live browser run exposed a harness race: emulateMedia resolves before the asynchronous media-query change listener necessarily updates the button. The probe now waits for the disabled state, then asserts it and verifies manual seeking. No production fix or redeployment was needed for that test-only correction.

The scoped study is published; finished art direction and 3D cast replacement are not approved. The existing game's medium initial-view weight finding and unmeasured frame pacing remain open. The prior dirty review/product-audit files and .claude directory in the main checkout were preserved.
