# Where the game happens, and how to scout it · 5 November 2026

The game names real places — Toa Payoh, Walthamstow, Shibuya, Khlong Toei — and
draws them as hand-painted backgrounds. The **Rokehan / Location Scout** tool
(https://tools.oyasumi-gamedev.com/rokehan/) builds a real city block in 3D from
OpenStreetMap data and elevation, draws it in manga line-and-tone, and exports
a PNG or a GLB. Its address bar holds the whole view, so a scouting session is
a link:

    #ll=<lat>,<lon>&s=<scale>&tod=<time of day>&far=<camera distance>&n=<name>

`s` is how much of the block is in frame, `tod` the light (the tool offers
morning, noon, late, night and more), `far` how far the camera stands, and `n`
the label it writes on the map.

## The places, and a scouting link for each

The coordinates are the centre of the place the game names. Open the link,
nudge `s`, `tod` and `far` until the frame is the shot the plate needs, then
export the PNG. **Do not commit their output**: the tool's terms forbid
copying, redistributing or modifying it. What we keep is the link and what we
learn from it.

| The game | The place | Coordinates | The scouting link |
| --- | --- | --- | --- |
| Sukhumvit | Sukhumvit, Bangkok | 13.7300, 100.5690 | `#ll=13.7300,100.5690&s=100&tod=late&far=4&n=Sukhumvit,+Bangkok` |
| Khlong Toei | Khlong Toei, Bangkok | 13.7000, 100.5750 | `#ll=13.7000,100.5750&s=100&tod=day&far=4&n=Khlong+Toei,+Bangkok` |
| Bang Na | Bang Na, Bangkok | 13.6680, 100.6140 | `#ll=13.6680,100.6140&s=100&tod=day&far=4&n=Bang+Na,+Bangkok` |
| Samut Prakan | Samut Prakan | 13.6500, 100.5900 | `#ll=13.6500,100.5900&s=100&tod=day&far=4&n=Samut+Prakan` |
| Pak Phanang | Pak Phanang, Nakhon Si Thammarat | 7.8800, 100.1400 | `#ll=7.8800,100.1400&s=100&tod=day&far=4&n=Pak+Phanang` |
| Nakhon Sawan | Nakhon Sawan | 15.0080, 100.5740 | `#ll=15.0080,100.5740&s=100&tod=day&far=4&n=Nakhon+Sawan` |
| Isan village | Nakhon Phanom | 16.4410, 103.4930 | `#ll=16.4410,103.4930&s=100&tod=day&far=4&n=Isan+village` |
| Tokyo | Shibuya Crossing, Tokyo | 35.6595, 139.7005 | `#ll=35.659500,139.700500&s=100&tod=late&far=4&n=Shibuya+Crossing,+Tokyo` |
| Singapore | Toa Payoh, Singapore | 1.3765, 103.8490 | `#ll=1.3765,103.8490&s=100&tod=day&far=4&n=Toa+Payoh,+Singapore` |
| London | Walthamstow, London | 51.5765, -0.0225 | `#ll=51.5765,-0.0225&s=100&tod=late&far=4&n=Walthamstow,+London` |
| Boston | Somerville, Massachusetts | 42.3876, -71.0995 | `#ll=42.3876,-71.0995&s=100&tod=late&far=4&n=Somerville,+Massachusetts` |

The base is `https://tools.oyasumi-gamedev.com/rokehan/` — the fragment goes
straight on the end.

## How this is used in production

Three ways, in the order they pay off:

1. **The plate prompt names the real block.** A painted background of
   Walthamstow should have Walthamstow's terraces, its narrow pavements and
   its brick; a painted Toa Payoh should have HDB blocks, a void deck and a
   void deck's open ground floor. The scouting view is where those facts come
   from, and they go into the prompt in `art/missing-art-requests.json`.

2. **The frame is chosen before the image is generated.** `s`, `tod` and `far`
   are art direction, not decoration: "late" gives the long shadows that the
   evening plates need; a short `far` gives the low street-level view the
   Bangkok plates use; a wide one gives the establishing shot.

3. **The 3D fallback can be checked against reality.** The GLB export shows
   the massing of the real block, which is what the hand-built districts in
   `dist/course/region3d.js` are standing in for.

## What it does not do for us

It draws a block, not a life. It cannot tell us what a household in that
block feels like, what it costs to live there, or what the street is like at
seven in the evening in the rain. Those are the research questions in
`research/lives.md` and `research/foundation.md`; this is the picture the
answer is drawn on.
