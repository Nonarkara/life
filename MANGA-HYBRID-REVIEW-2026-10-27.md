# Practical manga / 3D continuation

## Scope and authorization
Owner requests inspection of MiniMax/Claude work, practical manga presentation,
retained3D world and better mechanics. Standing implementation approval applies.
Apply anti-slop and planning skills. Current working tree includes other agents'
uncommitted stage2d, sprites, translations, pipeline, context and art specifications.
Preserve those; stage only this pass's changes, never silently claim them as ours.

## Evidence before new art
Current dependencies: Three.js0.185 and esbuild; playback is browser Canvas/WebGL.
79WebPs total4,272,370bytes. All RGBA pixel areas total143,469,404bytes (~136.8MiB),
not measured browserRSS. Canvas buffers/GPU/browser add overhead. No24GB engine or
always-on generation service is in this runtime. Art generation and asset preparation
are separate production steps.16GB M3 feasibility is plausible, not yet device-tested.
184baseline tests pass. Actual retained screenshots show substantial art improvement,
but Japanese room architecture presented as Thai, standing breakfast actors,
opposed bicycle headings, repeated limited poses and mismatched action captions.
Current uncommitted identity/household fallback work correctly avoids some false casts.

## Surgical implementation plan
- MODIFY clean scene3d.js/world.js: explicit visibility handoff to painted canvas,
  without constructing anotherWebGL renderer just to hide it.
- MODIFY stage2d.js one parent-presence condition only: independent adults do not
  acquire a family reunion. Preserve all pre-existing stage/art modifications.
- MODIFY clean investments.js: reserve fees before splitting standing investment
  into two funds. Keep actual funded trades, budget, liquidity and ledger invariants.
- NEW tests: canvas handoff, household-presence rule and low-wallet portfolio split.
- NEW script: art delivery audit from manifest+WebP headers; compressedbytes and
  estimated decodedpixels reported distinctly. No image generation/install needed.
- Documentation: viable authored art pipeline, current gaps and mechanics findings.
No save schema, assets, routes, Palette, earned records or event outcomes rewritten.

## Verification
Run full Node suite/build. Exercise local real UI renderer settings and decisions,
retain sparse/dense responsive screenshots when accessible. Independent source and
rendered review; report incomplete/browser/device checks honestly. Commit only our
hunks, preserve working tree. Do not deploy a bundle containing unreviewed other-agent
work or ship older art under a new release claim. Public promotion waits for that
combined baseline to be reviewed; this investigation does not overwrite that work.

## Observed multilingual performance issue
After Thai reload, browser input became unresponsive. Source inspection found
translate() rebuilding/sorting template rules on repeated calls; local900Thai
lookups took1432ms. Add bounded memoization in new translation-cache.js and i18n.js,
with language-isolation/eviction tests. This does not prove every browser stall has
that cause; verify UI recovery independently after the change. Keep memory finite.

## Rendered journey defect
Fresh1440capture still shows a hard vertical join between unlike street endpoints,
despite the earlier report's seam-fix claim. Replace repeated-panorama travel with
one bounded crop pan driven by traveled distance. NEW painted-camera.js constrains
image coverage; MODIFY routine samplePath adds normalized progress, presentation
only. MODIFY stage2d drawTravel removes the repeated copy/shadow masking, preserves
speed lines and all other scene behavior. Add domain/edge-continuity geometry tests.

## Recommended direction
Keep the isometric simulation as the continuous spatial world. Use manga close-ups
for selected recorded moments and quiet domestic scenes. Keep both existing world
preferences. Do not turn every minute into a new generated picture or put a generative
model in the gameplay loop. Production can run on demand on an art service or a
separate workstation; ship finished assets through static hosting. The player's
browser should need neither machine to stay on.

The distinguishing work is an art bible and scene contracts, not a large engine:
1. One reference identity across ages/poses: face, silhouette, proportions, clothing
   and recognizable belongings. Separate body traits from gender presentation.
2. A small observed Thai set with explicit floor, seat, hand and foreground anchors.
   Japanese drawing technique does not justify Japanese architecture in every home.
3. A6–8frame walk cycle with planted-foot metadata, correct headings and distance-
   linked cadence. Eating, sitting, working and recovery need their own supported
   poses. Avoid enlarging two static poses into a promise of full-character acting.
4. Recorded beat/cast/action/caption share one presentation descriptor. Bikes cannot
   be captioned walking; parents at another address cannot appear at this home.
5. Current-scene coverage, not complete-lifetime coverage. Missing matching art
   should use the retained3D scene truthfully, without inventing another identity.
6. Define Palette roles across backgrounds and characters before new generations;
   validate one complete scene against nearby frames. Match light direction and
   line weight; small crossfades cannot repair inconsistent faces or proportions.

Pilot: one household, childhood/adult/older appearance and one work/household fork.
Review it at phone and laptop distance and close-up, with the same character and
camera. Then extend the asset pack. RuntimeM3 test target: responsive input under
animation, measured frame pacing and peak memory on that actual16GB device. This
machine's microbenchmark and screenshot checks do not certify that target.

## Mechanics improvements beyond this patch
A compelling loop is a choice with scarce money/time, a visible change to the
next day, a later callback and an honest same-world comparison. More forced
questions are not inherently more interesting.
- Automatic investment now funds both assets inside its budget, including fees.
- m_crash can currently claim a loss with zero holdings; its future text promises
  recovery regardless of the actual path. Change eligibility/narration to actual
  portfolio and economic records, retain competing liquidity/care needs, and test
  both recovery and continued-loss scenarios.
- Inflation is currently represented by deleting25% of cash and exempts current
  Tokyo residents without their historical exposure. Purchasing power must be a
  separate model/index rather than an unexplained nominal account withdrawal.
- The aggregate test that early investing beats another path by a fixed percentage
  checks authored tuning, not real-world validity. Keep ledger/choice invariants;
  do not tune a teaching outcome merely to make that assertion green.
- Bullying eligibility uses low reasoning effort/poor wellbeing and a childhood
  stall decision. Treat school context and another person's behavior explicitly;
  the player's poverty or ability should not be presented as the cause of abuse.

## Verification and ownership receipt
Working-tree190tests pass; build7b105c5c6b84 includes pre-existing agent changes.
Fresh actual saved age55life retained. Two station answers were selected, held on
reload and unlocked the next chapter; wellbeing84→83→80, money stayed6,161,201.
3D→painted settings transition verified old siblinghidden/originalrevealed. Repeated
Thai lookup loop1432ms→28ms locally; fresh Thai pause/questions/settings then worked.
Not anFPS, totalRAM or physicalM3benchmark. Native screenshot dimensions and DOM
bounds match1440×900/1024×768/390×844. Final journey PNGs have no vertical repeat join;
Thai final capture shows the helper sentence fullytranslated. No error logs in the
completed successful capture run. Earlier CDP stalls and failed pointer attempts
are not counted as passes.
Independent reviewer ran the six new narrow tests, reviewed source and four final
images: bounded pass on fee split, home cast, visibility, cache and panorama edge;
composited sprite acting remains an acknowledged art-direction gap.

Current local dirty sprites/stage coverage/303translation rows/art requests remain
other agents' work. Only this pass's own hunks are committed. No public deployment
from this mixed working tree is claimed. /review/hybrid-oct27 is local evidence.

Clean-snapshot check: copied only the Git index to a temporary directory and reused
installed dependencies.189tests pass and buildf0ce11d7e917 succeeds without other
agents' uncommitted stage/art/translation changes. This differs from the local
mixed preview's190tests/build7b105c5c6b84; neither is represented as the other.
