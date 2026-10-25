# A lived world instead of a repeated walk

25October2026. User requests another original-game study and a substantial graphics
upgrade. The handoff is advisory; current owner authorization and repository rules
remain authoritative. Read docx sections1–14, not importing unsupported claims.

## Preserve
Womb/countdown, family, expanding world, Palette materials, all landmarks and
furniture, charts, console, point allocation, finances, named encounters, profiles,
private local saves, replay and all five languages. No file collapsed30%; original
Canvas renderer remains available. No data migration needed for rendering changes.

## Architecture decision
Add a Three.js WebGL scene behind the existing HTML console, bundled locally.
Reason: real depth, lighting, articulated actors and material surfaces address the
owner's request beyond repainting the existing low-resolution geometric drawing.
Keep vanilla modules, deterministic simulation and single animation clock; no
React/backend/accounts/LLM-per-turn. WebGL failure uses existing2D renderer. This
is browser3D, not Unreal or a claim of photorealism. Three is MIT; no original-game
art/code is copied. Cap resolution and shadow-map size; build geometry once.

## Changes
- NEW scene3d.js: continuous town coordinates, cutawayhome/furniture, pitchedroofs,
  roundedfoliage, materialdetail, daylight/contactshadows, fixedscreenlabels.
- NEW character3d.js: humanproportions, jointedwalk/facing, groundedfeet, distinct
  eat/read/type/craft/draw/garden/rest/play poses and visibleprops; agegrowth.
- MODIFY routines.js: actualchosen education/workroute overrides genericgoal;
  college/apprentice/independent/retired/recovery activities. Invariants remain
  continuousjourneys and furniture/townclearance. Neighbors are adults, not ageless
  schoolchildren. No finance/game state mutates from drawing.
- MODIFY world.js/game.js/CSS: reversible3D presentation with2Dfallback, sameclock,
  reducedmotion/pause, visiblecaption; higher motion cadence, not faster life.
- MODIFY tests: currentroute vs age/goal, continuity/full-dayclearance, no duplicate
  player/NPCdestination, purepose distinction. Browser motion and responsiveness
  are required separately; a screenshot cannot prove animation.

## Validation
Baseline71tests and livebuildde58e8f2adc5. Read-only originalround3records benefits,
failures and limits. Test actualchild/school/college/work/retired poses, repeated
screenshots across one day, pause/reducedmotion, portraitiPad820x1180/768x1024,
phone390, desktop1440. Independent visual/source review; preserve oldrenderer.
Commit/push/publicverify after gates. Keep wider handoff gaps explicit: autonomous
life/defaults, simulationclockbackgroundpause, checkpointreplay, calibratedeconomy,
relocation and coherenttimebudget are not magically solved by newgraphics.

## Refinements from actual review
Desktop decisions are content-height docks,320–360px wide; the world extends
beneath short tasks. The orthographic projection reserves the dock's real width
and tracks the protagonist after6. Phones use an activity-focused camera with
only nearby labels. Building cutaways use parallel camera rays through the rig's
actual head and torso; foreground structures fade only while obstructing them.
The floor ends at6.6 and a visible slope joins the street at7.2. All commuting
routes use that exit. Family chairs surround a shared dining table; craft hides
its task chair rather than putting a standing figure through it. The old route
fixture is explicitly named legacy; complete real routines retain their guards.
Build minification contains the cost of the pinned, MIT-licensed Three dependency.
Settings pauses until Resume. Background visibility handler pauses progression;
actual OS sleep/background delivery is not certified by a source check.
