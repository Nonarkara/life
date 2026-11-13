# Thailand in 77 provinces, on one studio floor — plan, 14 November 2026

Owner direction (14 Nov 2026): Life2.0 teaches Thailand's soft power by living in it, so a few lives
should begin in every region, province and kind of village. The Truman Show frame widens: when a life
leaves its origin (to another province or overseas), the camera rises off the set and the player sees
that the town was one stage on a vast studio floor. The camera glides across the plain to the next set.
A longer glide means a longer distance, and going overseas means crossing a painted sea.

Owner rulings:
- **Coverage:** all 77 provinces, built region by region.
- **Travel:** the glide over the studio. It is a metaphor, not a map: no pins, no coordinates on screen.
- **Visiting:** other sets show on the horizon but stay closed until a life goes there.

## Laws this work answers to

- **GSH: no invented place.** Every province's birthplace town, landmark and year comes from a source
  we record, and an unsourced fact is left out. A landmark is drawn only from its sourced year
  (late is acceptable, early is not).
- **Royals are never depicted.** No palaces, royal monuments or statues of kings as landmarks.
- **The board stays one board.** Home, school, clinic, market and workplace keep their places, because
  routines and tests depend on them. A province's identity lives in its layout, its terrain, its
  religious building, its landmark and its era marks.
- **Old saves and birth codes keep working.** The ten current Thai birthplaces keep their ids and codes.

## The data: one record per province

`research/provinces/<region>.json`, an array of:

```
{ "id": "chiang-mai", "nameEn": "Chiang Mai", "nameTh": "เชียงใหม่", "region": "north",
  "town": { "name": "…", "kind": "city|market-town|village|coast|hill|island", "source": "url" },
  "terrain": ["mountain","river","plain","coast","plateau","island","lake"],
  "archetype": "lanna-valley|isan-village|isan-town|central-river|central-rice|bangkok-*|east-industrial|east-orchard|west-border|south-rubber|south-coast|south-island|…",
  "households": [ { "class": "low_class|working_class|middle_class|bureaucratic_class|high_class",
                    "home": "short plain description", "livelihood": "…", "source": "url" } ],
  "faith": { "buddhist": 0.9, "muslim": 0.05, "christian": 0.05, "source": "url" },
  "landmarks": [ { "name": "…", "kind": "wat-lanna|wat-central|prang-khmer|chedi-south|mosque|church|chinese-shrine|clock-tower|bridge|market|mountain|sea|river|lake|waterfall|monument-nonroyal|industrial|port",
                   "from": 1955, "source": "url", "note": "what it looks like, in one line" } ]
}
```

## Phases

1. **Research.** Six regions in parallel: North 9, Northeast 20, Central 22 (with Bangkok), East 7,
   West 5 and South 14. An independent check follows for sources, dates and the royal rule.
2. **Studio plain and glide.** The beige around today's board becomes the studio floor. Sets the life
   has not reached stand on the horizon as closed boards, and moves glide. This works first with the
   fourteen places that already exist.
3. **Archetypes and landmark kinds.** The parts that can be reused: Lanna and Isan temples, the Khmer
   prang and the southern chedi, mountains, waterfalls, rubber rows and fruit orchards. Each province
   is these parts plus its own record, not 77 hand-built boards.
4. **Region by region.** Ship order: North, Northeast, East, West, South, then Central and Bangkok.
   Each region ships with contact sheets, the clearance and distinct-town tests, and an independent
   review.
5. **Story.** Moves, study and work draw from the province table. Each region gets its own scenes,
   which no native reader has checked yet.

Not in scope: an on-screen map, real distances, or free visits.
