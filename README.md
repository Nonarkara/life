# Life2.0

**What if you could live your life all over again?**

Life2.0 is a free browser game about one Thai life, from the womb to old age. You don't choose where you are born. You do choose, every five years, where your time goes. When the life ends you see what it became, and then you can live it again in the same world, under the same storms, floods and lucky breaks, and find out which differences were yours.

- Play: **https://life.nonarkara.org**
- Manual: `/start` · Session setup: `/intake` · The game: `/course`
- Languages: English, ไทย, 简体中文, 日本語, 한국어
- No account, no analytics, no backend. Your life is saved only in your own browser. Fonts load from Google Fonts.

---

## The premise

The game is set inside a piece of fiction. In the author's novel, a person lies back in a wide-armed white chair, and a whole lifetime is lived and remembered in the time it takes to rest. Life2.0, 2026 Screen Edition, is the earlier software for that chair: the manual you read before you settle in. The chair and its technology are fiction. Nothing here claims to be a medical device or a real immersion product. You can pause or leave whenever you like.

The fiction gives the game its one question. Your first life happened to you. Given a second, what would you keep the same?

## What you actually do

1. **Settle in.** A two-page illustrated manual explains the session. Choose a language, a text size, and whether motion is allowed.
2. **Starting conditions.** Let chance decide, or choose a body profile, an upbringing band and how ten starting points are spread across five attributes. Random is the default because that is how birth works.
3. **The womb.** A dark screen, a small illustrated figure, a count of 3, 2, 1.
4. **Childhood: no choices.** From 0 to 10 the family decides. One year passes every ten seconds at 2×, and faster at 3×, 10× or 20×. Each year is a short chapter about care, school and the household's income. You can look back at an earlier year without changing anything, then return.
5. **Ten: the first allocation.** You spread ten effort points across what you will practise. This is the first thing that is yours.
6. **Fifteen: money and routes.** You get your own small account, separate from the family's savings, with a budget you can edit, plus choices about school, vocational work and later college. You meet people, start projects, and fall for someone after school.
7. **Every five years after that: review.** Rebalance effort, choose habits (smoking and drinking unlock at 20), housing and commute, relationships and values. Encounters carry named people and commitments forward: a friendship at 15, an exhibition at 35, a flood you face together at 30, care for a friend at 40, marriage, children, remembrance.
8. **The end.** It may come early. Nothing guarantees 80. The ending shows three honest tracks over your age: physical health, wellbeing and money, each in its own units. It marks where money grew fastest and what happened to health at the same time. Every five-year record is kept.
9. **Again.** Replay starts a new life in the same world, with the previous ledger kept so the two can be compared.

## The ideas underneath

These come from long conversations between the author and the agents that built this. They are why the game looks and behaves as it does.

### Time is the currency

Money is the obvious scarce thing in a life game, and it is the wrong one. Time is the thing nobody gets more of. The first prototype made this literal: a market stall, study and friends shared exactly twelve hours a week. The current game keeps the idea as a conservation law. Ten effort points, always exactly ten, every five years. Adding to one part of your life means taking from another, and the game never hides that.

### You did not earn your starting line

A newborn inherits a context: household security, location, obligations, the care that happens to be available, a language, a network of people who may open doors or ask for things back. None of this is intelligence or moral worth. The game makes the birth lottery visible and refuses to pretend it is fair. It also refuses the opposite story. Inheritance is not destiny, and the starting points are fixed while learning keeps changing what you can do.

### Choice, circumstance and chance are different things

External events in a world run on a fixed seed. Replaying a life keeps the same flood and the same lucky meeting, so the only thing that differs is what you did. This is the closest a game can get to an honest counterfactual. It still isn't a causal proof, and the ending says so.

### No score for a good life

There is no leaderboard and no single happiness number. A short life can be a full one. Pleasure, intimacy, art, ambition, family and longevity are all allowed to matter, and you decide how much. Religion and intimacy are expressive choices that appear in your record without a morality bonus. Health, wellbeing and money are never folded into one figure, because a scale that adds baht to blood pressure is lying.

