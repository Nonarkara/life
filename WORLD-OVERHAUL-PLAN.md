# World overhaul: different people, different places, a world you can leave

25 October 2026. Owner direction, after many plays:

1. Everyone looks the same. Parents read as two people of the same sex. There is one
   kind of home. Ask: male/female differences, and slums, apartments, bigger houses.
2. The world must be expandable. Every life is born and dies in the same place.
   Scope chosen by the owner: Thailand plus abroad.
3. The 3D graphics are slop: identical figures, low resolution, and on a phone the
   world, which is the hero, is 153px of an 844px screen (18%).

## Preserve
Womb/countdown, childhood chapters, five-year reviews, ten-point law, finance ledger,
investments, economy, encounters, recap, replay, saves, five languages, Canvas
fallback, routines and every route test. No file shrinks 30%.

## Conservation law
A life is in exactly one region at every age. `regionAt(state, age)` is the only
answer: the birth region until a recorded move, then the region of the latest move
whose effective age is at or before `age`. Rendering, labels, pay and costs all read it.
The same shared coordinates are reused in every region (institutions are already
declared metaphorical), so routes and collision tests hold everywhere.

## 1. Regions (new `regions.js`)
Birth regions, chosen by seed within the upbringing band:
- constrained: Khlong Toei riverside community (Bangkok), Isan rice village (Khon Kaen).
- middle: apartment block (Bang Na, Bangkok), southern fishing town (Pak Phanang),
  provincial market town (Samut Prakan, the existing look).
- comfortable: walled family house (Sukhumvit, Bangkok).
Adult-only destinations: Singapore, Tokyo, London.
Each region carries place and household text, architecture style, materials, sign
language, neighbour clothing and skin range, and authored pay/cost factors (game
tuning, labelled as such). Legacy saves map to the existing look.

## 2. Moving
From 20, each five-year review can move you to another Thai region or abroad.
Recorded with an effective age, like housing and work moves. Pay and living costs
follow the region. Parents stay in the birth region and appear only there.

## 3. People
`createCharacter` gains sex, age role, skin tone, hair style and colour, build and
outfit. Female, male and intersex bodies differ in shoulders, hips and hair defaults;
outfits include skirts/pha sin, school uniform, work clothes. Households vary by seed:
mother and father, mother and grandmother, father and grandmother, two mothers, two
fathers, each stated in the birth record. The player's intake sex is rendered.
Neighbours differ in body, skin, hair and clothing by region.

## 4. Graphics and phone hero
Pixel ratio up to 2 (capped by total pixels), 2048 shadow map following the camera,
smoother geometry. On a phone the world takes at least 55% of the screen: compact
one-line header, caption and age track laid over the world, the three personal
instruments moved into reader tabs instead of a permanent 192px board.

## Owner's reference life (must be playable)
Born in Bangkok; raised partly by grandparents in the countryside while parents
worked; school in Bangkok; college in the suburbs; salaried job; quits for a
master's in the US; many heartbreaks until about 36, then a partner arrives
unsought; another master's in the UK; work abroad; PhD in the US; work abroad;
father dies; returns to Bangkok to be with his mother; raises dogs; partner and he
each care for their own parents in different homes; mutual funds and apartments
pay off over time; side work; writes a novel for fun; ends in the house he grew up in.

Follow-on phases, in order:
5. **Ending as a route map.** Replace the diagonal course with an age line coloured
   by where you lived, branching out and returning (subway-map grammar), with
   study, love, loss and return marked. Readable on a phone.
6. **Ikigai console.** Four readings: what you love (follow-through on chosen
   passions/projects), what you are good at (acquired skill vs starting aptitude),
   what the world gets from you (care, teaching, community), what sustains you
   (income covering costs, not wealth). Contentment is their overlap; maxing one
   cannot max the score. Authored proxy, stated as such.
7. **Life shapes.** Childhood with grandparents in another region; graduate study
   abroad as a five-year chapter; living-apart partnership while each cares for
   parents; dogs; apartment investment; a long personal project such as a novel;
   returning to the birth home.

## Verification
Tests: region conservation, legacy mapping, move validation, household variety,
character variety by parameter. Full headless lives at 390/1024/1440 and Thai extra,
measured world height share on phone, independent screenshot review, then deploy
and verify live.
