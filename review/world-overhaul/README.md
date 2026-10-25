# World overhaul release evidence — 26 October 2026

Commit `180284f`, build `67ec0f7a1bef`, Cloudflare Pages deployment `6a396e1a`.
Live URLs:
- Canonical preview: `https://6a396e1a.life-5wz.pages.dev/course/`
- Production domain: `https://life.nonarkara.org/course/`

## Automated Test Suite
145/145 tests pass (`npm test`) across `tests/*.test.mjs` and `tests/course/*.test.mjs`:
- `tests/course/scene3d.test.mjs`: Orthographic cutaways, camera spans (phone adult span 9), material versions, floor geometry, room revelations.
- `tests/course/life-choices.test.mjs`: Major fit, venture swings, partner nature, dog adoption bounds, Ikigai body/mind scaling.
- `tests/course/regions.test.mjs`: Region conservation laws, childhood grandparent relocations, move targets, household diversity, 3D prop clearances, subway route-map models.
- `tests/course/encounters.test.mjs`: Multi-year dating follow-ups, priority gates, full translations across 5 languages (en, th, zh-CN, ja, ko), capacity growth integrity.

## Remote Production Asset Verification
3 consecutive byte-matching SHA-256 probes passed across all 3 production hosts (`6a396e1a.life-5wz.pages.dev`, `life-5wz.pages.dev`, and `life.nonarkara.org`):
- `course/boot.js`: `66c42171ec26a04da28ea969a58ca83d58e3f9408331ff6f03d1590b10636605`
- `course/game.bundle.js`: `8a1da7c191a3cf8fb217f2bc29a5015b31f7cbf2a2f6fb39f60a927a4e09f581`
- `course/course.css`: `8f688058b948f554b2a9a5512b402fd29abca95802832fc0e987daa49ee3c609`
- `course/console.css`: `ab1f59785f8330819dbc5429dec6ae7404de1074f06bf6da078fde711a32c3ec`
- `course/personal-console.css`: `c1c92019b8dd1c8ec7fe2ff14300305da5e1b213b28b613e55c3c0d83fe6279f`
- `course/economy.css`: `d63cf615c81ef9ef9c14dc1af8a47f9090aaaaef29d9f4544c454bc2f5c2a1da`
- `course/fonts.js`: `112f24d5dbe157091e9bb0a28161641e1d2ed98d0e33b24d274b10a0712c379d`
- `course/settings.css`: `8ff1dfbb67f2c47c143873df25b19f23e6434644f72fa7c7596217d737fd2861`
- `study/scene-study.bundle.js`: `34b9cb1150f1773952c5e581ea986c989aefa2ae093d6b26c632d1c6f009bf28`

## Live Browser CDP Headless Verification
Live execution on `https://life.nonarkara.org/course/` via Chrome Headless CDP (`scripts/verify-live.mjs`):
1. **Phone Viewport Hero World Share (390x844)**:
   - Measured stage height: 481px / 844px (57.0% screen share, exceeding the >= 55% constraint).
   - Personal console reader panel neatly tucked in bottom drawer (`max-height: 43dvh - 40px`).
   - Single-line phone header: 40px height in Thai (`th`) with enlarged text (`extra`). Brand tagline automatically collapses; 4 control buttons stay on one row without wrapping (`headerSingleLine: true`).
   - Evidence capture: `live-phone-thai-390.png`.
2. **3D Low-Poly Dog Inhabited Scene**:
   - Active WebGL Three.js world renderer (`.world-renderer`) verified at age 30 with active dog adoption flag.
   - Low-poly dog model with custom fur/brown shaders rendered at home porch/walkway when `dogAt(state, age)` is true.
   - Evidence captures: `live-dog-390.png` (phone) and `live-dog-1440.png` (desktop 1440x900).
3. **Owner Reference Life Ending: Route Map & Ikigai**:
   - Tested multi-region trajectory at age 80 (`stage: recap`): Bangkok -> Isan -> Boston -> London -> back home to Bangkok.
   - Canvas route map rendered with 3 subway-style lived lanes (`lanes: ['bang-na', 'boston', 'london']`), 3 interchanges (`moves`), and key marks (`Love`, `Flood`, `Project`, `Back home`, `Loss`, `Work slows`).
   - `routeAriaLabel`: "ชีวิตของคุณไปที่ไหนบ้าง: บางนา กรุงเทพฯ 0–20; ซอมเมอร์วิลล์ แมสซาชูเซตส์ 20–30; วอลแธมสโตว์ ลอนดอน 30–40; บางนา กรุงเทพฯ 40–80."
   - 4-part Ikigai console rendered: 81 / 100 overall contentment score with geometric mean balance across love, good, world, and paid.
   - Evidence captures: `live-recap-route-390.png` (phone), `live-recap-route-1024.png` (tablet), `live-recap-route-1440.png` (desktop).
4. **Console Health**:
   - 0 runtime errors, 0 uncaught exceptions recorded across all navigation and life simulation cycles.
