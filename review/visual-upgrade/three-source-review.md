# Independent Three scene/rig source review

Inspected scene3d.js, character3d.js, routines/context integration, retained world fallback and CSS. No browser/source edits. Executed pure Three rig/routine probes in Node; no rendered approval yet.

## Demonstrated findings

1. Salaried-work context still fails to override sport/art aspiration. routine(player,30,26,sport,{pathway:work}) returns Training (independently reproduced). College/vocational/independent cases override, but actual salaried obligations must be resolved before discretionary aim.
2. Rig facing is frame-count dependent. Two update calls with identical actor/time12 yield yaw.3456 then.6151 radians (reproduced). Paused repaint or different frame rate changes facing. Use deterministic route-facing or explicit presentation delta with stable paused behavior; do not claim pure-time deterministic pose.
3. Child/adult seating supports do not scale together. Rig root scales with age, all chairs retain adult seat top.55. At age5 the nominal seated hip is.3406 above root, plus home floor.16 gives.5006, below the seat; younger children are worse. Chair floor itself is0 while homefloor.16. Define support anchors per actor/seat and solve sitting contact rather than applying one body drop to scaled rigs.
4. Gait remains time-clock cadence, independent of traveled distance/speed. Different route lengths over the same12-second phase produce different ground speed with identical step frequency: foot sliding remains structurally expected. No stance-foot contact or stride-length invariant implemented yet.
5. New seats/tables/props and static neighbors are absent from shared layout collider contract and existing tests. Old furniture-only route success cannot establish collision clearance for new scene. Include support surfaces and solid footprints, while allowing explicit seated origin/departure transitions. Work NPC12.9,6.3 lies close to table endpoint12.8; test radius clearance, not just exact centers.
6. Rest/eat/study/work/recover share seated base. Materials/props distinguish some actions, but care is still generic reaching from5.95,5.9 while infant is at5.48,5.03; hands cannot reach infant without a deliberate nearbycareanchor/target. Independent art remains standing sketchbook, which is a valid intended activity if communicated as such.
7. dispose() only disposes renderer/removescanvas; meshes/geometries/materials/textures/shadow resources created for scene/rig are not explicitly disposed. Most allocations are initialization-only, so no demonstrated per-frame GPU-object creation leak. On fallback/disposal, traverse and dispose owned resources once; account for sharedgeometry/materials and spriteCanvasTextures. If creation throws after renderer initialized, createScene’s outer error path also needs cleanup, not only constructor failure cleanup.
8. Small repeated per-frame allocations include camera offsetVector3 and label context/font work; not a demonstrated persistent leak. Reuse camera offset and update label textures only on text change (already done). DPR is capped1.5; verify new graphics costs on mobile and contextlost fallback in actual browser.

## Preserved/positive source properties

Canvas2D renderer remains and runtimeupdate/contextloss restores originalcanvas then returnsfalse. Course mode hides3D and restores original; source CSS honors hidden. Scene geometry/material caches are created once; geometry has sharedworldcoordinates and real depth testing; sun/contactshadows, directionalhead/limbs and separateprops meaningfully exceed baseline flat sprites. Housinggrowth/flood/parentvisibility conditions retained. Scene rendering does not mutate simulation state/history/finance.

## Required verification before visual verdict

Add tests for actualwork obligation vs aspirations, same-time repeated pose/paused stability, all new colliders/support heights across ages, and fallback cleanup ownership. Render infantfamily, seatedchild, walkingreturn, salaried/vocational/college/independent activity and elder. Inspect hand/prop alignment, chair contact, actor footplanes, captions and dock-safe framing at390/portraittablet/1440. Exercise WebGL unavailable + contextloss and world/course toggles. Existing10routine tests prove path logic only, not these new rig/render invariants.

## Corrective re-audit

Independently ran13 targeted routine/rig tests: all pass. Salaried context now overrides sport/art; context reads the committed row, and traveling render/caption receive travel.to context. Same-clock repeated rig update is now deterministic; stride phase follows path distance and scale. Child seating compensates to the adult nominal support height. Shared dining footprint, HOME/facing and taskDesk anchors now feed renderer/path checks. NPC work separation and full-day desk/path clearance tests are present. Prior demonstrated logic/test findings are closed.

Runtime fallback disposal now traverses unique geometry/material/texture sets before disposing renderer and canvas, improving owned GPU cleanup. One robustness gap remains: createScene failure after renderer construction but before its return still reaches the outer catch without accessing cleanup, so an inserted canvas/renderer/resources can remain. Constructor failure removes canvas, and update/contextloss cleanup is covered in source; post-constructor startupfailure is distinct. Use one initialization ownership/cleanup guard if such failure is exercised.

No demonstrated per-frame geometry/material/texture creation leak in current source; temporary cameraVector3 remains a minor allocation, not a persistent leak. Distance-driven gait tests prove phase relation, not stance-foot locking; seating test proves common nominalhipheight, not renderedhand/foot/seat contact. Care/prop reach and reducedmotion poses still need actual rendered inspection. No visual pass is issued before current captures/short motion evidence.

## Final source cleanup and available staging images — build46a9dd286092

Shared disposeScene now handles the scene-construction catch and runtime/contextloss fallback, traversing unique geometry/material/texture ownership then renderer/canvas cleanup. Prior post-constructor scene-assembly cleanup finding is closed by source. HOME/table/path changes remain shared with collision fixtures; earlier13 independently run targeted tests passed, parent reports76 full tests now passing. No new demonstrated source blocker found in this inspection.

Inspected available newborn, morning, journey and rest1440 staging captures. They show materially improved shaded geometry, consistent cast/contact shadows, supported family seating, distinct workplace tables and directional articulated people. These are genuine rendered improvements beyond an enlarged sprite buffer; no numerical10× quality claim is justified. Work/trade and home poses are visually distinguishable in the stills.

