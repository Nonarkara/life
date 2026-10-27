# Art handoff disposition · 27 October 2026

The local FLUX download has not produced a trial image: its observed log remained
at11/13 files. It is an offline authoring job, not a dependency of the web game.
No token was changed or included in the source. The46-request catalogue is not a
completed art batch.

A built-in image-generation trial used the approved female sheet as a style
reference for a Thai male character. Source: art/sources/sheet-player-m.png.
Face, clothing, palette and two standing poses passed independent visual review.
The two walk poses repeat the same leading leg. A second targeted image edit did
not convincingly correct that gait, so neither walking frame is published.

Only player-m/stand-a and stand-b are in the runtime manifest. This expands
matching male standing-scene coverage; male walking, cycling, childhood and other
uncovered scenes continue using the existing3D fallback. It does not certify a
complete new cast or a smooth animation cycle.

Reproduce only this sheet: python3 scripts/prepare-anime-assets.py player-m.
The processor prefers tracked art/sources, keys the white background and uses
art/frame-approvals.json as a publication allowlist. Rejected walking frames must
not silently reactivate on a future rebuild. Existing art is untouched.

The optional local generator now writes atomic verified images into
scratch/anime/candidates. It never writes directly over approvedsrc or live
assets. --check validates the46-request queue without downloading or generating.
Only a visually reviewed candidate should be promoted and assigned approved
frames. A successful model download alone is not an art-quality approval.