### Every number says what it is

Every probability, price, income and effect size in this game is an authored game rule. None is a Thai statistic, a psychological test, health advice or a financial forecast. The interface says so where numbers appear. Two household backgrounds and a small event deck show the structure; they do not represent the Thai population. Where research exists, it sits in `research/` with sources, dates and limits. Where evidence is missing, the game leaves the mechanic out rather than invent one:

- No medically specific disease odds. HIV, for example, would need separate exposure, infection, diagnosis and treatment states. Effective treatment allows long, healthy lives, and sex frequency alone is not an infection mechanism. None of that is modelled yet, so none of it is shown.
- No creativity bonus from drugs. Feeling inspired is not evidence of better work. Art comes from practice, opportunity, support and time.
- No per-person IQ or DNA predictor. IQ and EQ here are game attributes. Genes and environment interact; neither is a pie chart of fate.
- Universe 25, Calhoun's 1973 study of mice in a closed enclosure, is a story about crowded mice. It does not prove that humans need suffering. The novel may use it as fiction; the game does not use it as science.

### Money you can audit

Your personal account follows a strict ledger. Opening balance plus income, minus essential costs, enjoyment, learning and housing, equals what you have. A test checks this. Students pay school meals and travel out of their allowance. Plans are not receipts: setting a budget spends nothing. Family savings and your own money are separate pots with separate labels. Your CV is built only from what you actually completed, with no invented degrees.

### Memory over spectacle

The world is a small isometric neighbourhood: home, school, market, work, city. It widens as awareness grows. At birth the family fills the frame. By adulthood institutions sit closer together than a map would allow, and that is a metaphor, not geography. A shared sixty-second day moves the family through morning, journeys, work and rest. One clock owns the simulation and the motion; pausing stops both. With reduced motion on, the years still turn, as text.

## How it is designed

The visual language is warm paper, dark green ink, vegetation, water, terracotta roofs, and one amber that marks your agency. Typography is Jost with Prompt for Thai: non-looped letterforms, because looped Thai reads as learner material to Thai eyes. Chinese, Japanese and Korean use their regional Noto faces.

The design rules live in `DESIGN-RULES.md` and `STYLE.md`. In short:

- **One home for every fact.** The same value never appears twice side by side.
- **The data sets the graphic.** Charts cover the life lived so far, not decades of empty future, and carry their units.
- **A control is the size of its label.** No buttons padded to fill space, no bars that hold nothing, no scrolling the layout invents for itself.
- **Phone first.** Most people will open this from a link in a chat.
- **Owner rejection overrides any automated pass.** Several versions shipped green tests and were still rejected for wasting space or repeating facts. Those rejections are recorded in `context.md`, and the rules came out of them.

No AI-generated artwork, no copied game assets, no paid API and no backend.

## Inspirations and credits