One framing check for final current opening: newborn staging image partly cuts father at lower-right behind tree while mother/baby dominate. If final responsive opening retains this, adjust safe framing so both caregivers are readable rather than relying on their hidden presence. This observation is against a staging capture, not asserted as a current-build regression. Current phone/tablet/birth final captures still pending; no final responsive or uninterrupted motion verdict yet.

## Responsive current captures — build085d8afc70bb

Inspected desktop1440 (explicitly pre-header-fix), tablet1024, phone390 and iPad820 captures. Do not use the older desktop header to assert a current hidden-speed-controls defect.

Two current blockers/refinements require attention before a final graphics gate:

- **Portrait safe framing:** iPad820 shows amber player cut/hidden by right dock atx500 during return. Camera derives projection from fullcanvas and follows character without a dock-safe rectangle. Tablet work/school activity regions also disappear behind the dock. Keep the actor and task target inside the unobscured region; overlay can obscure background, not the protagonist being described.
- **Ramp contact mismatch:** source floor remains flat toz7 atheight.16; ramp and actorheight begin descending atz6.6. Atz6.9 actorroot follows.08 while solid floor is still.16, so feet sink into floor before reaching its edge. Align floor extent/ramp start and expose one groundHeight contract used by geometry/rig tests.

Phone overview is too wide for the requested activity improvement: whole settlement compressed to about176px high, articulated people tiny while placename cards dominate. This is a specific readability limitation, not overflow; use an activity-focused phone camera/contextual label policy rather than expecting small new rig details to carry meaning. Source/UI controls remain readable, advance footer visible. No live-motion verdict from stills.

## Current-disk correction — buildb29bf6087e96

Re-read current scene source: floor depth is now3.6, ending6.6, and floorboards match. Ramp6.6→7.2 and actor elevation match this extent. Earlier floor-overlap finding is closed for current disk and must not be presented as outstanding.

Projection shift uses exact dock-width/2 in screen-space equivalent; target follows protagonist after6. This mathematically places focus near the uncovered play-area center. Phone span capped6.2 and nearby-label filtering address earlier miniature-actor/all-label dominance. Source changes are coherent; updated responsive rendered results remain pending and source intent alone is not a final camera pass.

## Architectural cutaway audit — build657f8cf00372

Building material clones are initialization-only, roof mood ownership is preserved, and opacity/transparent/depthWrite restore to baseline each frame. This avoids sharing one faded wall material across unrelated structures. No demonstrated persistent per-frame geometry/material allocation leak introduced.

Correctness issue: occlusion camera is orthographic, but ray origin is camera.position and direction points to each torso/head aim, a perspective-style construction. Orthographic view rays are parallel; use actual projected rig anchors with Raycaster.setFromCamera or matching unprojected origin plus camera world direction. Otherwise edge/height-offset occluders may be missed. Fixed.7/1.3 heights also do not track child rig scaling/support elevation, so prefer actual rig world anchors. Supplied college768 pre-fix image is explicitly excluded from approval.

Settings-open handler pauses normal progression, but arrival countdown precedes paused check and still decrements. If opening settings must preserve the opening too, gate the3-2-1 branch on paused. Normal period/childhood pause source path is otherwise coherent. New occlusion/camera rendered results pending; source intent alone does not close the visual blocker.

## Corrective ray audit — build064faf338b85

Actual rig head/torso anchors now supply world positions after scene/camera matrix updates. Each anchor projects to screen, then Raycaster.setFromCamera constructs the matching orthographic ray; far stops before the actor. Previous perspective-ray and fixed-child-height findings are closed in current source.

Arrival countdown pause concern is withdrawn for the accessible Settings flow: arriving CSS hides header/main, so Settings cannot be opened during the intended3-second sequence. Existing initial reduced-motion pause behavior must not deadlock the opening. This is a scope correction, not proof of a user-accessible countdown-pause defect.

No remaining demonstrated blocker from this focused ray/settings source pass. Current rendered responsive/occlusion captures still required before final visual verdict.

## Final bounded graphics gate — build064faf338b85

Independently viewed desktop-final,tablet1024-final,iPad820-final,iPad768-final,phone-final and motion-return. First five show the same paused Evening age25. Dock-safe framing now keeps the amber family member in the uncovered scene at both portrait sizes. Phone camera presents a readable family activity instead of a whole island crowded by labels. Primary scene, console and advance footer remain distinct; controls visible. Earlier camera/miniature-phone findings are closed for these captures.

motion-return is correctly described by its actual Daytime / at college caption, not its filename. Architectural cutaways expose the amber character’s head/torso and preserve context. The school placard partly covers lower activity detail; hands/desk are not fully readable in this view, so this supports improved protagonist visibility rather than universal task-occlusion perfection. Consider contextual label displacement as a later refinement.

Bounded gate: no remaining demonstrated source or visual blocker for the supplied graphics/routine upgrade. Scene geometry, shading, directional rig, supported seating and task differentiation materially improve baseline. This does not certify a10× numerical quality factor, photorealism, Sims-level autonomy, complete actor avoidance, uninterrupted animation smoothness or all activities at all ages. Current opening/infant and enlarged-native UI final-build walkthrough are not independently witnessed; older657f Thai-extra Money capture establishes typography only. WebGL unavailable/context-loss fallback and cleanup are source-reviewed, not browser-fault-injected. Parent reports76 full tests; independent reviewer previously ran13 targeted rig/routine tests successfully.

Release judgment applies to this bounded implementation only, preserving the overall project’s separate feature/release requirements. No browser actions or source changes performed by reviewer.
