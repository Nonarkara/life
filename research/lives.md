# Documented lives used as circumstances · 29 October 2026

The encounters in `dist/course/encounters.js` marked *documented* are built from
observed lives, not from imagination. The pattern is observed; the person facing
it inside the game is a composite, never a real person.

Per the research foundation, each item records: source, what was observed, the
limits of the claim, the mechanic it becomes, and what the game does **not**
claim from it.

**Verification.** The first draft of this register (written the same day) carried
attributions that did not hold up when checked against the sources: wrong authors
for the journal paper, a fictional case study presented as a real person, an NPR
story credited to a different outlet, and a 1977 newspaper article that could not
be found. They were checked on 29 October 2026 and corrected below. Anything that
could not be confirmed is marked as such or left out. Facts below were read from
the pages named, not recalled.

---

## 1. Geo-arbitrage: earning in one currency, living in another

**Source.** Jiwasiddi, Schlagwein, Cahalane, Cecez-Kecmanovic, Leong and Ractham,
*Digital nomadism as a new part of the visitor economy: The case of the "digital
nomad capital" Chiang Mai, Thailand*, **Information Systems Journal** 34(5),
1493–1535 (September 2024), doi:10.1111/isj.12496.

**Observed.** The study takes the point of view of the locals visited by digital
nomads, not the nomads. It finds diverse socio-cultural, economic and technological
impacts, and that locals judge nomads differently from other visitors (mass tourists,
backpackers, expatriates). Secondary summaries (UNSW Business Think, SASIN) report
the downside the authors highlight: rising rents and property prices that push
locals out of affordable housing.

**Duration.** MBO Partners' State of Independence survey of U.S. workers, as
reported by secondary sources (Stamped Nomad, for the 2025 wave): about 73% of
current self-identified digital nomads had been nomadic for three years or less,
16% for three to five years, 11% for more than five. The primary report was not read.
That figure is how long *current* nomads have been at it. It is not how long an
arrangement lasts, and it is about U.S. workers. The game therefore says only that
most people who work this way have been at it for three years or less, and calls
such arrangements "often short". It does not say they last three years.

**Not verified.** The interview count and fieldwork dates the first draft gave for
the paper, and a trade-press anecdote about a Thai bank teller. Neither is used.

**Limits.** This describes one city and one community, from the locals' side. It says
nothing about the labour market of the player's own city and predicts nothing about
any player's income.

**Mechanic.** `geo_arbitrage` (ages 22–45) offers the move, staying put, or
declining. `geo_expiry` arrives three years or more after the move: settle, move
again, or come home. The three-year spacing is game design, informed by the tenure
figure above, not a measured lifetime.

**Not claimed.** No probability of success, no income figure, no suggestion that a
player's circumstances match anyone observed. The cash and wellbeing numbers are
authored.

---

## 2. The deliberate gap year

**Source.** Trisha Daab, a first-person account in **Business Insider** (4 September
2026), read through Business Insider Japan's translation:
https://www.businessinsider.jp/article/202609-gapyear-40s-career-work-life-balance/
The English headline was not confirmed.

**Observed.** A working mother in her forties who had spent more than twenty years
at one company left it in 2023 and took a gap year with no salary. She used a bonus
from her last job and, for the first time in her adult life, relied on her husband's
income. The household cut subscriptions and food delivery. She later became a
travel writer and started working as a substitute teacher.

**Limits.** One person, with savings and a partner's income. A gap year is not
available to everyone, and the game does not model whose household can carry one.
The article's two-line summary in the first draft ("two mothers", "one new thing a
week") was **not** found in the text that was read; the weekly-experiment line in
the encounter is authored narrative.

**Also read, not used as evidence.** Robert Chess, with Carol Fishman Cohen and
Ashley Dartnell, "Case Study: How Do I Come Back After a Career Break?",
**Harvard Business Review** 104(2), March–April 2026. This is a **fictional** case
study (HBR's format is a made-up protagonist and expert commentary) about a former
marketing executive who took time off to homeschool his daughter. It is not a
documented life, and the first draft was wrong to present it as one.

**Mechanic.** `gap_year` (ages 28–55): stop for the year, take the time in pieces
inside the year, or keep the salary and the certainty. The cash cost is real in the
ledger; the wellbeing effect is authored.

**Not claimed.** No assertion that a year off is wise, or that it produces a career.
The third option is written without a judgement attached.

---

## 3. Turning later in life

**Source.** *Care For A Career Change-Up? These Stories Are Proof It's Never Too
Late*, **NPR** staff, 26 March 2016 (republished by WGLT). NPR collected more than
1,000 Facebook responses about midlife career shifts.

**Observed.** Phyllis Rittner spent 28 years at a law firm, where she felt alienated
and invisible, then left for social-service work like what she had done after
college; she now teaches seated dance and tai chi to seniors. She says she makes
less money but feels free. The experts quoted advise a change that stays within a
person's natural talents, skills and personality, and warn against "fantasies of
reinvention".

**Not verified.** A 1977 New York Times article on midlife career changes that the
first draft cited could not be found, and neither could the "45-degree / 90-degree
turn" distinction it attributed to a Columbia professor. Neither is used. The
professor's book, Dale L. Hiestand, *Changing Careers After Thirty-Five* (Columbia
University Press, 1971), exists but was not read.

**Limits.** Self-selected stories, told by people who changed and were glad of it.
Nothing here says how many tried and regretted it.

**Mechanic.** None added. The existing `mismatch` encounter (ages 25–40) already
asks this question. This register does not explain how its options were worded.

**Not claimed.** No assertion that a turn will succeed, or that changing career is a
mark of character.

---

## What these are not

They are not a research-backed prediction engine. They are authored narrative rules:
the effects and the eligibility windows are game design, exactly as `encounters.js`
says at the top of the file. Every encounter that carries a documented basis is also
written so the player can see the limits: the cost of the year, the price of the
move.