- **The Sims** for the daily routine of a household made visible.
- **[1in8b.life](https://1in8b.life/en/about/)** for the birth lottery, annual focus and a life recorded as it passes. Life2.0 is unaffiliated and uses none of its code or art.
- **EarthBound** for small places you can read at a glance.
- **Massimo Vignelli, Dieter Rams and the Bauhaus** for grouping and proportion. **Sanzo Wada's colour chords** (plates 121 and 122) for the improving and difficult moods.
- Reading: Steven Pinker's *The Blank Slate* (as a concept, not a verdict); Polderman et al. 2015 and Deary 2021 on genetic variation; the World Bank Thailand growth series, kept for the economic-crisis work still to come.

## Run it locally

```bash
npm install
npm test          # 78 simulation, finance, translation, movement and 3D visibility tests
npm run dev       # builds to out/ and serves http://127.0.0.1:4219/
```

Three.js0.185.0 (MIT) supplies the locally bundled 3D world. esbuild minifies the module graph. The original Canvas world remains the fallback when WebGL fails; the overview and charts remain available. No game state depends on the renderer.

## Repository map

| Path | What it is |
|---|---|
| `dist/course/` | The game. `sim.js` is the deterministic life model and ten-point law. `finance.js` is the personal ledger. `encounters.js` holds people and commitments. `world.js` and `layout.js` are the isometric world. `game.js` is the one time controller. `ending.js` draws the final tracks. `translations.js` holds five languages. |
| `dist/intake/`, `dist/start/` | Session setup and the two-page manual. |
| `dist/*.js` (top level) | The first prototype, rejected by the owner and kept for comparison. It is served at `/legacy`. |
| `tests/` | Node's built-in test runner, no framework. |
| `research/` | Sourced notes on mechanics, economic crises, personal finance and inherited opportunity, each with its limits stated. |
| `review/` | Screenshots and independent reviews. Files named `failed-*` record faults, not passes. |
| `context.md` | The decision log, including every owner correction. Read it before changing anything. |
| `DESIGN-RULES.md`, `STYLE.md`, `AGENTS.md` | Rules any contributor, human or agent, must follow. |

## Status

**Previous release — v1 (2026.1), 24 October 2026.** Verified: four complete headless lives on phone, tablet, desktop and Thai with extra-large text, all reaching the ending with no script errors and no horizontal overflow. 63 tests pass. An independent review found three blockers (clipped money on phones, students banking almost all their pocket money, one label used for two different money pots), and all three are fixed.

**Graphics update —25October2026.** Articulated characters, directional stride, age growth, supported seating, distinct task props, real lighting and architectural cutaways. Committed routes drive school, college, trade, independent work and recovery poses. A content-height desktop dock and dock-aware camera preserve the protagonist; phones show the current activity more closely.78tests pass. Independent source and responsive still review passed for this bounded update; current release verification is recorded in RELEASE-READINESS.md.

Not yet done, stated plainly:

- The lead exercised changing routines live; the independent graphics review used source and stills. Continuous human motion-quality approval and WebGL-failure injection remain outstanding.
- The camera follows the player, so buildings at the edge of the world can be cropped.
- The setup screen at `/intake` is mostly empty on a phone.
- No calibrated crisis probabilities, full credit products, scholarships or admissions, inherited networks, or comprehensive late-life care systems yet. The research for them is in `research/`.
- The five languages have not been checked by native editors.
- No repeated human playtests yet. Whether the game is good is not settled by tests.

## The question it leaves you with

A life game can't tell you how to live. It can show you the shape of one: where the hours went, what they bought, what chance did, and what was left when it ended. Then it gives you something no one actually gets, the same world a second time. What you change, and what you find you would not change, is the part the game can't author.

## Personal console release —25October2026
Three aligned desktop instruments bring personality, condition and five-year
intent together; phone users switch between them. Original CC0 music has an
explicit Music/Mute control. Independent housing becomes the actual routine
home, and city work opens another district with explicit rent/pay/travel rules.
Furnished studios, inhabited streets, task props and closer framing improve the
world.105 tests pass. Ikigai is an authored completed-priority proxy, not a
psychological measurement. Runtime/release receipts: review/personal-console/.

## Economic world and inhabited biography -25October2026
Funded bond/equity holdings include cost basis, fees, realized/unrealized results
and ledger validation. Observed Thai GDP sequences supply elapsed scenario history;
authored investment/wage rules translate that world into game effects. Sampling is
biased scenario design, not an estimated crisis frequency or investment forecast.

A fictional soi street, recurring school case, purchased books, work corner and
recorded remembrance make domestic evidence visible. Longer commutes change time
at home. Palette241 informs the steady material chord; diffuse backgrounds and
cel figures separate place from people. The explicit /study/ comparison presents
three ages and two work/housing branches without reading or changing saved lives.
121tests pass. Human recognition, native editorial certification and measured
animation/performance comparisons remain open. Review receipts: review/economy/
and review/inhabited/source-review.md.
