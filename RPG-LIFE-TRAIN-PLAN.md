# Life2.0 — RPG life train ·30October2026

Current owner scope supersedes earlier no-choice-before10 pacing: one fixed phone
console33⅓dvh portrait/20dvh landscape, tabs inside, world above; all painted
figures2x baseline without doubling calibrated rooms again; clear floor anchors;
meaningful simple symbols beside complete decisions. Preserve static painted/3D
worlds, saves and5languages, no huge inference engine.

Gameplay: more year-dated relationship/health/work/bereavement events; searchable
bucket list with custom activities, real upfront money reservations and scarce
discretionary days per selected year; effects must affect simulation, not just
copy. A skippable first50seconds/years0–5 teaches actual controls, graphics and
child development notes. At6–9, age-appropriate choices pause before continuing.
Five-year effort reviews and full-life graphs remain. One-year carriage language
explains progress; unknown future/terminaldeath remains unknown.

Implementation in progress, single writer. Independent reviewer manga_audit.
Baseline main8fa5c73. No current turn release committed/deployed toproductionyet;
previewbranch moment-scale only (latest oldcandidate1092? inspectout/build.json).
Pre-existing untracked review/painted-default and review/product-audit untouched.

Done source: choice-symbols.js originalSVGS +30stationmappings, stableoptionID
lookup; sourceincludesallfigures2x helper and calibratedwoodenhome/day-night/
bedroom floorprofiles, noindependentHUDlift. scene3d readerhidden guard. New
rpg-dockwrapperconsole.js +fixedphoneCSS; phone native decisiondialog bounded
tosamebar. Need actual final render/evidence afterallsource settles.

Bucket core: bucket-list.js30catalogactivities, customfixed-purposeeffects,
30discretionarydays/year,upfrontmoney personalFlow receiptkindbucket, pending
yearwithinupcoming5yearwindow (birth through10), doneactivities/flags.
stepSkills/advancePeriod applyduebenefits beforemortality; begin appliesearlydue;
validBucket integratedsavevalidation. Addedbucket-view.js search/year/plans/custom,
console nav and game change callback recomputes travel.to afternewreservations.
Needs tests/localization + source review. Reviewer caught forgedcustomflag; fixed
bucketFlags canonicalonly/validatorrejectextra capability/reserved/duplicatekeys.

Remaining ordered:
1. Complete bucket tests/edgecases (reservation/reload/duplicates/time/custom/
   effects/earlyfree/puppyonce; retaincustomdefinitionsonreplay), localeallnewcopy.
2. Childhood module with4age6–9choice catalogs, origin snapshot, exactonceeffects,
   validChildhood +beginage0vs10record. Tutorial50seconds0–5 usesbirthduration10s
   with explicit Skip→6; existingchildhoodnotes sourcequalified, actualYou/World
   previewnav insidebirthRPGdock. Extenddecisiontempo heldforchild prompts/outcome;
   reducedmotion goesnextpendingchildage notsilentlyskipping. Native bottomdialog
   childoutcome acknowledgement preserved acrossreload choices. Keeplegacy saves.
3. Addyear-datedperiod event catalog, actualhealth/mood/incomecosteffects,
   provenance-gatedbreakup/friendloss; flagsOf canreadrecordedlifeevents safely;
   graphmarkers useeventage, andrealencounters remaindecisionbar. Keepnotmedical/
   demographicprobabilitiesclaims; all authoredgame tuning. Moreeventtypes.
4. Fulltests, buildonefinalcandidate, actualbrowser at390×844,844×390,
   1024×768,1280×720,1440×900 +ThaiXL. Verifybodyfit/RPGheightratio, no pagebleed,
   realsearch/custom/reservation→chaptereffect/reload, child6pause/skip/reduced,
   scalebedroom/homebodyprofiles, nativewordwrap. Independentpixel+sourceclosure.
5. Commit/push/deploy projectlife branchmain (Pagesdomainlife-5wz; projectnotthat
   domain). Exactverify script bothhosts +actualpublicbrowserpreservedsave.
   Updatecontext/integration/evidence. get_context(projectlife,query,days3) called;
   connectedMCPstilllegacyimplignoresfilters, doNOTuselegacyrecall/capturetools.
   Usewrite_note/log_decision/handoff toolifavailable. Do notreadwholevault.

Existing actualevidence review/moment-scale: beforephonegreyblanklowerhalf;
home17desktop/phone calibratedfloorandbody. Originalhouse3people nowfloorfront
oflowtable, notstandingoncups. Phonecropcentersonprotagonist/parentsatcameraedges.
Oldeveningcapturestillshowedtinychild; sourcebedroom.56 now2x baseline. Final
shared2xhelperlastsourceunbuilt. Existing sourcefulltests270/271 thenfocused5pass;
latest fulltestsession16850 pending before subsequentedits. Neverclaimfinalgreen
untilre-run settledsource. Currentpreviewstudytabs26game/27scenestudy, user25
canonicalage15pending3questions unchanged. Browser2IAB,1MCPApps afterreset.
Do notanswercanonicalchoices. CUAonlybrowserUI, noPlaywrightfromshell.

## Final completion supersedes the in-progress checkpoint above
All listed source steps now implemented;288tests pass, independent bounded source
and pixels approved. Runtime2f6126a95ea6. Evidence/limits are in
review/moment-scale/REVIEW.md. Release receipt/public verification follows there.
Source additions include repeat health events/general recovery question, with
primary references in research/fragility-and-care.md. Infant/maternal episodes
remain future work, not claimed. Superseded old geometry retained as a failing
fixture; corrected measurements pass the same gate. Fixed custom key collisions,
forged flags/prototype purposes, result reload acknowledgement and redraw pause.
