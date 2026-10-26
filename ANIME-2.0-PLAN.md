# Life 2.0 — the show, the control room, and the painted world

## The frame: The Truman Show

This life is a show. One baby, in a hospital, and then a world runs around
that baby: a mother at a stall, a father on a bicycle, friends on a court, a
first love, a fist fight in a soi at night, good grades, bad grades, a bed
with the blanket turned back. Every one of those things is played by someone
who knows the script for a life like this one.

The frame matters because it explains the parts that used to feel arbitrary:

- **The routine is the running order.** One sixty-second day: home, journey,
  work, home, evening. Every person in this life is on the same clock.
- **The console is the control room.** The operators can see the numbers of
  the life they are running: health, contentment, money, what was chosen and
  what it cost. The graphs are telemetry.
- **The encounters are the actors.** They use what the player already knows —
  the mother's stall, the father's absence, the money in the account — and they
  arrive on schedule.
- **Life 1.0 is a parallel run.** The same birth, the same world, the same
  luck, spent with no decisions taken. It is not a "normal" life and not a
  prediction. It is the take that was not filmed, and it is what makes the
  player's own take legible as numbers.
- **The roads not taken are the other takes.** At every question, each other
  answer is lived to the end of those five years, with the same seed and the
  same luck. The only thing that differs is the choice.
- **The ending is the truth about the world outside.** A life that can be
  replayed is a life that was being run. That is the beautiful part and the
  painful part, and the game does not hide either.

## The world is bigger than the room

The first version of this world was an isometric diorama of a house. It was
thrown away, not because it was badly made, but because a life is wider than
one room. The world now has seventeen painted places:

| Place | What happens there |
| --- | --- |
| Hospital | The show opens: one baby. |
| Home | Breakfast, the mother's stall seen from inside, the family together. |
| Bedroom | The quiet half of the day: reading on the rug, homework, resting, recovering, the bed and off the bed. |
| Street | Bikes, friends, the neighbourhood. |
| Street at night | Neon and wet concrete: the fights, the walks home. |
| School yard | School, the building, the mornings. |
| Basketball court | Training, the game, the crowd. |
| Shop | The bicycle workshop: a trade, an apprenticeship, the work of the hands. |
| Construction site | Engineering and architecture: the trade at building size. |
| Office | Salaried work, the fluorescent tube, the desk. |
| Garden | The plot behind the house, the elders' years. |
| Market stall | The mother's livelihood. |
| Town | The wide view across the river — the journey, the scale. |
| Abroad | The foreign city at night, when the life leaves the country. |

The places are chosen by the routine, and the routine is chosen by the life:
a trade builds on a site rather than behind a desk; a life that leaves the
country draws the foreign city; the show opens in a hospital.

## The art: Japanese RPG and manga

The drawing language is the one a 1990s Japanese roleplaying game used for
its character art, with painted backgrounds behind it:

- **Clean confident ink line and two-tone cel shading** on every figure.
- **Expressive manga faces**, on characters who are people first and
  archetypes second.
- **Painted backgrounds** with brush texture, drawn wider than the frame so
  they can be panned.
- **Limited animation, played honestly.** Every cycle is two drawings played
  on twos. A walk cycle is two walks. Nothing is faked with a transform that
  pretends to be a drawing.
- **Cuts, not camera moves.** A change of place is a cut: a white frame and a
  diagonal wipe. The journey is its own drawing, the town scrolling with
  speed lines across it.
- **An impact frame for a hard moment.** A death, the flood, a setback: a
  white flash and radial lines, held long enough to hurt.

### The pipeline

