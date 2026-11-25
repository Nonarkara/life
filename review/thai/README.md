# Thai localization evidence

The sentence the product assembles for the birth card, read out of the served page,
before and after the fix.

**Before** — production deployment `7ba906c8` (build `8de56757b1a5`), language `th`:

```
เกิดในa trading householdที่the old city by the temple in นครศรีธรรมราช เติบโตมากับแม่และยาย …
เกิดในa householdที่a แพร่ town house in แพร่ เติบโตมากับแม่และยาย …
เกิดในครอบครัวเกษตรกรที่the Mekong valley in หนองคาย เติบโตมากับแม่และพ่อ …
```

**After** — live build `105baccb8325`:

```
เกิดในครอบครัวชาวนาใกล้ตัวเมืองบุรีรัมย์ที่บุรีรัมย์ เติบโตมากับแม่และยาย ใช้ชีวิตหนึ่งชีวิต: …
เกิดในครอบครัวเลี้ยงหอยนางรมปากอ่าวที่ไชยา สุราษฎร์ธานี เติบโตมากับแม่และพ่อ ใช้ชีวิตหนึ่งชีวิต: …
เกิดในครอบครัวร้านค้าในเยาวราชที่เยาวราช กรุงเทพฯ เติบโตมากับพ่อสองคน ใช้ชีวิตหนึ่งชีวิต: …
```

The province changes with every life, so the same run shows a different household
phrase each time; the shape of the sentence is the point.

## Pictures

- `after/review-1440.png` — a life at the review stage in Thai: every word on the page
  is Thai, apart from the game's own acronyms.
- `after/decision-1440.png` — the world and the childhood decision in Thai.

The birth-card sentence itself lives in the console's birth panel. The console is hidden
during the birth stage by design (`.console-mode.birth-stage .console-reader{display:none}`),
so the arrival screen a reader sees was already Thai; the sentence was in the page, not
in the layout, and the engine could stitch any composed sentence into any language.

## Reproduce

```bash
# the same life in English and in Thai, and the pack keys that cover it
PLAYWRIGHT_FROM=/Users/nonarkara/Projects/palette BASE=https://life.nonarkara.org \
  node scripts/probe-i18n.mjs

# a real life in Thai: every word the page shows, with the English left named
PLAYWRIGHT_FROM=/Users/nonarkara/Projects/palette BASE=https://life.nonarkara.org \
  node scripts/sweep-thai.mjs

# the guard: the sentences, every province, every household, four languages
node --test tests/course/i18n-rendered.test.mjs
```

The previous production deployment is still readable at
`https://7ba906c8.life-5wz.pages.dev` for the "before" case.
