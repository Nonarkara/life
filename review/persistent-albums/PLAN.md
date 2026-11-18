# Preserve completed lives — 18 November 2026

Observed: e2438e6 ending albums exist only in the active save; recordLife stores birthplace, end age, score and player words. Old lifeId ignores pivots, effort, work paths, stops and activities, so changed journeys can collapse to one ending.

Scope: add bounded optional completed album snapshots to the existing40-entry local lives archive; allow reading them under their existing intake life row. Preserve birth replay links and player words. Disclose unavailable albums on old summaries, and backfill only while the actual completed source life is still available. No new simulation, world, modal or storage service.

Identity: deterministic versioned hash of the completed record; retain legacy function for one-time exact old-key migration. Replace an old ending key with the new one in taste/Almanac without incrementing counts or weights. Once migrated, a different journey must count separately. Reloads remain idempotent.

Composition: existing intake column. Birth card/primary play action stays first; past lives remain a disclosure. Within each past-life row: place/age, birth replay link, optional album. Album contains compact chronological receipt rows; no fixed-height panel or decorative motion. Validate phone/tablet/desktop and enlarged text via a different reviewer.

Falsifiers: play two runs with identical final metrics but changed pivotal decisions/journeys, then inspect both records after overwriting active save; old words/date and counts survive migration; future activities stay absent; damaged optional album cannot erase a valid old summary; unavailable storage cannot report a successful archive write. Existing startup and ending browser probes must still pass.