1. `scripts/prepare-anime-assets.py` — the art arrives as painted sheets on a
   pale ground. The script divides the sheet into the panels the model drew,
   finds the figures themselves (a figure often spills over the line of its
   own panel, so a fixed grid cut would cut through people), keys the ground
   away without eating a white shirt, and writes WebP files plus a manifest.
   - The ground colour is sampled from the sheet, never from the crop: a tight
     crop's border is the figure's own skin, and keying against that erases
     the person.
   - A ruled line is filled in with the colour around it rather than punched
     out of the drawing, so a line that crosses a figure closes the figure up
     instead of cutting it in two.
   - Only thin bands count as rules. A head of hair above an apron is a wide
     dark mass, not a line, and it stays in the picture.
   - Sheets whose layout is not an even grid — the model sometimes draws four
     figures in a row — have their panels written down by hand in the
     script, because no algorithm can be right about every drawing.
   - The pieces of one body are joined through a coarse spatial grid rather
     than by comparing every pair, which is the difference between a sheet
     that takes twelve minutes and never finishes and one that takes a second.
2. `dist/course/anime-assets.js` — loads the manifest, then only the plates
   and frames a life needs.
3. `dist/course/stage2d.js` — the renderer: plates, figures, cuts, weather,
   impact frames.
4. `scripts/build.mjs` — versions the art paths with the build id, so a new
   painting can never be served out of an old cache.

## The twenty-eight questions

Two hard questions at every five-year station, from ten to seventy-five. Each
one is a fork with a cost on both sides; none of them asks what the player
already knows.

- The childhood: the roof or the school fee; the workshop that pays your
  fees.
- The schooling: school or apprenticeship; the summer on the building site.
- The building years: the loan, the stall's paperwork, the Bangkok offer, the
  partner your family chose and the partner you chose.
- The flood: repair the house or keep the savings; move to the provinces or
  rebuild in the same lane.
- The turning points: the promotion in another city; the mother who is ill;
  the share in the firm; buying the house the family rents; moving for a
  child's school; the unpaid six months.
- The father's death: the tools and the trade, or a clear debt.
- The later years: five more years for the employer; the treatment that
  costs the savings; selling the house; the relative with no income.
- The last station: money, the house, or the work of your hands; and what you
  want to be remembered for.

Some answers are gambles where the luck is shared: the same seed, the same
station, the same roll in every branch. Some answers commit: a locked axis
holds for five years, so the next five years lean in the direction the answer
chose. The questions change with the years, and so does what effort is
worth: a young body answers training, the hands learn in the working years,
the mind keeps learning longer than the hand does.

## The lived moments

A beat is a lived moment with its own plate, its own people and one effect.
A beat may only be drawn when the life records that it happened, so the stage
never invents a life:

| Moment | When it is drawn | Plate | The people in it |
|---|---|---|---|
| Two bicycles | the friendship years, on the way to school | the lane | the player and the friend, riding |
| The first evening | the year you fell in love | the bridge at dusk | the player and the partner, and a heart |
| The corridor | the year you were bullied | the classroom | the player, and the boy who does not let up |
| The fist | the year you pushed back | the alley | the player throwing the punch, the rival guarding |
| The report card | the years the questions were about school | the classroom | the player at the desk, in good or bad light |
| The bed | a body that is being repaired | the bedroom | the player, lying down |

The bullying is a decision like any other: push him back, tell a teacher, say
nothing and take it, or ask someone to walk home with you. The fight is
drawn because you pushed back.

## The numbers

- `dist/course/baseline.js` — Life 1.0: the life you would have had by not
  choosing.
- `dist/course/alternatives.js` — the roads not taken: every other answer at
  every question, lived to the end of those five years, with the same luck.
- Both are shown in the console's History pane and on the ending screen, with
  the final difference in one line.

## What is still missing

- The player's face drifts between the two player sheets. A character
  reference pass would fix it.
- There is no drawing for "eating", "waiting", or "tired". The closest
  drawing is used and the stage never claims otherwise.
- The world is wide in places but shallow in people: the friend's circle, the
  classmates, the colleagues at work are not drawn yet.
- The impact frame fires on a recorded hard event, not on a hard choice.
- The report-card beat is covered by tests but has not been photographed,
  because it needs a life whose questions have been answered.
- There is no control room yet: the console shows the numbers and the roads
  not taken, but nobody is directing the actors.
- The trades are chosen, not drawn: the site and the workshop are one plate
  each, and a life in accounting or nursing stands in the same office.
